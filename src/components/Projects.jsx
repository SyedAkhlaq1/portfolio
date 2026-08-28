import { useMemo, useState } from 'react'
import { projects, projectFilters } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { ArrowUpRight } from './icons.jsx'

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const shown = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((p) => p.tags.includes(filter))
  }, [filter])

  // Re-scan reveal targets whenever the visible set changes.
  useScrollReveal([filter, shown.length])

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">05 — Selected work</span>
          <h2 className="section-title" id="projects-title">
            Research and product work, built end to end.
          </h2>
        </div>

        <div className="projects__filters" role="group" aria-label="Filter projects">
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

        <div className="projects__list">
          {shown.map((p) => (
            <article className="project reveal" key={p.index}>
              <div className="project__index">{p.index}</div>

              <div className="project__head">
                <h3 className="project__title">{p.title}</h3>
                <p className="project__blurb">{p.blurb}</p>
                <div className="project__tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="project__detail">
                <ul className="project__points">
                  {p.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
                <div className="project__stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {shown.length === 0 && (
            <p className="project" style={{ color: 'var(--ink-mute)' }}>
              Nothing under that filter yet.
            </p>
          )}
        </div>

        <p className="reveal" style={{ marginTop: 'var(--space-l)' }}>
          <a
            className="btn btn--ghost"
            href="https://github.com/SyedAkhlaq1"
            target="_blank"
            rel="noopener noreferrer"
          >
            More on GitHub <ArrowUpRight />
          </a>
        </p>
      </div>
    </section>
  )
}
