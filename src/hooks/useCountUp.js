import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/env.js'

/**
 * Counts a numeric value up when the element scrolls into view.
 * Non-numeric values (e.g. "MTech") pass straight through.
 * Returns [displayValue, ref].
 */
export function useCountUp(value, { duration = 1100 } = {}) {
  const ref = useRef(null)
  const match = String(value).match(/^(\d[\d,]*)(\D*)$/)
  const target = match ? Number(match[1].replace(/,/g, '')) : null
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(target === null ? value : `0${suffix}`)

  useEffect(() => {
    if (target === null) {
      setDisplay(value)
      return
    }
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setDisplay(`${target}${suffix}`)
      return
    }
    const el = ref.current
    if (!el) return

    let raf = 0
    let fired = false
    const run = () => {
      if (fired) return
      fired = true
      io.disconnect()
      window.clearTimeout(guard)
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(`${Math.round(eased * target)}${suffix}`)
        if (p < 1) raf = requestAnimationFrame(tick)
        else setDisplay(`${target}${suffix}`)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    // Failsafe: never leave the number stuck at 0 if the observer misses.
    const guard = window.setTimeout(() => setDisplay(`${target}${suffix}`), 4000)

    return () => {
      io.disconnect()
      window.clearTimeout(guard)
      cancelAnimationFrame(raf)
    }
  }, [value, target, suffix, duration])

  return [display, ref]
}
