import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ME, WHATSAPP } from '../data'
import { CardBack, CardFront } from './Card'
import { ArrowIcon, ChatIcon, Magnetic, Reveal, Scramble, SplitHeading, jump } from './ui'

// The card again, as a bookend: it arrives showing its black back and turns to its front as you reach it,
// the reverse of the hero. Its contact lines are real links, and it leans toward the mouse.
function ContactCard() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center 55%'] })
  const turn = useTransform(p, [0, 1], [-180, 0])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 16 })
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 16 })

  return (
    <div
      ref={ref}
      className="@container relative mx-auto aspect-[90/55] w-full max-w-[38rem]"
      style={{ perspective: '1400px' }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div style={{ rotateY: reduce ? 0 : turn, transformStyle: 'preserve-3d' }} className="absolute inset-0">
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }} className="absolute inset-0 rounded-[1.6cqw] shadow-[0_50px_100px_-30px_rgba(255,255,255,0.18)]">
          <CardFront live />
          <CardBack className="ring-1 ring-white/15" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Contact() {
  return (
    <footer id="contact" data-theme="dark" className="relative overflow-hidden px-5 pb-36 pt-24 sm:px-10 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <Scramble as="p" text="Say hi" className="label block text-fg/50" />
        <SplitHeading text="Let’s make your page." className="display mt-4 max-w-5xl text-[clamp(3.2rem,11vw,9.5rem)]" />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Reveal as="p" className="max-w-xl text-lg leading-relaxed text-fg/70 sm:text-xl">
              I’m {ME.name}, a web developer building in {ME.place}. Send me a message with your business name and I’ll tell you what I’d build.
            </Reveal>
            <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
                  <ChatIcon />
                  Message on WhatsApp
                </a>
              </Magnetic>
              <a href={`mailto:${ME.email}`} className="btn-ghost">
                Email me
              </a>
              <a href="/andika-pramana.vcf" download className="btn-ghost">
                Save my contact
              </a>
              <a href={ME.github} target="_blank" rel="noreferrer" className="btn-ghost">
                GitHub
                <ArrowIcon />
              </a>
            </Reveal>
          </div>
          <ContactCard />
        </div>

        <div aria-hidden="true" className="mt-28 select-none">
          <p className="display outline-text whitespace-nowrap text-[12.2vw] !leading-[0.8] xl:text-[9.6rem]">{ME.card}</p>
        </div>
        <div className="label mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-fg/15 pt-6 text-fg/50">
          <span>© {new Date().getFullYear()} {ME.full}</span>
          <span>{ME.web} · {ME.place}</span>
          <button type="button" onClick={() => jump('top')} className="uppercase transition-colors hover:text-fg">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
