import React, { createContext, useContext, useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { shop, promotionDefault } from '../data/shop'
import { db } from './firebase'
import './admin.css'
import { NewsVideo } from '../components/NewsVideo'
const Content = createContext({ prices: shop.prices, promotion: promotionDefault, posts: [], error: '' })
export const useContent = () => useContext(Content)
export function ContentProvider({ children }) {
  const [prices, setPrices] = useState(shop.prices)
  const [promotion, setPromotion] = useState(promotionDefault)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    if (!db) return
    const fail = () => setError('Não foi possível atualizar o conteúdo. Tente novamente mais tarde.')
    const a = onSnapshot(doc(db, 'settings', 'catalogV2'), snap => {
      if (snap.exists()) setPrices({ ...shop.prices, ...snap.data() })
    }, fail)
    const b = onSnapshot(query(collection(db, 'posts'), where('published', '==', true)), snap => {
      setPosts(snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
    }, fail)
    const c = onSnapshot(doc(db, 'settings', 'promotion'), snap => { if (snap.exists()) setPromotion(snap.data()) }, fail)
    return () => { a(); b(); c() }
  }, [])
  return <Content.Provider value={{ prices, promotion, posts, error }}>{children}</Content.Provider>
}
export function News() {
  const { posts, error } = useContent()
  return <section id="novidades" className="container news-section"><p className="eyebrow">FIQUE POR DENTRO</p><h2>Novidades e <em>promoções.</em></h2>{error && <p role="status">{error}</p>}<div className="news-grid"><article className="news-card news-video-card"><NewsVideo /><div><p className="eyebrow">NOVO PRODUTO</p><h3>Conheça o ERS + Estratégia</h3><p className="news-text">Mapa de ERS e estratégia de corrida de 50% para as 25 pistas. Veja a apresentação do novo produto da Goathi.</p><a className="text-link" href="#produtos">Ver produtos</a></div></article>{posts.map(post => <article className="news-card" key={post.id}>{/^https:\/\//.test(post.image || '') && <img src={post.image} alt={post.title} loading="lazy" />}<div><p className="eyebrow">{post.category === 'promocao' ? 'PROMOÇÃO' : 'NOVIDADE'}</p><h3>{post.title}</h3><p className="news-text">{post.body}</p></div></article>)}</div></section>
}
