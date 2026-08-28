import { useEffect, useRef } from 'react'
import { prefersReducedMotion, isTouch } from '../lib/env.js'

/**
 * Subtle magnetic pull toward the pointer for a button / link.
 * Pointer-only, disabled for touch and reduced-motion. Uses transform
 * (compositor-friendly) and always resets cleanly on leave.
 */
export function useMagnetic(strength = 0.28) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || isTouch()) return

    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
