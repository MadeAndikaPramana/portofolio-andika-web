import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FEATURES } from '../data'
import { Scramble, SplitHeading, pad } from './ui'

const shot = (n) => `/work/${n}.webp`

// Each promise comes with a tiny live version of itself instead of an icon.
function Fast() {
  return (
    <div className="w-full max-w-[17rem]">
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
        <span className="viz-ripple absolute inset-0 rounded-full bg-fg/25" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-fg text-bg">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-fg/12">
        <div className="viz-fill h-full origin-left rounded-full bg-fg" />
      </div>
      <p className="label mt-3 flex justify-between text-fg/50"><span>Loading</span><span>0.8 s</span></p>
    </div>
  )
}

const BLOCKS = [
  'h-24 rounded-lg bg-fg/25',
  'h-2 w-3/4 rounded bg-fg/30',
  'h-2 w-1/2 rounded bg-fg/15',
  'h-16 rounded-lg bg-fg/10',
  'h-16 rounded-lg bg-fg/10',
  'h-2 w-2/3 rounded bg-fg/20',
  'h-9 w-1/2 rounded-full bg-fg',
]

function Phone() {
  return (
    <div className="relative h-[17rem] w-40 overflow-hidden rounded-[2rem] border-[6px] border-fg/25 bg-bg">
      <div className="viz-scroll flex flex-col gap-2 p-2.5">
        {[0, 1].map((k) => (
          <div key={k} className="flex flex-col gap-2" aria-hidden="true">
            {BLOCKS.map((c, i) => <span key={i} className={`block ${c}`} />)}
          </div>
        ))}
      </div>
      <span className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-bg to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg to-transparent" />
    </div>
  )
}

function Chat() {
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-2 text-sm">
      <span className="viz-bubble self-start rounded-2xl rounded-bl-md bg-fg/12 px-3.5 py-2" style={{ '--d': '0s' }}>Hi! Are you open today?</span>
      <span className="viz-bubble self-end rounded-2xl rounded-br-md bg-fg px-3.5 py-2 font-semibold text-bg" style={{ '--d': '1.4s' }}>Yes! Come by any time.</span>
      <span className="viz-bubble self-start rounded-2xl rounded-bl-md bg-fg/12 px-3.5 py-2" style={{ '--d': '2.8s' }}>On my way 🙌</span>
    </div>
  )
}

const TILES = [
  ['zine-tattoo', '-4deg', '0s'],
  ['swordsman', '3deg', '0.6s'],
  ['ruang-napas', '-2deg', '1.2s'],
  ['golden-hour-tattoo', '4deg', '0.3s'],
  ['teduh', '-3deg', '0.9s'],
  ['night-tide-tattoo', '2deg', '1.5s'],
]

function Work() {
  return (
    <div className="grid w-full max-w-[18rem] grid-cols-3 gap-2">
      {TILES.map(([n, r, d]) => (
        <span key={n} className="viz-float block overflow-hidden rounded-lg border border-fg/15 bg-fg/5" style={{ '--r': r, '--d': d }}>
          <img src={shot(n)} alt="" width="1200" height="750" loading="lazy" className="shot block aspect-[4/3] w-full object-cover object-top" />
        </span>
      ))}
    </div>
  )
}

function Find() {
  return (
    <div className="relative flex h-full min-h-[11rem] w-full items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle, color-mix(in oklab, var(--fg) 25%, transparent) 1px, transparent 1.6px)', backgroundSize: '18px 18px' }} />
      <span className="viz-ripple absolute h-28 w-28 rounded-full border border-fg/60" />
      <span className="viz-ripple absolute h-28 w-28 rounded-full border border-fg/60" style={{ '--d': '1.3s' }} />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-fg text-bg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
      </span>
      <span className="label absolute bottom-3 left-3 rounded-full bg-fg/10 px-3 py-1.5">Open today</span>
    </div>
  )
}

function Voice() {
  return (
    <div className="relative w-full max-w-[20rem] text-center">
      <p className="viz-swap-a display text-2xl text-fg/40 line-through decoration-fg/40 sm:text-3xl">“We offer quality service.”</p>
      <p className="viz-swap-b display absolute inset-0 flex items-center justify-center text-2xl italic sm:text-3xl">“Fresh coffee, every morning, just up the road.”</p>
    </div>
  )
}

const VIZ = { bolt: Fast, phone: Phone, chat: Chat, grid: Work, pin: Find, heart: Voice }

// The six promises as a big numbered index. On large screens the row in the middle of the screen (or under the
// mouse) plays its little demo in a sticky panel; on phones each row carries its own demo.
export default function Features() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const rows = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.i))
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rows.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const Viz = VIZ[FEATURES[active].icon]

  return (
    <section id="features" data-theme="dark" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-36">
      <Scramble as="p" text="Every site I build" className="label block text-fg/50" />
      <SplitHeading text="Six things it always does." className="display mt-3 max-w-4xl text-5xl sm:text-7xl md:text-8xl" />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <ol className="border-t border-fg/15">
          {FEATURES.map((f, i) => {
            const RowViz = VIZ[f.icon]
            const on = active === i
            return (
              <li
                key={f.title}
                ref={(el) => (rows.current[i] = el)}
                data-i={i}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                className="group border-b border-fg/15 py-7 sm:py-9"
              >
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4 sm:grid-cols-[4.5rem_1fr]">
                  <span className={`label transition-colors duration-500 ${on ? '' : 'lg:text-fg/35'}`}>{pad(i + 1)}</span>
                  <div>
                    <h3 className={`display text-4xl transition-[color,transform] duration-500 sm:text-6xl ${on ? '' : 'lg:text-fg/30'} ${on && !reduce ? 'lg:translate-x-3' : ''}`}>{f.title}</h3>
                    <p className={`mt-3 max-w-md leading-relaxed text-fg/70 transition-colors duration-500 ${on ? '' : 'lg:text-fg/40'}`}>{f.body}</p>
                  </div>
                </div>
                <div aria-hidden="true" className="mt-6 flex min-h-[12rem] items-center justify-center overflow-hidden rounded-3xl border border-fg/10 bg-fg/[0.04] p-6 lg:hidden">
                  <RowViz />
                </div>
              </li>
            )
          })}
        </ol>

        <div aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-[18vh] flex h-[64vh] max-h-[34rem] flex-col overflow-hidden rounded-[2rem] border border-fg/12 bg-fg/[0.04]">
            <div className="flex items-center justify-between border-b border-fg/10 px-6 py-4">
              <span className="label text-fg/50">Live demo</span>
              <span className="label tabular-nums">{pad(active + 1)} / {pad(FEATURES.length)}</span>
            </div>
            <div className="relative flex flex-1 items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduce ? undefined : { opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  className="flex w-full items-center justify-center"
                >
                  <Viz />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="h-1 bg-fg/10">
              <motion.div className="h-full origin-left bg-fg" animate={{ scaleX: (active + 1) / FEATURES.length }} transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
