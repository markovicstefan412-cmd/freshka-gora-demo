/* Okvir svake stranice: head, header, footer i slojevi (korpa, meni, brzi pregled, pretraga). */
import { SITE, DEMO, esc, icon } from './parts.mjs';

/* link ka sekciji početne strane: na početnoj samo #, drugde preko korena */
export const home = (root, hash) => (root ? root : '') + (hash ? '#' + hash : root ? '' : './');

export function head({ root, path, title, desc, image = 'assets/img/og-image.jpg', imageAlt = 'Melem Blago licu mom sa lavandom i medom, Freshka Gora', type = 'website', ld, preload = '' }) {
  const url = SITE + path;
  const img = SITE + image;
  return `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${DEMO ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<meta name="author" content="Freshka Gora">
<meta name="theme-color" content="#F4F6EF">
<meta name="format-detection" content="telephone=no">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Freshka Gora">
<meta property="og:locale" content="sr_RS">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@FreshkaGora">
<link rel="icon" type="image/png" sizes="32x32" href="${root}assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="${root}assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="preload" href="${root}assets/fonts/fraunces-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/figtree-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${root}assets/css/fonts.css">
<link rel="stylesheet" href="${root}assets/css/style.css">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ''}</head>`;
}

const NAV = [
  { key: 'shop', name: 'Prodavnica', href: r => r + 'prodavnica/' },
  { key: 'cats', name: 'Kategorije', href: r => home(r, 'kategorije') },
  { key: 'story', name: 'Naša priča', href: r => home(r, 'prica') },
  { key: 'gifts', name: 'Poklon paketi', href: r => home(r, 'pokloni') },
  { key: 'faq', name: 'Pitanja', href: r => home(r, 'pitanja') }
];

export function header(root, active) {
  return `<body data-root="${root}">
<a class="skip" href="#main">Preskoči na sadržaj</a>
<div class="fg-page" id="top">

<p class="announce">Besplatna dostava za porudžbine preko <strong>4.000 RSD</strong> · Plaćanje pouzećem</p>

<header class="site-header" id="header">
  <div class="wrap hdr">
    <button class="icon-btn menu-btn" type="button" aria-label="Otvori meni" aria-controls="mmenu" aria-expanded="false" data-open="mmenu">${icon('menu')}</button>
    <a class="logo" href="${root ? root : '#top'}" aria-label="Freshka Gora, početna">
      <img src="${root}assets/img/logo.webp" width="400" height="160" alt="Freshka Gora">
    </a>
    <nav class="nav" aria-label="Glavna navigacija">
      ${NAV.map(n => `<a href="${n.href(root)}"${n.key === active ? ' aria-current="page"' : ''}>${n.name}</a>`).join('\n      ')}
    </nav>
    <div class="hdr-actions">
      <button class="icon-btn" type="button" aria-label="Pretraga" aria-controls="search" aria-expanded="false" data-open="search">${icon('search')}</button>
      <button class="icon-btn wish-btn" type="button" aria-label="Omiljeni proizvodi" data-show-wish>${icon('heart')}<span class="count" data-wish-count data-n="0">0</span></button>
      <button class="icon-btn" type="button" aria-label="Korpa" aria-controls="cart" aria-expanded="false" data-open="cart">${icon('bag')}<span class="count" data-cart-count data-n="0">0</span></button>
    </div>
  </div>
</header>
`;
}

export function footer(root, cats) {
  const shop = root + 'prodavnica/';
  return `
<footer class="footer">
  <div class="wrap">
    <div class="f-top">
      <div class="f-brand">
        <a class="logo logo-light" href="${root ? root : '#top'}" aria-label="Freshka Gora, početna"><img src="${root}assets/img/logo.webp" width="400" height="160" alt="Freshka Gora" loading="lazy"></a>
        <p>Ručno rađeni proizvodi od prirodnih sastojaka, sa Fruške gore.</p>
        <div class="social">
          <a href="https://www.facebook.com/FreshkaGora/" rel="noopener" target="_blank" aria-label="Freshka Gora na Facebooku">${icon('facebook')}</a>
          <a href="https://www.instagram.com/freshka_gora/" rel="noopener" target="_blank" aria-label="Freshka Gora na Instagramu">${icon('instagram')}</a>
          <a href="https://x.com/FreshkaGora" rel="noopener" target="_blank" aria-label="Freshka Gora na X mreži">${icon('x')}</a>
        </div>
      </div>
      <nav class="f-col" aria-label="Kategorije">
        <h3>Prodavnica</h3>
        <ul>${cats.map(c => `<li><a href="${shop}#${c.id}" data-filter="${c.id}">${esc(c.name)}</a></li>`).join('')}</ul>
      </nav>
      <nav class="f-col" aria-label="Pomoć">
        <h3>Pomoć</h3>
        <ul>
          <li><a href="${home(root, 'pitanja')}">Dostava i cene</a></li>
          <li><a href="${home(root, 'pitanja')}">Načini plaćanja</a></li>
          <li><a href="${home(root, 'pitanja')}">Povrat proizvoda</a></li>
          <li><a href="${root}kontakt/">Kontakt</a></li>
        </ul>
      </nav>
      <nav class="f-col" aria-label="O nama">
        <h3>Freshka Gora</h3>
        <ul>
          <li><a href="${home(root, 'prica')}">Kako je sve počelo</a></li>
          <li><a href="${home(root, 'o-nama')}">O nama</a></li>
          <li><a href="${home(root, 'pokloni')}">Poklon paketi</a></li>
          <li><a href="https://www.freshkagora.rs/info/opsti-uslovi-poslovanja">Uslovi korišćenja</a></li>
          <li><a href="https://www.freshkagora.rs/info/privatnost">Politika privatnosti</a></li>
        </ul>
      </nav>
    </div>
    <div class="f-bottom">
      <p>© 2026 Freshka Gora. Sva prava zadržana.</p>
      <p>Plaćanje pouzećem ili uplatom na račun · Dostava Post Express</p>
    </div>
  </div>
</footer>
</div>`;
}

export function overlays(root, cats) {
  const shop = root + 'prodavnica/';
  return `
<!-- slojevi: korpa, brzi pregled, pretraga, meni, obaveštenje -->
<div class="scrim" data-scrim></div>

<aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true">
  <div class="drawer-head">
    <h2 id="cart-title" data-cart-title>Korpa</h2>
    <button class="icon-btn" type="button" data-close aria-label="Zatvori korpu">${icon('close')}</button>
  </div>
  <div class="drawer-body" data-cart-body></div>
  <div class="drawer-foot" data-cart-foot></div>
</aside>

<aside class="drawer left" id="mmenu" role="dialog" aria-modal="true" aria-label="Meni" aria-hidden="true">
  <div class="drawer-head">
    <img src="${root}assets/img/logo.webp" width="400" height="160" alt="Freshka Gora" style="height:40px;width:auto" loading="lazy">
    <button class="icon-btn" type="button" data-close aria-label="Zatvori meni">${icon('close')}</button>
  </div>
  <div class="drawer-body">
    <nav class="mnav" aria-label="Mobilna navigacija">
      ${NAV.map(n => `<a href="${n.href(root)}" data-close>${n.name} ${icon('right')}</a>`).join('\n      ')}
      <a href="${root}kontakt/" data-close>Kontakt ${icon('right')}</a>
    </nav>
    <div class="mcats">${cats.map(c => `<a class="chip" href="${shop}#${c.id}" data-filter="${c.id}" data-close>${esc(c.name)}</a>`).join('')}</div>
  </div>
</aside>

<div class="modal" id="qv" role="dialog" aria-modal="true" aria-labelledby="qv-title" aria-hidden="true">
  <div class="modal-card" data-qv-card>
    <button class="icon-btn modal-close" type="button" data-close aria-label="Zatvori">${icon('close')}</button>
    <div class="qv-media" data-qv-media><img src="${root}assets/img/p/venvital.webp" alt="" data-qv-img></div>
    <div class="qv-body">
      <p class="eyebrow" data-qv-cat></p>
      <h2 id="qv-title" data-qv-name></h2>
      <span class="price" data-qv-price></span>
      <p class="lede" data-qv-desc></p>
      <div class="qv-ing" data-qv-ing><b>Sastav</b><span></span></div>
      <div class="qv-buy">
        <div class="qty" role="group" aria-label="Količina">
          <button type="button" data-qv-dec aria-label="Smanji količinu">${icon('minus')}</button>
          <output data-qv-qty>1</output>
          <button type="button" data-qv-inc aria-label="Povećaj količinu">${icon('plus')}</button>
        </div>
        <button class="btn btn-primary" type="button" data-qv-add>${icon('bag')}Dodaj u korpu</button>
        <button class="heart" type="button" data-qv-wish aria-pressed="false" aria-label="Dodaj u omiljene" style="position:static;box-shadow:inset 0 0 0 1.5px var(--line)">${icon('heart')}</button>
      </div>
      <a class="link-arrow qv-more" href="#" data-qv-link>Sve o proizvodu ${icon('right')}</a>
    </div>
  </div>
</div>

<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Pretraga proizvoda" aria-hidden="true">
  <div class="search-inner">
    <div class="search-row">
      <label class="sr-only" for="search-input">Pretraži proizvode</label>
      <input class="input" id="search-input" type="search" placeholder="Pretraži: neven, lavanda, sapun..." autocomplete="off" data-search>
      <button class="icon-btn" type="button" data-close aria-label="Zatvori pretragu">${icon('close')}</button>
    </div>
    <div class="results" data-results aria-live="polite"></div>
  </div>
</div>

<div class="toast" role="status" aria-live="polite" data-toast><span class="toast-img"><img alt="" data-toast-img></span><span data-toast-text></span><button type="button" data-open="cart">Korpa</button></div>

<script src="${root}assets/js/data.js" defer></script>
<script src="${root}assets/js/app.js" defer></script>
</body>
</html>
`;
}
