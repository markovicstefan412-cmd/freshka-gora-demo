/* Pravi gotov sajt u docs/ (GitHub Pages) iz src/: node build.mjs */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, DEMO, productUrl } from './src/templates/parts.mjs';
import { homePage } from './src/templates/home.mjs';
import { shopPage, productPage, contactPage, notFoundPage } from './src/templates/pages.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs');

const data = JSON.parse(readFileSync(join(SRC, 'data/products.json'), 'utf8'));
const P = Object.fromEntries(data.products.map(p => [p.id, p]));
const C = Object.fromEntries(data.categories.map(c => [c.id, c]));

rmSync(OUT, { recursive: true, force: true });
const write = (path, html) => {
  const f = join(OUT, path);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
};

cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });
cpSync(join(SRC, 'site.webmanifest'), join(OUT, 'site.webmanifest'));
write('.nojekyll', '');

/* podaci za korpu, pretragu i brzi pregled na svakoj stranici */
const slim = {
  products: data.products.map(({ img, badge, ...p }) => ({ ...p, url: productUrl(p) })),
  categories: data.categories,
  slides: data.slides.map(s => ({ tint: s.tint, product: s.product }))
};
write('assets/js/data.js', '/* generisano iz src/data/products.json, ne menjati ručno */\nwindow.FG_DATA=' + JSON.stringify(slim) + ';\n');

const pages = [''];
write('index.html', homePage(data, P));
write('prodavnica/index.html', shopPage(data, P)); pages.push('prodavnica/');
write('kontakt/index.html', contactPage(data)); pages.push('kontakt/');
for (const p of data.products) {
  write(productUrl(p) + 'index.html', productPage(p, data, P, C));
  pages.push(productUrl(p));
}
write('404.html', notFoundPage(data, P));

write('robots.txt', DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Gotovo: ${pages.length} stranica u docs/`);
