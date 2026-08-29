import { profile, stats } from '../data/content.js'
import { useCountUp } from '../hooks/useCountUp.js'

function Stat({ value, label }) {
  const [display, ref] = useCountUp(value)
  return (
    <div className="stat">
      <div className="stat__value" ref={ref}>
        {display}
      </div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

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
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
