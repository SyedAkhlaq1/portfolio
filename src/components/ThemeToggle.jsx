import { Sun, Moon } from './icons.jsx'

/**
 * Floating light/dark switch, fixed to the bottom-right corner.
 * Shows the icon of the mode you'll switch TO.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
