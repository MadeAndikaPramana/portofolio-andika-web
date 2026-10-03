import { motion } from 'motion/react'
import { ME, WHATSAPP } from '../data'
import { QR_PATH } from '../qr'

// The business card, rebuilt in HTML so it can move in 3D: a white front and a black back, 90 x 55.
// Everything is sized in container units (cqw), so it is the same card at any width.
// Layout taken from kartu-nama-andika-depan.svg / -belakang.svg.

// The card's dot field: patches of fine dots that fade out at their edges. Coordinates are on a 900 x 550 card.
const FRONT_PATCHES = [
  [420, 18, 880, 104],
  [20, 120, 880, 350],
  [610, 366, 880, 526],
]
const BACK_PATCHES = [
  [250, 18, 880, 104],
  [20, 168, 556, 526],
  [556, 440, 880, 526],
]
const STEP = 25

const ease = (t) => t * t * (3 - 2 * t)
function field(patches) {
  const dots = []
  for (let x = STEP / 2; x < 900; x += STEP) {
    for (let y = STEP / 2; y < 550; y += STEP) {
      let k = 0
      for (const [x0, y0, x1, y1] of patches) {
        if (x < x0 || x > x1 || y < y0 || y > y1) continue
        const fx = Math.min(1, (x - x0) / 140, (x1 - x) / 40)
        const fy = Math.min(1, (y - y0) / 50, (y1 - y) / 50)
        k = Math.max(k, ease(Math.max(0, fx)) * ease(Math.max(0, fy)))
      }
      if (k > 0.04) dots.push([x, y, 0.35 + 1.25 * k])
    }
  }
  return dots
}
const FRONT_DOTS = field(FRONT_PATCHES)
const BACK_DOTS = field(BACK_PATCHES)

function Dots({ dots, fill }) {
  return (
    <svg viewBox="0 0 900 550" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
      {dots.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </svg>
  )
}

const ROWS = [
  ['WhatsApp', ME.whatsappDisplay, WHATSAPP],
  ['Email', ME.email, `mailto:${ME.email}`],
  ['Web', ME.web, ME.url],
]

// `live` turns the three contact rows into real links (used on the contact card, not the hero one).
export function CardFront({ live = false, className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-[1.6cqw] bg-paper text-left text-ink [backface-visibility:hidden] ${className}`}>
      <Dots dots={FRONT_DOTS} fill="#000" />
      <div className="relative flex h-full flex-col p-[4.4cqw] pb-[5.4cqw]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[5.4cqw] font-extrabold leading-none tracking-[-0.045em]">{ME.card}</p>
            <p className="mt-[2.6cqw] text-[2.35cqw] font-medium uppercase leading-none tracking-[0.22em]">{ME.role}</p>
          </div>
          <p className="text-[5.4cqw] font-extrabold leading-none tracking-[-0.04em]">A.</p>
        </div>
        <dl className="mt-auto grid grid-cols-[20cqw_1fr] gap-y-[1.7cqw] text-left">
          {ROWS.map(([k, v, href]) => (
            <div key={k} className="contents">
              <dt className="self-center text-[1.95cqw] font-bold uppercase leading-none tracking-[0.2em]">{k}</dt>
              <dd className="text-[2.9cqw] leading-none tracking-[-0.01em]">
                {live ? (
                  <a href={href} target={k === 'Email' ? undefined : '_blank'} rel="noreferrer" className="underline-offset-[0.5cqw] hover:underline">
                    {v}
                  </a>
                ) : (
                  v
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

// `inkStyle` fades the printing (not the black card itself), so the hero can grow a solid black card.
export function CardBack({ className = '', inkStyle }) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-[1.6cqw] bg-ink text-left text-paper [backface-visibility:hidden] [transform:rotateY(180deg)] ${className}`}>
      <motion.div style={inkStyle} className="absolute inset-0">
        <Dots dots={BACK_DOTS} fill="#fff" />
        <div className="relative flex h-full flex-col p-[4.4cqw] pb-[5.4cqw]">
          <p className="text-[5.4cqw] font-extrabold leading-[0.95] tracking-[-0.045em]">
            See my
            <br />
            work.
          </p>
          <p className="mt-auto text-[2.35cqw] font-medium leading-none tracking-[0.08em]">{ME.web}</p>
        </div>
        <div className="absolute left-[65.5%] top-[25.7%] w-[30cqw] rounded-[1.8cqw] bg-paper p-[2.6cqw]">
          <svg viewBox="4 4 29 29" className="block aspect-square w-full" role="img" aria-label={`QR code for ${ME.web}`} shapeRendering="crispEdges">
            <path d={QR_PATH} stroke="#000" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
