import { FEATURES } from '../data'
import { Reveal } from './ui'

const Icon = ({ name }) => {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-7 w-7', 'aria-hidden': true }
  switch (name) {
    case 'bolt':
      return <svg {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
    case 'phone':
      return <svg {...props}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
    case 'chat':
      return <svg {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    case 'grid':
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
    case 'pin':
      return <svg {...props}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    default:
      return <svg {...props}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></svg>
  }
}

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
      <Reveal as="p" className="label text-acid">Every site I build</Reveal>
      <Reveal as="h2" delay={0.05} className="display mt-3 max-w-3xl text-5xl sm:text-7xl">Six things it always does.</Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal as="li" variant="pop" key={f.title} delay={(i % 3) * 0.09} className="group relative overflow-hidden rounded-3xl border border-bone/12 bg-coal p-6 transition-colors sm:p-7 hover:border-acid/60">
            <span aria-hidden="true" className="label absolute right-6 top-6 text-bone/25">{String(i + 1).padStart(2, '0')}</span>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate text-acid transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name={f.icon} />
            </span>
            <h3 className="display mt-6 text-3xl sm:mt-8">{f.title}</h3>
            <p className="mt-3 leading-relaxed text-bone/70">{f.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
