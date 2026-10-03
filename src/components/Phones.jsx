import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { PROJECTS } from '../data'
import { Reveal, Scramble, SplitHeading } from './ui'

function Phone({ project, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name}`}
      data-cursor="Open"
      className="group block w-full rounded-[2rem] border-[5px] border-fg/20 bg-ink p-0 transition-colors hover:border-fg"
    >
      <span className="relative block overflow-hidden rounded-[1.6rem]">
        <img src={`/work/${project.slug}-mobile.webp`} alt="" width="520" height="1125" loading="lazy" draggable="false" className="shot block aspect-[390/844] w-full object-cover object-top" />
      </span>
    </button>
  )
}

function Column({ items, p, from, to, className = '', onOpen }) {
  const y = useTransform(p, [0, 1], [from, to])
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-6 will-change-transform ${className}`}>
      {items.map((project) => (
        <Phone key={project.slug} project={project} onOpen={onOpen} />
      ))}
    </motion.div>
  )
}

export default function Phones({ onOpen }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const cols = [PROJECTS.filter((_, i) => i % 3 === 0), PROJECTS.filter((_, i) => i % 3 === 1), PROJECTS.filter((_, i) => i % 3 === 2)]

  return (
    <section id="phones" data-theme="dark" ref={ref} className="relative overflow-hidden px-5 py-24 sm:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <Scramble as="p" text="On the phone in their hand" className="label block text-fg/50" />
          <SplitHeading text="Phone first, always." className="display mt-3 text-5xl sm:text-7xl" />
          <Reveal as="p" delay={0.1} className="mt-5 max-w-md text-lg leading-relaxed text-fg/65">
            Most people will open your site on a phone, standing somewhere, deciding fast. So I design that screen first and let the laptop version follow.
          </Reveal>
          <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
            {['Big tap targets', 'Readable without zooming', 'Message button always close'].map((t) => (
              <span key={t} className="label rounded-full border border-fg/20 px-3 py-1.5 text-fg/75">{t}</span>
            ))}
          </Reveal>
        </div>

        {reduce ? (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {PROJECTS.map((project) => (
              <li key={project.slug}><Phone project={project} onOpen={onOpen} /></li>
            ))}
          </ul>
        ) : (
          <div className="grid grid-cols-2 items-start gap-5 pb-24 sm:grid-cols-3 sm:gap-6">
            <Column items={cols[0]} p={p} from={30} to={-90} onOpen={onOpen} />
            <Column items={cols[1]} p={p} from={-50} to={70} onOpen={onOpen} />
            <Column items={cols[2]} p={p} from={60} to={-60} className="hidden sm:flex" onOpen={onOpen} />
          </div>
        )}
      </div>
    </section>
  )
}
