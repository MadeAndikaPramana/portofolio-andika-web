import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { NICHE_GROUPS, PROJECTS, WHATSAPP } from '../data'
import { ChatIcon, Reveal } from './ui'

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))

function Thumb({ project, onOpen, tall }) {
  return (
    <button type="button" onClick={() => onOpen(project)} aria-label={`Open ${project.name}`} className="group relative block overflow-hidden rounded-xl border border-bone/12 bg-ink text-left transition-colors hover:border-acid">
      <img src={`/work/${project.slug}.webp`} alt="" width="1200" height="750" loading="lazy" className={`block w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${tall ? 'aspect-[4/3]' : 'aspect-[16/10]'}`} />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/95 to-transparent px-3 pb-2 pt-8">
        <span className="text-sm font-semibold">{project.short}</span>
        {project.kind === 'client' && <span className="label rounded-full bg-acid px-2 py-0.5 text-[0.6rem] text-ink">Live</span>}
      </span>
    </button>
  )
}

// One card per kind of business. On desktop each card sticks and the next one slides over it.
function NicheCard({ group, index, total, onOpen }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(p, [0, 1], [1, 0.93])
  const dim = useTransform(p, [0, 1], [0, 0.55])
  const projects = group.slugs.map((s) => bySlug[s])
  const last = index === total - 1

  return (
    <div ref={ref} className={last ? '' : 'md:h-[82svh]'}>
      <motion.article
        style={{ scale: reduce ? 1 : scale, top: `${5.5 + index * 0.6}rem`, transformOrigin: 'top center' }}
        className="relative overflow-hidden rounded-[2rem] border border-bone/12 bg-coal p-6 sm:p-10 md:sticky"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div>
            <p className="label text-acid">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
            <h3 className="display mt-4 text-5xl sm:text-6xl">{group.title}</h3>
            <p className="mt-3 text-xl text-bone">{group.line}</p>
            <p className="mt-4 max-w-md leading-relaxed text-bone/70">{group.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.points.map((t) => (
                <li key={t} className="label rounded-full bg-slate px-3 py-1.5 text-bone/80">{t}</li>
              ))}
            </ul>
          </div>

          <ul className={`grid content-start gap-3 ${projects.length > 1 ? 'grid-cols-2' : 'grid-cols-1 sm:max-w-sm'}`}>
            {projects.map((project, i) => (
              <li key={project.slug} className={projects.length > 2 && i === 0 ? 'col-span-2' : ''}>
                <Thumb project={project} onOpen={onOpen} tall={projects.length <= 2} />
              </li>
            ))}
          </ul>
        </div>
        <motion.div aria-hidden="true" style={{ opacity: reduce ? 0 : dim }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.article>
    </div>
  )
}

export default function Niches({ onOpen }) {
  const total = NICHE_GROUPS.length + 1
  return (
    <section id="niches" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
      <Reveal as="p" className="label text-acid">Built for</Reveal>
      <Reveal as="h2" delay={0.05} className="display mt-3 max-w-3xl text-5xl sm:text-7xl">Every kind of business asks for something different.</Reveal>

      <div className="mt-14 flex flex-col gap-6 md:gap-0">
        {NICHE_GROUPS.map((g, i) => (
          <NicheCard key={g.id} group={g} index={i} total={total} onOpen={onOpen} />
        ))}

        <Reveal variant="pop" className="relative overflow-hidden rounded-[2rem] border border-acid/60 bg-acid p-6 text-ink sm:p-10 md:mt-6">
          <p className="label">{String(total).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <h3 className="display mt-4 text-5xl sm:text-7xl">Yours is next.</h3>
          <p className="mt-4 max-w-xl text-xl">A café, a villa, a salon, a surf school, a shop on your street. Send me your Instagram and I will tell you what I would build.</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-[3.25rem] items-center gap-2 rounded-full bg-ink px-7 font-bold text-bone transition-transform hover:-translate-y-0.5">
            <ChatIcon className="h-5 w-5" />
            Message me
          </a>
        </Reveal>
      </div>
    </section>
  )
}
