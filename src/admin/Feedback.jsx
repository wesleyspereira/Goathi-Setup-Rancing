import React, { useEffect, useState } from 'react'
import { signInAnonymously } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { auth, db } from './firebase'
import { Modal } from '../components/Modal'
import './feedback.css'

const products = { individual: 'Individual Setup', pack: 'Pack Setups', ers: 'ERS + Estratégia', pro: 'Pack Pro', other: 'Outro' }
const statuses = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Recusado' }
const sorted = snapshot => snapshot.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
const dateLabel = item => item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Data não informada'
const productLabel = item => products[item.product] || 'Setup não informado'
function Stars({ rating }) {
  return <span className="rating" aria-label={`Nota ${rating} de 5`}><span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</span></span>
}

export function Feedback() {
  const [open, setOpen] = useState(false), [items, setItems] = useState([])
  const [name, setName] = useState(''), [rating, setRating] = useState(0), [product, setProduct] = useState(''), [comment, setComment] = useState('')
  const [message, setMessage] = useState(''), [loadError, setLoadError] = useState(''), [busy, setBusy] = useState(false), [index, setIndex] = useState(0), [paused, setPaused] = useState(false), [hover, setHover] = useState(false)
  const [perPage, setPerPage] = useState(() => window.innerWidth <= 700 ? 1 : window.innerWidth <= 900 ? 2 : 3)
  useEffect(() => {
    if (!db) return
    return onSnapshot(query(collection(db, 'feedbacks'), where('status', '==', 'approved')), s => { setItems(sorted(s)); setLoadError('') }, () => setLoadError('Não foi possível carregar os depoimentos agora.'))
  }, [])
  useEffect(() => {
    const resize = () => setPerPage(window.innerWidth <= 700 ? 1 : window.innerWidth <= 900 ? 2 : 3)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  const pages = Math.ceil(items.length / perPage)
  const current = pages ? index % pages : 0
  useEffect(() => {
    if (pages < 2 || paused || hover || open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex(i => (i+1)%pages), 6000)
    return () => clearInterval(timer)
  }, [pages, paused, hover, open])
  const average = items.length ? (items.reduce((sum,item) => sum + item.rating, 0) / items.length).toLocaleString('pt-BR', {minimumFractionDigits:1,maximumFractionDigits:1}) : '—'
  async function send(e) {
    e.preventDefault(); if (!db || busy) return
    if (!name.trim() || !comment.trim() || !product || !rating) { setMessage('Preencha seu nome, setup, nota e comentário.'); return }
    setBusy(true); setMessage('')
    try {
      await auth.authStateReady()
      const user = auth.currentUser || (await signInAnonymously(auth)).user
      const target = doc(db, 'feedbacks', user.uid)
      if ((await getDoc(target)).exists()) { setMessage('Você já enviou um feedback. Obrigado pela participação!'); return }
      await setDoc(target, { name: name.trim(), rating, product, comment: comment.trim(), status: 'pending', createdAt: serverTimestamp() })
      setMessage('Obrigado! Seu feedback foi enviado.'); setName(''); setComment(''); setProduct(''); setRating(0)
    } catch (error) {
  console.error('Erro ao enviar feedback:', error);
  setMessage('Não foi possível enviar o feedback.');
}
    finally { setBusy(false) }
  }
  return <section id="feedbacks" className="container section">
    <p className="eyebrow">QUEM JÁ ESTÁ NA PISTA</p>
    <div className="section-heading"><h2>Na voz dos <em>pilotos.</em></h2><button className="btn btn--ghost" onClick={() => {setMessage(''); setOpen(true)}}>Deixar avaliação</button></div>
    <div className="feedback-summary" aria-label={`Média das notas: ${average} de 5`}><strong>{average}</strong>{items.length > 0 && <span className="feedback-average-stars" aria-hidden="true"><span>★★★★★</span><span className="feedback-average-fill" style={{width: `${Number(average.replace(',', '.')) / 5 * 100}%`}}>★★★★★</span></span>}</div>
    {loadError && <p role="status">{loadError}</p>}
    <div className="feedback-carousel" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={e => {if (!e.currentTarget.contains(e.relatedTarget)) setHover(false)}}>
      <div className="feedback-grid"><div>{items.length ? items.slice(current * perPage, (current+1)*perPage).map(item => <article className="card feedback-card" key={item.id}>
        <div className="review-person"><span className="review-avatar" aria-hidden="true">{item.name.slice(0,1).toUpperCase()}</span><div><strong>{item.name}</strong><small className="feedback-meta">{productLabel(item)}</small></div></div>
        <p><Stars rating={item.rating}/></p><p className="news-text">{item.comment}</p><small className="feedback-meta feedback-date">{dateLabel(item)}</small>
      </article>) : <div className="review-empty"><strong>Sua experiência faz a diferença.</strong><p>Já correu com a Goathi? Conte como foi sua experiência na pista.</p></div>}</div></div>
      {pages > 1 && <div className="feedback-controls"><button type="button" aria-label="Feedbacks anteriores" onClick={() => setIndex((current+pages-1)%pages)}>‹</button><span>{current+1} / {pages}</span><button type="button" aria-label="Próximos feedbacks" onClick={() => setIndex((current+1)%pages)}>›</button><button type="button" onClick={() => setPaused(v => !v)}>{paused ? 'Reproduzir' : 'Pausar'}</button></div>}
    </div>
    {open && <Modal title="Deixar avaliação" close={() => setOpen(false)}><form className="feedback-form" onSubmit={send}>
      <h3>Conte sua experiência</h3><p>Compartilhe sua experiência com a Goathi.</p>
      <fieldset disabled={busy || !db}>
        <label>Nome<input required maxLength={60} autoComplete="given-name" value={name} onChange={e => setName(e.target.value)}/></label>
        <label>Setup adquirido<select required value={product} onChange={e => setProduct(e.target.value)}><option value="">Selecione seu setup</option>{Object.entries(products).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <fieldset className="feedback-stars"><legend>Sua nota</legend><div>{[1,2,3,4,5].map(n => <label key={n} className={n <= rating ? 'selected' : ''}><input type="radio" name="feedback-rating" value={n} required checked={rating===n} onChange={() => setRating(n)}/><span aria-hidden="true">★</span><span className="feedback-sr">{n} de 5 estrelas</span></label>)}</div></fieldset>
        <label>Comentário<textarea required maxLength={1200} rows={4} value={comment} onChange={e => setComment(e.target.value)}/></label><button className="btn" disabled={busy || !db}>{busy ? 'Enviando…' : 'Enviar feedback'}</button>
      </fieldset>{!db && <p>O envio de feedbacks estará disponível em breve.</p>}<p role="status">{message}</p>
    </form></Modal>}
  </section>
}

export function FeedbackModeration() {
  const [items, setItems] = useState([]), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [filter, setFilter] = useState('all')
  useEffect(() => onSnapshot(collection(db, 'feedbacks'), s => setItems(sorted(s)), () => setMessage('Não foi possível carregar os feedbacks.')), [])
  async function run(action, success) {
    setBusy(true); setMessage('')
    try { await action(); setMessage(success) } catch { setMessage('Não foi possível alterar o feedback.') }
    finally { setBusy(false) }
  }
  function moderate(item,status) { return run(() => updateDoc(doc(db,'feedbacks',item.id), {status}), 'Status do feedback atualizado.') }
  function remove(item) {
    if (window.confirm(`Excluir definitivamente o feedback de ${item.name}?`)) run(() => deleteDoc(doc(db,'feedbacks',item.id)), 'Feedback excluído.')
  }
  const counts = Object.fromEntries(Object.keys(statuses).map(s => [s,items.filter(i => i.status === s).length]))
  const visible = items.filter(i => filter === 'all' || i.status === filter)
  return <section className="admin-panel feedback-admin"><h2>Feedbacks dos clientes <span className="feedback-pending">{counts.pending} pendentes</span></h2><p>Apenas os aprovados aparecem no site.</p>
    <div className="feedback-filters" aria-label="Filtrar feedbacks">{[['all','Todos'],...Object.entries(statuses)].map(([key,label]) => <button type="button" key={key} aria-pressed={filter===key} onClick={() => setFilter(key)}>{label} ({key==='all' ? items.length : counts[key]})</button>)}</div>
    <p role="status">{message}</p>{!visible.length && <p>Nenhum feedback neste filtro.</p>}
    {visible.map(item => <article className="admin-post" key={item.id}><div className="feedback-admin-copy"><h3>{item.name} · {item.rating}/5</h3><p><Stars rating={item.rating}/></p><p>{productLabel(item)} · {dateLabel(item)}</p><p className="news-text">{item.comment}</p><p><strong>{statuses[item.status]}</strong></p></div><div className="admin-actions"><button disabled={busy || item.status==='approved'} onClick={() => moderate(item,'approved')}>Aprovar</button><button disabled={busy || item.status==='rejected'} onClick={() => moderate(item,'rejected')}>Recusar / ocultar</button><button disabled={busy} onClick={() => remove(item)}>Excluir</button></div></article>)}
  </section>
}
