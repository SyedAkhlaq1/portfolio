import { marquee } from '../data/content.js'

export default function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((word, i) => (
          <span className="marquee__item" key={i}>
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
