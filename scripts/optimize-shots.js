// Turns the full-size screenshots in raw/ (not committed) into the web-sized images in public/work/.
import { readdirSync } from 'node:fs'
import sharp from 'sharp'

for (const f of readdirSync('raw').filter((n) => n.endsWith('.png'))) {
  const name = f.replace('.png', '')
  const width = name.endsWith('-mobile') ? 520 : 1200
  await sharp(`raw/${f}`).resize(width).webp({ quality: 88, smartSubsample: true }).toFile(`public/work/${name}.webp`)
  console.log('✓', name)
}
