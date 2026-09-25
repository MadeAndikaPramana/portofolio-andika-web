import { useEffect, useRef } from 'react'

const SPACING = 28 // px between dots
const RADIUS = 250 // reach of the spotlight, in px
const BONE = [239, 234, 224]
const ACID = [215, 255, 63]

// A dot grid with a spotlight. Dim dots cover the page (a static CSS pattern); a small canvas draws only the
// few hundred dots near the spotlight, bigger and brighter. The light follows the mouse and wanders on its own
// on phones or when the mouse is idle. It never touches the page's layout, and reduced motion gets a still frame.
export default function Background() {
  const canvasRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const glow = glowRef.current
    const ctx = canvas.getContext('2d')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
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

    let dirty = null // area drawn last frame, so only that is cleared
    const draw = () => {
      if (dirty) ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
      else ctx.clearRect(0, 0, w, h)
      dirty = { x: px - RADIUS - 4, y: py - RADIUS - 4, w: RADIUS * 2 + 8, h: RADIUS * 2 + 8 }
      const half = SPACING / 2
      const i0 = Math.max(0, Math.floor((px - RADIUS - half) / SPACING))
      const i1 = Math.ceil((px + RADIUS - half) / SPACING)
      const j0 = Math.max(0, Math.floor((py - RADIUS - half) / SPACING))
      const j1 = Math.ceil((py + RADIUS - half) / SPACING)
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const x = half + i * SPACING
          const y = half + j * SPACING
          const d = Math.hypot(x - px, y - py)
          if (d > RADIUS) continue
          let k = 1 - d / RADIUS
          k = k * k * (3 - 2 * k)
          const r = Math.round(BONE[0] + (ACID[0] - BONE[0]) * k)
          const g = Math.round(BONE[1] + (ACID[1] - BONE[1]) * k)
          const b = Math.round(BONE[2] + (ACID[2] - BONE[2]) * k)
          ctx.fillStyle = `rgba(${r},${g},${b},${0.1 + 0.62 * k})`
          ctx.beginPath()
          ctx.arc(x, y, 1 + 1.7 * k, 0, 6.2832)
          ctx.fill()
        }
      }
      glow.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`
    }

    const place = (x, y) => {
      px = tx = x
      py = ty = y
      draw()
    }

    size()
    place(w * 0.62, h * 0.4)

    const onResize = () => {
      size()
      draw()
    }
    window.addEventListener('resize', onResize)

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
        if (now - lastMove > 2500) {
          const s = now / 1000
          tx = w * (0.5 + 0.34 * Math.sin(s * 0.21))
          ty = h * (0.45 + 0.3 * Math.sin(s * 0.33 + 1))
        }
        px += (tx - px) * 0.08
        py += (ty - py) * 0.08
        draw()
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (onMove) window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(239,234,224,0.17) 1px, transparent 1.7px)`,
          backgroundSize: `${SPACING}px ${SPACING}px`,
        }}
      />
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[80vmax] w-[80vmax] will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(215,255,63,0.09) 0%, rgba(215,255,63,0) 58%)' }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,11,12,0.75)_100%)]" />
      <div className="grain absolute inset-0 opacity-[0.05]" />
    </div>
  )
}
