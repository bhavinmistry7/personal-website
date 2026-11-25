// Contrast audit: measures text labels against the pixels actually behind them
// (photos included), at ~100 scroll positions, on a 390×664 phone viewport.
//
//   npm run build && npm run start          # in one terminal
//   npm run audit:contrast                  # in another (defaults to http://localhost:3000)
//   node scripts/audit-contrast.mjs http://localhost:3124
//
// Re-run whenever photos, scrims or label colours change. Exits 1 if any label
// is below 4.5:1 (WCAG AA, small text) at its worst pixel.
//
// Method, per label:
//   1. Skip it if another element covers it (e.g. the fixed header).
//   2. Screenshot its box with and without the text (CSS transitions disabled).
//   3. Glyph mask = pixels that changed; widen by 2px = background next to letters.
//   4. Composite the label colour (alpha / mix-blend-difference) over each of those
//      background pixels and compute the WCAG ratio. Report the minimum.
// Uses your installed Google Chrome (playwright-core downloads no browser).
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:3000'
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto(BASE, { waitUntil: 'networkidle' })
// The animated story loads after first paint; audit the real thing, not the fallback
await page.waitForFunction(() => document.documentElement.dataset.storyReady === 'true', null, { timeout: 20000 })
await page.waitForTimeout(300)
await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important} [data-measuring],[data-measuring] *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}' })

const SELECTORS = {
  hero:   '#top h1, #top p, #top a.label, #top ol a > span > span, #top ol a > span:last-child',
  corner: 'section[id] > div[aria-hidden] .label',
  header: 'header nav a, header nav .label',
  book:   '#book .label, #book dt, #book p',
}

async function measure(group, sel, scrollY) {
  const els = await page.$$(sel)
  const out = []
  for (const el of els) {
    const info = await el.evaluate((e) => {
      const r = e.getBoundingClientRect()
      if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return null
      if (!e.textContent.trim()) return null
      // Skip labels covered by another element (e.g. the fixed header)
      const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1)
      const prevPE = e.style.pointerEvents
      e.style.pointerEvents = 'auto'   // labels inside pointer-events:none overlays must still be hit-testable
      const hit = document.elementFromPoint(cx, cy)
      e.style.pointerEvents = prevPE
      if (hit && !(e.contains(hit) || hit.contains(e))) return { occluded: true }
      let op = 1, blend = 'normal', n = e
      while (n && n !== document.documentElement) {
        const s = getComputedStyle(n)
        op *= +s.opacity
        if (s.mixBlendMode !== 'normal') blend = s.mixBlendMode
        if (s.visibility === 'hidden') return null
        n = n.parentElement
      }
      if (op < 0.05) return null
      const m = getComputedStyle(e).color.match(/[\d.]+/g).map(Number)
      const x = Math.max(0, r.left), y = Math.max(0, r.top)
      return { x, y, w: Math.min(r.right, innerWidth) - x, h: Math.min(r.bottom, innerHeight) - y,
               color: m.slice(0, 3), alpha: (m[3] ?? 1) * op, blend, text: e.textContent.trim().slice(0, 28) }
    })
    if (!info) continue
    if (info.occluded) { occluded++; continue }
    if (info.w < 2 || info.h < 2) continue
    const clip = { x: info.x, y: info.y, width: info.w, height: info.h }
    const withText = await page.screenshot({ clip })
    await el.evaluate((e) => e.setAttribute('data-measuring', ''))
    const png = await page.screenshot({ clip })
    await el.evaluate((e) => e.removeAttribute('data-measuring'))
    const { data, info: im } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const { data: t } = await sharp(withText).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    // Glyph mask = pixels that change when the text is removed, dilated 2px: the background adjacent to the letters
    const W = im.width, Hh = im.height, glyph = new Uint8Array(W * Hh), near = new Uint8Array(W * Hh)
    for (let p = 0; p < W * Hh; p++) glyph[p] = Math.abs(t[p*3]-data[p*3]) + Math.abs(t[p*3+1]-data[p*3+1]) + Math.abs(t[p*3+2]-data[p*3+2]) > 24 ? 1 : 0
    for (let yy = 0; yy < Hh; yy++) for (let xx = 0; xx < W; xx++) if (glyph[yy*W+xx])
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = xx+dx, Y = yy+dy; if (X>=0 && Y>=0 && X<W && Y<Hh) near[Y*W+X] = 1 }
    const rs = []
    for (let i = 0; i < data.length; i += 3) {
      if (!near[i / 3]) continue
      const bg = [data[i], data[i + 1], data[i + 2]]
      const fg = info.blend === 'difference'
        ? bg.map((c, k) => Math.abs(info.color[k] - c) * info.alpha + c * (1 - info.alpha))
        : bg.map((c, k) => info.color[k] * info.alpha + c * (1 - info.alpha))
      rs.push(ratio(fg, bg))
    }
    if (!rs.length) continue
    rs.sort((a, b) => a - b)
    out.push({ group, scrollY, text: info.text, blend: info.blend, min: rs[0], p05: rs[Math.floor(rs.length * 0.05)], median: rs[Math.floor(rs.length / 2)] })
  }
  return out
}

const results = []
let occluded = 0
const vh = 664
const H = await page.evaluate(() => document.documentElement.scrollHeight)
results.push(...await measure('hero', SELECTORS.hero, 0))
for (let y = 0; y <= H - vh; y += Math.round(vh * 0.2)) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
  await page.waitForTimeout(160)
  results.push(...await measure('corner', SELECTORS.corner, y))
  results.push(...await measure('header', SELECTORS.header, y))
  results.push(...await measure('book', SELECTORS.book, y))
}
mkdirSync('_review', { recursive: true })
writeFileSync('_review/contrast-report.json', JSON.stringify(results, null, 1))

const worst = {}
for (const r of results) { const k = `${r.group} | ${r.text}`; if (!worst[k] || r.min < worst[k].min) worst[k] = r }
const rows = Object.entries(worst).sort((a, b) => a[1].min - b[1].min)
const fails = rows.filter(([, r]) => r.min < 4.5)
console.log(`${results.length} measurements (${occluded} skipped: covered by another element), ${rows.length} distinct labels, ${fails.length} below 4.5:1 at worst pixel`)
for (const [k, r] of rows) {
  console.log(`${r.min < 4.5 ? 'FAIL' : 'ok  '} ${k.padEnd(46)} min ${r.min.toFixed(2)}  p05 ${r.p05.toFixed(2)}  med ${r.median.toFixed(2)}  @y=${r.scrollY}${r.blend !== 'normal' ? ' [' + r.blend + ']' : ''}`)
}
await browser.close()
process.exitCode = fails.length ? 1 : 0
