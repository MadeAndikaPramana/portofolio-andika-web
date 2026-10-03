import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { PROJECTS } from '../data'
import { ArrowIcon } from './ui'

export default function Sheet({ project, onClose, onStep }) {
  const closeRef = useRef(null)
  const i = PROJECTS.findIndex((p) => p.slug === project.slug)

  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/85 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        key={project.slug}
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94svh] w-full max-w-6xl overflow-y-auto rounded-t-[1.75rem] bg-paper text-ink sm:rounded-[1.75rem]"
      >
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10 lg:p-8">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink">
            <img src={`/work/${project.slug}.webp`} alt={`${project.name} homepage`} width="1200" height="750" className="block aspect-[16/10] w-full object-cover object-top" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="label text-ink/50">{String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
              <button ref={closeRef} type="button" onClick={onClose} className="label rounded-full border border-ink/25 px-4 py-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                Close
              </button>
            </div>

            <div className="mt-5">
              <span className="label text-ink/50">{project.niche}{project.kind === 'client' ? ` · ${project.place}` : ''}</span>
            </div>
            <h3 className="display mt-4 text-4xl sm:text-5xl">{project.name}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">{project.story}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="label rounded-full border border-ink/15 px-3 py-1.5 text-ink/75">{s}</li>
              ))}
            </ul>

            {project.kind === 'demo' && (
              <p className="mt-5 text-sm leading-relaxed text-ink/55">
                A demo: a sample site built to show a style for this kind of business. The name, prices and reviews on it are placeholders.
              </p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              {project.live ? (
                <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full bg-ink px-7 font-bold text-paper transition-transform hover:-translate-y-0.5">
                  Visit live site
                  <ArrowIcon />
                </a>
              ) : (
                <span className="label rounded-full border border-dashed border-ink/25 px-4 py-3 text-ink/55">Live link coming soon</span>
              )}
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous project" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper">←</button>
                <button type="button" onClick={() => onStep(1)} aria-label="Next project" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper">→</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
