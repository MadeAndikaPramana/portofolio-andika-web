import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { jump } from './ui'

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[42%] w-[42%]" aria-hidden="true">
    {children}
  </svg>
)

const ITEMS = [
  { id: 'work', label: 'Work', icon: <Svg><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg> },
  { id: 'process', label: 'How it works', icon: <Svg><path d="M4 6h10M4 12h16M4 18h7" /></Svg> },
  { id: 'offer', label: 'Price', icon: <Svg><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></Svg> },
  { id: 'contact', label: 'Say hi', icon: <Svg><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></Svg> },
]

function DockItem({ mouseX, item }) {
  const ref = useRef(null)
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? v - (b.x + b.width / 2) : 9999
  })
  const size = useSpring(useTransform(distance, [-150, 0, 150], [48, 78, 48]), { stiffness: 320, damping: 24, mass: 0.4 })

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => jump(item.id)}
      aria-label={item.label}
      style={{ width: size, height: size }}
      className="group relative flex items-center justify-center rounded-2xl bg-slate text-bone transition-colors hover:bg-acid hover:text-ink focus-visible:bg-acid focus-visible:text-ink"
    >
      {item.icon}
      <span className="label pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-bone px-2 py-1 text-[0.62rem] text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {item.label}
      </span>
    </motion.button>
  )
}

export default function Dock() {
  const mouseX = useMotionValue(-9999)
  return (
    <nav aria-label="Sections" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
      <div
        onPointerMove={(e) => e.pointerType === 'mouse' && mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(-9999)}
        className="pointer-events-auto flex h-[64px] items-end gap-2 rounded-[1.4rem] border border-bone/15 bg-coal/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        {ITEMS.map((item) => (
          <DockItem key={item.id} mouseX={mouseX} item={item} />
        ))}
      </div>
    </nav>
  )
}
