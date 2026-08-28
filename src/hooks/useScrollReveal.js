import { useEffect } from 'react'
import { prefersReducedMotion } from '../lib/env.js'

/**
 * One shared IntersectionObserver for every `.reveal` element, with hard
 * guarantees that content becomes visible even if the observer never
 * fires (reduced motion, no IO support, a background/hidden tab, etc.).
 *
 * `deps` lets callers re-scan after the DOM changes (e.g. project filter).
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const revealAll = () =>
      document.querySelectorAll('.reveal:not(.is-in)').forEach((n) => n.classList.add('is-in'))

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    const nodes = document.querySelectorAll('.reveal:not(.is-in)')
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const delay = Number(el.dataset.revealDelay || 0)
          window.setTimeout(() => el.classList.add('is-in'), delay)
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    nodes.forEach((n) => io.observe(n))

    // Failsafe 1: if the tab is hidden, nobody sees the animation anyway —
    // just show everything so content is never stuck invisible.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') revealAll()
    }
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)

    // Failsafe 2: absolute backstop.
    const guard = window.setTimeout(revealAll, 6000)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearTimeout(guard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
