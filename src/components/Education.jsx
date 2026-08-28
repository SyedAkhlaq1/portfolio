import { education, certifications, achievements } from '../data/content.js'

export default function Education() {
  return (
    <section className="section section--alt" id="education" aria-labelledby="education-title">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">04 — Foundations</span>
          <h2 className="section-title" id="education-title">
            Study, certified skills and the work outside the syllabus.
          </h2>
        </div>

        <div className="two-col">
          <div>
            <div className="edu-list">
              {education.map((e) => (
                <article className="edu-item reveal" key={e.degree + e.field}>
                  <div className="edu-item__period">{e.period}</div>
                  <h3 className="edu-item__degree">{e.degree}</h3>
                  <div className="edu-item__field">{e.field}</div>
                  <div className="edu-item__org">{e.org}</div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="side-block reveal">
              <h3 className="side-block__title">Certifications</h3>
              <div className="chip-row">
                {certifications.map((c) => (
                  <div className="cert" key={c.name}>
                    <span className="cert__name">{c.name}</span>
                    <span className="cert__issuer">{c.issuer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-block reveal">
              <h3 className="side-block__title">Beyond the classroom</h3>
              <div className="chip-row">
                {achievements.map((a) => (
                  <div className="ach" key={a.title}>
                    <div className="ach__title">{a.title}</div>
                    <div className="ach__detail">{a.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
