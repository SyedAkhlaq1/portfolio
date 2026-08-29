import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import { useMagnetic } from '../hooks/useMagnetic.js'
import { prefersReducedMotion } from '../lib/env.js'
import ParticleField from './ParticleField.jsx'
import { ArrowUpRight, Download, ArrowDown } from './icons.jsx'

gsap.registerPlugin(ScrollTrigger)

const TITLE_LINES = [
  <>Full&#8288;-&#8288;stack</>,
  <>engineering,</>,
  <>
    <em>secured</em> by design
  </>,
]

export default function Hero({ start }) {
  const rootRef = useRef(null)
  const orbRef = useRef(null)

  const mailRef = useMagnetic(0.35)
  const resumeRef = useMagnetic(0.35)

  // Hide entrance elements before first paint so nothing flashes.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return
    gsap.set(root.querySelectorAll('.hero__eyebrow, .hero__role, .hero__actions > *, .hero__scroll'), {
      opacity: 0,
    })
    gsap.set(root.querySelectorAll('.hero__eyebrow, .hero__role'), { yPercent: 100 })
    gsap.set(root.querySelectorAll('.hero__actions > *'), { y: 26 })
    gsap.set(root.querySelectorAll('.hero__title .line > span'), { yPercent: 118 })
    gsap.set(root.querySelector('.particle-field'), { opacity: 0 })
  }, [])

  // Entrance choreography — runs once the loader hands off.
  useEffect(() => {
    if (!start || prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return

    let done = false
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          done = true
        },
      })
      tl.to('.hero__eyebrow', { yPercent: 0, opacity: 1, duration: 0.7 })
        .to(
          '.hero__title .line > span',
          { yPercent: 0, duration: 1.1, stagger: 0.09 },
          '-=0.35',
        )
        .to('.hero__role', { yPercent: 0, opacity: 1, duration: 0.7 }, '-=0.7')
        .to(
          '.hero__actions > *',
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          '-=0.5',
        )
        .to('.hero__scroll', { opacity: 1, duration: 0.6 }, '-=0.3')
        .to('.particle-field', { opacity: 1, duration: 1.6 }, 0)
    }, root)

    // Failsafe: if GSAP's ticker was paused (tab loaded hidden) and never
    // resumed, force the final visible state so the hero is never stuck.
    const guard = window.setTimeout(() => {
      if (done) return
      gsap.set(
        root.querySelectorAll(
          '.hero__eyebrow, .hero__role, .hero__actions > *, .hero__scroll, .particle-field',
        ),
        { opacity: 1, clearProps: 'transform' },
      )
      gsap.set(root.querySelectorAll('.hero__title .line > span'), { yPercent: 0 })
    }, 4000)

    return () => {
      window.clearTimeout(guard)
      ctx.revert()
    }
  }, [start])

  // Parallax as the hero scrolls away.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const st = {
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      }
      if (orbRef.current) gsap.to(orbRef.current, { yPercent: 22, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__inner', { yPercent: 14, opacity: 0.35, ease: 'none', scrollTrigger: st })
      gsap.to('.particle-field', { opacity: 0.25, ease: 'none', scrollTrigger: st })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero__orb" ref={orbRef} aria-hidden="true" />
      <ParticleField />

      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow" data-in>
          {profile.name} &nbsp;/&nbsp; {profile.location}
        </p>

        <h1 className="hero__title">
          {TITLE_LINES.map((line, i) => (
            <span className="line" key={i} data-in>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <p className="hero__role" data-in>
            <strong>Full Stack Web Developer</strong>
          </p>

          <div className="hero__actions">
            <a
              ref={mailRef}
              className="btn btn--primary"
              href={`mailto:${profile.email}`}
              data-cursor="write"
              data-in
            >
              Get in touch <ArrowUpRight />
            </a>
            <a
              ref={resumeRef}
              className="btn btn--ghost"
              href={profile.resume}
              download
              data-cursor="download"
              data-in
            >
              <Download /> Resume
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about section" data-in>
        <span className="dot">
          <ArrowDown width={14} height={14} />
        </span>
        Scroll
      </a>
    </section>
  )
}
