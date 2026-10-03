// Everything that changes lives here: contact details, projects, copy.

// Matches the business card (kartu-nama-andika-*.svg): name, title, WhatsApp, email, web.
export const ME = {
  name: 'Andika',
  card: 'Andika Pramana',
  full: 'Made Andika Pramana',
  role: 'Web developer',
  place: 'Bali',
  github: 'https://github.com/MadeAndikaPramana',
  whatsappNumber: '6281932200554', // digits only, with country code
  whatsappDisplay: '+62 819-3220-0554',
  email: 'andika@andikapramana.com',
  web: 'andikapramana.com',
  url: 'https://www.andikapramana.com/',
  // TODO: add before launch if wanted. The button only shows when set.
  instagram: '',
}

const waText = encodeURIComponent('Hi Andika, I saw your portfolio and I would like a website for my business.')
export const WHATSAPP = ME.whatsappNumber ? `https://wa.me/${ME.whatsappNumber}?text=${waText}` : 'https://wa.me/'
export const EMAIL = ME.email ? `mailto:${ME.email}` : null

// kind: 'client' = real business, published with the owner's permission; 'demo' = sample site for a made-up business, built to show a style.
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
  },
  {
    slug: 'zine-tattoo',
    name: 'Zine Tattoo',
    short: 'Zine',
    niche: 'Tattoo studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: null,
    line: 'Loud, playful, paper-and-tape.',
    story:
      'For a studio that wants to feel like a zine instead of a template: taped photos, a moving ticker, hand-made stickers, and a booking button you cannot miss.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
  {
    slug: 'night-tide-tattoo',
    name: 'Night Tide Tattoo',
    short: 'Night Tide',
    niche: 'Tattoo studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: 'https://seamless-concept.vercel.app/',
    line: 'Dark glass, ocean teal, a glowing hero.',
    story:
      'A premium, night-time feel. A bento layout, glass panels and a slow teal glow, with every section one tap away from a message.',
    stack: ['React', 'Motion', 'WebGL glow'],
  },
  {
    slug: 'golden-hour-tattoo',
    name: 'Golden Hour Tattoo',
    short: 'Golden Hour',
    niche: 'Tattoo studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: null,
    line: 'Calm, editorial, sunset serif.',
    story:
      'Slow and confident. One big sunset photo, an elegant serif, and a page that builds trust before it asks for anything.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
  {
    slug: 'clear-quote-tattoo',
    name: 'Clear Quote Tattoo',
    short: 'Clear Quote',
    niche: 'Tattoo studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: null,
    line: 'Built to turn visitors into messages.',
    story:
      'Prices up front, a story viewer, a straight FAQ and a chat button that follows you down the page. Designed around one job: get the enquiry.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
  {
    slug: 'one-long-scroll-yoga',
    name: 'One Long Scroll Yoga',
    short: 'One Long Scroll',
    niche: 'Yoga studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: 'https://arrive-theta-lake.vercel.app/',
    line: 'The whole studio, told in a single scroll.',
    story:
      'Ten chapters, no menu needed. A breathing circle that follows your scroll, a stack of class cards, a timetable, prices and a route to the door, ending with everything on one page.',
    stack: ['React', 'Scroll storytelling', 'Motion'],
  },
  {
    slug: 'ruang-napas',
    name: 'Ruang Napas',
    short: 'Ruang Napas',
    niche: 'Yoga studio',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: 'https://ruang-napas.vercel.app/',
    line: 'Warm sand and terracotta, moving with the day.',
    story:
      'A gentle yoga studio site where the light changes with the time of day. Classes, teachers, schedule and prices, all in a calm order.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
  {
    slug: 'teduh',
    name: 'Teduh',
    short: 'Teduh',
    niche: 'Counselling',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: 'https://teduh-six.vercel.app/',
    line: 'A quiet place to start, with a breathing exercise in the hero.',
    story:
      'For a counselling practice, calm matters more than flash. Soft light, plain words, clear fees and a safety page that says what to do in a crisis.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
  {
    slug: 'lumira-resort',
    name: 'Lumira Resort Ubud',
    short: 'Lumira Resort',
    niche: 'Resort / villa',
    place: 'Demo',
    kind: 'demo',
    year: '2026',
    live: 'https://lumiraresort.vercel.app/',
    line: 'A booking-engine hotel site, minus the bloat.',
    story:
      'A fictional Ubud resort, built to match the feel of a real booking-engine page: a hero video, villas, a candlelit restaurant, a spa and a photo gallery. Same motion, a fraction of the weight.',
    stack: ['React', 'Motion', 'Tailwind'],
  },
]

export const NICHES = ['Tattoo studios', 'Yoga studios', 'Counselling', 'Wellness', 'Cafés', 'Villas', 'Local shops', 'And many more']

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
  headline: 'Worth every dime.',
  promise: 'You see the site on your own phone before you pay, and I keep changing it until you are happy.',
  compare: 'Priced below what most agencies charge, and below what a website builder costs you once you add up a year or two of monthly fees.',
  negotiable: 'The price is negotiable. Tell me your budget and we will find something that works.',
  includes: [
    'A full website designed for phones first',
    'A WhatsApp button so customers can message you in one tap',
    'Your photos, prices, hours and map in one place',
    'Revisions until you are happy',
  ],
  excludes: 'The domain name (like yourbusiness.com) is not included.',
}

// "Three ways to get a website". Honest on purpose: no names, the other two get their real strengths too,
// and price stays qualitative (no competitor numbers). Check the claims still hold before changing them.
export const COMPARE = {
  heading: 'Three ways to get a website.',
  lead: 'All three can work. Here is the honest difference, so you can pick the one that fits.',
  columns: ['A website builder', 'A typical agency', 'Me'],
  notes: ['You build it yourself', 'A team builds it', 'One person builds it'],
  rows: [
    { label: 'Who you talk to', cells: ['Nobody, it is all you', 'An account manager, who passes it on', 'Me, the person writing the code'] },
    { label: 'Design', cells: ['A template many others use too', 'Custom, often from their own starter kit', 'Made for your business, no template'] },
    { label: 'Before you pay', cells: ['You can try it free', 'Usually a mockup or a drawing', 'A real page to open on your own phone'] },
    { label: 'Speed on a phone', cells: ['Often slowed down by builder code and plugins', 'Depends on the team', 'Plain, light code that opens fast on weak signal'] },
    { label: 'Changes', cells: ['Any time, if you do them yourself', 'Often a set number of rounds', 'Send a message. Revisions until you are happy'] },
    { label: 'Price', cells: ['A small monthly fee that never stops', 'Usually the highest upfront cost', 'Below typical agency rates, and negotiable'] },
    { label: 'Best for', cells: ['Owners who enjoy doing it themselves', 'Big brands with big budgets', 'Small businesses that want to look good and get messages'] },
  ],
}

export const STATEMENT = {
  words: 'Most people find a business on their phone, decide in a few seconds, then send a message. I build the whole site around those few seconds.',
  accent: ['message.', 'few', 'seconds.'],
}

export const FEATURES = [
  { title: 'Fast to open', body: 'Plain, light pages. No plugins and no slow page builder, so it opens quickly on a phone with weak signal.', icon: 'bolt' },
  { title: 'Made for phones', body: 'Designed on a phone screen first, then stretched up to laptops. Not the other way round.', icon: 'phone' },
  { title: 'One tap to message', body: 'A WhatsApp button that stays with people as they scroll, so asking is never more than one tap away.', icon: 'chat' },
  { title: 'Shows your work', body: 'Photos, prices and your team, in the order people actually look for them.', icon: 'grid' },
  { title: 'Easy to find', body: 'Opening hours, address and a map, right where people scroll to look for them.', icon: 'pin' },
  { title: 'Sounds like you', body: 'Your words, your photos, your colours. You read it and think, yes, that is us.', icon: 'heart' },
]

export const NICHE_GROUPS = [
  {
    id: 'tattoo',
    title: 'Tattoo studios',
    line: 'Show the work first. Make the quote easy.',
    body: 'People choose an artist by style, so the work and the artists come first, then prices, then one obvious button to ask for a quote.',
    points: ['Portfolio by style', 'Artist pages', 'Clear price ranges', 'Quote on WhatsApp'],
    slugs: ['swordsman', 'zine-tattoo', 'night-tide-tattoo', 'golden-hour-tattoo', 'clear-quote-tattoo'],
  },
  {
    id: 'yoga',
    title: 'Yoga studios',
    line: 'Calm on the page, clear on the timetable.',
    body: 'People want the class time, the price and the way to the door in a few seconds. The feel of the room comes next, and it matters too.',
    points: ['Timetable at a glance', 'Class levels', 'Prices in plain numbers', 'Map and parking'],
    slugs: ['one-long-scroll-yoga', 'ruang-napas'],
  },
  {
    id: 'counselling',
    title: 'Counselling',
    line: 'Quiet, plain and honest.',
    body: 'Nobody looks for help in a good mood. Soft light, plain words, clear fees, and a page that says what to do in a crisis.',
    points: ['Plain language', 'Clear fees', 'Safety information', 'Gentle first step'],
    slugs: ['teduh'],
  },
]

export const FAQ = [
  { q: 'How much does a website cost?', a: 'Less than most agencies charge, and the price is negotiable. I tell you the exact number before you decide. The domain name (like yourbusiness.com) is not included.' },
  { q: 'Can I see it before I pay?', a: 'Yes. I build a page you can open on your own phone first, so you can see what you are getting before you decide.' },
  { q: 'What if I want changes?', a: 'Send me a message and I change it. Revisions are included until you are happy.' },
  { q: 'What do you need from me?', a: 'A few photos, your prices, your opening hours, and your Instagram or Google Maps link. That is enough to start.' },
  { q: 'Can customers contact me from the site?', a: 'Yes. Every site has a WhatsApp button, so people can message you in one tap.' },
  { q: 'Do you speak Indonesian?', a: 'Ya. We can talk in Bahasa Indonesia or English, whichever is easier for you.' },
]

export const WHY = [
  { title: 'One person, start to finish', body: 'You talk to me, and I build it. No agency, no account manager, no passing your message along.' },
  { title: 'Based in Bali', body: 'I live and work here. I know how people in Bali find a business and how they like to message it.' },
  { title: 'Demo first', body: 'You see a real page before you pay, so nothing is a guess.' },
]

export const ABOUT = {
  heading: 'I build cool websites.',
  lead: 'Hey, I’m Andika. I make websites for small businesses in Bali, the kind that look good, load fast and get people messaging you.',
  more: 'I do everything myself, from the design to the code to the launch, so you only ever talk to me. Send a few photos and tell me what you sell, and I’ll show you a real page to look at. No pressure.',
  facts: [
    ['Based in', 'Bali'],
    ['What I do', 'Cool websites for small businesses'],
    ['We can talk in', 'Bahasa Indonesia or English'],
    ['I build with', 'React, Astro, Vite, Tailwind, Motion and many more'],
  ],
}

// The last stop on the project strip.
export const MORE = {
  name: '…and many more',
  short: 'and many more',
  line: 'Cafés, villas, salons, surf schools, shops. If it has customers, it can have a great website.',
  hint: 'Cafés · Villas · Salons · Shops',
}
