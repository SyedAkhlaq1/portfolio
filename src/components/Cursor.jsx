import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, isTouch } from '../lib/env.js'

/**
 * Two-part cursor: an instant dot and a ring, both tracking the pointer
 * with no lag. The ring grows and can show a short label when hovering
 * [data-cursor] elements or any link / button. Inert on touch devices
 * and prefers-reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const fine =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches
    if (isTouch() || prefersReducedMotion() || !fine) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')
    dot.style.opacity = '1'
    ring.style.opacity = '1'

    const onMove = (e) => {
      const t = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      dot.style.transform = t
      ring.style.transform = t
      const hit = e.target.closest('a, button, [data-cursor], input, textarea, select')
      ring.dataset.active = hit ? 'true' : 'false'
      setLabel(hit ? hit.getAttribute('data-cursor') || '' : '')
    }
    const onDown = () => {
      ring.dataset.press = 'true'
    }
    const onUp = () => {
      ring.dataset.press = 'false'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" style={{ opacity: 0 }} />
      <div
        className="cursor-ring"
        ref={ringRef}
        data-active="false"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        <span className="cursor-ring__label">{label}</span>
      </div>
    </>
  )
}
