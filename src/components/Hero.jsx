import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ME, NICHES, WHATSAPP } from '../data'
import { ArrowIcon, ChatIcon, jump } from './ui'

const HEADLINE = ['Websites', 'that', 'make', 'people', 'message', 'you.']

function FanCard({ src, alt, rotate, left, top, depth, sx, sy, delay, z }) {
  const x = useTransform(sx, [-0.5, 0.5], [depth, -depth])
  const y = useTransform(sy, [-0.5, 0.5], [depth * 0.6, -depth * 0.6])
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 1, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute w-[62%] sm:w-[56%] lg:w-[74%]"
      style={{ left, top, zIndex: z }}
    >
      <motion.div style={{ x, y }} className="overflow-hidden rounded-2xl border border-bone/15 bg-coal shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
        <img src={src} alt={alt} width="1200" height="750" fetchPriority="high" className="block aspect-[16/10] w-full object-cover object-top" />
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 70, damping: 18 })
  const sy = useSpring(py, { stiffness: 70, damping: 18 })

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <header id="top" onPointerMove={onMove} className="relative overflow-hidden px-5 pb-20 pt-24 sm:px-10 lg:min-h-svh lg:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(215,255,63,0.09)_0%,rgba(215,255,63,0)_65%)]" />

      <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-10 sm:top-7">
        <a href="#top" className="display text-2xl tracking-tight" aria-label={`${ME.name}, back to top`}>
          {ME.name}<span className="text-acid">.</span>
        </a>
        <p className="label flex items-center gap-2 text-bone/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          Open for new projects
        </p>
      </div>

      <div className="mx-auto grid max-w-[88rem] items-center gap-12 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label mb-6 text-mute">{ME.role} · {ME.place} · from {ME.origin}</p>
          <h1 className="display text-[clamp(3rem,9.4vw,6.6rem)]" aria-label={HEADLINE.join(' ')}>
            {HEADLINE.map((w, i) => (
              <span key={w + i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]" aria-hidden="true">
                <motion.span
                  initial={reduce ? false : { y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                  className={`inline-block ${w === 'message' ? 'text-acid' : ''}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-bone/75 sm:text-xl"
          >
            I build fast, good-looking sites for Bali businesses. You get a real page to click through before you pay anything.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <button type="button" onClick={() => jump('work')} className="btn">
              See the work
              <ArrowIcon />
            </button>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-ghost">
              <ChatIcon className="h-4 w-4" />
              Message me
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] lg:col-span-5 lg:h-[600px] lg:max-w-none" aria-hidden={false}>
          <FanCard src="/work/one-long-scroll-yoga.webp" alt="One Long Scroll Yoga, a demo website" rotate={7} left="30%" top="0%" depth={34} sx={sx} sy={sy} delay={0.5} z={1} />
          <FanCard src="/work/night-tide-tattoo.webp" alt="Night Tide Tattoo, a demo website" rotate={-5} left="8%" top="22%" depth={18} sx={sx} sy={sy} delay={0.62} z={2} />
          <FanCard src="/work/swordsman.webp" alt="Swordsman Tattoo Studio website" rotate={2} left="22%" top="44%" depth={6} sx={sx} sy={sy} delay={0.74} z={3} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-bone/10 bg-ink/60 py-4" aria-hidden="true">
        <div className="marquee-track flex w-max items-center gap-10" style={{ animation: 'marquee 38s linear infinite' }}>
          {[...NICHES, ...NICHES, ...NICHES, ...NICHES].map((n, i) => (
            <span key={n + i} className="display flex items-center gap-10 text-2xl text-bone/55 sm:text-3xl">
              {n}
              <span className="text-acid">✦</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
