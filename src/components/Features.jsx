import { FEATURES } from '../data'
import { Reveal } from './ui'

const bySlug = (n) => `/work/${n}.webp`

// Each card shows a tiny live version of what it promises, instead of just an icon.
function Fast() {
  return (
    <div className="w-full max-w-[17rem]">
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
        <span className="viz-ripple absolute inset-0 rounded-full bg-acid/25" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-acid text-ink">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate">
        <div className="viz-fill h-full origin-left rounded-full bg-acid" />
      </div>
    </div>
  )
}

const BLOCKS = [
  'h-24 rounded-lg bg-acid/25',
  'h-2 w-3/4 rounded bg-bone/25',
  'h-2 w-1/2 rounded bg-bone/15',
  'h-16 rounded-lg bg-bone/10',
  'h-16 rounded-lg bg-bone/10',
  'h-2 w-2/3 rounded bg-bone/20',
  'h-9 w-1/2 rounded-full bg-acid/80',
]

function Phone() {
  return (
    <div className="relative h-[19rem] w-44 overflow-hidden rounded-[2rem] border-[6px] border-bone/25 bg-ink lg:h-[24rem] lg:w-52">
      <div className="viz-scroll flex flex-col gap-2 p-2.5">
        {[0, 1].map((k) => (
          <div key={k} className="flex flex-col gap-2" aria-hidden="true">
            {BLOCKS.map((c, i) => <span key={i} className={`block ${c}`} />)}
          </div>
        ))}
      </div>
      <span className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-ink to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-ink to-transparent" />
    </div>
  )
}

function Chat() {
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-2 text-sm">
      <span className="viz-bubble self-start rounded-2xl rounded-bl-md bg-bone/12 px-3.5 py-2" style={{ '--d': '0s' }}>Hi! Are you open today?</span>
      <span className="viz-bubble self-end rounded-2xl rounded-br-md bg-acid px-3.5 py-2 font-semibold text-ink" style={{ '--d': '1.4s' }}>Yes! Come by any time.</span>
      <span className="viz-bubble self-start rounded-2xl rounded-bl-md bg-bone/12 px-3.5 py-2" style={{ '--d': '2.8s' }}>On my way 🙌</span>
    </div>
  )
}

const TILES = [
  ['zine-tattoo', '-4deg', '0s'],
  ['swordsman', '3deg', '0.6s'],
  ['ruang-napas', '-2deg', '1.2s'],
  ['golden-hour-tattoo', '4deg', '0.3s'],
  ['teduh', '-3deg', '0.9s'],
  ['night-tide-tattoo', '2deg', '1.5s'],
]

function Work() {
  return (
    <div className="grid w-full max-w-[18rem] grid-cols-3 gap-2">
      {TILES.map(([n, r, d]) => (
        <span key={n} className="viz-float block overflow-hidden rounded-lg border border-bone/15 bg-coal" style={{ '--r': r, '--d': d }}>
          <img src={bySlug(n)} alt="" width="1200" height="750" loading="lazy" className="block aspect-[4/3] w-full object-cover object-top" />
        </span>
      ))}
    </div>
  )
}

function Find() {
  return (
    <div className="relative flex h-full min-h-[9rem] w-full items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle, rgba(239,234,224,0.22) 1px, transparent 1.6px)', backgroundSize: '18px 18px' }} />
      <span className="viz-ripple absolute h-28 w-28 rounded-full border border-acid/60" />
      <span className="viz-ripple absolute h-28 w-28 rounded-full border border-acid/60" style={{ '--d': '1.3s' }} />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-acid text-ink">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
      </span>
      <span className="label absolute bottom-3 left-3 rounded-full bg-slate px-3 py-1.5 text-bone">Open today</span>
    </div>
  )
}

function Voice() {
  return (
    <div className="relative w-full text-center">
      <p className="viz-swap-a display text-2xl text-bone/40 line-through decoration-bone/40 sm:text-4xl">“We offer quality service.”</p>
      <p className="viz-swap-b display absolute inset-0 flex items-center justify-center text-2xl text-acid sm:text-4xl">“Fresh coffee, every morning, just up the road.”</p>
    </div>
  )
}

const VIZ = { bolt: Fast, phone: Phone, chat: Chat, grid: Work, pin: Find, heart: Voice }
// Bento layout on large screens: phone card is tall, the last one runs full width.
const SPAN = ['lg:col-span-2', 'lg:col-span-2 lg:row-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-6']

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-32">
      <Reveal as="p" className="label text-acid">Every site I build</Reveal>
      <Reveal as="h2" delay={0.05} className="display mt-3 max-w-4xl text-5xl sm:text-7xl md:text-8xl">
        Six things it <span className="text-acid">always</span> does.
      </Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {FEATURES.map((f, i) => {
          const Viz = VIZ[f.icon]
          return (
            <Reveal as="li" variant="pop" key={f.title} delay={(i % 3) * 0.1} className={`group relative flex flex-col overflow-hidden rounded-3xl border border-bone/12 bg-coal p-5 transition-colors hover:border-acid/60 sm:p-6 ${SPAN[i]} ${i === 5 ? 'sm:col-span-2' : ''}`}>
              <span aria-hidden="true" className="label absolute right-7 top-7 z-10 text-bone/30">{String(i + 1).padStart(2, '0')}</span>
              <div className={`relative mb-6 flex flex-1 ${i === 5 ? 'min-h-[7rem]' : 'min-h-[10.5rem]'} items-center justify-center overflow-hidden rounded-2xl bg-ink/70 p-5`} aria-hidden="true">
                <Viz />
              </div>
              <h3 className="display text-3xl sm:text-4xl">{f.title}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-bone/70">{f.body}</p>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
