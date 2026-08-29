import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, isTouch } from '../lib/env.js'

/**
 * Two-part cursor: an instant dot and a lagging ring. The ring grows and
 * can show a short label when hovering elements marked [data-cursor], or
 * any link / button. Inert on touch devices and prefers-reduced-motion —
 * the native cursor stays and these nodes never show.
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

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
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

    const loop = () => {
      rx += (mx - rx) * 0.35
      ry += (my - ry) * 0.35
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      cancelAnimationFrame(raf)
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
