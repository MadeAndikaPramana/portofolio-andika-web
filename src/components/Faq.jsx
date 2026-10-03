import { useState } from 'react'
import { FAQ } from '../data'
import { Reveal, Scramble, SplitHeading } from './ui'

function Item({ q, a, open, onToggle, id }) {
  return (
    <div className="border-b border-fg/15">
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-6 py-6 text-left">
          <span className="display text-2xl !tracking-[-0.02em] sm:text-3xl">{q}</span>
          <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fg/25 text-xl transition-[transform,background-color,color] duration-300 ${open ? 'rotate-45 bg-fg text-bg' : ''}`}>+</span>
        </button>
      </h3>
      <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-lg leading-relaxed text-fg/65">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" data-theme="light" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-10 md:py-32 lg:grid-cols-[1fr_1.6fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Scramble as="p" text="Questions" className="label block text-fg/50" />
        <SplitHeading text="Good to know." className="display mt-3 text-5xl sm:text-7xl" />
      </div>
      <ul className="border-t border-fg/15">
        {FAQ.map((f, i) => (
          <Reveal as="li" key={f.q} delay={0.04 * i}>
            <Item q={f.q} a={f.a} id={`faq-${i}`} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
