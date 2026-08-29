import { useEffect, useRef } from 'react'
import { marquee } from '../data/content.js'
import { prefersReducedMotion } from '../lib/env.js'

/**
 * Kinetic marquee — drifts on its own, speeds up and skews with scroll
 * velocity, and reverses direction based on scroll direction. Falls back
 * to a static strip under prefers-reduced-motion.
 */
export default function Marquee() {
  const items = [...marquee, ...marquee, ...marquee]
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || prefersReducedMotion()) return

    let x = 0
    let half = track.scrollWidth / 3 // one copy width (we render 3)
    const measure = () => {
      half = track.scrollWidth / 3
    }
    measure()
    window.addEventListener('resize', measure)

    let lastScroll = window.scrollY
    let velocity = 0
    const onScroll = () => {
      const now = window.scrollY
      velocity += (now - lastScroll)
      lastScroll = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    const base = -0.6 // idle drift px/frame
    const loop = () => {
      // velocity decays each frame
      velocity *= 0.9
      const speed = base + velocity * 0.35
      x += speed
      // wrap
      if (x <= -half) x += half
      if (x >= 0) x -= half
      const skew = Math.max(-8, Math.min(8, velocity * 0.4))
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {items.map((word, i) => (
          <span className="marquee__item" key={i}>
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
