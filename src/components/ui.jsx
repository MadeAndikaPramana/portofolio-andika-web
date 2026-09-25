import { motion, useReducedMotion } from 'motion/react'

// Blocks appear one by one as you scroll to them. 'rise' fades up, 'pop' fades in while growing from slightly smaller.
const VARIANTS = {
  rise: { from: (y) => ({ opacity: 0, y }), to: { opacity: 1, y: 0 } },
  pop: { from: () => ({ opacity: 0, y: 36, scale: 0.9 }), to: { opacity: 1, y: 0, scale: 1 } },
  fade: { from: () => ({ opacity: 0 }), to: { opacity: 1 } },
}

export function Reveal({ as = 'div', variant = 'rise', delay = 0, y = 24, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const v = VARIANTS[variant]
  return (
    <Tag
      initial={reduce ? false : v.from(y)}
      whileInView={v.to}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={variant === 'pop' ? { type: 'spring', stiffness: 170, damping: 20, delay } : { duration: 0.75, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function ChatIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

export function ArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function Kind({ kind }) {
  const client = kind === 'client'
  return (
    <span className={`label inline-flex items-center gap-2 rounded-full border px-3 py-1 ${client ? 'border-acid bg-acid text-ink' : 'border-bone/25 text-bone/80'}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${client ? 'bg-ink' : 'bg-bone/60'}`} />
      {client ? 'Live client site' : 'Demo'}
    </span>
  )
}
