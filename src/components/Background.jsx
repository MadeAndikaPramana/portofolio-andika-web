import { useEffect, useRef } from 'react'

const SPACING = 26 // px between dots
const RADIUS = 220 // reach of the cursor, in px
const PUSH = 14 // how far the nearest dots are pushed away, in px

// The card's dot grid, behind the whole page. Dim dots are a static CSS pattern in the page's type colour, so they
// flip with the theme on their own. A small canvas draws only the few hundred dots near the light: bigger, brighter,
// and nudged away from the mouse like iron filings. The light wanders by itself on phones or when the mouse is idle.
// It never touches layout, and reduced motion gets a still frame.
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    let w = 0
    let h = 0
    let rgb = '244,244,244'
    const readColour = () => {
      const c = getComputedStyle(root).getPropertyValue('--fg').trim()
      const m = c.match(/^#([0-9a-f]{6})$/i)
      if (m) {
        const n = parseInt(m[1], 16)
        rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
      } else {
        const p = c.match(/[\d.]+/g)
        if (p && p.length >= 3) rgb = p.slice(0, 3).map((v) => Math.round(+v)).join(',')
      }
    }

    let dirty = null // area drawn last frame, so only that is cleared
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dirty = null
    }

    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    let lastMove = -1e9
    let raf = 0

    const draw = () => {
      if (dirty) ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
      else ctx.clearRect(0, 0, w, h)
      const reach = RADIUS + PUSH + 6
      dirty = { x: px - reach, y: py - reach, w: reach * 2, h: reach * 2 }
      const half = SPACING / 2
      const i0 = Math.max(0, Math.floor((px - RADIUS - half) / SPACING))
      const i1 = Math.ceil((px + RADIUS - half) / SPACING)
      const j0 = Math.max(0, Math.floor((py - RADIUS - half) / SPACING))
      const j1 = Math.ceil((py + RADIUS - half) / SPACING)
      ctx.fillStyle = `rgb(${rgb})`
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const x = half + i * SPACING
          const y = half + j * SPACING
          const dx = x - px
          const dy = y - py
          const d = Math.hypot(dx, dy)
          if (d > RADIUS) continue
          let k = 1 - d / RADIUS
          k = k * k * (3 - 2 * k)
          const push = d > 0.01 ? (PUSH * k) / d : 0
          ctx.globalAlpha = 0.07 + 0.38 * k
          ctx.beginPath()
          ctx.arc(x + dx * push, y + dy * push, 0.9 + 1.4 * k, 0, 6.2832)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const place = (x, y) => {
      px = tx = x
      py = ty = y
      draw()
    }

    readColour()
    size()
    place(w * 0.62, h * 0.4)

    const onResize = () => {
      size()
      draw()
    }
    window.addEventListener('resize', onResize)

    // Follow the theme: sample the colour for the length of the flip.
    let sampleUntil = 0
    const mo = new MutationObserver(() => {
      sampleUntil = performance.now() + 900
      if (calm) {
        readColour()
        draw()
      }
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    let onMove = null
    if (!calm) {
      onMove = (e) => {
        if (e.pointerType === 'touch') return
        tx = e.clientX
        ty = e.clientY
        lastMove = performance.now()
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      const frame = (now) => {
        if (now < sampleUntil) readColour()
        if (now - lastMove > 2500) {
          const s = now / 1000
          tx = w * (0.5 + 0.34 * Math.sin(s * 0.21))
          ty = h * (0.45 + 0.3 * Math.sin(s * 0.33 + 1))
        }
        px += (tx - px) * 0.1
        py += (ty - py) * 0.1
        draw()
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('resize', onResize)
      if (onMove) window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, color-mix(in oklab, var(--fg) 16%, transparent) 1px, transparent 1.6px)`,
          backgroundSize: `${SPACING}px ${SPACING}px`,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, color-mix(in oklab, var(--bg) 80%, transparent) 100%)' }} />
    </div>
  )
}
