// Inline stroke icons — 1.6px, 24px grid, currentColor.
// Kept inline (no icon-library dependency) to keep the bundle small.

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const ArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
)

export const Download = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
)

export const Mail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const GitHub = (p) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.6 3.6 5.5 3.9 5.5 3.9a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 10.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />
  </svg>
)

export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const Moon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

export const LinkedIn = (p) => (
  <svg {...base} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6Z" />
    <rect x="2" y="9" width="4" height="11" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
