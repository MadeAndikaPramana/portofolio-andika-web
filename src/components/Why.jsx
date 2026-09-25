import { WHY } from '../data'
import { Reveal } from './ui'

export default function Why() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
      <Reveal as="p" className="label text-acid">Why me</Reveal>
      <Reveal as="h2" delay={0.05} className="display mt-3 max-w-3xl text-5xl sm:text-7xl">A small studio of one.</Reveal>
      <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-bone/12 bg-bone/12 md:grid-cols-3">
        {WHY.map((w, i) => (
          <Reveal as="li" key={w.title} variant="fade" delay={i * 0.12} className="bg-ink p-8 sm:p-10">
            <span className="label text-acid">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display mt-10 text-3xl sm:text-4xl">{w.title}</h3>
            <p className="mt-4 leading-relaxed text-bone/70">{w.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
