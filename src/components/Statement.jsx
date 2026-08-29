import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/env.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * A big centred line that lights up word-by-word as it scrolls through
 * the viewport. Plain flow — no pinning. Static under reduced motion.
 */
export default function Statement({ children, id }) {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('.st-w > span')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 1,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const words = String(children).split(/(\s+)/)
  return (
    <section className="statement" id={id} ref={ref}>
      <p className="statement__line">
        {words.map((w, i) =>
          /^\s+$/.test(w) ? (
            w
          ) : (
            <span className="st-w" key={i}>
              <span>{w}</span>
            </span>
          ),
        )}
      </p>
    </section>
  )
}
