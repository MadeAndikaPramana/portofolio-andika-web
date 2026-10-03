import { motion, useReducedMotion } from 'motion/react'
import { COMPARE } from '../data'
import { Reveal, Scramble, SplitHeading } from './ui'

const ME_COL = COMPARE.columns.length - 1

// Large screens: a real table. The last column (me) sits on a white card that rises in behind it, like the card front.
function Table() {
  const reduce = useReducedMotion()
  const rows = COMPARE.rows.length + 1 // header + rows
  return (
    <div role="table" aria-label="Three ways to get a website" className="relative hidden grid-cols-[11rem_1fr_1fr_1.15fr] lg:grid">
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="rounded-3xl bg-paper shadow-[0_40px_90px_-30px_rgba(255,255,255,0.25)]"
        style={{ gridColumn: ME_COL + 2, gridRow: `1 / span ${rows}` }}
      />

      <div role="row" className="contents">
        <span role="columnheader" style={{ gridRow: 1, gridColumn: 1 }} />
        {COMPARE.columns.map((c, i) => (
          <div key={c} role="columnheader" style={{ gridRow: 1, gridColumn: i + 2 }} className={`relative px-6 pb-6 pt-7 ${i === ME_COL ? 'text-ink' : ''}`}>
            <p className={`label ${i === ME_COL ? 'text-ink/50' : 'text-fg/45'}`}>{COMPARE.notes[i]}</p>
            <p className="display mt-3 text-3xl !tracking-[-0.035em]">{i === ME_COL ? 'Andika.' : c}</p>
          </div>
        ))}
      </div>

      {COMPARE.rows.map((r, ri) => (
        <div key={r.label} role="row" className="contents">
          <span role="rowheader" style={{ gridRow: ri + 2, gridColumn: 1 }} className="label border-t border-fg/15 py-5 pr-4 text-fg/50">
            {r.label}
          </span>
          {r.cells.map((cell, ci) => (
            <span
              key={ci}
              role="cell"
              style={{ gridRow: ri + 2, gridColumn: ci + 2 }}
              className={`relative px-6 py-5 leading-snug ${ci === ME_COL ? 'border-t border-ink/10 font-semibold text-ink' : 'border-t border-fg/15 text-fg/60'}`}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

// Phones: one block per question, my answer on the white card, the other two underneath.
function Stack() {
  return (
    <div className="grid gap-4 lg:hidden">
      {COMPARE.rows.map((r, ri) => (
        <Reveal key={r.label} delay={0.03 * ri} className="rounded-3xl border border-fg/12 p-4">
          <p className="label px-1 text-fg/50">{r.label}</p>
          <p className="mt-3 rounded-2xl bg-paper px-4 py-3.5 font-semibold leading-snug text-ink">
            <span className="label mb-1 block text-ink/45">Me</span>
            {r.cells[ME_COL]}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 px-1 text-sm">
            {r.cells.slice(0, ME_COL).map((cell, ci) => (
              <div key={ci}>
                <dt className="label text-[0.6rem] text-fg/40">{COMPARE.columns[ci]}</dt>
                <dd className="mt-1 leading-snug text-fg/60">{cell}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  )
}

export default function Compare() {
  return (
    <section id="compare" data-theme="dark" className="mx-auto max-w-6xl px-5 py-24 sm:px-10 md:py-36">
      <Scramble as="p" text="The honest comparison" className="label block text-fg/50" />
      <SplitHeading text={COMPARE.heading} className="display mt-3 max-w-4xl text-5xl sm:text-7xl" />
      <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg leading-relaxed text-fg/65">{COMPARE.lead}</Reveal>
      <div className="mt-14">
        <Table />
        <Stack />
      </div>
    </section>
  )
}
