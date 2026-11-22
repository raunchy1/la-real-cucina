// Verifica completa Headless Playwright (1440px, 390px, 320px):
// - Server HTTP statico dalla root di site/ (così /bozze/muraiya-olbia/assets/... risolve in locale!)
// - 0 errori console, 0 risposte >=400, 0 immagini rotte, 0 overflow orizzontale
// - Test ricerca istantanea, filtro corsie, aggiunta lista + campo libero + generazione link WhatsApp
// - Salva screenshot in /config/work/muraiya-olbia/screenshots/
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require('/usr/local/lib/node_modules/@playwright/mcp/node_modules/playwright-core');

const ROOT = '/config/work/muraiya-olbia/site';
const OUT = '/config/work/muraiya-olbia/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const u = decodeURIComponent((req.url || '/').split('?')[0]);
  let rel = u.endsWith('/') ? u + 'index.html' : u;
  const fp = path.join(ROOT, rel);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404);
    res.end('Not found: ' + u);
    return;
  }
  const ext = path.extname(fp).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/bozze/muraiya-olbia/`;

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox']
});

const report = {};

for (const [tag, vp] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }]
]) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: tag === 'mobile' ? 2 : 1,
    isMobile: tag === 'mobile',
    hasTouch: tag === 'mobile',
    locale: 'it-IT',
    timezoneId: 'Europe/Rome'
  });
  const page = await ctx.newPage();

  const errs = [];
  const badStatus = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400 && !r.url().includes('openstreetmap.org')) badStatus.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => { if (!r.url().includes('openstreetmap.org')) badStatus.push(`FAILED ${r.url()}`); });

  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);

  // Hero screenshot
  await page.screenshot({ path: `${OUT}/${tag}-01-hero.png` });

  // Scroll through entire page to load all lazy images
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);

  // Section screenshots
  const sections = [
    ['02-reparti', '#reparti'],
    ['03-catalogo', '#catalogo'],
    ['04-stagione-asian', '#stagione'],
    ['05-instagram', '#social'],
    ['06-mappa-orari', '#mappa'],
    ['07-footer', '.site-footer']
  ];

  for (const [name, sel] of sections) {
    const loc = page.locator(sel);
    if (name === '03-catalogo') {
      await loc.evaluate(el => window.scrollTo(0, el.offsetTop - 74));
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
    } else {
      await loc.screenshot({ path: `${OUT}/${tag}-${name}.png` });
    }
  }

  // Interactive test: Filter + Search + Add to WhatsApp List + Free text item
  await page.locator('#catalogo').evaluate(el => window.scrollTo(0, el.offsetTop - 74));
  await page.locator('.chip[data-filter="clima"]').click();
  const climaCount = await page.locator('#results-count').textContent();

  await page.locator('#search-input').fill('pellet');
  const pelletCount = await page.locator('#results-count').textContent();

  // Add Sacco Pellet
  await page.locator('button[data-action="add"][data-id="sacco-pellet"]').click();
  // Reset filter & add Mogu Mogu
  await page.locator('#search-clear').click();
  await page.locator('.chip[data-filter="all"]').click();
  await page.locator('button[data-action="add"][data-id="mogu-mogu"]').click();

  // Add custom item
  if (tag === 'mobile') {
    await page.locator('.mobile-bottom-bar [data-open-drawer]').click();
    await page.waitForTimeout(350);
  }
  await page.locator('#custom-item-input').fill('Tergicristalli Fiat Panda');
  await page.locator('#custom-add-form button[type="submit"]').click();
  await page.locator('.when-opt[data-when="Domani"]').click();
  await page.waitForTimeout(200);

  if (tag === 'mobile') {
    await page.screenshot({ path: `${OUT}/${tag}-08-lista-wa.png` });
    await page.locator('#drawer-close').click();
    await page.waitForTimeout(250);
  } else {
    await page.locator('#richiesta-panel').screenshot({ path: `${OUT}/${tag}-08-lista-wa.png` });
  }

  const waHref = await page.locator('#wa-send').getAttribute('href');

  // DOM & Layout Audit
  const audit = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const overflowing = [...document.querySelectorAll('body *')]
      .filter(el => {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || el.classList.contains('skip-link')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1.5 || r.left < -1.5);
      })
      .slice(0, 10)
      .map(el => `${el.tagName}.${el.className} [${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)} / ${vw}]`);

    const brokenImgs = [...document.images]
      .filter(i => !i.complete || i.naturalWidth === 0)
      .map(i => i.getAttribute('src'));

    const missingAlt = [...document.images]
      .filter(i => !i.hasAttribute('alt') || i.getAttribute('alt').trim() === '')
      .map(i => i.getAttribute('src'));

    const nonAbsoluteAssets = [
      ...[...document.querySelectorAll('[src]')].map(e => e.getAttribute('src')),
      ...[...document.querySelectorAll('link[href]')].map(e => e.getAttribute('href'))
    ].filter(u => u && !u.startsWith('/bozze/muraiya-olbia/assets/') && !u.startsWith('https://'));

    const deadAnchors = [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute('href'))
      .filter(h => h.length > 1 && !document.querySelector(h));

    const loadedFonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family);

    return {
      vw,
      scrollW,
      overflowPx: scrollW - vw,
      overflowing,
      totalImgs: document.images.length,
      brokenImgs,
      missingAlt,
      nonAbsoluteAssets,
      deadAnchors,
      h1Count: document.querySelectorAll('h1').length,
      loadedFonts,
      liveBadge: document.querySelector('.live-badge .live-text')?.textContent
    };
  });

  report[tag] = {
    errs,
    badStatus,
    climaCount,
    pelletCount,
    waDecoded: decodeURIComponent(waHref || ''),
    ...audit
  };

  await ctx.close();
}

// Extra 320px narrow phone overflow check
{
  const ctx320 = await browser.newContext({ viewport: { width: 320, height: 700 }, isMobile: true });
  const p320 = await ctx320.newPage();
  await p320.route('**/*', route => route.request().url().includes('openstreetmap.org') ? route.fulfill({ status: 200, body: '' }) : route.continue());
  await p320.goto(baseUrl, { waitUntil: 'networkidle' });
  const w320 = await p320.evaluate(() => ({ vw: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth }));
  report.narrow320 = w320;
  await ctx320.close();
}

await browser.close();
server.close();

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
