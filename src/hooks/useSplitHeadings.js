import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/env.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Word-by-word rise for every `[data-split]` heading as it enters view.
 * Each word is wrapped in a masking span; the inner span animates up.
 * No-ops under reduced motion (text stays as authored) and is a safe
 * progressive enhancement — if it never runs, headings are just visible.
 */
export function useSplitHeadings(deps = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const heads = document.querySelectorAll('[data-split]:not([data-split-done])')
    const ctxs = []

    heads.forEach((el) => {
      el.setAttribute('data-split-done', '')
      const original = el.innerHTML
      // wrap each whitespace-separated token, keeping inline markup atoms
      const words = el.textContent.split(/(\s+)/)
      el.innerHTML = ''
      words.forEach((w) => {
        if (/^\s+$/.test(w)) {
          el.appendChild(document.createTextNode(w))
          return
        }
        if (!w) return
        const mask = document.createElement('span')
        mask.className = 'sw'
        const inner = document.createElement('span')
        inner.textContent = w
        mask.appendChild(inner)
        el.appendChild(mask)
      })

      const ctx = gsap.context(() => {
        gsap.from(el.querySelectorAll('.sw > span'), {
          yPercent: 115,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      }, el)
      ctxs.push({ ctx, el, original })
    })

    // Safety: never leave a heading masked if a trigger somehow misses.
    const guard = window.setTimeout(() => {
      document.querySelectorAll('[data-split-done] .sw > span').forEach((s) => {
        if (s.getBoundingClientRect().height && getComputedStyle(s).transform !== 'none') {
          gsap.set(s, { yPercent: 0, clearProps: 'transform' })
        }
      })
    }, 9000)

    return () => {
      window.clearTimeout(guard)
      ctxs.forEach(({ ctx, el, original }) => {
        ctx.revert()
        el.innerHTML = original
        el.removeAttribute('data-split-done')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
