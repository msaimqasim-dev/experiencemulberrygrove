import fs from 'node:fs/promises';
import { chromium } from 'playwright';

await fs.mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const original = await fs.readFile('/tmp/mulberry-source.html', 'utf8');
const privacy = await fs.readFile('/tmp/mulberry-privacy.html', 'utf8');

const source = await page.evaluate(({ original, privacy }) => {
  const parse = (html) => new DOMParser().parseFromString(html, 'text/html');
  const doc = parse(original);
  const privacyDoc = parse(privacy);
  const clean = (s) => s.replace(/[\u0000-\u0008]/g, '').replace(/\s+/g, ' ').trim();
  const sections = {};
  for (const id of ['vision', 'community', 'location', 'residential', 'retail', 'contact']) {
    const el = doc.getElementById(`${id}-section`);
    const section = el?.closest('section');
    sections[id] = [...(section?.querySelectorAll('h1,h2,h3,p,li,label') ?? [])]
      .filter((el) => el.children.length === 0 || ['H1','H2','H3','P'].includes(el.tagName))
      .map((el) => ({ tag: el.tagName.toLowerCase(), text: clean(el.textContent ?? '') }))
      .filter((el) => el.text);
  }
  return {
    sections,
    links: [...doc.querySelectorAll('a[href]')].map((el) => ({ href: el.getAttribute('href'), text: clean(el.textContent ?? '') })),
    assets: [...new Set([...doc.querySelectorAll('img,video,source')].flatMap((el) => ['src','poster','data-lazy-src'].map((a) => el.getAttribute(a)).filter((a) => a && !a.startsWith('data:'))))],
    privacyHtml: (privacyDoc.querySelector('main .entry-content') ?? privacyDoc.querySelector('main article') ?? privacyDoc.querySelector('main'))?.innerHTML,
    privacyText: clean(privacyDoc.querySelector('main')?.textContent ?? ''),
    privacyElements: [...(privacyDoc.querySelector('main')?.querySelectorAll('h1,h2,h3,h4,p,li') ?? [])].map((el) => ({ tag: el.tagName.toLowerCase(), text: clean(el.textContent ?? '') })).filter((el) => el.text),
  };
}, { original, privacy });
await fs.writeFile('artifacts/source-audit.json', JSON.stringify(source, null, 2));
console.log('SOURCE SECTIONS', JSON.stringify(source.sections, null, 2));
console.log('PRIVACY', JSON.stringify(source.privacyElements, null, 2));

const errors = [];
const failed = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('requestfailed', (r) => failed.push({ url: r.url(), error: r.failure()?.errorText }));
await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
await page.screenshot({ path: 'artifacts/baseline-desktop.png' });
await page.evaluate(() => { document.querySelectorAll('img').forEach((el) => el.loading = 'eager'); });
await page.waitForTimeout(3000);
const images = await page.locator('img').evaluateAll((els) => els.map((el) => ({
  src: el.currentSrc,
  complete: el.complete,
  width: el.naturalWidth,
  height: el.naturalHeight,
  frame: { w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height },
})));
console.log('BROWSER ERRORS', errors);
console.log('FAILED REQUESTS', failed);
console.log('BAD IMAGES', images.filter((el) => !el.width));
await fs.writeFile('artifacts/baseline-media.json', JSON.stringify({ images, errors, failed }, null, 2));
await browser.close();