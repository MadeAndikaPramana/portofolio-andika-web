// Build-time SEO for a site that renders in the browser: the HTML that crawlers receive is otherwise an empty
// <div id="root">. This fills it with a plain copy of the page's text and adds schema.org data, both generated from
// src/data.js so they always say the same as the page. React replaces the copy as soon as it loads.
import { ABOUT, COMPARE, FAQ, FEATURES, HERO, ME, NICHE_GROUPS, OFFER, PROJECTS, STATEMENT, STEPS, WHATSAPP } from '../src/data.js'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const li = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

const status = (p) => (p.kind === 'client' ? 'Client site' : p.private ? 'Concept' : 'Demo')

// Section headings match the ones on the page (they live in the components).
export function prerenderedPage() {
  const work = PROJECTS.map((p) => {
    const link = p.live && !p.private ? ` <a href="${esc(p.live)}">Live site</a>` : ''
    return `<strong>${esc(p.name)}</strong> (${esc(p.niche)}, ${status(p)}): ${esc(p.line)}${link}`
  })
  return `<div class="prerender">
<header>
  <p>${esc(ME.card)}, ${esc(ME.role.toLowerCase())} in ${esc(ME.place)}</p>
  <h1>${esc(HERO.headline.join(' '))}</h1>
  <p>${esc(HERO.lead)}</p>
  <p><a href="${esc(WHATSAPP)}">Message me on WhatsApp</a></p>
</header>
<main>
  <section><h2>A card for every site.</h2>${li(work)}</section>
  <section><h2>What I do</h2><p>${esc(STATEMENT.words)}</p></section>
  <section><h2>${esc(ABOUT.heading)}</h2><p>${esc(ABOUT.lead)}</p><p>${esc(ABOUT.more)}</p>
    ${li(ABOUT.facts.map(([k, v]) => `${esc(k)}: ${esc(v)}`))}</section>
  <section><h2>Six things it always does.</h2>${li(FEATURES.map((f) => `<strong>${esc(f.title)}</strong>: ${esc(f.body)}`))}</section>
  <section><h2>Every kind of business asks for something different.</h2>
    ${NICHE_GROUPS.map((g) => `<h3>${esc(g.title)}</h3><p>${esc(g.line)} ${esc(g.body)}</p>`).join('')}</section>
  <section><h2>Simple on purpose.</h2>${li(STEPS.map((s) => `<strong>${esc(s.title)}</strong>: ${esc(s.body)}`))}</section>
  <section><h2>${esc(COMPARE.heading)}</h2><p>${esc(COMPARE.lead)}</p></section>
  <section><h2>${esc(OFFER.headline)}</h2><p>${esc(OFFER.promise)}</p><p>${esc(OFFER.compare)}</p>${li(OFFER.includes.map(esc))}<p>${esc(OFFER.excludes)}</p></section>
  <section><h2>Good to know.</h2>${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>
</main>
<footer>
  <h2>Let’s make your page.</h2>
  <p>WhatsApp <a href="${esc(WHATSAPP)}">${esc(ME.whatsappDisplay)}</a> · Email <a href="mailto:${esc(ME.email)}">${esc(ME.email)}</a> ·
    <a href="/andika-pramana.vcf">Save my contact</a> · <a href="${esc(ME.github)}">GitHub</a></p>
</footer>
</div>`
}

// schema.org: who Andika is, the web design service he runs in Bali, and the site itself.
export function structuredData() {
  const url = ME.url
  const phone = `+${ME.whatsappNumber}`
  const address = { '@type': 'PostalAddress', addressLocality: ME.locality, addressRegion: ME.place, addressCountry: 'ID' }
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: ME.full,
        alternateName: ME.card,
        jobTitle: ME.role,
        url,
        image: `${url}andika.webp`,
        email: `mailto:${ME.email}`,
        telephone: phone,
        address,
        knowsLanguage: ['en', 'id'],
        sameAs: [ME.github],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${url}#service`,
        name: `${ME.card}, ${ME.role.toLowerCase()} in ${ME.place}`,
        description: 'Fast, phone-first websites for small businesses in Bali, built so customers can message you in one tap.',
        url,
        image: `${url}og.png`,
        email: ME.email,
        telephone: phone,
        address,
        areaServed: [...ME.serviceAreas.map((name) => ({ '@type': 'AdministrativeArea', name })), { '@type': 'AdministrativeArea', name: ME.place }],
        founder: { '@id': `${url}#person` },
        knowsLanguage: ['en', 'id'],
      },
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: ME.card, inLanguage: 'en', publisher: { '@id': `${url}#person` } },
    ],
  }
  // Escape "<" so the JSON can never close the script tag early.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

// Vite plugin: puts both into index.html at build time (and in dev, so it can be checked there too).
export function seo() {
  return {
    name: 'seo',
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', `<div id="root">${prerenderedPage()}</div>`)
        .replace('</head>', `    ${structuredData()}\n  </head>`)
    },
  }
}
