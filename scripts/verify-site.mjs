import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

await fs.mkdir('artifacts', { recursive: true });
const source = JSON.parse(await fs.readFile('artifacts/source-audit.json', 'utf8'));
const copy = JSON.parse(await fs.readFile('src/data/clientCopy.json', 'utf8'));
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failures = [];
const errors = [];
const report = { sourceCopy: [], navigation: [], media: {}, responsive: [], dialogs: [] };
page.on('pageerror', (e) => errors.push(e.message));
page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) failures.push({ url: r.url(), status: r.status() }); });

const visit = async (selector) => {
  await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(1200);
};
const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1800);
await page.screenshot({ path: 'artifacts/final-desktop.png' });

const nav = page.getByRole('navigation', { name: 'Primary Navigation' });
const navigation = [
  ['Vision', 'vision'], ['Residential', 'residential'], ['Community', 'community'],
  ['Retail', 'retail'], ['Contact Us', 'contact'],
];
assert.deepEqual(await nav.getByRole('link').allTextContents(), navigation.map(([label]) => label));
for (const [label, id] of navigation) {
  const link = nav.getByRole('link', { name: label, exact: true });
  assert(await link.isVisible(), `${label} missing on desktop`);
  const style = await link.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderWidth }));
  assert.equal(style.bg, 'rgba(0, 0, 0, 0)');
  assert.equal(style.border, '0px');
  await link.click();
  await page.waitForTimeout(1600);
  assert.equal(await link.getAttribute('aria-current'), 'location');
  const position = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
  const headerHeight = await page.locator('header').evaluate((el) => el.getBoundingClientRect().height);
  assert(Math.abs(position - headerHeight) < 12, `${label} anchor hidden or misaligned: ${position}`);
  report.navigation.push({ label, position, headerHeight, transparent: true });
}
assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).isVisible(), false);

await page.evaluate(() => document.querySelectorAll('img').forEach((el) => el.loading = 'eager'));
await page.waitForTimeout(1000);
const media = await page.locator('img').evaluateAll((images) => images.map((el) => ({
  alt: el.alt, complete: el.complete, width: el.naturalWidth, height: el.naturalHeight,
  bundled: el.currentSrc.startsWith('data:'),
  frameWidth: el.getBoundingClientRect().width, frameHeight: el.getBoundingClientRect().height,
})));
assert(media.every((i) => i.complete && i.width > 0), 'An image failed to decode');
assert(media.every((i) => i.frameWidth > 0 && i.frameHeight > 0), 'An image has a collapsed frame');
report.media = { count: media.length, broken: media.filter((i) => !i.width), allBundled: media.every((i) => i.bundled) };
assert(report.media.allBundled);

const text = normalize(await page.locator('body').innerText());
for (const section of ['vision', 'community', 'location', 'residential', 'retail']) {
  const paragraph = source.sections[section].find((e) => e.tag === 'p').text;
  const sectionText = section === 'vision' ? normalize((await page.locator('#vision p').allTextContents()).join(' ')) : text;
  assert(sectionText.includes(normalize(paragraph)), `Missing or changed ${section} paragraph`);
  report.sourceCopy.push(section);
}
for (const section of ['stoneMartin', 'greystone']) {
  assert(text.includes(normalize(copy[section].paragraph)), `Missing builder copy: ${section}`);
  report.sourceCopy.push(section);
}
for (const phrase of ['168 ac', 'nature preserve', 'golf', 'south metro', 'has been added for', 'your submission has been received']) assert(!text.includes(phrase), `Unsupported copy: ${phrase}`);
for (const value of ['706.221.3632', '706.786.6700', '706.801.4265', '478-368-5350', 'Explore Available Homes', 'Now Leasing']) assert(text.includes(normalize(value)), `Client update missing: ${value}`);
assert(!/\b\d+\s+homesites?\s+remaining\b|delivering\s+2023/i.test(text));
const stoneMartin = 'https://www.stonemartinbuilders.com/find-my-home/harris-county/mulberry-grove';
const greystone = 'https://greystoneproperties.net/mulberry-grove';
assert.equal(await page.locator(`#residential a[href="${stoneMartin}"]`).count(), 1);
assert.equal(await page.locator(`#residential a[href="${greystone}"]`).count(), 1);
for (const scope of ['#residential', 'footer']) {
  assert.equal(await page.locator(`${scope} a[href="tel:4783685350"]`).textContent(), '478-368-5350');
}

await nav.getByRole('button', { name: 'Masterplan', exact: true }).click();
await page.getByRole('dialog', { name: 'Mulberry Grove Master Plan', exact: true }).waitFor();
assert(await page.getByRole('img', { name: 'Mulberry Grove Master Plan', exact: true }).evaluate((el) => el.naturalWidth > 0));
await page.screenshot({ path: 'artifacts/final-masterplan-fit.png' });
await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
await page.waitForTimeout(400);
assert(await page.getByRole('dialog').getByText('150%', { exact: true }).isVisible());
await page.screenshot({ path: 'artifacts/final-masterplan.png' });
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('dialog').count(), 0);
report.dialogs.push('Masterplan: decodes, zooms, closes');

await visit('#location');
await page.getByRole('button', { name: 'Open Mulberry Grove Location Map', exact: true }).click();
await page.getByRole('dialog', { name: 'Mulberry Grove Location Map', exact: true }).waitFor();
await page.screenshot({ path: 'artifacts/final-map-fit.png' });
await page.getByRole('button', { name: 'Zoom in map', exact: true }).click();
await page.waitForTimeout(400);
assert(await page.getByRole('dialog').getByText('150%', { exact: true }).isVisible());
await page.screenshot({ path: 'artifacts/final-map.png' });
await page.keyboard.press('Escape');
report.dialogs.push('Location map: decodes, zooms, closes');

await visit('#contact');
await page.getByRole('tab', { name: 'Community Guide', exact: true }).click();
for (let index = 0; index < 4; index++) {
  const question = page.locator('[aria-controls^="community-guide-"]').nth(index);
  await question.click();
  assert.equal(await question.getAttribute('aria-expanded'), index === 0 ? 'false' : 'true');
}
await page.getByRole('tab', { name: 'Directory', exact: true }).click();
assert.equal(await page.locator('#contact article').count(), 3);
assert(await page.locator('#contact').getByText('April Durham', { exact: true }).isVisible());
assert(await page.locator('#contact').getByText('Greystone Leasing Office', { exact: true }).isVisible());
assert.equal((await page.locator('#contact a[href="tel:7062217175"]').textContent()).trim(), '706.221.7175');
assert.equal(await page.locator(`#contact a[href="${stoneMartin}"]`).count(), 1);
assert.equal(await page.locator(`#contact a[href="${greystone}"]`).count(), 1);
assert.equal((await page.locator('#contact a[href="tel:4783685350"]').textContent()).trim(), '478-368-5350');
await page.getByRole('tab', { name: 'Get Connected', exact: true }).click();
assert.equal(await page.locator('#mg-email').getAttribute('type'), 'email');
assert.equal(await page.locator('#mg-comments').getAttribute('maxlength'), '300');
const invalid = await page.locator('#contact form').evaluate((form) => !form.checkValidity());
assert(invalid, 'Empty form must be invalid');
assert.equal(await page.locator('#contact a').filter({ hasText: 'Join our email list' }).getAttribute('href'), 'https://experiencemulberrygrove.com/#contact');

assert.equal(await page.locator('#contact').getByRole('link', { name: 'Privacy Policy', exact: true }).getAttribute('href'), '/privacy-policy/');
await page.locator('footer').getByRole('link', { name: 'Privacy Policy', exact: true }).click();
await page.waitForURL('**/privacy-policy/');
assert.equal((await page.reload()).status(), 200);
const policy = page.locator('main');
assert.equal(await policy.locator('h3').count(), 8);
assert(await policy.evaluate((main, html) => {
  const original = new DOMParser().parseFromString(`<main>${html}</main>`, 'text/html');
  return main.innerHTML.trim() === original.querySelector('main').innerHTML.trim();
}, source.privacyHtml), 'Original legal headings, paragraphs, lists, or links differ');
for (const width of [1440, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Policy overflow at ${width}px`);
}
report.privacyPage = 'Dedicated route, reload, exact original legal markup, responsive widths verified';
await page.setViewportSize({ width: 1440, height: 1000 });
await page.getByRole('link', { name: 'Home', exact: true }).click();
await page.waitForURL('http://localhost:4173/');

for (const [id, file] of [['vision','vision'],['location','location'],['residential','residential'],['retail','retail']]) {
  await visit(`#${id}`);
  await page.screenshot({ path: `artifacts/final-${file}.png` });
}

for (const width of [1440, 1024, 768, 390, 360]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(650);
  const horizontal = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  assert(horizontal.document <= horizontal.viewport + 1, `Horizontal overflow at ${width}: ${horizontal.document}`);
  if (width >= 1024) assert(await nav.getByRole('link', { name: 'Community', exact: true }).isVisible());
  else assert(await page.getByRole('button', { name: 'Open menu', exact: true }).isVisible());
  report.responsive.push({ width, ...horizontal });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('link', { name: 'Mulberry Grove home', exact: true }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: 'artifacts/final-mobile.png' });
await page.getByRole('button', { name: 'Open menu', exact: true }).click();
await page.waitForTimeout(600);
const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation', exact: true });
assert.equal(await page.locator('#mobile-navigation').getByRole('link', { name: 'Privacy Policy', exact: true }).getAttribute('href'), '/privacy-policy/');
assert.deepEqual(await mobileNav.getByRole('link').evaluateAll((links) => links.map((link) => [
  link.querySelector('span').textContent, link.hash,
])), navigation.map(([label, id]) => [label, `#${id}`]));
await page.screenshot({ path: 'artifacts/final-mobile-menu.png' });
for (const [, id] of navigation) {
  await mobileNav.locator(`a[href="#${id}"]`).click();
  await page.waitForTimeout(1600);
  assert.equal(await page.getByRole('dialog', { name: 'Site Menu' }).count(), 0);
  assert.equal(new URL(page.url()).hash, `#${id}`);
  if (id !== 'contact') await page.getByRole('button', { name: 'Open menu', exact: true }).click();
}
await visit('#location');
await page.screenshot({ path: 'artifacts/final-mobile-location.png' });

assert.equal(errors.length, 0, JSON.stringify(errors));
assert.equal(failures.length, 0, JSON.stringify(failures));
report.runtimeErrors = errors;
report.localResourceFailures = failures;
await fs.writeFile('artifacts/final-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
