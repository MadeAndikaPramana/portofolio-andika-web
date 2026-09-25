# Andika — portfolio

One-page portfolio: hero, a 3D ring of projects that turns as you scroll, a hover-preview index, how it works, price and contact. React 19, Vite 8, Tailwind v4, `motion/react`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Before it goes live

Everything editable is in `src/data.js`.

- [ ] `ME.whatsappNumber` (digits with country code, e.g. `6281234567890`). Until it is set, the WhatsApp buttons open `wa.me/` with no number.
- [ ] `ME.email` (the Email button only shows when this is set) and `ME.instagram`.
- [ ] `live` on each demo once its Vercel deploy exists (zine-tattoo, night-tide-tattoo, golden-hour-tattoo, clear-quote-tattoo, one-long-scroll-yoga). Until then the sheet says "Live link coming soon".
- [ ] Read the copy in `OFFER` and `STEPS` once: the price (Rp 2.000.000, domain excluded, revisions until happy) comes from the current quote, the rest is wording.
- [ ] Add a domain, then `og:image`, canonical URL and sitemap.

## Who is in it

Swordsman (owner approved) plus seven neutral concepts. Only work the owner has approved, plus neutral demos, appears here. Do not add anything else without permission.

## Screenshots

Full-size captures live in `raw/` (not committed). `npm run shots` turns them into `public/work/*.webp`.

## Notes

- The ring is CSS 3D (`rotateY` + `translateZ`) driven by scroll progress. It only moves `transform`, and the "which project is in front" state lives in a small leaf component so the ring does not re-render while spinning. Measured 60 fps with no long tasks on a desktop Mac; not yet measured on a real phone.
- `prefers-reduced-motion` gets a plain grid instead of the pinned ring.
- The idea and component picks came from 21st.dev. Its component source is behind a login, so these are my own implementations of the same patterns (3D ring, magnetic dock, cursor image preview), not copies.
