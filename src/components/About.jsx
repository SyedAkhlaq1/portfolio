import { profile, stats } from '../data/content.js'

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">01 — Profile</span>
          <h2 className="section-title" id="about-title">
            A developer who thinks in systems, not just screens.
          </h2>
        </div>

        <div className="about__grid">
          <div className="about__body reveal" data-reveal-delay="80">
            <p>{profile.summary}</p>
            <p>
              My focus sits where the <strong>front end meets the network</strong> —
              building interfaces that are fast and reliable, backed by services that
              handle authentication, sessions, and data with care.
            </p>
          </div>

          <div className="stats reveal" data-reveal-delay="140">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__value">{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
