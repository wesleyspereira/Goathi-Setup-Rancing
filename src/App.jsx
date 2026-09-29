import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import logoWhite from './assets/goathi/logo-branca.png'
import logoBlack from './assets/goathi/logo-preta.png'
import wetTrack from './assets/goathi/pista-molhada-nova.jpeg'
import { shop } from './data/shop'
import heroPoster from './assets/goathi/corrida.jpeg'
import qualifying from './assets/goathi/qualy-race.jpeg'
import race from './assets/goathi/corrida.jpeg'
import parcFerme from './assets/goathi/parc-ferme-foto.jpeg'
import intermediate from './assets/goathi/intermediario-novo.jpeg'
import qualifyingArt from './assets/goathi/qualifying.jpg'
import raceArt from './assets/goathi/race.jpg'
import parcFermeArt from './assets/goathi/parc-ferme.jpg'
import intermediateArt from './assets/goathi/intermediario.jpg'
import logoIMT from './assets/goathi/logo-imt.png'
import logoRBT from './assets/goathi/logo-rbt.jpeg'
// Fotos selecionadas conforme as indicações da Goathi.
const products = [
  { id: 'qualifying', tag: 'F1 26 • QUALIFYING', name: 'Qualifying Setup', description: 'Foco em volta rápida e performance na classificação.', image: qualifying },
  { id: 'race', tag: 'F1 26 • RACE', name: 'Race Setup', description: 'Equilíbrio e consistência para corridas de longa distância.', image: race },
  { id: 'parc-ferme', tag: 'F1 26 • PARC FERMÉ', name: 'Parc Fermé Setup', description: 'Configurações para as condições do fim de semana de Grande Prêmio.', image: parcFerme },
  { id: 'intermediate', tag: 'F1 26 • INTERMEDIÁRIO', name: 'Intermediário Setup', description: 'Ajustes para clima instável e pista molhada.', image: intermediate },
]
// As quatro artes aparecem primeiro; as fotos originais continuam na galeria.
const galleryItems = [
  {
    image: qualifyingArt,
    title: 'Qualifying Setup',
    description: 'Foco em volta rápida e mais performance.',
  },
  {
    image: raceArt,
    title: 'Race Setup',
    description: 'Equilíbrio e consistência para longa distância.',
  },
  {
    image: parcFermeArt,
    title: 'Parc Fermé Setup',
    description: 'Preparação para o fim de semana de Grande Prêmio.',
  },
  {
    image: intermediateArt,
    title: 'Intermediário Setup',
    description: 'Controle em clima instável e pista molhada.',
  },
]
function PackageCarousel() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const carousel = useRef(null)
  const touchStart = useRef(null)
  const swiped = useRef(false)
  const total = galleryItems.length
  const automatic = !reducedMotion && visible
  function move(direction) {
    setIndex(current => (current + direction + total) % total)
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(carousel.current)
    return () => { preference.removeEventListener('change', update); observer.disconnect() }
  }, [])

  useEffect(() => {
    if (!automatic) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % total)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [automatic, total])

  return (
    <figure ref={carousel} className="setup-carousel" aria-label="Artes e fotos Goathi" aria-roledescription="carrossel"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
      <div className="setup-carousel-stage"
        onTouchStart={event => { touchStart.current = event.touches[0].clientX; swiped.current = false }}
        onTouchEnd={event => {
          if (touchStart.current === null) return
          const distance = event.changedTouches[0].clientX - touchStart.current
          if (Math.abs(distance) > 45) { swiped.current = true; move(distance < 0 ? 1 : -1) }
          touchStart.current = null
        }}
        onTouchCancel={() => { touchStart.current = null }}>
        {galleryItems.map((item, itemIndex) => {
          const middle = Math.floor(total / 2)
          const position = (itemIndex - index + total + middle) % total - middle
          const distance = Math.abs(position)
          const active = position === 0
          return (
            <a key={item.image} href={item.image} target="_blank" rel="noopener noreferrer"
              className={`setup-carousel-slide ${active ? 'is-active' : ''}`}
              data-position={position} data-hidden={distance > 2}
              style={{ '--shift': `${Math.sign(position) * (distance === 1 ? 64 : distance >= 2 ? 95 : 0)}%`, '--angle': `${Math.sign(position) * (distance === 1 ? 50 : distance >= 2 ? 72 : 0)}deg`, '--distance': distance, zIndex: total - distance }}
              tabIndex={active ? 0 : -1} aria-hidden={!active}
              aria-label={`Ampliar ${item.title}`}
              onClick={event => {
                if (swiped.current) { event.preventDefault(); swiped.current = false; return }
                if (!active) { event.preventDefault(); setIndex(itemIndex) }
              }}>
              {/* Fundo que preenche as laterais */}
              <img
                className="carousel-image-bg"
                src={item.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                draggable={false}
              />

              {/* Imagem principal, inteira */}
              <img
                className="carousel-image-main"
                src={item.image}
                alt={item.title}
                loading="lazy"
                draggable={false}
              />
            </a>
          )
        })}
      </div>
      <div className="setup-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Imagem anterior">‹ <span>Anterior</span></button>
        <span className="setup-carousel-count">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(1)} aria-label="Próxima imagem"><span>Próxima</span> ›</button>
       
      </div>
      <figcaption aria-live={automatic ? 'off' : 'polite'} aria-atomic="true">
        <strong>{galleryItems[index].title}</strong>
        <span>{galleryItems[index].description}</span>
      </figcaption>
      <p className="setup-carousel-hint">Selecione uma lateral para girar. Toque na imagem central para ampliar.</p>
    </figure>
  )
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
      <h1 id="hero-title">A próxima volta<br /><em>O seu melhor</em></h1>
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
  const [type] = useState(order.product?.id || products[0].id)
  const [circuit, setCircuit] = useState('')
  const [observations, setObservations] = useState('')
  // As 25 pistas informadas pela Goathi; country identifica a bandeira local.
  const tracks = [
    { country: 'au', name: 'Austrália — Albert Park' },
    { country: 'cn', name: 'China — Shanghai International Circuit' },
    { country: 'jp', name: 'Japão — Suzuka' },
    { country: 'bh', name: 'Bahrein — Bahrain International Circuit' },
    { country: 'sa', name: 'Arábia Saudita — Jeddah Corniche Circuit' },
    { country: 'us', name: 'Miami — Miami International Autodrome' },
    { country: 'ca', name: 'Canadá — Circuit Gilles-Villeneuve' },
    { country: 'mc', name: 'Mônaco — Circuit de Monaco' },
    { country: 'es', name: 'Barcelona — Circuit de Barcelona-Catalunya' },
    { country: 'at', name: 'Áustria — Red Bull Ring' },
    { country: 'gb', name: 'Grã-Bretanha — Silverstone' },
    { country: 'be', name: 'Bélgica — Spa-Francorchamps' },
    { country: 'hu', name: 'Hungria — Hungaroring' },
    { country: 'nl', name: 'Holanda — Zandvoort' },
    { country: 'it', name: 'Itália — Monza' },
    { country: 'es', name: 'Espanha — MADRING (Madrid)' },
    { country: 'az', name: 'Azerbaijão — Baku City Circuit' },
    { country: 'sg', name: 'Singapura — Marina Bay' },
    { country: 'us', name: 'EUA — Circuit of the Americas (Austin)' },
    { country: 'mx', name: 'México — Autódromo Hermanos Rodríguez' },
    { country: 'br', name: 'Brasil — Interlagos' },
    { country: 'us', name: 'Las Vegas — Las Vegas Strip Circuit' },
    { country: 'qa', name: 'Qatar — Lusail' },
    { country: 'ae', name: 'Abu Dhabi — Yas Marina' },
    { country: 'it', name: 'Imola — Autodromo Enzo e Dino Ferrari' },
  ]
  const trackPickerRef = useRef(null)
  const [trackError, setTrackError] = useState(false)
  const selectedTrack = tracks.find(track => track.name === circuit)
  const isPack = order.kind === 'pack'
  const isCatalog = order.kind === 'catalog'
  const product = products.find(item => item.id === type)
  const price = isPack ? shop.prices.pack : isCatalog ? shop.prices.cards : shop.prices.individual
  const checkoutUrl = isPack ? shop.checkout.pack : isCatalog ? shop.checkout.cards[type] : shop.checkout.individual[type]
  const hasCheckout = typeof checkoutUrl === 'string' && checkoutUrl.startsWith('https://')
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
    if (!isPack && !selectedTrack) {
      setTrackError(true)
      const picker = trackPickerRef.current
      if (picker) { picker.open = true; picker.querySelector('summary')?.focus() }
      return
    }
    const productName = isPack
      ? 'Pack Completo Goathi'
      : isCatalog
        ? product.name
        : 'Setup individual'
    const message = [
      `Olá! Quero comprar o ${productName} para F1 26 DLC.`,
      !isPack ? `Pista: ${circuit}` : '',
      `Valor: ${money(price)}`,
      !isPack && observations.trim()
        ? `Observações: ${observations.trim()}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(
      `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }
  return <dialog ref={dialog} className="purchase-dialog" aria-labelledby="purchase-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose() } }}>
    <button className="dialog-close" type="button" onClick={onClose} aria-label="Fechar pedido" autoFocus>×</button>
    <p className="eyebrow">GOATHI SETUPS • F1 26 DLC</p>
    <h2 id="purchase-title">{isPack ? 'Pack completo' : isCatalog ? product.name : 'Setup individual'}</h2>
    <p className="dialog-description">
      {isPack
        ? 'Todos os circuitos e todas as configurações disponíveis no pack Goathi.'
        : isCatalog
          ? product.description
          : 'Selecione sua pista e informe suas preferências nas observações.'}
    </p>
    <p className="order-price">{money(price)}<small>{isPack ? ' / pack' : isCatalog ? ' / setup' : ' / setup individual'}</small></p>
    <form onSubmit={sendOrder}>
      {!isPack && (
        <div className="order-fields">
          <div className="track-field">
            <span className="track-field-label" id="track-label">Pista</span>
            <details className="track-picker" ref={trackPickerRef}
              onKeyDown={event => {
                if (event.key === 'Escape' && event.currentTarget.open) {
                  event.preventDefault()
                  event.stopPropagation()
                  event.currentTarget.open = false
                  event.currentTarget.querySelector('summary')?.focus()
                }
              }}>
              <summary aria-labelledby="track-label track-value" aria-invalid={trackError}
                aria-describedby={trackError ? 'track-error' : undefined}>
                {selectedTrack && <img className="track-flag" src={`${import.meta.env.BASE_URL}flags/${selectedTrack.country}.png`} alt="" width="28" height="20" />}
                <span id="track-value">{selectedTrack?.name || 'Selecione uma pista'}</span>
                <span className="track-chevron" aria-hidden="true">▾</span>
              </summary>
              <div className="track-options" role="group" aria-label="Pistas disponíveis">
                {tracks.map(track => (
                  <button key={track.name} type="button" className="track-option" aria-pressed={circuit === track.name}
                    onClick={() => {
                      setCircuit(track.name)
                      setTrackError(false)
                      const picker = trackPickerRef.current
                      if (picker) { picker.open = false; picker.querySelector('summary')?.focus() }
                    }}>
                    <img className="track-flag" src={`${import.meta.env.BASE_URL}flags/${track.country}.png`} alt="" width="28" height="20" loading="lazy" />
                    <span>{track.name}</span>
                  </button>
                ))}
              </div>
            </details>
            {trackError && <p className="track-error" id="track-error" role="alert">Selecione uma pista para continuar.</p>}
          </div>
          <label>
            Observações (opcional)
            <textarea
              value={observations}
              onChange={event => setObservations(event.target.value)}
              placeholder="Ex.: prefiro um carro mais estável nas curvas."
              rows={2}
              maxLength={500}
            />
          </label>
        </div>
      )}
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
          <div className="product-body"><p className="eyebrow">{product.tag}</p><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><button type="button" onClick={() => setOrder({ kind: 'catalog', product })} aria-haspopup="dialog" aria-label={'Ver setup: ' + product.name}>VER SETUP ↗</button></div></div>
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
      <section className="brand-materials container" aria-labelledby="materials-title"><div className="materials-grid"><div className="gallery-copy"><p className="eyebrow">GOATHI SETUPS • F1 26 DLC</p><h2 id="materials-title">Cada condição.<br />Uma nova volta.</h2><p>Quatro configurações. Um objetivo: extrair mais do carro.</p><div className="setup-tags"><span>Qualifying</span><span>Race</span><span>Parc Fermé</span><span>Intermediário</span></div><a className="button primary" href="#pacotes">ESCOLHER MEU SETUP ↗</a></div><PackageCarousel /></div></section>
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
