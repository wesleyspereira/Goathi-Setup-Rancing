import React, { useEffect, useRef } from 'react'
export function Modal({ title, close, children, className = '' }) {
 const ref = useRef(null)
 useEffect(() => { const trigger = document.activeElement, overflow = document.body.style.overflow; ref.current.showModal(); document.body.style.overflow = 'hidden'; return () => {document.body.style.overflow = overflow; trigger?.focus()} }, [])
 return <dialog ref={ref} className={`compact-modal ${className}`} aria-label={title} onCancel={close}><button type="button" className="close-dialog" onClick={close} aria-label={`Fechar ${title}`}>Fechar</button>{children}</dialog>
}
