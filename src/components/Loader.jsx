import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/env.js'

/**
 * Brief count-up intro. Two guarantees:
 *  - it never blocks longer than `hardStop` ms, even if rAF is throttled
 *    (e.g. the page loaded in a background tab)
 *  - it always calls onDone exactly once and removes `js-loading`
 */
export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const barRef = useRef(null)
  const firedRef = useRef(false)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const total = reduced ? 200 : 950
    const hardStop = reduced ? 400 : 1500
    const start = performance.now()
    let raf = 0

    const finish = () => {
      if (firedRef.current) return
      firedRef.current = true
      setCount(100)
      if (barRef.current) barRef.current.style.setProperty('--p', '1')
      setDone(true)
      document.documentElement.classList.remove('js-loading')
      window.setTimeout(() => onDone?.(), reduced ? 40 : 560)
      // Remove from the DOM after the fade so a stalled CSS transition
      // can never leave the overlay covering the page.
      window.setTimeout(() => setGone(true), reduced ? 250 : 900)
    }

    const tick = (now) => {
      const p = Math.min(1, (now - start) / total)
      const eased = 1 - Math.pow(1 - p, 2)
      setCount(Math.round(eased * 100))
      if (barRef.current) barRef.current.style.setProperty('--p', String(eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)

    // Failsafe: complete regardless of whether rAF kept ticking.
    const guard = window.setTimeout(finish, hardStop)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(guard)
    }
  }, [onDone])

  if (gone) return null

  return (
    <div className="loader" data-done={done} aria-hidden="true">
      <div className="loader__inner">
        <span className="loader__count">{String(count).padStart(3, '0')}</span>
        Loading portfolio
        <div className="loader__bar" ref={barRef} />
      </div>
    </div>
  )
}
