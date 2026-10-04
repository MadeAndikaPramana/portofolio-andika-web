import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MORE, PROJECTS, WHATSAPP } from '../data'
import { ArrowIcon, ChatIcon, Scramble, SplitHeading, pad } from './ui'

// Every project as a business card: a white front with the screenshot, a black back laid out like the real card's
// back and contact rows. Hover (mouse) or tap (touch) turns it over; click / Open shows the project sheet.
// Plain page scroll: nothing pinned, nothing snapped.

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'tattoo', label: 'Tattoo', test: (p) => /tattoo/i.test(p.niche) },
  { id: 'wellness', label: 'Wellness', test: (p) => /yoga|counsel/i.test(p.niche) },
  { id: 'venues', label: 'Venues', test: (p) => /resort|villa|café|cafe|venue|surf/i.test(p.niche) },
]

const status = (p) => (p.kind === 'client' ? 'Client · live' : p.private ? 'Concept' : 'Demo')

// The card back's dot field, as a CSS pattern faded into two patches (same idea as Card.jsx, lighter to draw 17 times).
const BACK_DOTS = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 0.9px, transparent 1.3px)',
  backgroundSize: '2.8cqw 2.8cqw',
  WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 78% 22%, #000, transparent 72%), radial-gradient(ellipse 45% 40% at 18% 70%, #000, transparent 72%)',
  maskImage: 'radial-gradient(ellipse 55% 45% at 78% 22%, #000, transparent 72%), radial-gradient(ellipse 45% 40% at 18% 70%, #000, transparent 72%)',
}

function Front({ project, n }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6cqw] bg-paper p-[2.6cqw] text-ink [backface-visibility:hidden]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1cqw] bg-ink">
        <img src={`/work/${project.slug}.webp`} alt={`${project.name} website, ${project.niche.toLowerCase()}`} width="1200" height="750" loading="lazy" draggable="false" className="block h-full w-full object-cover object-top grayscale" />
      </div>
      <div className="flex items-end justify-between px-[1cqw] pt-[2.4cqw]">
        <p className="truncate text-[4.4cqw] font-extrabold leading-none tracking-[-0.04em]">{project.short}</p>
        <p className="shrink-0 pl-3 text-[2.3cqw] font-bold leading-none tracking-[0.2em]">{pad(n)}</p>
      </div>
    </div>
  )
}

function Back({ project, n, onOpen }) {
  const rows = [
    ['Type', project.niche],
    ['Status', status(project)],
    ['Built with', project.stack.join(' · ')],
  ]
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.6cqw] border border-white/25 bg-[#050505] text-paper [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <div aria-hidden="true" className="absolute inset-0" style={BACK_DOTS} />
      <div className="relative flex h-full flex-col p-[4.4cqw] pb-[4.6cqw]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[5.6cqw] font-extrabold leading-[0.95] tracking-[-0.045em]">{project.name}</p>
            <p className="mt-[2cqw] line-clamp-2 max-w-[78%] text-[2.6cqw] leading-snug text-paper/65">{project.line}</p>
          </div>
          <p className="text-[2.3cqw] font-bold tracking-[0.2em]">{pad(n)}</p>
        </div>
        <dl className="mt-auto grid grid-cols-[17cqw_1fr] gap-y-[1.3cqw] text-left">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="self-center text-[1.8cqw] font-bold uppercase leading-none tracking-[0.2em] text-paper/60">{k}</dt>
              <dd className="truncate text-[2.7cqw] leading-none">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-[3.4cqw] flex items-center gap-[1.6cqw]">
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              onOpen(project)
            }}
            className="inline-flex items-center gap-[1cqw] rounded-full bg-paper px-[3.4cqw] py-[1.6cqw] text-[2.6cqw] font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            Open
            <ArrowIcon className="h-[2.6cqw] w-[2.6cqw]" />
          </button>
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-[1cqw] rounded-full border border-paper/35 px-[3.4cqw] py-[1.6cqw] text-[2.6cqw] font-semibold transition-colors hover:bg-paper hover:text-ink">
              Live site
              <ArrowIcon className="h-[2.6cqw] w-[2.6cqw]" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, n, i, onOpen }) {
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const tilt = ((n * 37) % 11) - 5 // a different small angle per card, the same on every load
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 90, rotate: tilt * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: (i % 3) * 0.08 }}
      className="@container list-none"
      style={{ perspective: '1300px' }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`${project.name}. ${status(project)}. Open`}
        data-cursor={flipped ? 'Open' : 'Flip'}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setFlipped(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
        onFocus={() => setFlipped(true)}
        onBlur={() => setFlipped(false)}
        onClick={(e) => {
          // touch: the first tap turns the card over, a second tap (or Open on the back) opens it
          if (e.nativeEvent.pointerType === 'touch' && !flipped) setFlipped(true)
          else onOpen(project)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(project)
          }
        }}
        className="relative block aspect-[90/55] w-full cursor-pointer rounded-[1.6cqw] outline-offset-4"
      >
        <motion.div
          className="absolute inset-0 rounded-[1.6cqw] shadow-[0_40px_70px_-35px_rgba(0,0,0,0.9)]"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0, scale: flipped ? 1.03 : 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 17 }}
        >
          <Front project={project} n={n} />
          <Back project={project} n={n} onOpen={onOpen} />
        </motion.div>
      </div>
    </motion.li>
  )
}

function MoreCard() {
  return (
    <motion.li layout className="@container list-none">
      <a href={WHATSAPP} target="_blank" rel="noreferrer" data-cursor="Say hi" className="group flex aspect-[90/55] w-full flex-col justify-between rounded-[1.6cqw] border-2 border-dashed border-fg/40 p-[4.4cqw] transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg">
        <span className="text-[2.3cqw] font-bold uppercase tracking-[0.2em] opacity-60">{MORE.hint}</span>
        <span className="text-[7cqw] font-extrabold leading-[0.95] tracking-[-0.045em]">
          …and many <span className="italic">more.</span>
        </span>
        <span className="inline-flex items-center gap-[1.4cqw] text-[2.8cqw] font-bold">
          <ChatIcon className="h-[3cqw] w-[3cqw]" />
          Tell me about yours
        </span>
      </a>
    </motion.li>
  )
}

export default function Work({ onOpen }) {
  const [filter, setFilter] = useState('all')
  const f = FILTERS.find((x) => x.id === filter)
  const shown = PROJECTS.map((p, i) => ({ p, n: i + 1 })).filter(({ p }) => f.test(p))

  return (
    <section id="work" data-theme="dark" className="mx-auto max-w-[84rem] px-5 py-24 sm:px-10 md:py-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Scramble as="p" text="Selected work" className="label block text-fg/50" />
          <SplitHeading text="A card for every site." className="display mt-3 text-5xl sm:text-7xl" />
          <p className="mt-4 max-w-xl text-fg/60">
            <span className="hidden sm:inline">Point at a card to turn it over. Click to look closer.</span>
            <span className="sm:hidden">Tap a card to turn it over, tap again to look closer.</span>
          </p>
        </div>
        <div aria-label="Filter projects" className="flex flex-wrap gap-2">
          {FILTERS.map((x) => {
            const count = PROJECTS.filter(x.test).length
            const on = x.id === filter
            return (
              <button
                key={x.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(x.id)}
                className={`label flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors ${on ? 'border-fg bg-fg text-bg' : 'border-fg/25 text-fg/70 hover:border-fg hover:text-fg'}`}
              >
                {x.label}
                <span className={on ? 'opacity-60' : 'text-fg/40'}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <motion.ul layout className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <AnimatePresence>
          {shown.map(({ p, n }, i) => (
            <ProjectCard key={p.slug} project={p} n={n} i={i} onOpen={onOpen} />
          ))}
          {filter === 'all' && <MoreCard key="more" />}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
