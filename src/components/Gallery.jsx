import React, { useState } from 'react'
import one from '../assets/goathi/galeria/jogo-01.jpeg'
import two from '../assets/goathi/galeria/jogo-02.jpeg'
import three from '../assets/goathi/galeria/jogo-03.jpeg'
import four from '../assets/goathi/galeria/jogo-04.jpeg'
const slides = [one,two,three,four]
export function Gallery(){const [index,setIndex]=useState(0); const move=n=>setIndex(i=>(i+n+slides.length)%slides.length)
return <div className="about-gallery" role="region" aria-label="Fotos Goathi no simulador"><div className="gallery-stage"><img src={slides[index]} alt={`Carro de Fórmula 1 no simulador, imagem ${index+1}`} loading="lazy" /></div><div className="gallery-controls"><button onClick={()=>move(-1)} aria-label="Imagem anterior">‹</button><span aria-live="polite">{index+1} / {slides.length}</span><button onClick={()=>move(1)} aria-label="Próxima imagem">›</button></div></div>}
