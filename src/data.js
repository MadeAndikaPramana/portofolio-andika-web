// Everything that changes lives here: contact details, projects, copy.

export const ME = {
  name: 'Andika',
  full: 'Made Andika Pramana',
  role: 'Web developer',
  place: 'Bali',
  origin: 'Abuan, Bangli',
  github: 'https://github.com/MadeAndikaPramana',
  // TODO: fill these in before launch. The buttons still render without them.
  whatsappNumber: '', // digits only, with country code, e.g. 6281234567890
  email: '',
  instagram: '',
}

const waText = encodeURIComponent('Hi Andika, I saw your portfolio and I would like a website for my business.')
export const WHATSAPP = ME.whatsappNumber ? `https://wa.me/${ME.whatsappNumber}?text=${waText}` : 'https://wa.me/'
export const EMAIL = ME.email ? `mailto:${ME.email}` : null

export const PRICE = { amount: 'Rp 2.000.000', note: 'One flat price for the whole site.' }

// kind: 'client' = real business, published with the owner's permission; 'concept' = made-up business, built to show a style.
export const PROJECTS = [
  {
    slug: 'swordsman',
    name: 'Swordsman Tattoo Studio',
    short: 'Swordsman',
    niche: 'Tattoo & piercing',
    place: 'Legian, Bali',
    kind: 'client',
    year: '2026',
    live: 'https://www.swordsmantattoostudiobali.com/',
    line: 'A dark, high-contrast site for a working tattoo studio.',
    story:
      'A real studio in Legian, so the site had to feel like the shop: deep red, heavy type and a hero that moves. Portfolio, artists, prices and booking are all a tap away.',
    stack: ['React', 'Motion', 'WebGL hero'],
    accent: '#c1272d',
  },
  {
    slug: 'zine-tattoo',
    name: 'Zine Tattoo',
    short: 'Zine',
    niche: 'Tattoo studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: null,
    line: 'Loud, playful, paper-and-tape.',
    story:
      'For a studio that wants to feel like a zine instead of a template: taped photos, a moving ticker, hand-made stickers, and a booking button you cannot miss.',
    stack: ['React', 'Motion', 'Tailwind'],
    accent: '#0e6b5c',
  },
  {
    slug: 'night-tide-tattoo',
    name: 'Night Tide Tattoo',
    short: 'Night Tide',
    niche: 'Tattoo studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: null,
    line: 'Dark glass, ocean teal, a glowing hero.',
    story:
      'A premium, night-time feel. A bento layout, glass panels and a slow teal glow, with every section one tap away from a message.',
    stack: ['React', 'Motion', 'WebGL glow'],
    accent: '#25c2b0',
  },
  {
    slug: 'golden-hour-tattoo',
    name: 'Golden Hour Tattoo',
    short: 'Golden Hour',
    niche: 'Tattoo studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: null,
    line: 'Calm, editorial, sunset serif.',
    story:
      'Slow and confident. One big sunset photo, an elegant serif, and a page that builds trust before it asks for anything.',
    stack: ['React', 'Motion', 'Tailwind'],
    accent: '#d9a441',
  },
  {
    slug: 'clear-quote-tattoo',
    name: 'Clear Quote Tattoo',
    short: 'Clear Quote',
    niche: 'Tattoo studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: null,
    line: 'Built to turn visitors into messages.',
    story:
      'Prices up front, a story viewer, a straight FAQ and a chat button that follows you down the page. Designed around one job: get the enquiry.',
    stack: ['React', 'Motion', 'Tailwind'],
    accent: '#f3c23c',
  },
  {
    slug: 'one-long-scroll-yoga',
    name: 'One Long Scroll Yoga',
    short: 'One Long Scroll',
    niche: 'Yoga studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: null,
    line: 'The whole studio, told in a single scroll.',
    story:
      'Ten chapters, no menu needed. A breathing circle that follows your scroll, a stack of class cards, a timetable, prices and a route to the door, ending with everything on one page.',
    stack: ['React', 'Scroll storytelling', 'Motion'],
    accent: '#d9a441',
  },
  {
    slug: 'ruang-napas',
    name: 'Ruang Napas',
    short: 'Ruang Napas',
    niche: 'Yoga studio',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: 'https://ruang-napas.vercel.app/',
    line: 'Warm sand and terracotta, moving with the day.',
    story:
      'A gentle yoga studio site where the light changes with the time of day. Classes, teachers, schedule and prices, all in a calm order.',
    stack: ['React', 'Motion', 'Tailwind'],
    accent: '#c25b34',
  },
  {
    slug: 'teduh',
    name: 'Teduh',
    short: 'Teduh',
    niche: 'Counselling',
    place: 'Concept',
    kind: 'concept',
    year: '2026',
    live: 'https://teduh-six.vercel.app/',
    line: 'A quiet place to start, with a breathing exercise in the hero.',
    story:
      'For a counselling practice, calm matters more than flash. Soft light, plain words, clear fees and a safety page that says what to do in a crisis.',
    stack: ['React', 'Motion', 'Tailwind'],
    accent: '#c9714a',
  },
]

export const NICHES = ['Tattoo studios', 'Yoga studios', 'Counselling', 'Wellness', 'Local businesses']

export const STEPS = [
  {
    n: '01',
    title: 'You show me your business',
    body: 'A few photos, your prices, your Instagram. That is enough to start. No long forms.',
  },
  {
    n: '02',
    title: 'I build a page you can click',
    body: 'Before you pay anything, you get a real link to look at on your own phone, not a drawing.',
  },
  {
    n: '03',
    title: 'We adjust until it feels like you',
    body: 'Change the words, the photos, the colours. Send a message and I fix it, as many times as it takes.',
  },
  {
    n: '04',
    title: 'It goes live and you own it',
    body: 'Customers can find you, see your work and message you on WhatsApp in one tap.',
  },
]

export const OFFER = {
  includes: [
    'A full website designed for phones first',
    'A WhatsApp button so customers can message you in one tap',
    'Your photos, prices, hours and map in one place',
    'Revisions until you are happy',
  ],
  excludes: 'The domain name (like yourbusiness.com) is not included.',
}
