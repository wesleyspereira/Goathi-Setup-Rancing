import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import logoWhite from './assets/goathi/logo-branca.png'
import logoBlack from './assets/goathi/logo-preta.png'
import wetTrack from './assets/goathi/pista-molhada-nova.jpeg'
import { shop } from './data/shop'
import jogo01 from './assets/goathi/galeria/jogo-01.jpeg'
import jogo02 from './assets/goathi/galeria/jogo-02.jpeg'
import jogo03 from './assets/goathi/galeria/jogo-03.jpeg'
import jogo04 from './assets/goathi/galeria/jogo-04.jpeg'
import jogo05 from './assets/goathi/galeria/jogo-05.jpeg'
import heroPoster from './assets/goathi/corrida.jpeg'
import qualifying from './assets/goathi/qualy-race.jpeg'
import race from './assets/goathi/corrida.jpeg'
import parcFerme from './assets/goathi/parc-ferme-foto.jpeg'
import intermediate from './assets/goathi/intermediario-novo.jpeg'
import logoIMT from './assets/goathi/logo-imt.png'
import logoRBT from './assets/goathi/logo-rbt.jpeg'

// Fotos selecionadas conforme as indicações da Goathi.
const products = [
  { id: 'qualifying', tag: 'F1 26 • QUALIFYING', name: 'Qualifying Setup', description: 'Foco em volta rápida e performance na classificação.', image: qualifying },
  { id: 'race', tag: 'F1 26 • RACE', name: 'Race Setup', description: 'Equilíbrio e consistência para corridas de longa distância.', image: race },
  { id: 'parc-ferme', tag: 'F1 26 • PARC FERMÉ', name: 'Parc Fermé Setup', description: 'Configurações para as condições do fim de semana de Grande Prêmio.', image: parcFerme },
  { id: 'intermediate', tag: 'F1 26 • INTERMEDIÁRIO', name: 'Intermediário Setup', description: 'Ajustes para clima instável e pista molhada.', image: intermediate },
]

const packagePhotos = [jogo01, jogo02, jogo03, jogo04, jogo05]

function PackageCarousel() {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touchStart = useRef(null)
  const move = delta => setIndex(current => (current + delta + packagePhotos.length) % packagePhotos.length)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (hovered || focused || reduced) return
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [hovered, focused, reduced])

  return <figure className="package-gallery" aria-label="Fotos do setup completo" aria-roledescription="carrossel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="package-gallery-stage"
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}
      onTouchStart={event => { touchStart.current = event.touches[0].clientX }}
      onTouchEnd={event => { if (touchStart.current !== null) { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1); touchStart.current = null } }}>
      {packagePhotos.map((src, photoIndex) => <a key={src} className={`package-gallery-slide${photoIndex === index ? ' is-active' : ''}`} href={src} target="_blank" rel="noreferrer" tabIndex={photoIndex === index ? 0 : -1} aria-hidden={photoIndex !== index} aria-label={`Ampliar foto ${photoIndex + 1}`}>
        <img src={src} alt={`Ferrari na pista — foto ${photoIndex + 1} do setup completo`} loading="lazy" />
      </a>)}
      <button className="gallery-arrow gallery-prev" onClick={() => move(-1)} aria-label="Foto anterior">‹</button>
      <button className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Próxima foto">›</button>
    </div>
    <div className="gallery-controls">
      <span>{index + 1} / {packagePhotos.length}</span>
    </div>
    <figcaption><strong>Setup completo</strong><br />Quatro configurações. Um objetivo: extrair mais do carro.</figcaption>
  </figure>
}

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

  return <section className="hero hero-hover" aria-labelledby="hero-title"
    onMouseEnter={startMotion} onMouseLeave={stopMotion}
    onFocus={startMotion}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) stopMotion() }}
  >
    <video ref={video} className="hero-video" src={`${import.meta.env.BASE_URL}videos/corrida.mp4`} muted loop playsInline preload="metadata" poster={heroPoster} onLoadedData={() => setUnavailable(false)} aria-hidden="true" onError={() => setUnavailable(true)} />
    <div className="hero-shade" />
    <div className="hero-content container">
      <p className="eyebrow"><span /> GOATHI SETUPS • F1 26 DLC</p>
      <h1 id="hero-title">A próxima volta.<br /><em>O seu melhor.</em></h1>
      <p className="hero-description">Setups desenvolvidos para extrair mais performance do seu carro no F1 26.</p>
      <div className="hero-actions"><a className="button primary" href="#setups">ENCONTRAR MEU SETUP <span aria-hidden="true">↗</span></a><a className="button secondary" href="#sobre">CONHECER A GOATHI</a></div>
    </div>
    <div className="hero-bottom container"><span>PRECISÃO EM CADA CURVA</span>{unavailable && <span className="video-note">Vídeo indisponível</span>}</div>
  </section>
}

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

function ThemeToggle({ theme, onToggle }) {
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`} title={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />}</svg>
    <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
  </button>
}

// O diálogo usa foco nativo, Escape e restauração do foco ao botão de origem.
function PurchaseDialog({ order, onClose }) {
  const dialog = useRef(null)
  const [type, setType] = useState(order.product?.id || products[0].id)
  const [circuit, setCircuit] = useState('')
  const isPack = order.kind === 'pack'
  const isCatalog = order.kind === 'catalog'
  const product = products.find(item => item.id === type)
  const price = isPack ? shop.prices.pack : isCatalog ? shop.prices.cards : shop.prices.individual
  const checkoutUrl = isPack ? shop.checkout.pack : isCatalog ? shop.checkout.cards[type] : shop.checkout.individual[type]
  const hasCheckout = typeof checkoutUrl === 'string' && /^https:\/\//.test(checkoutUrl)

  useEffect(() => {
    const current = dialog.current
    const trigger = document.activeElement
    current.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { current.close(); document.body.style.overflow = previousOverflow; trigger?.focus() }
  }, [])

  function sendOrder(event) {
    event.preventDefault()
    if (!isPack && !circuit.trim()) return
    const message = isPack
      ? `Olá! Quero comprar o Pack Completo Goathi para F1 26 DLC por ${money(price)}.`
      : `Olá! Quero comprar o ${product.name} para F1 26 DLC. Circuito: ${circuit.trim()}. Valor: ${money(price)}.`
    window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return <dialog ref={dialog} className="purchase-dialog" aria-labelledby="purchase-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose() } }}>
    <button className="dialog-close" type="button" onClick={onClose} aria-label="Fechar pedido" autoFocus>×</button>
    <p className="eyebrow">GOATHI SETUPS • F1 26 DLC</p>
    <h2 id="purchase-title">{isPack ? 'Pack completo' : isCatalog ? product.name : 'Setup individual'}</h2>
    <p className="dialog-description">{isPack ? 'Todos os circuitos e todas as configurações disponíveis no pack Goathi.' : product.description}</p>
    <p className="order-price">{money(price)}<small>{isPack ? ' / pack' : isCatalog ? ' / setup' : ' / setup individual'}</small></p>
    <form onSubmit={sendOrder}>
      {!isPack && <div className="order-fields"><label>Configuração<select value={type} onChange={event => setType(event.target.value)}>{products.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        {!hasCheckout && <label>Circuito<input value={circuit} onChange={event => setCircuit(event.target.value)} placeholder="Ex.: Interlagos" required maxLength={100} pattern=".*\S.*" /></label>}
      </div>}
      {hasCheckout ? <><a className="button primary checkout-button" href={checkoutUrl} target="_blank" rel="noreferrer">IR PARA PAGAMENTO ↗</a><p className="order-note">Confira os itens e, para um setup individual, selecione o circuito na página de pagamento.</p></> : <><button className="button primary checkout-button" type="submit">CONTINUAR PELO WHATSAPP ↗</button><p className="order-note">Seu pedido será enviado à Goathi para confirmar disponibilidade, pagamento e entrega. Nenhuma cobrança é realizada neste site.</p></>}
    </form>
  </dialog>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090A0C' : '#F5F5F5')
    try { localStorage.setItem('goathi-theme', theme) } catch { /* Navegação com armazenamento desativado. */ }
  }, [theme])
  useEffect(() => {
    const closeMenu = event => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', closeMenu)
    return () => document.removeEventListener('keydown', closeMenu)
  }, [])
  const logo = theme === 'dark' ? logoWhite : logoBlack
  return <>
    <a href="#main" className="skip-link">Pular para o conteúdo</a>
    <header className="header"><div className="container navigation">
      <a className="brand" href="#" aria-label="Goathi Setups — início"><img className="brand-logo" src={logo} alt="Goathi Setups" /></a>
      <nav id="main-menu" className={menuOpen ? 'nav open' : 'nav'} aria-label="Menu principal"><a href="#setups" onClick={() => setMenuOpen(false)}>Setups</a><a href="#pacotes" onClick={() => setMenuOpen(false)}>Pacotes</a><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a><a className="nav-cta" href="#setups" onClick={() => setMenuOpen(false)}>VER SETUPS ↗</a></nav>
      <div className="header-actions"><ThemeToggle theme={theme} onToggle={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} /><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fechar' : 'Menu'}</button></div>
    </div></header>
    <main id="main"><RaceBanner />
      <div className="racing-strip"><div className="container"><span>F1 26 DLC</span><span>QUALIFYING</span><span>RACE</span><span>PARC FERMÉ</span><span>INTERMEDIÁRIO</span></div></div>
      <section id="setups" className="catalog container" aria-labelledby="catalog-title">
        <div className="section-heading"><div><p className="eyebrow">ESCOLHA COMO VOCÊ QUER CORRER</p><h2 id="catalog-title">Seu ritmo começa aqui.</h2></div><p>Setups agressivos, precisos e desenvolvidos para performance na pista.</p></div>
        <div className="products">{products.map(product => <article key={product.id} className="product">
          <div className="product-photo"><img className={`setup-image setup-image--${product.id}`} src={product.image} alt={product.id === 'intermediate' ? 'Ferrari em pista molhada' : `Ferrari na pista — ${product.name}`} loading="lazy" width="800" height="500" /></div>
          <div className="product-body"><p className="eyebrow">{product.tag}</p><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><span>{money(shop.prices.cards)}<small>por setup</small></span><button type="button" onClick={() => setOrder({ kind: 'catalog', product })} aria-haspopup="dialog" aria-label={'Ver setup: ' + product.name}>VER SETUP ↗</button></div></div>
        </article>)}</div>
      </section>
      <section id="pacotes" className="pricing-section" aria-labelledby="pricing-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">PREPARAÇÃO QUE VIRA PERFORMANCE</p><h2 id="pricing-title">Escolha sua performance.</h2></div><p>Configure sua próxima corrida com setups para diferentes momentos da pista.</p></div>
        <div className="pricing-grid">
          <article className="price-card"><p className="eyebrow">UMA PISTA. SEU OBJETIVO.</p><h3>Setup individual</h3><p className="price">{money(shop.prices.individual)}<small> / setup</small></p><p>Escolha o circuito e adquira o setup que você precisa.</p><ul><li>Um circuito à sua escolha</li><li>A configuração para seu estilo de corrida</li><li>Foco no seu próximo desafio</li></ul><button className="button primary" type="button" aria-haspopup="dialog" onClick={() => setOrder({ kind: 'individual' })}>COMPRAR SETUP ↗</button></article>
          <article className="price-card price-card-featured"><span className="value-badge">MAIOR ECONOMIA</span><p className="eyebrow">PRONTO PARA CADA DESAFIO</p><h3>Pack completo</h3><p className="price">{money(shop.prices.pack)}<small> / pack</small></p><p>O conjunto completo de setups disponíveis da Goathi.</p><ul><li>Todos os circuitos</li><li>Todas as configurações disponíveis</li><li>Da classificação à bandeirada</li></ul><button className="button primary" type="button" aria-haspopup="dialog" onClick={() => setOrder({ kind: 'pack' })}>QUERO O PACK COMPLETO ↗</button></article>
        </div>
        <p className="support-line">Dúvidas sobre qual escolher? <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer">Fale com a Goathi ↗</a></p>
      </div></section>
      <section className="manifesto container" aria-label="Manifesto Goathi"><p className="eyebrow">CADA AJUSTE CONTA.</p><h2>PERFORMANCE<br />IS <span>BUILT.</span></h2><p>Performance não acontece por acaso.<br />Ela é construída em cada ajuste, cada curva e cada volta.</p></section>
      <section id="sobre" className="about container" aria-labelledby="about-title"><div className="about-copy"><p className="eyebrow">DA PRIMEIRA VOLTA À BANDEIRADA</p><h2 id="about-title">Performance construída para a pista.</h2><p>A Goathi Setups nasceu para transformar preparação em performance.</p><p>Desenvolvemos setups para F1 26 com foco em velocidade, equilíbrio e consistência — da classificação à bandeirada.</p><a className="text-link" href="https://www.instagram.com/goathisetups/" target="_blank" rel="noreferrer">ACOMPANHE A GOATHI ↗</a></div><figure className="about-photo"><img src={wetTrack} alt="Ferrari contornando uma curva na pista molhada" loading="lazy" /><figcaption>VELOCIDADE. CONTROLE. CONSISTÊNCIA.</figcaption></figure></section>
      <section className="brand-materials container" aria-labelledby="materials-title"><div className="materials-grid"><PackageCarousel /><div className="gallery-copy"><p className="eyebrow">GOATHI SETUPS • F1 26 DLC</p><h2 id="materials-title">Cada condição.<br />Uma nova volta.</h2><p>Quatro configurações. Um objetivo: extrair mais do carro.</p><div className="setup-tags"><span>Qualifying</span><span>Race</span><span>Parc Fermé</span><span>Intermediário</span></div><a className="button primary" href="#pacotes">ESCOLHER MEU SETUP ↗</a></div></div></section>
      <section id="contato" className="contact container" aria-labelledby="contact-title"><div className="contact-copy"><p className="eyebrow">SUA PRÓXIMA VOLTA COMEÇA AQUI</p><h2 id="contact-title">Pronto para ir além?</h2><p>Escolha seu setup e prepare sua próxima corrida. Para dúvidas e novidades, fale com a Goathi ou acompanhe nosso Instagram.</p><a className="text-link" href="#pacotes">VER PRODUTOS E PREÇOS ↗</a></div>
        <div className="contact-links">
          <a className="contact-link" href="https://wa.me/5527996452596" target="_blank" rel="noreferrer" aria-label="Falar com a Goathi Setups pelo WhatsApp">
            <span className="contact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img"><path fill="currentColor" d="M19.1 4.9A9.8 9.8 0 0 0 3.7 16.7L2.3 22l5.4-1.4A9.8 9.8 0 0 0 22 11.9a9.7 9.7 0 0 0-2.9-7Zm-7 15.3a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3.2.9.9-3.1-.2-.3A8.1 8.1 0 1 1 12.1 20.2Zm4.4-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.3.2-.3.7-1 .1-.1.1-.3 0-.5l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3.7.3 1.2.5 1.6.6.7.2 1.4.2 1.9.1.6-.1 1.4-.6 1.6-1.1.2-.5.2-1 .2-1.1-.1-.1-.2-.2-.5-.3Z" /></svg>
            </span>
          </a>

          <a className="contact-link" href="https://www.instagram.com/goathisetups/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram da Goathi Setups">
            <span className="contact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img"><path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.7 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>
            </span>
          </a>
        </div>
      </section>
    </main>
    <footer className="site-footer">
      <section
        className="partners container"
        aria-labelledby="partners-title"
      >
        <p className="eyebrow">JUNTOS NA PISTA</p>
        <h2 id="partners-title">Nossos parceiros.</h2>

        <div className="partners-grid">
          <article className="partner partner-main">
            <span className="partner-label">
              PARCEIRO PRINCIPAL
            </span>

            <div className="partner-logo">
              <img
                src={logoIMT}
                alt="IMT — IronX E-Sports"
                loading="lazy"
              />
            </div>

            <h3>IMT — IronX E-Sports</h3>
          </article>

          <article className="partner">
            <span className="partner-label">PARCEIRO</span>

            <div className="partner-logo">
              <img
                src={logoRBT}
                alt="RBT — Racing Brazil Team"
                loading="lazy"
              />
            </div>

            <h3>RBT — Racing Brazil Team</h3>
          </article>
        </div>
      </section>

      <div className="container footer">
        <a
          className="brand"
          href="#"
          aria-label="Goathi Setups — início"
        >
          <img
            className="brand-logo"
            src={logo}
            alt="Goathi Setups"
          />
        </a>

        <p>
          © {new Date().getFullYear()} Goathi Setups
          F1 26 DLC • GOATHI SETUPS
        </p>

        <span>PERFORMANCE IS BUILT.</span>
      </div>
    </footer>
    {order && <PurchaseDialog order={order} onClose={() => setOrder(null)} />}
  </>
}
