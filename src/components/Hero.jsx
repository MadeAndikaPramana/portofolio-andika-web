import { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { HERO } from '../data'
import { CardBack, CardFront } from './Card'
import { jump, useIntroDone } from './ui'

const ASPECT = 55 / 90

// Scroll beats, as shares of the pinned hero:
//   0 → 0.1   rest: headline and card
//   0.1 → 0.5 the copy lifts away, the card glides to the middle and flips to its black back
//   0.5 → 0.86 the back grows until it fills the screen, which is where the black Work section begins
const FLIP = [0.1, 0.5]
const GROW = [0.52, 0.86]

function setTheme(t) {
  const root = document.documentElement
  if (root.dataset.theme === t) return
  root.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#ebebeb' : '#000000')
}

// The card itself: tilts toward the mouse and catches a moving sheen. In the pinned version it also flips and grows
// with scroll; `calm` (0..1) flattens the tilt as it does, so a giant card never leans toward the camera.
function TiltCard({ children, flip, calm, slot }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 16 })
  const sy = useSpring(my, { stiffness: 90, damping: 16 })
  const still = calm ?? mx // any motion value; only read when calm is given
  const tiltY = useTransform([sx, still], ([v, c]) => v * 32 * (calm ? 1 - c : 1))
  const tiltX = useTransform([sy, still], ([v, c]) => -v * 24 * (calm ? 1 - c : 1))
  const sheen = useTransform([sx, sy], ([x, y]) => `radial-gradient(circle at ${50 + x * 70}% ${50 + y * 80}%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.1) 75%)`)

  useEffect(() => {
    if (reduce) return undefined
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, mx, my])

  return (
    <div ref={slot} className="@container relative aspect-[90/55] w-full" style={{ perspective: '1400px' }}>
      <motion.div style={{ ...flip, transformStyle: 'preserve-3d' }} className="absolute inset-0 will-change-transform">
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }} className="absolute inset-0">
          {children}
          <motion.div aria-hidden="true" style={{ background: sheen }} className="pointer-events-none absolute inset-0 rounded-[1.6cqw] [backface-visibility:hidden]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

function Copy({ style }) {
  const started = useIntroDone()
  const reduce = useReducedMotion()
  const show = started || reduce
  return (
    <motion.div style={style} className="relative z-10">
      {/* Real spaces between the words (not margins), so search engines and screen readers read a sentence. */}
      <h1 className="display text-[clamp(2.7rem,6.6vw,6.6rem)]">
        {HERO.headline.map((w, i) => (
          <Fragment key={w + i}>
            {i > 0 && ' '}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span
                initial={reduce ? false : { y: '112%', rotate: 6 }}
                animate={show ? { y: 0, rotate: 0 } : undefined}
                transition={{ duration: 1, delay: 0.05 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                className={`inline-block origin-bottom-left ${w === 'message' ? 'italic' : ''}`}
              >
                {w}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </h1>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-5"
      >
        <p className="max-w-md text-lg leading-relaxed text-ink/70 sm:text-xl">
          {HERO.lead}
        </p>
        <button type="button" onClick={() => jump('work')} data-cursor="Work" className="label hidden items-center gap-3 text-ink/60 transition-colors hover:text-ink lg:flex">
          <span className="relative block h-10 w-6 rounded-full border border-current">
            <motion.span
              animate={reduce ? undefined : { y: [6, 18, 6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-0 block h-1.5 w-1 -translate-x-1/2 rounded-full bg-current"
            />
          </span>
          Scroll to flip the card
        </button>
      </motion.div>
    </motion.div>
  )
}

function TopBar() {
  return (
    <div className="relative z-20 flex items-center justify-between">
      <a href="#top" aria-label="Andika Pramana, back to top" className="display text-3xl">A.</a>
      <p className="label flex items-center gap-2.5 text-ink/70">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
        </span>
        Open for new projects
      </p>
    </div>
  )
}

function Stage({ children, cardSlot, stageRef }) {
  return (
    <div ref={stageRef} className="relative flex h-full flex-col bg-smoke px-5 pb-8 pt-5 text-ink sm:px-10 sm:pt-7">
      <div aria-hidden="true" className="dot-field pointer-events-none absolute inset-0 text-ink/25" />
      <TopBar />
      <div className="relative mx-auto grid w-full max-w-[84rem] flex-1 content-center gap-10 pt-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14 lg:pt-0">
        {children}
        <div className="relative mx-auto w-full max-w-[min(88vw,34rem)] lg:max-w-none">{cardSlot}</div>
      </div>
    </div>
  )
}

function PinnedHero() {
  const ref = useRef(null)
  const slotRef = useRef(null)
  const stageRef = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // How far the card must travel to reach the centre of the screen, and how much it must grow to cover it.
  const toX = useMotionValue(0)
  const toY = useMotionValue(0)
  const cover = useMotionValue(8)
  useLayoutEffect(() => {
    const measure = () => {
      const el = slotRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const top = r.top - stageRef.current.getBoundingClientRect().top // the slot is never transformed, only the card inside it
      toX.set(window.innerWidth / 2 - (r.left + r.width / 2))
      toY.set(window.innerHeight / 2 - (top + r.height / 2))
      cover.set(Math.max(window.innerWidth / r.width, window.innerHeight / (r.width * ASPECT)) * 1.15)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [toX, toY, cover])

  const glide = useTransform(p, FLIP, [0, 1], { clamp: true })
  const grow = useTransform(p, GROW, [0, 1], { clamp: true })
  const x = useTransform([glide, toX], ([g, t]) => g * t)
  const y = useTransform([glide, toY], ([g, t]) => g * t)
  const rotateY = useTransform(glide, [0, 1], [0, 180])
  const rotateZ = useTransform(glide, [0, 0.5, 1], [0, -4, 0])
  const scale = useTransform([glide, grow, cover], ([g, k, c]) => (1 + 0.08 * g) * (1 + (c - 1) * k * k * k))
  const backInk = useTransform(grow, [0, 0.25], [1, 0])

  // Full 0..1 keyframes on purpose: motion runs these on the browser's scroll timeline, which does not hold the
  // end value past the last keyframe the way a plain useTransform does.
  const copyY = useTransform(p, [0, 0.06, 0.34, 1], ['0vh', '0vh', '-28vh', '-28vh'])
  const copyOpacity = useTransform(p, [0, 0.06, 0.3, 1], [1, 1, 0, 0])
  const barOpacity = useTransform(p, [0, 0.3, 0.5, 1], [1, 1, 0, 0])
  const handoffOpacity = useTransform(p, [0, 0.8, 0.93, 1], [0, 0, 1, 1])
  const handoffY = useTransform(p, [0, 0.8, 0.95, 1], ['6vh', '6vh', '0vh', '0vh'])

  // Light while the white front is showing, dark once the black back takes over.
  useMotionValueEvent(p, 'change', (v) => {
    if (v > 0 && v < 1) setTheme(v < 0.62 ? 'light' : 'dark')
  })
  useEffect(() => {
    if (window.scrollY < window.innerHeight) setTheme('light')
  }, [])

  return (
    <header id="top" ref={ref} className="relative h-[320svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Stage
          stageRef={stageRef}
          cardSlot={
            <TiltCard slot={slotRef} calm={glide} flip={{ x, y, rotateY, rotateZ, scale }}>
              <button type="button" onClick={() => jump('work')} data-cursor="Flip" aria-label="Andika Pramana's business card. See my work" className="absolute inset-0 rounded-[1.6cqw] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.45),0_8px_24px_-12px_rgba(0,0,0,0.3)] [transform-style:preserve-3d]">
                <CardFront />
                <CardBack inkStyle={{ opacity: backInk }} />
              </button>
            </TiltCard>
          }
        >
          <Copy style={{ y: copyY, opacity: copyOpacity }} />
        </Stage>
        {/* once the card fills the screen, its line takes over as the opening of the Work section */}
        <motion.div style={{ opacity: handoffOpacity, y: handoffY }} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center text-paper">
          <p className="display text-[clamp(3.6rem,13vw,12rem)]">
            See my <span className="italic">work.</span>
          </p>
          <span className="label mt-8 text-paper/50">{'↓'} Scroll</span>
        </motion.div>
        <motion.div style={{ opacity: barOpacity }} aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-6 hidden justify-between text-ink/50 sm:inset-x-10 sm:flex">
          <span className="label">Web developer · Bali</span>
          <span className="label hidden sm:block">Est. 2026</span>
        </motion.div>
      </div>
    </header>
  )
}

// Reduced motion: the same hero, nothing pinned, the card simply sits there.
function StillHero() {
  useEffect(() => setTheme('light'), [])
  return (
    <header id="top" className="h-[100svh] min-h-[40rem]">
      <Stage
        cardSlot={
          <div className="@container relative aspect-[90/55] w-full shadow-[0_50px_90px_-30px_rgba(0,0,0,0.45)]">
            <CardFront />
          </div>
        }
      >
        <Copy />
      </Stage>
    </header>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  return reduce ? <StillHero /> : <PinnedHero />
}
