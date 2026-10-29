/* Prodavnica, stranica proizvoda, kontakt i 404. */
import { SITE, esc, fmt, icon, pill, card, chips, sorter, crumbs, productUrl } from './parts.mjs';
import { head, header, footer, overlays, home } from './layout.mjs';
import { ORG, news } from './home.mjs';

const page = (root, active, cats, main, extra = '') =>
  header(root, active) + `
<main id="main" tabindex="-1">
${main}
</main>
` + footer(root, cats) + extra + overlays(root, cats);

/* ---------- prodavnica ---------- */
export function shopPage(data, P) {
  const root = '../';
  const n = data.products.length;
  const first = P[data.categories[2].cover];
  const main = `
<section class="page-hero" data-tint="sage" data-shop-hero>
  <div class="wrap page-hero-inner">
    <div class="page-hero-copy">
      ${crumbs([{ name: 'Početna', href: root }, { name: 'Prodavnica' }])}
      <p class="eyebrow">Prodavnica</p>
      <h1 class="h-sec page-title" data-shop-title>Sve iz <em>radionice</em></h1>
      <p class="lede" data-shop-intro>${n} proizvoda od bilja, meda, pčelinjeg voska i biljnih ulja, ručno rađenih na Fruškoj gori.</p>
    </div>
    <div class="page-hero-stage" aria-hidden="true">
      <div class="hero-blob"></div>
      ${pill('ph-pill')}
      <div class="ph-visual is-active" data-cover="${first.id}"><img src="${root}assets/img/p/${first.id}.webp" width="${first.img.w}" height="${first.img.h}" alt=""></div>
    </div>
  </div>
</section>

<section class="sec shop-sec" id="prodavnica" aria-labelledby="shop-label" data-shop data-limit="0">
  <div class="wrap">
    <h2 class="sr-only" id="shop-label">Proizvodi</h2>
    <div class="shop-bar">
      ${chips(data.categories)}
      <p class="shop-count" data-shop-count aria-hidden="true"></p>
      ${sorter('sort')}
    </div>
    <p class="sr-only" aria-live="polite" data-shop-status></p>
    <ul class="grid" data-grid>
      ${data.products.map((p, i) => card(p, root, { i })).join('\n      ')}
    </ul>
  </div>
</section>

${news}
`;
  const ld = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': SITE + 'prodavnica/', url: SITE + 'prodavnica/', name: 'Prodavnica | Freshka Gora', inLanguage: 'sr-Latn' },
      breadcrumbLd([['Početna', ''], ['Prodavnica', 'prodavnica/']])
    ]
  };
  return head({
    root, path: 'prodavnica/', title: 'Prodavnica | Freshka Gora, prirodna kozmetika',
    desc: `Svih ${n} proizvoda Freshka Gore: kreme, mleko za telo, melemi, sapuni, zubne paste, dezodoransi, šamponi i poklon paketi.`, ld
  }) + '\n' + page(root, 'shop', data.categories, main);
}

/* ---------- stranica proizvoda ---------- */
export function productPage(p, data, P, C) {
  const root = '../../';
  const c = C[p.cat];
  const shop = root + 'prodavnica/';
  const img = `${root}assets/img/p/${p.id}.webp`;
  const badge = p.badge ? `<span class="badge" data-tint="${p.badge.tint}">${esc(p.badge.text)}</span>` : '';
  /* ista kategorija prvo, pa dopuna da traka uvek ima bar 4 */
  let rel = data.products.filter(x => x.cat === p.cat && x.id !== p.id);
  if (rel.length < 4) rel = rel.concat(data.products.filter(x => x.cat !== p.cat && x.cat !== 'paketi').slice(0, 6 - rel.length));
  rel = rel.slice(0, 8);
  const sameCat = rel.every(x => x.cat === p.cat);

  const main = `
<section class="pp" data-tint="${p.tint}" data-product="${p.id}">
  <div class="wrap">
    ${crumbs([{ name: 'Početna', href: root }, { name: c.name, href: `${shop}#${c.id}` }, { name: p.name }])}
    <div class="pp-grid">
      <div class="pp-media${p.photo ? ' is-photo' : ''}">
        <div class="pp-blob" aria-hidden="true"></div>
        ${pill('pp-pill')}
        <div class="pp-visual"><img src="${img}" width="${p.img.w}" height="${p.img.h}" alt="${esc(p.alt)}" fetchpriority="high"></div>
        ${badge}
      </div>
      <div class="pp-info">
        <p class="eyebrow"><a href="${shop}#${c.id}">${esc(c.name)}</a></p>
        <h1 class="pp-title"><span class="ln"><span>${esc(p.name)}</span></span></h1>
        <p class="pp-short">${esc(p.short)}</p>
        <div class="pp-price">
          <span class="price">${fmt(p.price)}<small>RSD</small></span>
          <span class="pp-stock"><i aria-hidden="true"></i>Na stanju · isporuka za 3 do 5 dana</span>
        </div>
        <div class="pp-buy" data-pp-buy>
          <div class="qty" role="group" aria-label="Količina">
            <button type="button" data-pp-dec aria-label="Smanji količinu">${icon('minus')}</button>
            <output data-pp-qty>1</output>
            <button type="button" data-pp-inc aria-label="Povećaj količinu">${icon('plus')}</button>
          </div>
          <button class="btn btn-primary pp-add" type="button" data-pp-add="${p.id}">${icon('bag')}<span>Dodaj u korpu</span></button>
          <button class="heart" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="Dodaj u omiljene: ${esc(p.name)}">${icon('heart')}</button>
        </div>
        <div class="ship pp-ship" data-pp-ship></div>
        <ul class="pp-perks">
          <li>${icon('hand')}<span><b>Ručno rađeno</b> na Fruškoj gori</span></li>
          <li>${icon('cash')}<span><b>Pouzećem</b> ili uplatom na račun</span></li>
          <li>${icon('undo')}<span><b>Povrat novca</b> ako vam ne odgovara</span></li>
        </ul>
        <div class="pp-acc">
          <details class="qa" open>
            <summary>Opis<i>${icon('plus')}</i></summary>
            <p>${esc(p.short)} ${esc(p.desc)}</p>
          </details>
          ${p.ing ? `<details class="qa">
            <summary>Sastav<i>${icon('plus')}</i></summary>
            <p>${esc(p.ing)}</p>
          </details>` : ''}
          <details class="qa">
            <summary>Dostava i plaćanje<i>${icon('plus')}</i></summary>
            <p>Šaljemo Post Expressom, isporuka traje 3 do 5 dana. Za porudžbine preko 4.000 RSD dostava je besplatna. Plaćate pouzećem (dodatnih 150 RSD) ili uplatom na račun.</p>
          </details>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec related" aria-labelledby="rel-title">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><p class="eyebrow">${sameCat ? esc(c.name) : 'Iz radionice'}</p><h2 class="h-sec" id="rel-title">Možda vam se <em>dopadne i ovo</em></h2></div>
      <div class="rel-actions">
        <a class="link-arrow" href="${shop}#${c.id}">Sve iz kategorije ${icon('right')}</a>
        <div class="arrows">
          <button class="arrow" type="button" data-rail="-1" aria-label="Prethodni proizvodi" aria-controls="rel-rail">${icon('left')}</button>
          <button class="arrow" type="button" data-rail="1" aria-label="Sledeći proizvodi" aria-controls="rel-rail">${icon('right')}</button>
        </div>
      </div>
    </div>
    <ul class="rail" id="rel-rail">
      ${rel.map(x => card(x, root, { rail: true })).join('\n      ')}
    </ul>
  </div>
</section>
`;
  const buybar = `
<div class="buybar" data-buybar aria-hidden="true">
  <span class="li-img${p.photo ? ' is-photo' : ''}" data-tint="${p.tint}"><img src="${img}" alt="" loading="lazy"></span>
  <span class="buybar-txt"><b>${esc(p.name)}</b><span class="price">${fmt(p.price)}<small>RSD</small></span></span>
  <button class="btn btn-primary" type="button" data-add="${p.id}" tabindex="-1">${icon('bag')}Dodaj</button>
</div>`;
  const url = SITE + productUrl(p);
  const ld = {
    '@context': 'https://schema.org', '@graph': [
      {
        '@type': 'Product', '@id': url + '#proizvod', name: p.name, image: SITE + `assets/img/p/${p.id}.webp`,
        description: `${p.short} ${p.desc}`, category: c.name, brand: { '@type': 'Brand', name: 'Freshka Gora' },
        offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'RSD', availability: 'https://schema.org/InStock', url, seller: { '@id': SITE + '#org' } }
      },
      breadcrumbLd([['Početna', ''], [c.name, 'prodavnica/#' + c.id], [p.name, productUrl(p)]]),
      ORG
    ]
  };
  const desc = `${p.short} ${p.desc}`;
  return head({
    root, path: productUrl(p), title: `${p.name}, ${fmt(p.price)} RSD | Freshka Gora`,
    desc: desc.length > 158 ? desc.slice(0, 155).replace(/\s+\S*$/, '') + '...' : desc,
    image: `assets/img/p/${p.id}.webp`, imageAlt: p.alt, type: 'product', ld,
    preload: `<link rel="preload" as="image" href="${img}" fetchpriority="high">\n`
  }) + '\n' + page(root, '', data.categories, main, buybar);
}

/* ---------- kontakt ---------- */
export function contactPage(data) {
  const root = '../';
  const main = `
<section class="page-hero page-hero-sm" data-tint="lav">
  <div class="wrap page-hero-inner">
    <div class="page-hero-copy">
      ${crumbs([{ name: 'Početna', href: root }, { name: 'Kontakt' }])}
      <p class="eyebrow">Kontakt</p>
      <h1 class="h-sec page-title">Pišite <em>nam</em></h1>
      <p class="lede">Pitanje o proizvodu, porudžbini ili poklon paketu za firmu? Pošaljite poruku i javljamo se brzo.</p>
    </div>
  </div>
</section>

<section class="sec contact" aria-label="Kontakt forma" style="padding-top:clamp(40px,5cqi,72px)">
  <div class="wrap contact-grid">
    <form class="contact-form reveal" data-contact novalidate>
      <div class="form-grid">
        <div class="field"><label for="c-ime">Ime i prezime</label><input class="input" id="c-ime" name="ime" type="text" autocomplete="name" required></div>
        <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required></div>
        <fieldset class="field full seg-field"><legend>Tema</legend>
          <div class="seg">
            <label><input type="radio" name="tema" value="proizvod" checked><span>Proizvod</span></label>
            <label><input type="radio" name="tema" value="porudzbina"><span>Porudžbina</span></label>
            <label><input type="radio" name="tema" value="firme"><span>Za firme</span></label>
            <label><input type="radio" name="tema" value="drugo"><span>Nešto drugo</span></label>
          </div>
        </fieldset>
        <div class="field full"><label for="c-poruka">Poruka</label><textarea class="input" id="c-poruka" name="poruka" rows="5" required></textarea></div>
        <p class="err full" data-contact-err hidden>Popunite ime, ispravan email i poruku.</p>
        <div class="full"><button class="btn btn-primary" type="submit">${icon('mail')}Pošalji poruku</button></div>
      </div>
    </form>
    <aside class="contact-side reveal">
      <div class="contact-card" data-tint="butter">
        <p class="eyebrow">Pre nego što pišete</p>
        <p>Odgovori na najčešća pitanja o dostavi, plaćanju i povratu su na početnoj strani.</p>
        <a class="link-arrow" href="${home(root, 'pitanja')}">Česta pitanja ${icon('right')}</a>
      </div>
      <div class="contact-card" data-tint="sage">
        <p class="eyebrow">Pratite nas</p>
        <div class="social social-dark">
          <a href="https://www.facebook.com/FreshkaGora/" rel="noopener" target="_blank" aria-label="Freshka Gora na Facebooku">${icon('facebook')}</a>
          <a href="https://www.instagram.com/freshka_gora/" rel="noopener" target="_blank" aria-label="Freshka Gora na Instagramu">${icon('instagram')}</a>
          <a href="https://x.com/FreshkaGora" rel="noopener" target="_blank" aria-label="Freshka Gora na X mreži">${icon('x')}</a>
        </div>
      </div>
    </aside>
  </div>
</section>
`;
  return head({ root, path: 'kontakt/', title: 'Kontakt | Freshka Gora', desc: 'Pišite Freshka Gori: pitanja o proizvodima, porudžbinama i poklon paketima za firme.' })
    + '\n' + page(root, '', data.categories, main);
}

/* ---------- 404: GitHub Pages ga servira na bilo kojoj adresi, pa koren računamo u pregledaču ---------- */
export function notFoundPage(data, P) {
  const p = P['nevenova-mast'];
  const base = `<script>(function(){var s=location.pathname.split('/');var b=location.hostname.slice(-10)==='.github.io'&&s[1]?'/'+s[1]+'/':'/';document.write('<base href="'+b+'">');})();</script>\n`;
  const main = `
<section class="page-hero nf" data-tint="butter">
  <div class="wrap page-hero-inner">
    <div class="page-hero-copy">
      <p class="eyebrow">Greška 404</p>
      <h1 class="h-sec page-title">Ova staza <em>ne vodi nigde</em></h1>
      <p class="lede">Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu ili pogledajte prodavnicu.</p>
      <div class="nf-actions"><a class="btn btn-primary" href="./">Na početnu ${icon('right')}</a><a class="btn btn-ghost" href="prodavnica/">Prodavnica</a></div>
    </div>
    <div class="page-hero-stage" aria-hidden="true">
      <div class="hero-blob"></div>
      ${pill('ph-pill')}
      <div class="ph-visual is-active"><img src="assets/img/p/${p.id}.webp" width="${p.img.w}" height="${p.img.h}" alt=""></div>
    </div>
  </div>
</section>
`;
  return head({ root: '', path: '404.html', title: 'Stranica nije pronađena | Freshka Gora', desc: 'Stranica ne postoji.' })
    .replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n' + base)
    .replace('content="index, follow, max-image-preview:large"', 'content="noindex"')
    + '\n' + page('', '', data.categories, main).replace('href="#top" aria-label="Freshka Gora, početna"', 'href="./" aria-label="Freshka Gora, početna"');
}

function breadcrumbLd(items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })) };
}
