import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, projectFilters } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { prefersReducedMotion } from '../lib/env.js'
import { ArrowUpRight } from './icons.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const listRef = useRef(null)

  const shown = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((p) => p.tags.includes(filter))
  }, [filter])

  useScrollReveal([filter, shown.length])

  // Scrub-driven wipe + parallax on each cover image.
  useEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.project__media').forEach((media) => {
        // reveal wipe as it enters
        gsap.fromTo(
          media,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top 92%', end: 'top 52%', scrub: true },
          },
        )
        // gentle parallax on the image within
        const img = media.querySelector('img')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -9 },
            {
              yPercent: 9,
              ease: 'none',
              scrollTrigger: {
                trigger: media.closest('.project'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    }, listRef)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      window.clearTimeout(t)
      ctx.revert()
    }
  }, [shown])

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow reveal">05 — Selected work</span>
          <h2 className="section-title" id="projects-title" data-split>
            Three builds, taken end to end.
          </h2>
        </div>

        <div className="projects__filters reveal" role="group" aria-label="Filter projects">
          {projectFilters.map((f) => (
            <button
              key={f}
              className="filter-chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="projects__list" ref={listRef}>
          {shown.map((p, i) => (
            <article className="project" data-flip={i % 2 === 1 ? 'true' : undefined} key={p.index}>
              <div className="project__media" data-cursor="view">
                <picture>
                  <source srcSet={`projects/${p.image}.webp`} type="image/webp" />
                  <img
                    src={`projects/${p.image}.jpg`}
                    alt={p.imageAlt || p.title}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <span className="project__media-index">{p.index}</span>
              </div>

              <div className="project__body">
                <h3 className="project__title reveal">{p.title}</h3>
                <p className="project__blurb reveal" data-reveal-delay="60">
                  {p.blurb}
                </p>

                <ul className="project__points reveal" data-reveal-delay="120">
                  {p.points.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>

                <div className="project__meta reveal" data-reveal-delay="160">
                  <div className="project__tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="project__stack">
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>

                {(p.demo || p.repo) && (
                  <div className="project__links reveal" data-reveal-delay="200">
                    {p.demo && (
                      <a
                        className="btn btn--primary"
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="open"
                      >
                        Live demo <ArrowUpRight />
                      </a>
                    )}
                    {p.repo && (
                      <a
                        className="btn btn--ghost"
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="open"
                      >
                        View code <ArrowUpRight />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}

          {shown.length === 0 && (
            <p className="project-empty">Nothing under that filter yet.</p>
          )}
        </div>

        <p className="reveal" style={{ marginTop: 'var(--space-xl)' }}>
          <a
            className="btn btn--ghost"
            href="https://github.com/SyedAkhlaq1"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="open"
          >
            More on GitHub <ArrowUpRight />
          </a>
        </p>
      </div>
    </section>
  )
}
