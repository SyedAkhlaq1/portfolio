export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(hover: none)').matches

let _webgl
export const hasWebGL = () => {
  if (_webgl !== undefined) return _webgl
  try {
    const c = document.createElement('canvas')
    _webgl = !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    _webgl = false
  }
  return _webgl
}

// Rough "is this device beefy enough for the 3D hero" guess.
// Also desktop-only — on phones the CSS gradient hero is used instead.
export const canRun3D = () => {
  if (prefersReducedMotion() || !hasWebGL()) return false
  if (typeof window !== 'undefined' && window.innerWidth < 900) return false
  const mem = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  if (mem && mem < 4) return false
  if (cores && cores < 4) return false
  return true
}
