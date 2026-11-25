import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, configured } from './firebase'
import { FeedbackModeration } from './Feedback'
import { shop, promotionDefault } from '../data/shop'
import './admin.css'
import './premium.css'
import goathiLogo from './goathi-logo.png'
import Cash from './Cash'
import { uploadMedia } from './uploadMedia'
const empty = { title: '', body: '', image: '', video: '', category: 'novidade', published: false }
const labels = { individual: 'Individual Setup', pack: 'Pack Setups', ers: 'ERS + Estratégia', pro: 'Pack Pro' }
export default function Admin({ embedded = false }) {
  const [tab,setTab] = useState('dashboard'), [pending,setPending] = useState(0)
  const [user, setUser] = useState(null), [allowed, setAllowed] = useState(false), [loading, setLoading] = useState(true)
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [prices, setPrices] = useState(shop.prices), [posts, setPosts] = useState([]), [post, setPost] = useState(empty)
  const [promotion, setPromotion] = useState(promotionDefault)
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('')
  useEffect(() => {
    if (!auth) { setLoading(false); return }
    let active = true
    const off = onAuthStateChanged(auth, async current => {
      if (current?.isAnonymous) current = null
      setUser(current); setAllowed(false); setPending(0); setLoading(true)
      try { if (current) { const role = await getDoc(doc(db, 'admins', current.uid)); if (active) setAllowed(role.exists() && role.data().enabled === true) } }
      catch { if (active) setMessage('Não foi possível verificar seu acesso. Confira as regras do Firebase.') }
      finally { if (active) setLoading(false) }
    })
    return () => { active = false; off() }
  }, [])
  useEffect(() => {
    if (!allowed) return
    const fail = () => setMessage('Falha ao carregar os dados. Confira sua conexão e as regras do Firebase.')
    const a = onSnapshot(doc(db, 'settings', 'catalogV2'), d => setPrices({ ...shop.prices, ...(d.data() || {}) }), fail)
    const b = onSnapshot(collection(db, 'posts'), s => setPosts(s.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))), fail)
    const c = onSnapshot(doc(db, 'settings', 'promotion'), d => { if(d.exists()) setPromotion(d.data()) }, fail)
    const f = onSnapshot(collection(db, 'feedbacks'), snap => setPending(snap.docs.filter(d=>d.data().status==='pending').length), fail)
    return () => { a(); b(); c(); f() }
  }, [allowed])
  async function run(action, success) {
    setBusy(true); setMessage('')
    try { await action(); setMessage(success) } catch (error) { setMessage(error.message || 'Não foi possível concluir.'); console.error(error) }
    finally { setBusy(false) }
  }
  function savePost(event) {
    event.preventDefault()
    if (!post.title.trim() || !post.body.trim()) { setMessage('Preencha o título e a descrição.'); return }
    if ([post.image,post.video].some(url => url && !/^https:\/\//.test(url))) { setMessage('Use um endereço de imagem começando com https://.'); return }
    run(async () => {
      const target = post.id ? doc(db, 'posts', post.id) : doc(collection(db, 'posts'))
      await setDoc(target, { title: post.title.trim(), body: post.body.trim(), image: (post.image || '').trim(), video: (post.video || '').trim(), category: post.category, published: post.published, createdAt: post.createdAt || serverTimestamp(), updatedAt: serverTimestamp() })
      setPost(empty)
    }, 'Publicação salva.')
  }
  async function chooseMedia(event,kind) {
    const file=event.target.files?.[0]; event.target.value=''; if(!file)return;
    await run(async()=>{const url=await uploadMedia(file,kind);setPost(old=>({...old,[kind]:url}))},'Mídia enviada. Salve a publicação para concluir.')
  }
  const menu=[['dashboard','▦','Visão geral'],['cash','↗','Fluxo de caixa'],['prices','◇','Setups'],['promotion','%','Promoções'],['posts','▤','Publicações'],['feedback','★',`Feedbacks (${pending})`]]
  return <div className={`admin-shell gp-shell ${allowed?'gp-authorized':''}`}>
    {allowed&&<aside className="gp-sidebar"><div className="gp-brand"><img className="gp-brand-logo" src={goathiLogo} alt="Goathi Setups" /></div><nav>{menu.map(([id,icon,label])=><button key={id} className={tab===id?'gp-active':''} onClick={()=>setTab(id)}><span>{icon}</span>{label}</button>)}</nav><div className="gp-sidebar-foot">Ambiente administrativo<br/>{user?.email}</div></aside>}
    <div className="gp-content"><header className="admin-header"><div><p className="eyebrow">GOATHI SETUPS</p><h1>Painel administrativo</h1></div>{!embedded && import.meta.env.VITE_STORE_URL && <a href={import.meta.env.VITE_STORE_URL} target="_blank" rel="noreferrer">Ver site ↗</a>}{user && <button onClick={() => run(() => signOut(auth), 'Você saiu do painel.')} disabled={busy}>Sair</button>}</header>
    <p role="status" aria-live="polite">{message}</p>
    {!configured ? <section className="admin-panel admin-login"><h2>Entrar</h2><p>Acesso exclusivo da equipe Goathi.</p><fieldset disabled><label>E-mail<input type="email" placeholder="Seu e-mail administrativo" /></label><label>Senha<input type="password" placeholder="Sua senha" /></label><button>Entrar no painel</button></fieldset><p>Login disponível após conectar o Firebase. Consulte ATIVAR-PAINEL.md.</p></section> : loading ? <p>Verificando acesso…</p> : !user ? <form className="admin-panel admin-login" onSubmit={e => { e.preventDefault(); run(() => signInWithEmailAndPassword(auth, email, password), '') }}><h2>Entrar</h2><label>E-mail<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy}>{busy ? 'Entrando…' : 'Entrar no painel'}</button></form> : !allowed ? <section className="admin-panel"><h2>Conta sem autorização</h2><p>Esta conta não está habilitada como administradora. Siga a etapa de autorização no guia do projeto.</p></section> : <>
    {tab==='dashboard'&&<><Cash dashboard/><section className="admin-panel"><h2>Central de operações</h2><div className="gp-kpis"><div className="gp-kpi"><small>Feedbacks pendentes</small><strong>{pending}</strong><button onClick={()=>setTab('feedback')}>Moderar</button></div><div className="gp-kpi"><small>Publicações</small><strong>{posts.length}</strong><button onClick={()=>setTab('posts')}>Gerenciar</button></div></div></section></>}
    {tab==='cash'&&<Cash/>}
    {tab==='prices'&&<form className="admin-panel" onSubmit={e => { e.preventDefault(); run(() => setDoc(doc(db, 'settings', 'catalogV2'), Object.fromEntries(Object.keys(labels).map(k => [k, prices[k] === '' || prices[k] === null ? null : Number(prices[k])]))), 'Preços atualizados no site.') }}><h2>Valores dos setups</h2><p>Deixe um campo vazio para mostrar “Preço a consultar”.</p><fieldset disabled={busy} className="admin-price-grid">{Object.keys(labels).map(key => <label key={key}>{labels[key]} (R$)<input type="number" min="0" max="99999" step="0.01" value={prices[key] ?? ''} onChange={e => setPrices({ ...prices, [key]: e.target.value })} /></label>)}</fieldset><button disabled={busy}>Salvar preços</button></form>}
    {tab==='promotion'&&<form className="admin-panel" onSubmit={e => { e.preventDefault(); run(() => setDoc(doc(db, 'settings', 'promotion'), {...promotion, price:Number(promotion.price)}), 'Oferta atualizada no site.') }}><h2>Oferta para quem já tem o Pack</h2><p>Os valores da vitrine, tabela e pedidos são atualizados pelo painel. O prazo usa o horário de Brasília e a faixa desaparece após o último dia.</p><fieldset disabled={busy}><label>Valor promocional (R$)<input type="number" min="0" max="99999" step="0.01" required value={promotion.price} onChange={e => setPromotion({...promotion,price:e.target.value})} /></label><label>Válida até<input type="date" required value={promotion.endDate} onChange={e => setPromotion({...promotion,endDate:e.target.value})} /></label><label className="admin-check"><input type="checkbox" checked={promotion.enabled} onChange={e => setPromotion({...promotion,enabled:e.target.checked})} />Ativar oferta</label></fieldset><button disabled={busy}>Salvar oferta</button></form>}
    {tab==='posts'&&<><form className="admin-panel" onSubmit={savePost}><h2>{post.id ? 'Editar publicação' : 'Nova publicação'}</h2><fieldset disabled={busy}><label>Título<input required maxLength={120} value={post.title} onChange={e => setPost({ ...post, title: e.target.value })} /></label><label>Tipo<select value={post.category} onChange={e => setPost({ ...post, category: e.target.value })}><option value="novidade">Novidade</option><option value="promocao">Promoção</option></select></label><label>Descrição<textarea required maxLength={5000} rows="6" value={post.body} onChange={e => setPost({ ...post, body: e.target.value })} /></label><label>Link da imagem (opcional)<input type="url" placeholder="https://..." maxLength={2000} value={post.image || ''} onChange={e => setPost({ ...post, image: e.target.value })} /></label><label>Enviar foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>chooseMedia(e,'image')}/></label>{post.image&&<img className="gp-media-preview" src={post.image} alt="Prévia da foto"/>}<label>Link do vídeo (opcional)<input type="url" maxLength={2000} value={post.video||''} onChange={e=>setPost({...post,video:e.target.value})}/></label><label>Enviar vídeo<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>chooseMedia(e,'video')}/></label>{post.video&&<video className="gp-media-preview" src={post.video} controls playsInline/>}<label className="admin-check"><input type="checkbox" checked={post.published} onChange={e => setPost({ ...post, published: e.target.checked })} />Publicar no site</label></fieldset><div className="admin-actions"><button disabled={busy}>Salvar publicação</button>{post.id && <button type="button" disabled={busy} onClick={() => setPost(empty)}>Cancelar edição</button>}</div></form>
    <section className="admin-panel"><h2>Publicações</h2>{!posts.length && <p>Nenhuma publicação cadastrada.</p>}{posts.map(item => <article className="admin-post" key={item.id}><div><h3>{item.title}</h3><p>{item.published ? 'Publicado' : 'Rascunho'} · {item.category === 'promocao' ? 'Promoção' : 'Novidade'}</p></div><div className="admin-actions"><button disabled={busy} onClick={() => { setPost(item); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</button><button disabled={busy} onClick={() => { if (window.confirm(`Excluir “${item.title}”?`)) run(async () => { await deleteDoc(doc(db, 'posts', item.id)); if (post.id === item.id) setPost(empty) }, 'Publicação excluída.') }}>Excluir</button></div></article>)}</section></>}{tab==='feedback'&&<FeedbackModeration />}</>}
  </div></div>
}
