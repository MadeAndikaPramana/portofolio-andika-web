import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ABOUT, ME, WHATSAPP, WHY } from '../data'
import { ChatIcon, Magnetic, Reveal, Scramble, SplitHeading, pad } from './ui'

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(p, [0, 1], ['-6%', '6%'])
  const tagRotate = useTransform(p, [0, 1], [-8, 6])

  return (
    <section id="about" data-theme="light" ref={ref} className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-36">
      <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal variant="pop" className="relative mx-auto w-full max-w-md lg:sticky lg:top-24 lg:max-w-none">
          <div className="group relative overflow-hidden rounded-[2rem] bg-ink" data-cursor="Hi!">
            <motion.img
              src="/andika.webp"
              alt={`Portrait of ${ME.full}`}
              width="960"
              height="1200"
              style={{ y: reduce ? 0 : imgY, scale: reduce ? 1 : 1.12 }}
              className="shot block aspect-[4/5] w-full object-cover object-top will-change-transform"
            />
          </div>
          {/* a small copy of the card, pinned to the corner of the photo */}
          <motion.div
            style={{ rotate: reduce ? -4 : tagRotate }}
            className="absolute -bottom-6 -right-3 w-[62%] rounded-xl bg-paper p-4 text-ink shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)] sm:-right-8 sm:p-5"
          >
            <div className="flex items-start justify-between">
              <p className="text-lg font-extrabold leading-none tracking-[-0.045em] sm:text-xl">{ME.card}</p>
              <p className="text-lg font-extrabold leading-none tracking-[-0.04em] sm:text-xl">A.</p>
            </div>
            <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.22em]">{ME.role}</p>
          </motion.div>
        </Reveal>

        <div>
          <Scramble as="p" text="About me" className="label block text-fg/50" />
          <SplitHeading text={ABOUT.heading} className="display mt-3 text-5xl sm:text-7xl" />
          <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-xl leading-relaxed">{ABOUT.lead}</Reveal>
          <Reveal as="p" delay={0.15} className="mt-4 max-w-xl text-lg leading-relaxed text-fg/65">{ABOUT.more}</Reveal>

          <dl className="mt-10 max-w-xl border-t border-fg/15">
            {ABOUT.facts.map(([k, v], i) => (
              <Reveal key={k} delay={0.05 * i} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-fg/15 py-3.5 sm:grid-cols-[10rem_1fr]">
                <dt className="label pt-1 text-fg/50">{k}</dt>
                <dd>{v}</dd>
              </Reveal>
            ))}
          </dl>

          <ol className="mt-14 grid gap-8">
            {WHY.map((w, i) => (
              <Reveal as="li" key={w.title} delay={0.06 * i} className="group grid grid-cols-[3.5rem_1fr] gap-4 sm:grid-cols-[5rem_1fr]">
                <span className="display outline-text text-5xl transition-colors duration-500 group-hover:text-fg sm:text-6xl">{pad(i + 1)}</span>
                <div className="pt-1">
                  <h3 className="display text-2xl !tracking-[-0.03em] sm:text-3xl">{w.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-fg/65">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2} className="mt-12">
            <Magnetic>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
                <ChatIcon className="h-5 w-5" />
                Say hi on WhatsApp
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
