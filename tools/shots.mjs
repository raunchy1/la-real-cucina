// Verifica headless: screenshot per sezione (1440 e 390), errori console, 404, overflow, immagini rotte.
// Uso: node tools/shots.mjs [url] [outdir]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/usr/local/lib/node_modules/@playwright/mcp/node_modules/playwright-core');
import fs from 'fs';

const url = process.argv[2] || 'http://127.0.0.1:8787/';
const out = process.argv[3] || '/config/work/super-speedy/screenshots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const report = {};
for (const [tag, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: tag === 'mobile' ? 2 : 1, isMobile: tag === 'mobile', hasTouch: tag === 'mobile', locale: 'it-IT', timezoneId: 'Europe/Rome' });
  const page = await ctx.newPage();
  const errs = [], bad = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('super-speedy.mp4')) bad.push(r.status() + ' ' + r.url()); });
  page.on('requestfailed', r => { if (!r.url().endsWith('super-speedy.mp4') && !r.url().includes('openstreetmap')) bad.push('FAILED ' + r.url()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/${tag}-00-hero.png` });
  // scroll through to trigger lazy images and observers
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(800);
  const ids = ['top5', 'menu', 'impasto', 'sala', 'recensioni', 'ordina', 'dove'];
  let i = 1;
  for (const id of ids) {
    const el = page.locator('#' + id);
    const h = await el.evaluate(e => e.getBoundingClientRect().height);
    if (id === 'menu') {
      // prime 2 schermate del menù + una a metà
      await el.evaluate(e => window.scrollTo(0, e.offsetTop));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/${tag}-0${i}-${id}-a.png` });
      await page.evaluate(() => window.scrollBy(0, innerHeight));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/${tag}-0${i}-${id}-b.png` });
      await page.locator('#bibite').evaluate(e => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 120));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/${tag}-0${i}-${id}-c.png` });
    } else {
      await el.screenshot({ path: `${out}/${tag}-0${i}-${id}.png` });
    }
    i++;
  }
  await page.locator('footer').screenshot({ path: `${out}/${tag}-09-footer.png` });
  // interaction test: add 2 items, check WA link
  await page.locator('#menu').evaluate(e => window.scrollTo(0, e.offsetTop));
  await page.locator('.item .add').nth(2).click();
  await page.locator('.item .add').nth(2).click();
  await page.locator('.add-chip').first().click();
  await page.evaluate(() => { const r = document.querySelector('input[value="consegna"]'); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); });
  if (tag === 'mobile') { await page.locator('#bar-menu').click(); await page.waitForTimeout(600); await page.screenshot({ path: `${out}/${tag}-10-comanda.png` }); }
  else { await page.locator('#comanda').scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.locator('#comanda').screenshot({ path: `${out}/${tag}-10-comanda.png` }); }
  const wa = await page.locator('#wa-send').getAttribute('href');
  // filter test
  await page.keyboard.press('Escape'); await page.goto(url + '?r=1#menu'); await page.waitForTimeout(500);
  if (tag === 'mobile') await page.evaluate(() => localStorage.clear());
  await page.locator('.chip[data-f="hot"]').click();
  const hotCount = await page.locator('#filt-count').textContent();
  const checks = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.idx,.filters,.comanda,.nav,.vh,.skip'); }).slice(0, 10).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right));
    const imgs = [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src);
    const noAlt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src);
    const links = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.querySelector(h));
    return { scrollW: document.documentElement.scrollWidth, w, over, imgs, noAlt, deadAnchors: [...new Set(links)], h1: document.querySelectorAll('h1').length, fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style) };
  });
  report[tag] = { errs, bad, wa: decodeURIComponent(wa), hotCount, ...checks };
  await ctx.close();
}
await browser.close();
fs.writeFileSync(out + "/report.json", JSON.stringify(report, null, 1)); console.log("done");
