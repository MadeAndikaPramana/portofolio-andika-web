import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ME } from '../data'
import { finishIntro } from './ui'

const KEY = 'andika-intro-seen'
const SPACING = 13
const DRAW_MS = 1250
const HOLD_MS = 450

// The first thing on screen, once per visit: a black dot grid where the card's "A." lights up dot by dot
// while a counter runs to 100, then the whole black sheet lifts off the page.
// Skipped for reduced motion and on a second load in the same tab.
export default function Intro() {
  const [show, setShow] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    try {
      return sessionStorage.getItem(KEY) !== '1'
    } catch {
      return true
    }
  })
  const canvasRef = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    if (!show) {
      finishIntro()
      return undefined
    }
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage can be blocked; then the intro just plays again */
    }
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    let raf = 0
    let done = false
    let timer = 0
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const start = async () => {
      try {
        await document.fonts.load('800 200px "Plus Jakarta Sans Variable"')
      } catch {
        /* fall back to whatever font is there */
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Draw "A." off screen and keep the grid points that land on ink.
      const size = Math.min(w * 0.62, h * 0.62)
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')
      o.fillStyle = '#fff'
      o.font = `800 ${size}px "Plus Jakarta Sans Variable", system-ui, sans-serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText('A.', w / 2, h / 2 + size * 0.04)
      const ink = o.getImageData(0, 0, w, h).data

      const dots = []
      const cx = w / 2
      const cy = h / 2
      const maxD = Math.hypot(cx, cy)
      for (let x = SPACING / 2; x < w; x += SPACING) {
        for (let y = SPACING / 2; y < h; y += SPACING) {
          const on = ink[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 128
          const d = Math.hypot(x - cx, y - cy) / maxD
          dots.push({ x, y, on, at: on ? 0.12 + Math.random() * 0.6 : d })
        }
      }

      const t0 = performance.now()
      const frame = (now) => {
        const t = Math.min(1, (now - t0) / DRAW_MS)
        ctx.clearRect(0, 0, w, h)
        for (const d of dots) {
          if (d.on) {
            const k = Math.max(0, Math.min(1, (t - d.at) / 0.22))
            const pop = k < 1 ? 1 + 0.6 * Math.sin(k * Math.PI) : 1
            ctx.fillStyle = `rgba(255,255,255,${0.14 + 0.86 * k})`
            ctx.beginPath()
            ctx.arc(d.x, d.y, (0.9 + 1.5 * k) * pop, 0, 6.2832)
            ctx.fill()
          } else {
            const k = Math.max(0, Math.min(1, (t * 1.6 - d.at) / 0.3))
            ctx.fillStyle = `rgba(255,255,255,${0.13 * k})`
            ctx.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4)
          }
        }
        if (countRef.current) countRef.current.textContent = String(Math.round(t * 100)).padStart(3, '0')
        if (t < 1) raf = requestAnimationFrame(frame)
        else
          timer = setTimeout(() => {
            done = true
            root.style.overflow = prevOverflow
            finishIntro()
            setShow(false)
          }, HOLD_MS)
      }
      raf = requestAnimationFrame(frame)
    }
    start()

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      if (!done) root.style.overflow = prevOverflow
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          aria-hidden="true"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-ink text-paper"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-5 bottom-6 flex items-end justify-between sm:inset-x-10 sm:bottom-8">
            <div>
              <p className="text-xl font-extrabold tracking-[-0.04em] sm:text-2xl">{ME.card}</p>
              <p className="label mt-2 text-paper/60">{ME.role}</p>
            </div>
            <p className="display text-5xl tabular-nums sm:text-7xl">
              <span ref={countRef}>000</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
