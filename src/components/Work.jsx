import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MORE, PROJECTS, WHATSAPP } from '../data'
import { ArrowIcon, ChatIcon, Scramble, jump, pad } from './ui'

const N = PROJECTS.length
const COUNT = N + 1 // every project, then the "and many more" stop
const PAD = 0.04 // scroll share at each end where the strip rests on the first / last stop

function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia('(min-width: 768px)')
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia('(min-width: 768px)').matches,
  )
}

// A little browser window around each screenshot.
function Frame({ project, i }) {
  return (
    <span className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0b] text-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] transition-[border-color] duration-300 group-hover:border-white/60">
      <span className="flex h-8 shrink-0 items-center gap-1.5 border-b border-white/10 bg-[#141414] px-3">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="label ml-2 truncate text-[0.6rem] text-white/50">{project.live ? project.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : project.short}</span>
        <span className="label ml-auto text-[0.6rem]">{pad(i + 1)}</span>
      </span>
      <img src={`/work/${project.slug}.webp`} alt="" width="1200" height="750" loading="lazy" draggable="false" className="block min-h-0 w-full flex-1 object-cover object-top" />
    </span>
  )
}

function MoreFrame() {
  return (
    <span className="flex h-full flex-col justify-between rounded-2xl border-2 border-dashed border-white/50 p-5 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black sm:p-8">
      <span className="label">{pad(COUNT)}</span>
      <span className="display text-[clamp(2rem,5vw,4.6rem)]">
        …and many <span className="italic">more.</span>
      </span>
      <span className="label opacity-60">{MORE.hint}</span>
    </span>
  )
}

// Name, number and buttons for whichever stop is in the middle.
function Info({ active, goTo, onOpen }) {
  const isMore = active === N
  const p = isMore ? null : PROJECTS[active]
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-h-[7.5rem] items-end gap-5 sm:min-h-[8rem] sm:gap-8">
        <span aria-hidden="true" className="display outline-text hidden text-[7.5rem] !leading-[0.78] tabular-nums md:block">{pad(active + 1)}</span>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <span className="label text-fg/50">{pad(active + 1)} / {pad(COUNT)}{isMore ? '' : ` · ${p.niche}${p.kind === 'demo' ? ' · Demo' : ''}`}</span>
            <h3 className="display mt-2 text-[1.9rem] sm:text-5xl">{isMore ? MORE.name : p.name}</h3>
            <p className="mt-2 max-w-md text-fg/65">{isMore ? MORE.line : p.line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous" className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/25 transition-colors hover:bg-fg hover:text-bg disabled:opacity-30">←</button>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === COUNT - 1} aria-label="Next" className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/25 transition-colors hover:bg-fg hover:text-bg disabled:opacity-30">→</button>
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

function Heading({ hint }) {
  return (
    <div>
      <Scramble as="p" text="Selected work" className="label block text-fg/50" />
      <h2 className="display mt-2 text-[2rem] sm:text-5xl">Sites built for Bali businesses.</h2>
      <p className="mt-2 max-w-xl text-sm text-fg/60 sm:text-base">{hint}</p>
    </div>
  )
}

// One stop on the strip. Its distance from the middle (in stops) drives colour, size and fade, all continuously.
function Panel({ i, pos, children, onClick, label }) {
  const d = useTransform(pos, (v) => Math.abs(v - i))
  const filter = useTransform(d, (v) => `grayscale(${Math.min(1, v * 1.4).toFixed(2)})`)
  const scale = useTransform(d, (v) => 1 - 0.14 * Math.min(1, v))
  const opacity = useTransform(d, (v) => 1 - 0.55 * Math.min(1, v * 0.8))
  const y = useTransform(d, (v) => `${4 * Math.min(1, v)}%`)
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor="Open"
      style={{ filter, scale, opacity, y }}
      className="group block aspect-[16/10] w-[var(--pw)] shrink-0 text-left"
    >
      {children}
    </motion.button>
  )
}

// Desktop: the page scrolls down, the strip slides sideways. Rests on each site when you stop.
function Strip({ onOpen }) {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const stride = useMotionValue(0)
  useLayoutEffect(() => {
    const measure = () => {
      const kids = trackRef.current?.children
      if (kids && kids.length > 1) stride.set(kids[1].offsetLeft - kids[0].offsetLeft)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [stride])

  // pos: which stop is in the middle, as a fraction (0 = first, COUNT-1 = last).
  const pos = useTransform(p, (v) => Math.min(1, Math.max(0, (v - PAD) / (1 - 2 * PAD))) * (COUNT - 1))
  const x = useTransform([pos, stride], ([v, s]) => -v * s)
  const bar = useTransform(pos, (v) => v / (COUNT - 1))
  const [active, setActive] = useState(0)
  useMotionValueEvent(pos, 'change', (v) => {
    const idx = Math.round(v)
    setActive((prev) => (prev === idx ? prev : idx))
  })

  const metrics = () => {
    const el = ref.current
    const start = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    return { start, total, stop: (total * (1 - 2 * PAD)) / (COUNT - 1) }
  }
  const goTo = useCallback((i) => {
    if (!ref.current || i < 0 || i >= COUNT) return
    const m = metrics()
    window.scrollTo({ top: m.start + PAD * m.total + i * m.stop + 1, behavior: 'smooth' })
  }, [])

  // After scrolling stops inside the strip, settle on the nearest site.
  useEffect(() => {
    let t
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (!ref.current) return
        const m = metrics()
        const f = (window.scrollY - m.start - PAD * m.total) / m.stop
        if (f <= -0.5 || f >= COUNT - 0.5) return
        const idx = Math.min(COUNT - 1, Math.max(0, Math.round(f)))
        if (Math.abs(f - idx) > 0.03) goTo(idx)
      }, 180)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [goTo])

  return (
    <section id="work" data-theme="dark" ref={ref} style={{ height: `${COUNT * 55 + 100}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden py-10 lg:py-14" style={{ '--pw': 'min(56vw, 52svh * 1.6, 920px)' }}>
        <div className="mx-auto w-full max-w-6xl px-10">
          <Heading hint="Keep scrolling to move along. Click a site to look closer." />
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-[4vw] px-[calc(50vw-var(--pw)/2)] will-change-transform">
            {PROJECTS.map((project, i) => (
              <Panel key={project.slug} i={i} pos={pos} onClick={() => onOpen(project)} label={`Open ${project.name}`}>
                <Frame project={project} i={i} />
              </Panel>
            ))}
            <Panel i={N} pos={pos} onClick={() => jump('contact')} label="And many more. Go to contact">
              <MoreFrame />
            </Panel>
          </motion.div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-10">
          <Info active={active} goTo={goTo} onOpen={onOpen} />
          <div className="mt-6 h-px bg-fg/15">
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-fg" />
          </div>
        </div>
      </div>
    </section>
  )
}

// Phones and reduced motion: a plain swipe carousel. Nothing pinned, nothing scroll-driven.
function Carousel({ onOpen }) {
  const railRef = useRef(null)
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const rail = railRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.i))
      },
      { root: rail, rootMargin: '0px -45% 0px -45%' },
    )
    Array.from(rail.children).forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const goTo = (i) => {
    const el = railRef.current?.children[i]
    if (el) railRef.current.scrollTo({ left: el.offsetLeft - (railRef.current.clientWidth - el.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="work" data-theme="dark" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <Heading hint="Swipe to look around. Tap a site to look closer." />
      </div>
      <div ref={railRef} className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[10vw] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROJECTS.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            data-i={i}
            onClick={() => onOpen(project)}
            aria-label={`Open ${project.name}`}
            className={`group block aspect-[16/10] w-[80vw] max-w-[40rem] shrink-0 snap-center text-left transition-[filter,opacity,transform] duration-500 ${active === i ? '' : 'scale-[0.94] opacity-60 grayscale'}`}
          >
            <Frame project={project} i={i} />
          </button>
        ))}
        <button
          type="button"
          data-i={N}
          onClick={() => jump('contact')}
          aria-label="And many more. Go to contact"
          className={`group block aspect-[16/10] w-[80vw] max-w-[40rem] shrink-0 snap-center text-left transition-[opacity,transform] duration-500 ${active === N ? '' : 'scale-[0.94] opacity-60'}`}
        >
          <MoreFrame />
        </button>
      </div>
      <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-10">
        <Info active={active} goTo={goTo} onOpen={onOpen} />
      </div>
    </section>
  )
}

export default function Work({ onOpen }) {
  const reduce = useReducedMotion()
  const wide = useWide()
  return wide && !reduce ? <Strip onOpen={onOpen} /> : <Carousel onOpen={onOpen} />
}
