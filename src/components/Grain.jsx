// Fixed film-grain overlay. Purely decorative, never intercepts pointer
// events, and is dropped automatically under prefers-reduced-motion via CSS
// only if it were animated — here it is static so it always stays.
export default function Grain() {
  return <div className="grain" aria-hidden="true" />
}
