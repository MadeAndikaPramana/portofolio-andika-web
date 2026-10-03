import { useEffect, useRef } from 'react'

// A round cursor that inverts whatever it is over (white on black, black on white), so it always reads.
// It swells over anything clickable, and over elements with data-cursor="Word" it shows that word.
// Mouse and trackpad only, never on touch or with reduced motion.
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return undefined

    const root = document.documentElement
    const dot = dotRef.current
    const ring = ringRef.current
    const text = textRef.current
    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let size = 14
    let target = 14
    let seen = false
    let raf = 0

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!seen) {
        seen = true
        rx = x
        ry = y
        root.classList.add('has-cursor')
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
    }
    const onOver = (e) => {
      const word = e.target.closest?.('[data-cursor]')
      const hot = e.target.closest?.('a, button, [role="button"], summary, label, input, textarea, select')
      if (word) {
        target = 92
        text.textContent = word.dataset.cursor
        text.style.opacity = '1'
      } else {
        target = hot ? 46 : 14
        text.style.opacity = '0'
      }
    }
    const onLeave = () => {
      ring.style.opacity = '0'
      dot.style.opacity = '0'
      seen = false
      root.classList.remove('has-cursor')
    }
    const onDown = () => (target *= 0.8)
    const onUp = (e) => onOver(e)

    const frame = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      size += (target - size) * 0.18
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      ring.style.width = ring.style.height = `${size}px`
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300] mix-blend-difference">
      <div ref={ringRef} className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-300" style={{ width: 14, height: 14 }}>
        <span ref={textRef} className="label whitespace-nowrap text-[0.62rem] text-black opacity-0 transition-opacity duration-200" />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 h-1 w-1 rounded-full bg-white opacity-0" />
    </div>
  )
}
