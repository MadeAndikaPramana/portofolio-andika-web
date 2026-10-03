import { OFFER, WHATSAPP } from '../data'
import { ChatIcon, Magnetic, Reveal, Scramble, SplitHeading } from './ui'

export default function Offer() {
  return (
    <section id="offer" data-theme="dark" className="px-5 py-24 sm:px-10 md:py-36">
      <div className="relative mx-auto max-w-6xl">
        <Scramble as="p" text="The price" className="label block text-fg/50" />
        <SplitHeading text={OFFER.headline} className="display mt-4 text-[clamp(3.4rem,13vw,11rem)]" />

        <div className="mt-14 grid gap-12 border-t border-fg/15 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal as="p" className="max-w-md text-2xl leading-snug">{OFFER.promise}</Reveal>
            <Reveal as="p" delay={0.05} className="mt-5 max-w-md text-lg leading-relaxed text-fg/65">{OFFER.compare}</Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-md text-lg font-semibold italic">{OFFER.negotiable}</Reveal>
            <Reveal delay={0.15} className="mt-8">
              <Magnetic>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
                  <ChatIcon className="h-5 w-5" />
                  Tell me your budget
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <div>
            <p className="label text-fg/50">What you get</p>
            <ul className="mt-4 border-t border-fg/15">
              {OFFER.includes.map((t, i) => (
                <Reveal as="li" key={t} delay={0.05 * i} className="group flex items-center gap-4 border-b border-fg/15 py-5 text-lg">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fg/25 transition-colors duration-300 group-hover:bg-fg group-hover:text-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  {t}
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-fg/50">{OFFER.excludes}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
