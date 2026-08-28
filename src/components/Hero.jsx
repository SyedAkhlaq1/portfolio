import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import { useMagnetic } from '../hooks/useMagnetic.js'
import { prefersReducedMotion } from '../lib/env.js'
import { ArrowUpRight, Download, ArrowDown } from './icons.jsx'

const TITLE_LINES = [
  <>Full&#8288;-&#8288;stack</>,
  <>engineering,</>,
  <>
    <em>secured</em> by design
  </>,
]

export default function Hero({ start }) {
  // 'idle'  -> headline shown as-is (no-JS / reduced motion / failsafe)
  // 'pending' -> masked below the line, waiting to reveal
  // 'in'    -> animating / animated into place
  const [anim, setAnim] = useState('idle')
  const rootRef = useRef(null)
  const orbRef = useRef(null)

  const mailRef = useMagnetic(0.3)
  const resumeRef = useMagnetic(0.3)

  // Arm the mask before first paint so text never flashes then hides.
  useLayoutEffect(() => {
    if (!prefersReducedMotion()) setAnim('pending')
  }, [])

  useEffect(() => {
    // setTimeout (not rAF) so the reveal still fires if the tab is
    // backgrounded during load. setAnim('in') is idempotent.
    const delay = start ? 60 : 2400
    const t = window.setTimeout(() => setAnim('in'), delay)
    return () => window.clearTimeout(t)
  }, [start])

  // Gentle parallax on the gradient orb as the hero scrolls away.
  useEffect(() => {
    if (prefersReducedMotion() || !orbRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero__orb" ref={orbRef} aria-hidden="true" />
      <NetworkGrid />

      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow reveal">
          {profile.name} &nbsp;/&nbsp; {profile.location}
        </p>

        <h1 className="hero__title" data-anim={anim}>
          {TITLE_LINES.map((line, i) => (
            <span className="line" key={i}>
              <span style={{ transitionDelay: `${0.08 + i * 0.09}s` }}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <p className="hero__role">
            <strong>Full Stack Web Developer</strong>
          </p>

          <div className="hero__actions">
            <a
              ref={mailRef}
              className="btn btn--primary"
              href={`mailto:${profile.email}`}
            >
              Get in touch <ArrowUpRight />
            </a>
            <a ref={resumeRef} className="btn btn--ghost" href={profile.resume} download>
              <Download /> Resume
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about section">
        <span className="dot">
          <ArrowDown width={14} height={14} />
        </span>
        Scroll
      </a>
    </section>
  )
}

/* Decorative node graph — a quiet nod to computer networks. */
function NetworkGrid() {
  return (
    <svg
      className="hero__grid-lines"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" fillOpacity="0.3" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#dots)" />
      <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" fill="none">
        <path d="M120 480 L320 300 L520 360 L680 180" />
        <path d="M320 300 L360 120 L560 90" />
        <path d="M520 360 L600 500" />
      </g>
      <g fill="currentColor" fillOpacity="0.6">
        <circle cx="120" cy="480" r="3.5" />
        <circle cx="320" cy="300" r="4.5" />
        <circle cx="520" cy="360" r="3.5" />
        <circle cx="680" cy="180" r="3.5" />
        <circle cx="360" cy="120" r="3" />
        <circle cx="560" cy="90" r="3" />
        <circle cx="600" cy="500" r="3" />
      </g>
    </svg>
  )
}
