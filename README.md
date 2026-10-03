# Andika — portfolio

One long page built around the business card (`kartu-nama-andika-*.svg`): black, white and greys only, Plus Jakarta Sans, the card's "A." and its dot field.

Intro (dots draw the "A."), hero with the card in 3D (scroll flips it to its black back, which grows into the Work section), a sideways film strip of projects, a scroll-lit statement, about + why me, phone screenshots, six things every site does (numbered list with a sticky live demo), sticky cards per kind of business, how it works, an honest three-way comparison, price, FAQ and contact (the card again, turning to its front). The whole page flips between light and dark per section (`data-theme` on each section). A custom cursor inverts whatever it is over. React 19, Vite 8, Tailwind v4, `motion/react`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Before it goes live

Everything editable is in `src/data.js`.

- [x] `ME.whatsappNumber` is set (business WhatsApp).
- [x] `ME.email` matches the card: andika@andikapramana.com.
- [ ] `ME.instagram` (not shown yet).
- [ ] `live` on each demo once its Vercel deploy exists (zine-tattoo, night-tide-tattoo, golden-hour-tattoo, clear-quote-tattoo, one-long-scroll-yoga). Until then the sheet says "Live link coming soon".
- [ ] Read the copy in `OFFER`, `FAQ` and `STEPS` once. No price is shown on purpose ("worth every dime", negotiable, domain not included, revisions until happy). The "cheaper than most agencies / builders" line is a claim about the market: check it still holds before launch.
- [x] Domain (andikapramana.com) and canonical URL.
- [x] `og:image` (`public/og.png`): a 1200 x 630 capture of the hero. Retake it if the hero changes.
- [ ] Read the claims in `COMPARE` (data.js) once. They are about website builders and agencies in general, named nobody, and should stay that way.

## Photo

`public/andika.webp` is the portrait in the About section (original in `raw/andika.jpg`, not committed). Swap it there.

## Who is in it

Swordsman (owner approved), eight neutral demos (`kind: 'demo'`, labelled as demos on the site), and seven anonymised concepts (`private: true`, labelled "Concept").

The anonymised concepts were built unasked for real businesses that have not approved being shown, so they appear under invented names (Concrete Wall, Gold Leaf, Grey Wash, Old School, Coffee & Ink, Garden Collective, First Wave) with no live link. Their screenshots were taken with the real name, logo marks, artist names, real review counts, slogans and street addresses swapped out on the page before capture. Only stock (Unsplash / Mixkit) photos are visible in them. If an owner approves, swap in their real name and site; until then keep them anonymous. The Segara Ink concept is left out on purpose: its tattoo photos are not stock and have no recorded source.

Do not add anything else without permission.

## Screenshots

Full-size captures live in `raw/` (not committed). `npm run shots` turns them into `public/work/*.webp`.

## Notes

- Background: a dot grid with a spotlight (`src/components/Background.jsx`) in the page's type colour, so it flips with the theme. A small canvas draws only the dots near the light, larger and pushed away from the mouse. The light wanders by itself on phones or when the mouse is idle. Reduced motion gets a still frame.

- Work is a pinned strip on screens 768px and up (scroll moves it sideways, it settles on the nearest site), and a plain swipe carousel on phones and for reduced motion. Screenshots are grey except the one in the middle.
- Scroll-linked opacity in `motion` runs on the browser's scroll timeline, which does not hold the last value past the final keyframe. Give those `useTransform`s a full 0..1 range (see Hero.jsx).
- `public/andika-pramana.vcf` is the "Save my contact" file. Keep it in step with `ME`.
- `prefers-reduced-motion` gets no intro, a still hero card, the swipe carousel instead of the pinned strip, a plain phone grid and static text; nothing pinned or spinning. Not yet tested in a browser.
- Mobile screenshots are `raw/<slug>-mobile.png` (390x844 @2x); `npm run shots` makes the web versions.
- The QR code on the card back (`src/qr.js`) was traced from the card SVG and points to https://www.andikapramana.com/.
