import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { STATEMENT } from '../data'

function Word({ p, i, n, children, accent }) {
  const start = 0.08 + (i / n) * 0.62
  const o = useTransform(p, [start, start + 0.1], [0.14, 1])
  return (
    <motion.span style={{ opacity: o }} className={`mr-[0.28em] inline-block ${accent ? 'text-acid' : ''}`}>
      {children}
    </motion.span>
  )
}

// A sentence that lights up word by word as you scroll through it.
export default function Statement() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const words = STATEMENT.words.split(' ')

  return (
    <section ref={ref} style={{ height: reduce ? 'auto' : '240svh' }} className="relative">
      <div className={`${reduce ? 'py-24' : 'sticky top-0 h-[100svh]'} flex items-center px-5 sm:px-10`}>
        <div className="mx-auto w-full max-w-6xl">
          <p className="label mb-6 text-acid">What I do</p>
          <p className="display text-[clamp(2.1rem,6.2vw,5.4rem)] !leading-[1.04] !tracking-[-0.03em]">
            {reduce
              ? STATEMENT.words
              : words.map((w, i) => (
                  <Word key={w + i} p={p} i={i} n={words.length} accent={STATEMENT.accent.includes(w)}>
                    {w}
                  </Word>
                ))}
          </p>
        </div>
      </div>
    </section>
  )
}
