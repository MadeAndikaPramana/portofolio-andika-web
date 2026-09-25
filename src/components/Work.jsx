import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MORE, NICHES, PROJECTS, WHATSAPP } from '../data'
import { ArrowIcon, ChatIcon, jump } from './ui'

const N = PROJECTS.length
const COUNT = N + 1 // every project, then the "and many more" stop
const STEP = 360 / COUNT
const PAD = 0.08 // scroll share at each end where the ring rests on the first / last stop

const pad = (n) => String(n).padStart(2, '0')

// Which stop is in front, from the ring's rotation.
const frontIndex = (v) => Math.min(COUNT - 1, Math.max(0, Math.round(-v / STEP)))

// How many stops away from the front this card is right now (0 = in the spotlight, 1 = its neighbour, ...).
const stopsFromFront = (i, r) => Math.abs(((((i * STEP + r + 180) % 360) + 360) % 360) - 180) / STEP

// One stop on the ring. The outer div carries the 3D placement. The inner button is the spotlight effect: the card in front
// grows and steps forward, its neighbours shrink and fade, and the ones after them fade further, all continuously as the ring turns.
// Far cards stay faintly visible so the whole circle still reads, but only the near ones take taps.
function Stop({ i, rot, onClick, label, children }) {
  const opacity = useTransform(rot, (r) => Math.max(0.14, 1 / (1 + 0.9 * stopsFromFront(i, r) ** 2)))
  const scale = useTransform(rot, (r) => 1.2 - 0.3 * Math.min(1, stopsFromFront(i, r)))
  const z = useTransform(rot, (r) => 70 * (1 - Math.min(1, stopsFromFront(i, r))))
  const pointerEvents = useTransform(rot, (r) => (stopsFromFront(i, r) < 2.4 ? 'auto' : 'none'))
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 'var(--w)',
        height: 'calc(var(--w) * 0.66)',
        marginLeft: 'calc(var(--w) / -2)',
        marginTop: 'calc(var(--w) * -0.33)',
        transform: `rotateY(${i * STEP}deg) translateZ(calc(var(--w) * var(--rk)))`,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.button type="button" onClick={onClick} aria-label={label} style={{ opacity, scale, z, pointerEvents }} className="group block h-full w-full text-left">
        {children}
      </motion.button>
    </div>
  )
}

// A little browser window around each screenshot.
function ProjectFace({ project, i }) {
  return (
    <span className="flex h-full flex-col overflow-hidden rounded-2xl border border-bone/20 bg-coal shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-[border-color] group-hover:border-acid">
      <span className="flex h-7 shrink-0 items-center gap-1.5 border-b border-bone/10 bg-slate px-3">
        <span className="h-2 w-2 rounded-full bg-bone/25" />
        <span className="h-2 w-2 rounded-full bg-bone/25" />
        <span className="h-2 w-2 rounded-full bg-bone/25" />
        <span className="label ml-2 truncate text-[0.6rem] text-mute">{project.short}</span>
        <span className="label ml-auto text-[0.6rem] text-acid">{pad(i + 1)}</span>
      </span>
      <img src={`/work/${project.slug}.webp`} alt="" width="1200" height="750" loading="lazy" draggable="false" className="block min-h-0 w-full flex-1 object-cover object-top" />
    </span>
  )
}

function MoreFace() {
  return (
    <span className="flex h-full flex-col justify-between rounded-2xl border-2 border-dashed border-acid/70 bg-coal p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-colors group-hover:bg-acid group-hover:text-ink sm:p-6">
      <span className="label text-acid group-hover:text-ink">{pad(COUNT)}</span>
      <span className="display text-[clamp(1.7rem,4vw,3.4rem)]">
        …and many <span className="text-acid group-hover:text-ink">more.</span>
      </span>
      <span className="label text-mute group-hover:text-ink/70">{MORE.hint}</span>
    </span>
  )
}

// Leaf components own the "which stop is in front" state so the ring itself never re-renders while it spins.
function useFront(rot) {
  const [active, setActive] = useState(0)
  useMotionValueEvent(rot, 'change', (v) => {
    const idx = frontIndex(v)
    setActive((prev) => (prev === idx ? prev : idx))
  })
  return active
}

// A soft glow behind the ring in the colour of whichever site is in front.
function Glow({ rot }) {
  const active = useFront(rot)
  const accent = active < N ? PROJECTS[active].accent : MORE.accent
  return (
    <AnimatePresence>
      <motion.div
        key={active}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[95%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(ellipse at center, ${accent}66 0%, ${accent}00 62%)` }}
      />
    </AnimatePresence>
  )
}

function Info({ rot, goTo, onOpen }) {
  const active = useFront(rot)
  const isMore = active === N
  const p = isMore ? null : PROJECTS[active]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 pb-24 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-10 sm:pb-28">
      <div className="min-h-[6.5rem] sm:min-h-[8.5rem]">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <span className="label text-acid">{pad(active + 1)} / {pad(COUNT)}</span>
            <h3 className="display mt-2 text-[1.7rem] sm:mt-3 sm:text-5xl">{isMore ? MORE.name : p.name}</h3>
            <p className="mt-2 max-w-md text-bone/70">{isMore ? MORE.line : p.line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous" className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30">←</button>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === COUNT - 1} aria-label="Next" className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30">→</button>
        {isMore ? (
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn ml-1">
            <ChatIcon className="h-5 w-5" />
            Tell me yours
          </a>
        ) : (
          <button type="button" onClick={() => onOpen(p)} className="btn ml-1">
            Open
            <ArrowIcon />
          </button>
        )}
      </div>
    </div>
  )
}

// Huge outlined words sliding behind the ring. CSS-only, transform-only.
function Backdrop() {
  const words = [...NICHES, ...NICHES]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
      <div className="marquee-track flex w-max items-center gap-10" style={{ animation: 'marquee 60s linear infinite' }}>
        {words.map((w, i) => (
          <span key={w + i} className="display flex items-center gap-10 whitespace-nowrap text-[clamp(5rem,15vw,12rem)] uppercase text-transparent [-webkit-text-stroke:1px_rgba(239,234,224,0.13)]">
            {w}
            <span className="text-[0.5em] text-acid/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Ring({ onOpen }) {
  const ref = useRef(null)
  const drag = useRef({ active: false, moved: false, suppress: false, x0: 0, s0: 0, lastX: 0, lastT: 0, v: 0 })
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rot = useTransform(p, [0, PAD, 1 - PAD, 1], [0, 0, -(COUNT - 1) * STEP, -(COUNT - 1) * STEP])

  // The ring is driven by page scroll, so everything (buttons, dragging, snapping) just moves the page.
  const metrics = () => {
    const el = ref.current
    const start = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    return { start, total, stop: (total * (1 - 2 * PAD)) / (COUNT - 1) }
  }
  const goTo = useCallback((i) => {
    const el = ref.current
    if (!el || i < 0 || i >= COUNT) return
    const m = metrics()
    window.scrollTo({ top: m.start + PAD * m.total + i * m.stop + 2, behavior: 'smooth' })
  }, [])

  // Which stop the page is scrolled to, as a fraction (0 = first, COUNT-1 = last).
  const position = () => {
    const m = metrics()
    return (window.scrollY - m.start - PAD * m.total) / m.stop
  }

  // After scrolling stops, settle on the nearest site.
  useEffect(() => {
    let t
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (drag.current.active || !ref.current) return
        const f = position()
        if (f <= -0.6 || f >= COUNT - 1 + 0.6) return // resting at the ends, or scrolled away
        const idx = Math.min(COUNT - 1, Math.max(0, Math.round(f)))
        if (Math.abs(f - idx) > 0.03) goTo(idx)
      }, 160)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [goTo])

  // Drag or swipe sideways to spin the ring; on release it settles on the nearest site (a flick carries it further).
  const cardPx = () => Math.min(430, Math.max(220, window.innerWidth * 0.33))
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { active: true, moved: false, suppress: false, x0: e.clientX, s0: window.scrollY, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.x0
    if (!d.moved) {
      if (Math.abs(dx) < 7) return
      d.moved = true
      d.suppress = true
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    const dt = Math.max(1, e.timeStamp - d.lastT)
    d.v = 0.8 * d.v + 0.2 * ((e.clientX - d.lastX) / dt)
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    const m = metrics()
    window.scrollTo({ top: d.s0 - dx * (m.stop / cardPx()), behavior: 'instant' })
  }
  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (!d.moved) return
    const carry = Math.max(-2, Math.min(2, (-d.v * 160) / cardPx())) // flick: about 160 ms of momentum, at most two sites
    const idx = Math.min(COUNT - 1, Math.max(0, Math.round(position() + carry)))
    goTo(idx)
  }

  return (
    <section id="work" ref={ref} style={{ height: `${COUNT * 62 + 90}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-10 sm:pt-20">
          <p className="label text-acid">Selected work</p>
          <h2 className="display mt-2 text-[1.7rem] sm:text-5xl">Sites built for Bali businesses.</h2>
          <p className="mt-2 max-w-xl text-sm text-bone/65 sm:text-base">
            <span className="sm:hidden">Drag to spin. Tap to open.</span>
            <span className="hidden sm:inline">Drag or scroll to spin the ring. Tap a site to look closer.</span>
          </p>
        </div>

        <div
          className="ring-scope relative min-h-[15.5rem] flex-1 cursor-grab select-none active:cursor-grabbing"
          style={{ perspective: '1500px', touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(e) => {
            if (drag.current.suppress) {
              e.stopPropagation()
              e.preventDefault()
              drag.current.suppress = false
            }
          }}
        >
          <Glow rot={rot} />
          <Backdrop />
          {/* the whole wheel is pushed back so the front card sits at depth 0, then tilted to look down on it a little */}
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateY(calc(var(--w) * var(--lift))) translateZ(calc(var(--w) * var(--rk) * -1)) rotateX(-9deg)' }}>
            <motion.div className="absolute inset-0 will-change-transform" style={{ transformStyle: 'preserve-3d', rotateY: rot }}>
              {/* the orbit the cards travel on */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-acid/30"
                style={{
                  width: 'calc(var(--w) * var(--rk) * 2)',
                  height: 'calc(var(--w) * var(--rk) * 2)',
                  marginLeft: 'calc(var(--w) * var(--rk) * -1)',
                  marginTop: 'calc(var(--w) * var(--rk) * -1)',
                  transform: 'translateY(calc(var(--w) * 0.42)) rotateX(90deg)',
                }}
              />
              {PROJECTS.map((project, i) => (
                <Stop key={project.slug} i={i} rot={rot} onClick={() => onOpen(project)} label={`Open ${project.name}`}>
                  <ProjectFace project={project} i={i} />
                </Stop>
              ))}
              <Stop i={N} rot={rot} onClick={() => jump('contact')} label="And many more. Go to contact">
                <MoreFace />
              </Stop>
            </motion.div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-3 left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(239,234,224,0.18),rgba(239,234,224,0)_70%)]" />
        </div>

        <Info rot={rot} goTo={goTo} onOpen={onOpen} />
      </div>
    </section>
  )
}

// For people who ask their system for less motion: a plain grid, nothing pinned or spinning.
function Grid({ onOpen }) {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 sm:px-10">
      <p className="label text-acid">Selected work</p>
      <h2 className="display mt-2 text-4xl sm:text-5xl">Sites built for Bali businesses.</h2>
      <p className="mt-3 max-w-xl text-bone/65">Tap a site to look closer.</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <li key={p.slug}>
            <button type="button" onClick={() => onOpen(p)} className="block w-full overflow-hidden rounded-2xl border border-bone/12 bg-coal text-left transition-colors hover:border-acid">
              <img src={`/work/${p.slug}.webp`} alt="" width="1200" height="750" loading="lazy" className="block aspect-[16/10] w-full object-cover object-top" />
              <span className="flex items-center justify-between gap-3 p-4">
                <span className="display text-2xl">{p.name}</span>
                <span className="label text-mute">{pad(i + 1)}</span>
              </span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => jump('contact')} className="flex h-full min-h-[14rem] w-full flex-col justify-between rounded-2xl border-2 border-dashed border-acid/70 bg-coal p-6 text-left transition-colors hover:bg-acid hover:text-ink">
            <span className="label">{pad(COUNT)}</span>
            <span className="display text-4xl">…and many more.</span>
            <span className="label text-mute">{MORE.hint}</span>
          </button>
        </li>
      </ul>
    </section>
  )
}

export default function Work({ onOpen }) {
  const reduce = useReducedMotion()
  return reduce ? <Grid onOpen={onOpen} /> : <Ring onOpen={onOpen} />
}
