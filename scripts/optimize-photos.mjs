// Turns full-resolution originals into web masters for next/image.
//
//   node scripts/optimize-photos.mjs            # process every file in originals/
//   node scripts/optimize-photos.mjs DSC09035   # only files whose name contains this
//   node scripts/optimize-photos.mjs --prune    # sync with site.ts: build any newly referenced
//                                               # photos, delete every photo site.ts doesn't use
//
// Only photos referenced in site.ts should be publicly served, so after changing
// picks in site.ts, run with --prune. Originals are never touched.
//
// Input:  originals/*.jpg  (gitignored, never deployed)
// Output: public/photos/<slug>.jpg      2400px long edge, mozjpeg q80, metadata stripped
//         src/content/photos.generated.json   { [slug]: { src, width, height, color } }
//         color = dominant colour, used as the loading background
//
// next/image then serves AVIF/WebP at the exact width each device needs.

import sharp from 'sharp'
import { readdir, mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT      = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR   = path.join(ROOT, 'originals')
const OUT_DIR   = path.join(ROOT, 'public', 'photos')
const MANIFEST  = path.join(ROOT, 'src', 'content', 'photos.generated.json')
const SITE      = path.join(ROOT, 'src', 'content', 'site.ts')
const LONG_EDGE = 2400

const args   = process.argv.slice(2)
const prune  = args.includes('--prune')
const filter = args.find((a) => !a.startsWith('--'))

const slugify = (file) =>
  path.parse(file).name.toLowerCase().replace(/-enhanced-nr$/, '').replace(/[^a-z0-9]+/g, '-')

await mkdir(OUT_DIR, { recursive: true })

let manifest = {}
try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')) } catch {}

// Every quoted string in site.ts that matches a photo slug counts as "used"
const used = prune
  ? new Set([...(await readFile(SITE, 'utf8')).matchAll(/['"`]([a-z0-9-]+)['"`]/g)].map((m) => m[1]))
  : null
const existing = new Set(await readdir(OUT_DIR))

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.(jpe?g|png|tiff?)$/i.test(f))
  .filter((f) => !filter || f.includes(filter))
  // --prune: only build used photos that aren't built yet (or predate the colour field)
  .filter((f) => {
    if (!used) return true
    const slug = slugify(f), m = manifest[slug]
    return used.has(slug) && !(m && m.color && existing.has(`${slug}.jpg`))
  })

for (const file of files) {
  const slug = slugify(file)
  const input = sharp(path.join(SRC_DIR, file)).rotate() // respect EXIF orientation

  const { data, info } = await input
    .clone()
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true })
  await writeFile(path.join(OUT_DIR, `${slug}.jpg`), data)

  // Dominant colour (sharp's histogram-based estimate) → flat loading background
  const { dominant: { r, g, b } } = await sharp(data).stats()
  const color = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

  manifest[slug] = {
    src:    `/photos/${slug}.jpg`,
    width:  info.width,
    height: info.height,
    color,
  }
  console.log(`${file} → ${slug}.jpg  ${info.width}×${info.height}  ${(data.length / 1024).toFixed(0)} KB  ${color}`)
}

if (used) {
  let removed = 0
  for (const slug of Object.keys(manifest)) if (!used.has(slug)) delete manifest[slug]
  for (const file of await readdir(OUT_DIR)) {
    if (!used.has(path.parse(file).name)) { await unlink(path.join(OUT_DIR, file)); removed++ }
  }
  const missing = [...used].filter((s) => /^(dsc|about)/.test(s) && !manifest[s])
  console.log(`pruned ${removed} unused photo(s) from public/photos`)
  if (missing.length) console.warn(`WARNING: referenced in site.ts but no original found: ${missing.join(', ')}`)
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n')
console.log(`\n${files.length} processed · manifest has ${Object.keys(sorted).length} photos`)
