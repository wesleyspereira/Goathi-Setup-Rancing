import React, { useEffect, useRef, useState } from 'react'
import { News, useContent } from './admin/Content'
import { Feedback } from './admin/Feedback'
import { shop, products, money, promotionActive } from './data/shop'
import { tracks } from './data/tracks'
import './App.css'
import './refinements.css'
import { Gallery } from './components/Gallery'
import heroPoster from './assets/goathi/corrida.jpeg'
const base = import.meta.env.BASE_URL
const asset = path => window.GOATHI_PREVIEW_ASSETS?.[path] || `${base}${path}`
function RaceBanner() {
  const video = useRef(null)
  const [unavailable, setUnavailable] = useState(false)
  // O movimento começa com mouse ou foco pelo teclado.
  function startMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    video.current?.play().catch(() => { })
  }
  function stopMotion() { video.current?.pause() }
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchDevice = window.matchMedia('(hover: none)')
    const stopIfReduced = () => {
      if (preference.matches) video.current?.pause()
      else if (touchDevice.matches) startMotion()
    }
    stopIfReduced()
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stopMotion()
      else if (touchDevice.matches) startMotion()
    })
    if (video.current) observer.observe(video.current)
    preference.addEventListener('change', stopIfReduced)
    return () => { preference.removeEventListener('change', stopIfReduced); observer.disconnect() }
  }, [])
  return <section className="race-hero hero-hover" aria-labelledby="hero-title"
    onMouseEnter={startMotion} onMouseLeave={stopMotion}
    onFocus={startMotion}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) stopMotion() }}
  >
    <video ref={video} className="race-background hero-video" src={window.GOATHI_PREVIEW_VIDEO || `${import.meta.env.BASE_URL}videos/corrida.mp4`} muted loop playsInline preload="metadata" poster={heroPoster} onLoadedData={() => setUnavailable(false)} aria-hidden="true" onError={() => setUnavailable(true)} />
    <div className="race-shade" />
    <div className="race-content container">
      <p className="eyebrow"><span /> GOATHI SETUPS • F1 26 DLC</p>
      <h1 id="hero-title">A próxima volta<br /><em>O seu melhor</em></h1>
      <p className="hero-description">Setups desenvolvidos para extrair mais performance do seu carro no F1 26.</p>
      <div className="hero-actions"><a className="btn" href="#produtos">ENCONTRAR MEU SETUP <span aria-hidden="true">↗</span></a><a className="btn btn--ghost" href="#sobre">CONHECER A GOATHI</a></div>
    </div>
    <div className="hero-bottom container"><span>PRECISÃO EM CADA CURVA</span>{unavailable && <span className="video-note">Vídeo indisponível</span>}</div>
  </section>
}

function Purchase({ product, price, close }) {
  const ref = useRef(null), [circuit, setCircuit] = useState(''), [notes, setNotes] = useState('')
  useEffect(() => {
    const trigger = document.activeElement, overflow = document.body.style.overflow
    ref.current.showModal(); document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; trigger?.focus() }
  }, [])
  function submit(e) {
    e.preventDefault()
    const checkout = shop.checkout[product.id]
    if (checkout && price != null) { window.open(checkout, '_blank', 'noopener,noreferrer'); return }
    const message = [`Olá, Goathi! Quero adquirir ${product.name}.`, `Valor: ${money(price)}`, circuit && `Pista: ${circuit}`, notes && `Observações: ${notes}`].filter(Boolean).join('\n')
    window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }
  return <dialog ref={ref} className="purchase-dialog" aria-labelledby="purchase-title" onCancel={close}><button className="close-dialog" onClick={close} aria-label="Fechar pedido">Fechar</button><p className="eyebrow">SEU PEDIDO</p><h2 id="purchase-title">{product.name}</h2><p className="price">{money(price)}</p><form onSubmit={submit}>{product.id === 'individual' && <label>Circuito<select required value={circuit} onChange={e => setCircuit(e.target.value)}><option value="">Selecione uma pista</option>{tracks.map(t => <option key={t.name}>{t.name}</option>)}</select></label>}<label>Observações (opcional)<textarea maxLength={1000} value={notes} onChange={e => setNotes(e.target.value)} /></label><p>Confirme disponibilidade, pagamento e entrega com a Goathi. Nenhuma cobrança é realizada nesta página.</p><button className="btn" type="submit">Continuar compra</button></form></dialog>
}
export default function App() {
  const { prices, promotion } = useContent()
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'claro' ? 'claro' : 'escuro')
  const [pdfTheme, setPdfTheme] = useState('escuro'), [order, setOrder] = useState(null), [menu, setMenu] = useState(false), [now, setNow] = useState(Date.now())
  useEffect(() => { document.documentElement.dataset.theme = theme; document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'claro' ? '#F4F2EC' : '#0E0E10'); try { localStorage.setItem('goathi-theme', theme) } catch {} }, [theme])
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  const offer = promotionActive(promotion, now)
  const logo = asset(`logos/logo_goathi_para-fundo-${theme === 'claro' ? 'claro' : 'escuro'}.png`)
  return <><a className="skip-link" href="#main">Pular para o conteúdo</a><header className="site-header"><div className="container navigation"><a href="#" aria-label="Goathi Setups início"><img className="brand-logo" src={logo} alt="Goathi Setups" /></a><button className="mobile-menu" aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>Menu</button><nav id="navigation" className={menu ? 'open' : ''}>{[['produtos','Produtos'],['previas','Prévias'],['novidades','Novidades'],['feedbacks','Feedbacks'],['contato','Contato']].map(([id,label]) => <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>{label}</a>)}</nav><button className="theme-button" onClick={() => setTheme(theme === 'claro' ? 'escuro' : 'claro')} aria-label={`Ativar tema ${theme === 'claro' ? 'escuro' : 'off-white'}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">{theme === 'claro' ? <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}</svg></button></div></header>
  <main id="main"><RaceBanner />
  <section id="produtos" className="container section"><p className="eyebrow">QUATRO FORMAS DE SE PREPARAR</p><h2>Escolha sua <em>performance.</em></h2><div className="product-grid">{products.map(p => <article key={p.id} className={`card product-card ${p.id === 'pro' ? 'card--red' : ''}`}><div className="badge-slot">{p.badge && <span className="pill">{p.badge}</span>}</div><h3>{p.name}</h3><p className="summary">{p.summary}</p><p className="price">{money(prices[p.id])}</p><ul>{p.details.map(d => <li key={d}>{d}</li>)}</ul><button className="btn" onClick={() => setOrder(p)}>Escolher {p.name}</button></article>)}</div><p className="muted">Todos os PDFs incluem os temas escuro e off-white. Atualizações dos setups continuam gratuitas para clientes.</p></section>
  {offer && <section className="container upgrade"><div><p className="eyebrow">CONDIÇÃO PARA CLIENTES</p><h2>Já tem o <em>Pack?</em></h2><p>Adquira o novo ERS + Estratégia por <strong>{money(promotion.price)}</strong> <span>(de {money(prices.ers)})</span>, até {promotion.endDate.split('-').reverse().join('/')}.</p><p className="muted">Envie seu comprovante pelo direct para confirmar a condição.</p></div><a className="btn" href="https://www.instagram.com/goathisetups/" target="_blank" rel="noreferrer">Solicitar pelo Instagram</a></section>}
  <section className="container section"><p className="eyebrow">COMPARE OS CONTEÚDOS</p><h2>Produtos e <em>valores.</em></h2><div className="table-wrap"><table><caption>Catálogo Goathi Setups — F1 26 DLC</caption><thead><tr><th scope="col">Produto</th><th scope="col">Conteúdo</th><th scope="col">Valor</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><th scope="row">{p.name}</th><td>{p.summary} {p.details[0]}</td><td className="price-cell">{money(prices[p.id])}</td></tr>)}</tbody></table></div></section>
  <section id="previas" className="container section"><p className="eyebrow">EXEMPLO · ÁUSTRIA</p><div className="section-heading"><h2>Conheça nossos <em>setups.</em></h2><div className="theme-options" aria-label="Tema das prévias">{['escuro','claro'].map(t => <button key={t} aria-pressed={pdfTheme === t} onClick={() => setPdfTheme(t)}>{t === 'claro' ? 'Off-white' : 'Escuro'}</button>)}</div></div><div className="preview-grid">{[1,2].map(n => <figure className="card" key={n}><a href={asset(`previews-pdf/exemplo-austria_pagina${n}_${pdfTheme}.jpg`)} target="_blank" rel="noreferrer"><img src={asset(`previews-pdf/exemplo-austria_pagina${n}_${pdfTheme}.webp`)} alt={`Prévia Áustria, página ${n}: ${n === 1 ? 'setups' : 'ERS e estratégia'}, tema ${pdfTheme}`} loading="lazy" /></a><figcaption>Página {n} · {n === 1 ? 'Setups' : 'ERS + Estratégia'} — clique para ampliar</figcaption></figure>)}</div></section>
  <section className="container section"><p className="eyebrow">DA ESCOLHA À PISTA</p><h2>Como <em>comprar.</em></h2><div className="steps">{[['Escolha o produto','Selecione o conteúdo desejado. No avulso, escolha também o circuito.'],['Confirme seu pedido','Continue pelo WhatsApp para combinar pagamento e entrega com a Goathi.'],['Receba seus PDFs','Acesse o material por pista nos dois temas e prepare sua próxima corrida.']].map(([title,text],i) => <article className="card" key={title}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section id="sobre" className="container section about about-layout"><div className="about-copy"><p className="eyebrow">DA PRIMEIRA VOLTA À BANDEIRADA</p><h2>Performance construída<br />para a pista.</h2><p>A Goathi Setups nasceu para transformar preparação em performance.</p><p>Desenvolvemos setups para F1 26 com foco em velocidade, equilíbrio e consistência — da classificação à bandeirada.</p><a className="about-follow" href="https://www.instagram.com/goathisetups/" target="_blank" rel="noreferrer">ACOMPANHE A GOATHI <span aria-hidden="true">↗</span></a></div><Gallery /></section><News /><Feedback />
  <section className="container section faq"><p className="eyebrow">DÚVIDAS FREQUENTES</p><h2>Antes da <em>largada.</em></h2>{[['O que vem no Individual Setup?','Quatro setups de uma pista: Qualifying, Race, Parc Fermé e Intermediate.'],['ERS + Estratégia é uma atualização?','É um produto novo, vendido separadamente ou junto dos setups no Pack Pro.'],['As atualizações dos setups continuam gratuitas?','Sim. As atualizações dos setups continuam gratuitas para quem já comprou.'],['Como funciona o Pack Pro?','São 25 pistas, com um PDF por pista: setups na página 1 e ERS e estratégia na página 2. Os PDFs vêm nos temas escuro e off-white.']].map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
  <section id="contato" className="container section contact"><p className="eyebrow">FALE COM A GOATHI</p><h2>Sua próxima <em>corrida.</em></h2><p>Dúvidas sobre os produtos, condições e entrega? Fale com a equipe.</p><div className="actions"><a className="social-icon" href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Falar com a Goathi pelo WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.6 8.6 0 0 1-12.7 7.6L3 20.5l1.3-4.7a8.6 8.6 0 1 1 16.2-4.2Z"/><path d="M8.1 7.5c.3-.3.8-.2 1 .2l.9 1.8c.1.3.1.5-.1.7l-.7.7c.7 1.5 1.8 2.6 3.4 3.3l.7-.8c.2-.2.5-.3.8-.1l1.8.9c.4.2.4.6.2 1-1 1.6-2.9 1.1-5.1-.3-2.1-1.4-3.5-3.4-3.7-5.3-.1-.9.3-1.6.8-2.1Z"/></svg></a><a className="social-icon" href="https://www.instagram.com/goathisetups/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram da Goathi" title="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a></div></section></main>
  <footer className="container footer"><img className="brand-logo" src={logo} alt="Goathi Setups" /><p>© {new Date().getFullYear()} Goathi Setups · F1 26 DLC</p></footer>{order && <Purchase product={order} price={prices[order.id]} close={() => setOrder(null)} />}</>
}
