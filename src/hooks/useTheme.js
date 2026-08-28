import { useCallback, useEffect, useState } from 'react'

const KEY = 'sah-theme'

function readInitial() {
  // The pre-paint script in index.html may already have set the attribute.
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'dark' || attr === 'light') return attr
  }
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* storage blocked — fall through */
  }
  // Default: always start light (per design decision), regardless of OS.
  return 'light'
}

/**
 * Light/dark theme state, persisted to localStorage. `data-theme` on
 * <html> drives every CSS token swap.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readInitial)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.setAttribute('data-theme', 'light')

    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* ignore */
    }

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#161221' : '#f3f0ea')
  }, [theme])

  const toggle = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  return { theme, toggle }
}
