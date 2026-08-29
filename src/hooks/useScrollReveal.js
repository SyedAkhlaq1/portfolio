import { useEffect } from 'react'
import { prefersReducedMotion } from '../lib/env.js'

/**
 * Shared IntersectionObserver for `.reveal` elements.
 *
 * Reveal styles only apply when <html> has the `reveal-armed` class,
 * which this hook adds *only* after confirming IO is usable. So if JS or
 * IO is unavailable, or motion is reduced, nothing is ever hidden — the
 * page just renders normally. A long backstop also disarms as a safety.
 *
 * Children of `[data-reveal-stagger]` reveal one after another.
 * `deps` re-scans after DOM changes (e.g. project filter).
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const root = document.documentElement
    const disarm = () => root.classList.remove('reveal-armed')

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      disarm()
      return
    }

    root.classList.add('reveal-armed')

    const nodes = document.querySelectorAll('.reveal:not(.is-in)')
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          io.unobserve(el)

          const parent = el.closest('[data-reveal-stagger]')
          if (parent && !parent.dataset.revealFired) {
            parent.dataset.revealFired = '1'
            parent.querySelectorAll('.reveal').forEach((k, i) => {
              window.setTimeout(() => k.classList.add('is-in'), i * 90)
              io.unobserve(k)
            })
            return
          }
          const delay = Number(el.dataset.revealDelay || 0)
          window.setTimeout(() => el.classList.add('is-in'), delay)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    nodes.forEach((n) => io.observe(n))

    // Backstop: if the observer somehow never fires, stop hiding content.
    const guard = window.setTimeout(disarm, 9000)

    return () => {
      io.disconnect()
      window.clearTimeout(guard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
