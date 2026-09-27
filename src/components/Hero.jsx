import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { NICHES } from '../data'
import { ArrowIcon, jump } from './ui'

const HEADLINE = ['Websites', 'that', 'make', 'people', 'message', 'you.']

// The shelf of project cards: five, fanned out with a slight stagger, Swordsman (the one real,
// approved case study) largest and most forward in the centre. Two are dropped on phones so the
// shelf reads as a tidy trio rather than a jumble (see the `hidden sm:block` cards below).
const SHELF = [
  { src: '/work/one-long-scroll-yoga.webp', alt: 'One Long Scroll Yoga, a demo website', left: '-2%', top: '8%', rotate: -7, w: '29%', depth: 22, z: 1, delay: 0.5, hideOnMobile: true },
  { src: '/work/night-tide-tattoo.webp', alt: 'Night Tide Tattoo, a demo website', left: '17%', top: '-4%', rotate: 4, w: '29%', depth: 14, z: 2, delay: 0.6 },
  { src: '/work/swordsman.webp', alt: 'Swordsman Tattoo Studio website', left: '36%', top: '2%', rotate: -2, w: '32%', depth: 4, z: 4, delay: 0.72, scale: 1.06 },
  { src: '/work/teduh.webp', alt: 'Teduh, a counselling demo website', left: '57%', top: '10%', rotate: 5, w: '28%', depth: 16, z: 2, delay: 0.64 },
  { src: '/work/golden-hour-tattoo.webp', alt: 'Golden Hour Tattoo, a demo website', left: '74%', top: '-2%', rotate: -4, w: '29%', depth: 24, z: 1, delay: 0.52, hideOnMobile: true },
]

function ShelfCard({ src, alt, rotate, left, top, w, depth, sx, sy, delay, z, scale = 1, hideOnMobile }) {
  const x = useTransform(sx, [-0.5, 0.5], [depth, -depth])
  const y = useTransform(sy, [-0.5, 0.5], [depth * 0.55, -depth * 0.55])
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 1, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={`absolute ${hideOnMobile ? 'hidden sm:block' : ''}`}
      style={{ left, top, width: w, zIndex: z }}
    >
      <motion.div style={{ x, y, scale }} className="overflow-hidden rounded-2xl border border-bone/15 bg-coal shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
        <img src={src} alt={alt} width="1200" height="750" fetchPriority={z >= 4 ? 'high' : 'low'} loading={z >= 4 ? 'eager' : 'lazy'} className="block aspect-[16/10] w-full object-cover object-top" />
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
    <header id="top" onPointerMove={onMove} className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-10 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(215,255,63,0.09)_0%,rgba(215,255,63,0)_65%)]" />

      <div className="absolute inset-x-5 top-5 flex items-center justify-end sm:inset-x-10 sm:top-7">
        <p className="label flex items-center gap-2 text-bone/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          Open for new projects
        </p>
      </div>

      <div className="mx-auto max-w-[74rem]">
        <h1 className="display text-[clamp(2.9rem,8.4vw,6rem)]" aria-label={HEADLINE.join(' ')}>
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
          className="mt-7 max-w-xl text-lg leading-relaxed text-bone/75 sm:text-xl"
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
        </motion.div>
      </div>

      <div className="relative mx-auto mt-12 h-[160px] w-full max-w-[80rem] sm:mt-16 sm:h-[300px] lg:mt-24 lg:h-[420px]">
        {SHELF.map((c) => <ShelfCard key={c.src} sx={sx} sy={sy} {...c} />)}
      </div>

      <div className="relative mt-14 overflow-hidden border-y border-bone/10 bg-ink/60 py-4 lg:mt-20" aria-hidden="true">
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
