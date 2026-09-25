# Andika — portfolio

One long page: hero, a scroll-lit statement, a 3D ring of projects that turns as you scroll, phone screenshots drifting in columns, six things every site does, sticky cards per kind of business, how it works, price, FAQ, why me and contact. Blocks fade or pop in one by one as you scroll. React 19, Vite 8, Tailwind v4, `motion/react`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Before it goes live

Everything editable is in `src/data.js`.

- [x] `ME.whatsappNumber` is set (business WhatsApp).
- [ ] `ME.email` (the Email button only shows when this is set) and `ME.instagram`.
- [ ] `live` on each demo once its Vercel deploy exists (zine-tattoo, night-tide-tattoo, golden-hour-tattoo, clear-quote-tattoo, one-long-scroll-yoga). Until then the sheet says "Live link coming soon".
- [ ] Read the copy in `OFFER`, `FAQ` and `STEPS` once. No price is shown on purpose ("worth every dime", negotiable, domain not included, revisions until happy). The "cheaper than most agencies / builders" line is a claim about the market: check it still holds before launch.
- [ ] Add a domain, then `og:image`, canonical URL and sitemap.

## Photo

`public/andika.webp` is the portrait in the About section (original in `raw/andika.jpg`, not committed). Swap it there.

## Who is in it

Swordsman (owner approved) plus seven neutral demos (`kind: 'demo'`, labelled as demos on the site). Only work the owner has approved, plus neutral demos, appears here. Do not add anything else without permission.

## Screenshots

Full-size captures live in `raw/` (not committed). `npm run shots` turns them into `public/work/*.webp`.

## Notes

- The ring is CSS 3D (`rotateY` + `translateZ`) driven by scroll progress. It only moves `transform`, and the "which project is in front" state lives in a small leaf component so the ring does not re-render while spinning. Measured 60 fps with no long tasks on a desktop Mac; not yet measured on a real phone.
- `prefers-reduced-motion` gets a plain grid instead of the pinned ring, plain phone grid, and static text; nothing pinned or spinning. Not yet tested in a browser.
- Mobile screenshots are `raw/<slug>-mobile.png` (390x844 @2x); `npm run shots` makes the web versions.
- The idea and component picks came from 21st.dev. Its component source is behind a login, so these are my own implementations of the same patterns (3D ring, magnetic dock, cursor image preview), not copies.
