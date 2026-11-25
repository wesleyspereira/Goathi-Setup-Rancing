import React, { useEffect, useRef } from 'react'

export function NewsVideo() {
  const video = useRef(null)
  const pausedByUser = useRef(false)

  useEffect(() => {
    const media = video.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !pausedByUser.current) media.play().catch(() => {})
      else media.pause()
    }, { threshold: 0.3 })
    observer.observe(media)
    return () => { observer.disconnect(); media.pause() }
  }, [])

  function toggle() {
    const media = video.current
    if (media.paused) {
      pausedByUser.current = false
      media.play().catch(() => {})
    } else {
      pausedByUser.current = true
      media.pause()
    }
  }

  return (
    <button type="button" className="news-video-toggle" onClick={toggle} aria-label="Pausar ou reproduzir vídeo de novidades">
      <video ref={video} autoPlay muted loop playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}videos/novidade-goathi.jpg`} aria-hidden="true">
        <source src={`${import.meta.env.BASE_URL}videos/novidade-goathi.mp4`} type="video/mp4" />
      </video>
    </button>
  )
}
