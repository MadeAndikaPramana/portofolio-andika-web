import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { PROJECTS } from './data'
import Dock from './components/Dock'
import Hero from './components/Hero'
import Work, { Index } from './components/Work'
import Process from './components/Process'
import Offer from './components/Offer'
import Contact from './components/Contact'
import Sheet from './components/Sheet'

export default function App() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((dir) => {
    setOpen((cur) => {
      if (!cur) return cur
      const i = PROJECTS.findIndex((p) => p.slug === cur.slug)
      return PROJECTS[(i + dir + PROJECTS.length) % PROJECTS.length]
    })
  }, [])

  return (
    <>
      <Hero />
      <main>
        <Work onOpen={setOpen} />
        <Index onOpen={setOpen} />
        <Process />
        <Offer />
      </main>
      <Contact />
      <Dock />
      <AnimatePresence>{open && <Sheet project={open} onClose={close} onStep={step} />}</AnimatePresence>
    </>
  )
}
