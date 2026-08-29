import { useEffect, useRef } from 'react'
import { prefersReducedMotion, isTouch } from '../lib/env.js'

/**
 * Interactive constellation — drifting nodes joined by lines that
 * strengthen near the pointer and part around it. A quiet nod to
 * computer networks. Canvas 2D, theme-aware, and heavily perf-guarded:
 *   - pauses when the tab is hidden or the hero scrolls out of view
 *   - caps device pixel ratio at 2
 *   - draws a single static frame under prefers-reduced-motion
 */
export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    const reduced = prefersReducedMotion()
    const pointerCapable = !isTouch()

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes = []
    let raf = 0
    let running = true

    const pointer = { x: -9999, y: -9999, active: false }

    // Theme colour, read from a CSS var and re-read on theme change.
    let rgb = readRGB()
    function readRGB() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-rgb')
        .trim()
      return v || '27, 26, 23'
    }

    const CONNECT = 132 // px link distance
    const REPEL = 150 // px pointer influence

    function resize() {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function seed() {
      const target = Math.round((w * h) / 15000)
      const count = Math.max(24, Math.min(reduced ? 60 : 110, target))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }))
    }

    function step() {
      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < -20) n.x = w + 20
          if (n.x > w + 20) n.x = -20
          if (n.y < -20) n.y = h + 20
          if (n.y > h + 20) n.y = -20

          if (pointer.active) {
            const dx = n.x - pointer.x
            const dy = n.y - pointer.y
            const d = Math.hypot(dx, dy)
            if (d < REPEL && d > 0.001) {
              const f = (1 - d / REPEL) * 1.6
              n.x += (dx / d) * f
              n.y += (dy / d) * f
            }
          }
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < CONNECT) {
            let alpha = (1 - d / CONNECT) * 0.28
            // brighten links near the pointer
            if (pointer.active) {
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2
              const md = Math.hypot(mx - pointer.x, my - pointer.y)
              if (md < REPEL) alpha += (1 - md / REPEL) * 0.35
            }
            ctx.strokeStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      ctx.fillStyle = `rgba(${rgb}, 0.55)`
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }

      if (running && !reduced) raf = requestAnimationFrame(step)
    }

    // ---- lifecycle ----
    resize()
    step()

    const onResize = debounce(resize, 180)
    window.addEventListener('resize', onResize)

    let onMove, onLeave
    if (pointerCapable && !reduced) {
      onMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        pointer.x = e.clientX - rect.left
        pointer.y = e.clientY - rect.top
        pointer.active =
          pointer.x >= 0 && pointer.x <= w && pointer.y >= 0 && pointer.y <= h
      }
      onLeave = () => {
        pointer.active = false
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerout', onLeave)
    }

    // pause offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        if (visible && !running && !reduced) {
          running = true
          raf = requestAnimationFrame(step)
        } else if (!visible) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    // pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduced) {
        running = true
        raf = requestAnimationFrame(step)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    // re-read colour when the site theme flips
    const themeObserver = new MutationObserver(() => {
      rgb = readRGB()
      if (reduced) step() // repaint the static frame in the new colour
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onLeave) window.removeEventListener('pointerout', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

function debounce(fn, ms) {
  let t
  return (...a) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...a), ms)
  }
}
