import { experience } from '../data/content.js'

export default function Experience() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">03 — Track record</span>
          <h2 className="section-title" id="work-title">
            From training bench to shipping features.
          </h2>
        </div>

        <div className="timeline">
          {experience.map((item) => (
            <article className="tl-item reveal" key={item.org}>
              <div className="tl-meta">
                <span className="kind">{item.kind}</span>
                <div>{item.period}</div>
                <div>{item.place}</div>
              </div>
              <div>
                <h3 className="tl-role">{item.role}</h3>
                <div className="tl-org">{item.org}</div>
                <ul className="tl-points">
                  {item.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
