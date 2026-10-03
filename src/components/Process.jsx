import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { STEPS } from '../data'
import { Reveal, Scramble, SplitHeading } from './ui'

export default function Process() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="process" data-theme="light" className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-24 sm:px-10 md:pb-20 md:pt-32 lg:grid-cols-[1fr_1.4fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Scramble as="p" text="How it works" className="label block text-fg/50" />
        <SplitHeading text="Simple on purpose." className="display mt-3 text-5xl sm:text-7xl" />
        <Reveal as="p" delay={0.1} className="mt-5 max-w-sm text-lg text-fg/65">Most small business owners are busy. So there are four steps and you only need to be there for the fun ones.</Reveal>
      </div>

      <ol ref={ref} className="relative">
        <span aria-hidden="true" className="absolute bottom-3 left-[1.35rem] top-3 w-px bg-fg/15" />
        <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : scaleY }} className="absolute bottom-3 left-[1.35rem] top-3 w-px origin-top bg-fg" />
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.n} delay={0.04 * i} className="relative grid grid-cols-[2.7rem_1fr] gap-5 pb-12 last:pb-0">
            <span className="label relative z-10 flex h-[2.7rem] w-[2.7rem] items-center justify-center rounded-full bg-fg text-bg">{s.n}</span>
            <div className="pt-1.5">
              <h3 className="display text-2xl sm:text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-fg/65">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
