import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { PROJECTS } from './data'
import Intro from './components/Intro'
import Cursor from './components/Cursor'
import Dock from './components/Dock'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Work from './components/Work'
import About from './components/About'
import Phones from './components/Phones'
import Features from './components/Features'
import Niches from './components/Niches'
import Process from './components/Process'
import Compare from './components/Compare'
import Offer from './components/Offer'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Sheet from './components/Sheet'
import Background from './components/Background'

// Every section carries data-theme="light" or "dark". Whichever one crosses the middle of the screen sets the theme
// for the whole page, so it flips like turning the card over. (The hero sets it itself while it is pinned.)
function useThemeSections() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target.dataset.theme
          document.documentElement.dataset.theme = t
          meta?.setAttribute('content', t === 'light' ? '#ebebeb' : '#000000')
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    // Re-scan on resize: the Work section swaps between its phone and desktop versions.
    const attach = () => {
      io.disconnect()
      document.querySelectorAll('main [data-theme], footer[data-theme]').forEach((el) => io.observe(el))
    }
    attach()
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(attach, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
      io.disconnect()
    }
  }, [])
}

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
  useThemeSections()

  return (
    <>
      <Intro />
      <Background />
      <Hero />
      <main>
        <Work onOpen={setOpen} />
        <Statement />
        <About />
        <Phones onOpen={setOpen} />
        <Features />
        <Niches onOpen={setOpen} />
        <Process />
        <Compare />
        <Offer />
        <Faq />
      </main>
      <Contact />
      <Dock />
      <Cursor />
      <AnimatePresence>{open && <Sheet project={open} onClose={close} onStep={step} />}</AnimatePresence>
    </>
  )
}
