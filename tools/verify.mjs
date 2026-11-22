import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require('/usr/local/lib/node_modules/@playwright/mcp/node_modules/playwright-core');

const ROOT = '/config/work/istentales-alghero/site';
const OUT = '/config/work/istentales-alghero/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u === '/' || u === '/bozze/istentales-alghero' || u === '/bozze/istentales-alghero/') u = '/bozze/istentales-alghero/index.html';
  const fp = path.join(ROOT, u);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/bozze/istentales-alghero/`;

const execPath = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch({ headless: true, executablePath: execPath, args: ['--no-sandbox'] });

const report = {};
for (const [name, vw, vh] of [['desktop', 1440, 900], ['mobile', 390, 844], ['narrow320', 320, 680]]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } });
  const badStatus = [];
  const errs = [];
  page.on('response', (r) => { if (r.status() >= 400 && r.url().includes('127.0.0.1')) badStatus.push(`${r.status()} ${r.url()}`); });
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
    await document.fonts.ready;
  });
  await page.waitForTimeout(700);

  if (name !== 'narrow320') {
    await page.screenshot({ path: path.join(OUT, `${name}-01-hero.png`), fullPage: false });
    await page.locator('#oasi').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}-02-oasi.png`), fullPage: false });
    await page.locator('#camere').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}-03-camere.png`), fullPage: false });
    await page.locator('#colazione').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}-04-colazione.png`), fullPage: false });
    await page.locator('#recensioni').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}-05-recensioni.png`), fullPage: false });
    await page.locator('#prenota').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}-06-prenota.png`), fullPage: false });
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // Test interactive tabs + quote builder
  await page.locator('.btab[data-tab="salata"]').click();
  const salataActive = await page.locator('#panel-salata').evaluate((el) => el.classList.contains('is-active'));
  await page.locator('.btab[data-tab="dolce"]').click();
  await page.fill('#q-name', 'Marco e Giulia');
  await page.check('#q-ebike');
  const waHref = await page.locator('#btn-send-wa').getAttribute('href');

  const metrics = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return {
      vw: window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
      overflowPx: document.documentElement.scrollWidth - window.innerWidth,
      totalImgs: imgs.length,
      brokenImgs: imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
      loadedFonts: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))]
    };
  });
  report[name] = { ...metrics, badStatus, errs, salataActive, waOk: waHref.includes('393294324502') && waHref.includes('Marco') && waHref.includes('E-Bike') };
  await page.close();
}

await browser.close();
server.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
