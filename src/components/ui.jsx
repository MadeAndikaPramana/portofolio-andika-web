import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

// Blocks appear one by one as you scroll to them. 'rise' fades up, 'pop' fades in while growing from slightly smaller.
const VARIANTS = {
  rise: { from: (y) => ({ opacity: 0, y }), to: { opacity: 1, y: 0 } },
  pop: { from: () => ({ opacity: 0, y: 36, scale: 0.9 }), to: { opacity: 1, y: 0, scale: 1 } },
  fade: { from: () => ({ opacity: 0 }), to: { opacity: 1 } },
}

export function Reveal({ as = 'div', variant = 'rise', delay = 0, y = 24, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const v = VARIANTS[variant]
  return (
    <Tag
      initial={reduce ? false : v.from(y)}
      whileInView={v.to}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={variant === 'pop' ? { type: 'spring', stiffness: 170, damping: 20, delay } : { duration: 0.75, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// A big heading whose words slide up out of a mask, one after another, when it scrolls into view.
export function SplitHeading({ as = 'h2', text, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text} initial="hidden" whileInView="shown" viewport={{ once: true, margin: '0px 0px -12% 0px' }}>
      {words.map((w, i) => (
        <span key={w + i} aria-hidden="true" className="-mb-[0.14em] mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0">
          <motion.span
            className="inline-block"
            variants={{ hidden: reduce ? {} : { y: '110%' }, shown: { y: 0 } }}
            transition={{ duration: 0.85, delay: delay + i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·'

// Small caps that "decode" from random letters when they first come into view, and again on hover.
export function Scramble({ text, className = '', as: Tag = 'span' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [out, setOut] = useState(text)
  const run = useRef(null)

  const play = () => {
    if (reduce) return
    cancelAnimationFrame(run.current)
    const start = performance.now()
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 650)
      const fixed = Math.floor(k * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        s += i < fixed || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (k < 1) run.current = requestAnimationFrame(tick)
    }
    run.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return undefined
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        play()
        io.disconnect()
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(run.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce])

  return (
    <Tag ref={ref} onPointerEnter={play} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}

// Wraps a button or link so it leans toward the mouse a little.
export function Magnetic({ children, strength = 0.28, className = 'inline-flex' }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  return (
    <motion.span
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

// The intro (Intro.jsx) tells the rest of the page when it has lifted, so the hero can start moving.
let introDone = false
const listeners = new Set()
export function finishIntro() {
  if (introDone) return
  introDone = true
  listeners.forEach((l) => l())
}
export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => introDone,
  )
}

export const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export const pad = (n) => String(n).padStart(2, '0')

export function ChatIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

export function ArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}
