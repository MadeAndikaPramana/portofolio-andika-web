import { OFFER, PRICE, WHATSAPP } from '../data'
import { ChatIcon, Reveal } from './ui'

export default function Offer() {
  return (
    <section id="offer" className="px-5 py-24 sm:px-10 md:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-bone/12 bg-coal p-7 sm:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(215,255,63,0.16)_0%,rgba(215,255,63,0)_65%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal as="p" className="label text-acid">The price</Reveal>
            <Reveal as="p" delay={0.05} className="display mt-4 text-[clamp(3.4rem,11vw,8rem)]">{PRICE.amount}</Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 max-w-sm text-lg text-bone/70">{PRICE.note}</Reveal>
            <Reveal delay={0.15} className="mt-8">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
                <ChatIcon className="h-5 w-5" />
                Ask me about it
              </a>
            </Reveal>
          </div>

          <div className="self-center">
            <p className="label text-mute">What you get</p>
            <ul className="mt-4 divide-y divide-bone/10 border-y border-bone/10">
              {OFFER.includes.map((t, i) => (
                <Reveal as="li" key={t} delay={0.05 * i} className="flex gap-4 py-4 text-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-1 h-5 w-5 shrink-0 text-acid" aria-hidden="true">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  {t}
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-mute">{OFFER.excludes}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
