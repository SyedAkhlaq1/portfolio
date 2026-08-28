import { profile } from '../data/content.js'
import { useMagnetic } from '../hooks/useMagnetic.js'
import { Mail, GitHub, LinkedIn, Download, ArrowUpRight } from './icons.jsx'

export default function Contact() {
  const mailRef = useMagnetic(0.3)
  const resumeRef = useMagnetic(0.3)
  const year = new Date().getFullYear()

  const links = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      Icon: Mail,
      external: false,
    },
    {
      label: 'LinkedIn',
      value: 'in/syed-akhlaq-hussain',
      href: profile.linkedin,
      Icon: LinkedIn,
      external: true,
    },
    {
      label: 'GitHub',
      value: 'SyedAkhlaq1',
      href: profile.github,
      Icon: GitHub,
      external: true,
    },
  ]

  return (
    <section className="section section--contact contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <span className="eyebrow reveal">06 — Contact</span>

        <h2 className="contact__title reveal" id="contact-title" data-reveal-delay="60">
          Have a role, a project or a security problem worth solving?{' '}
          <a href={`mailto:${profile.email}`}>Let&rsquo;s talk.</a>
        </h2>

        <div className="contact__actions reveal" data-reveal-delay="120">
          <a ref={mailRef} className="btn btn--primary" href={`mailto:${profile.email}`}>
            Email me <ArrowUpRight />
          </a>
          <a ref={resumeRef} className="btn btn--ghost" href={profile.resume} download>
            <Download /> Download resume
          </a>
        </div>

        <div className="contact__links">
          {links.map(({ label, value, href, Icon, external }) => (
            <a
              key={label}
              className="contact__link reveal"
              href={href}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <span>
                <span className="label">{label}</span>
                <br />
                <span className="value">{value}</span>
              </span>
              <Icon />
            </a>
          ))}
        </div>

        <footer className="footer">
          <span>© {year} {profile.name}</span>
          <span>{profile.location}</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </section>
  )
}
