import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ABOUT, ME, WHATSAPP } from '../data'
import { ChatIcon, Reveal } from './ui'

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(p, [0, 1], ['-6%', '6%'])

  return (
    <section id="about" ref={ref} className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal variant="pop" className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-3 -rotate-3 rounded-[2.2rem] border border-acid/50" />
          <div className="relative overflow-hidden rounded-[2rem] border border-bone/15 bg-coal">
            <motion.img
              src="/andika.webp"
              alt={`Portrait of ${ME.name}`}
              width="960"
              height="1200"
              style={{ y: reduce ? 0 : imgY, scale: reduce ? 1 : 1.12 }}
              className="block aspect-[4/5] w-full object-cover object-top will-change-transform"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16">
              <p className="label text-bone">{ME.full}</p>
              <p className="label mt-1 text-acid">{ME.role} · {ME.place}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal as="p" className="label text-acid">About me</Reveal>
          <Reveal as="h2" delay={0.05} className="display mt-3 text-5xl sm:text-7xl">{ABOUT.heading}</Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-xl leading-relaxed text-bone">{ABOUT.lead}</Reveal>
          <Reveal as="p" delay={0.15} className="mt-4 max-w-xl text-lg leading-relaxed text-bone/70">{ABOUT.more}</Reveal>

          <dl className="mt-8 max-w-xl divide-y divide-bone/12 border-y border-bone/12">
            {ABOUT.facts.map(([k, v], i) => (
              <Reveal key={k} delay={0.05 * i} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[10rem_1fr]">
                <dt className="label pt-0.5 text-mute">{k}</dt>
                <dd>{v}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2} className="mt-8">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
              <ChatIcon className="h-5 w-5" />
              Say hi on WhatsApp
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
