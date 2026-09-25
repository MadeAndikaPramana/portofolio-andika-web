import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { PROJECTS } from './data'
import Dock from './components/Dock'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Work from './components/Work'
import About from './components/About'
import Phones from './components/Phones'
import Features from './components/Features'
import Niches from './components/Niches'
import Process from './components/Process'
import Offer from './components/Offer'
import Faq from './components/Faq'
import Why from './components/Why'
import Contact from './components/Contact'
import Sheet from './components/Sheet'
import Background, { BgSwitch } from './components/Background'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const [bg, setBg] = useState(params.get('bg') || 'auto')
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
      <Background mode={bg} />
      {params.has('bgpreview') && <BgSwitch mode={bg} setMode={setBg} />}
      <Hero />
      <main>
        <About />
        <Statement />
        <Work onOpen={setOpen} />
        <Phones onOpen={setOpen} />
        <Features />
        <Niches onOpen={setOpen} />
        <Process />
        <Offer />
        <Faq />
        <Why />
      </main>
      <Contact />
      <Dock />
      <AnimatePresence>{open && <Sheet project={open} onClose={close} onStep={step} />}</AnimatePresence>
    </>
  )
}
