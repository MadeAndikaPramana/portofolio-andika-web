import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { PROJECTS } from '../data'
import { ArrowIcon } from './ui'

const N = PROJECTS.length
const STEP = 360 / N
const PAD = 0.08 // scroll share at each end where the ring rests on the first / last project

const pad = (n) => String(n).padStart(2, '0')

function Card({ project, i, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name}`}
      className="absolute left-1/2 top-1/2 block overflow-hidden rounded-2xl border border-bone/15 bg-coal shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-[border-color] hover:border-acid"
      style={{
        width: 'var(--w)',
        marginLeft: 'calc(var(--w) / -2)',
        marginTop: 'calc(var(--w) * -0.3125)',
        transform: `rotateY(${i * STEP}deg) translateZ(calc(var(--w) * 1.32))`,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <img src={`/work/${project.slug}.webp`} alt="" width="1200" height="750" loading="lazy" draggable="false" className="block aspect-[16/10] w-full object-cover object-top" />
      <span className="label absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1">{pad(i + 1)}</span>
    </button>
  )
}

// Owns the "which project is in front" state so the ring itself never re-renders while it spins.
function Info({ rot, goTo, onOpen }) {
  const [active, setActive] = useState(0)
  useMotionValueEvent(rot, 'change', (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round(-v / STEP)))
    setActive((prev) => (prev === idx ? prev : idx))
  })
  const p = PROJECTS[active]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pb-28 sm:flex-row sm:items-end sm:justify-between sm:px-10">
      <div className="min-h-[7.5rem] sm:min-h-[8.5rem]">
        <AnimatePresence mode="wait">
          <motion.div key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <span className="label text-acid">{pad(active + 1)} / {pad(N)}</span>
            <h3 className="display mt-3 text-3xl sm:text-5xl">{p.name}</h3>
            <p className="mt-2 max-w-md text-bone/70">{p.line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project" className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30">←</button>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === N - 1} aria-label="Next project" className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/25 transition-colors hover:bg-bone hover:text-ink disabled:opacity-30">→</button>
        <button type="button" onClick={() => onOpen(p)} className="btn ml-1">
          Open
          <ArrowIcon />
        </button>
      </div>
    </div>
  )
}

function Ring({ onOpen }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rot = useTransform(p, [0, PAD, 1 - PAD, 1], [0, 0, -(N - 1) * STEP, -(N - 1) * STEP])

  const goTo = (i) => {
    const el = ref.current
    if (!el || i < 0 || i >= N) return
    const start = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: start + (PAD + (i / (N - 1)) * (1 - 2 * PAD)) * total + 2, behavior: 'smooth' })
  }

  return (
    <section id="work" ref={ref} style={{ height: `${N * 62 + 90}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 pt-16 sm:px-10 sm:pt-20">
          <p className="label text-acid">Selected work</p>
          <h2 className="display mt-2 text-3xl sm:text-5xl">Sites built for Bali businesses.</h2>
          <p className="mt-2 hidden max-w-xl text-bone/65 sm:block">Scroll to turn the ring, tap a site to look closer.</p>
        </div>

        <div className="relative min-h-0 flex-1" style={{ perspective: '1800px', '--w': 'clamp(220px, 33vw, 430px)' }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(calc(var(--w) * -1.32))' }}>
            <motion.div className="absolute inset-0 will-change-transform" style={{ transformStyle: 'preserve-3d', rotateY: rot }}>
              {PROJECTS.map((project, i) => (
                <Card key={project.slug} project={project} i={i} onOpen={onOpen} />
              ))}
            </motion.div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
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
      </ul>
    </section>
  )
}

export default function Work({ onOpen }) {
  const reduce = useReducedMotion()
  return reduce ? <Grid onOpen={onOpen} /> : <Ring onOpen={onOpen} />
}
