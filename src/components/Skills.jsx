import { skillGroups } from '../data/content.js'

export default function Skills() {
  return (
    <section className="section section--alt" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow reveal">02 — Capabilities</span>
          <h2 className="section-title" id="skills-title" data-split>
            The toolkit, grouped by where it earns its keep.
          </h2>
        </div>

        <div className="skills__grid">
          {skillGroups.map((group, i) => (
            <article
              className="skill-card reveal"
              key={group.title}
              data-reveal-delay={i * 60}
            >
              <h3 className="skill-card__title">
                <span>{group.title}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </h3>
              <ul className="skill-card__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
