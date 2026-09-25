import { EMAIL, ME, WHATSAPP } from '../data'
import { ArrowIcon, ChatIcon, Reveal } from './ui'

export default function Contact() {
  return (
    <footer id="contact" className="px-5 pb-40 pt-24 sm:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal as="p" className="label text-acid">Say hi</Reveal>
        <Reveal as="h2" delay={0.05} className="display mt-4 text-[clamp(3.2rem,11vw,9.5rem)]">
          Let’s make your <span className="text-acid">page.</span>
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-8 max-w-xl text-lg leading-relaxed text-bone/75 sm:text-xl">
          I’m {ME.name}, a web developer from {ME.origin}, building in {ME.place}. Send me a message with your business name and I’ll tell you what I’d build.
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn">
            <ChatIcon />
            Message on WhatsApp
          </a>
          {EMAIL && (
            <a href={EMAIL} className="btn-ghost">
              Email me
            </a>
          )}
          <a href={ME.github} target="_blank" rel="noreferrer" className="btn-ghost">
            GitHub
            <ArrowIcon />
          </a>
        </Reveal>

        <p className="label mt-24 flex flex-wrap justify-between gap-3 border-t border-bone/12 pt-6 text-mute">
          <span>© {new Date().getFullYear()} {ME.full}</span>
          <span>{ME.place} · from {ME.origin}</span>
        </p>
      </div>
    </footer>
  )
}
