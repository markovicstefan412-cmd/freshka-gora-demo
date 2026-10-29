/* Početna: slider, kategorije, prodavnica, priča na skrol, o nama, poklon paketi, pitanja. */
import { SITE, esc, fmt, icon, stitches, pill, card, chips, sorter, plural, productUrl } from './parts.mjs';
import { head, header, footer, overlays } from './layout.mjs';

export const FAQ = [
  ['Koliko košta dostava?', 'Pakete šalje Post Express, a cena zavisi od težine: do 0,5 kg 420 RSD, do 1 kg 450 RSD, do 2 kg 500 RSD i do 5 kg 600 RSD. Za porudžbine preko 4.000 RSD dostava je besplatna.'],
  ['Za koliko dana stiže paket?', 'Isporuka obično traje od 3 do 5 dana od potvrde porudžbine.'],
  ['Kako mogu da platim?', 'Pouzećem, kuriru pri preuzimanju paketa (dodatnih 150 RSD), ili uplatom na račun. Kod uplate na račun paket šaljemo kad uplata stigne.'],
  ['Mogu li da vratim proizvod?', 'Da. Proizvod možete vratiti iz bilo kog razloga i dobijate novac nazad.'],
  ['Da li firme mogu da naruče?', 'Mogu. Pri porudžbini upišite podatke firme i dobićete fakturu sa tim podacima.'],
  ['Mogu li da promenim porudžbinu?', 'Pišite nam preko kontakt forme i navedite broj porudžbine, pa ćemo je izmeniti pre slanja.']
];

const ORG = {
  '@type': 'Organization', '@id': SITE + '#org', name: 'Freshka Gora', url: SITE, logo: SITE + 'assets/img/logo.png',
  description: 'Ručno rađena prirodna kozmetika od bilja, meda i voska, sa Fruške gore.',
  founder: { '@type': 'Person', name: 'Sanja Kun', jobTitle: 'diplomirani agronom' },
  sameAs: ['https://www.facebook.com/FreshkaGora/', 'https://www.instagram.com/freshka_gora/', 'https://x.com/FreshkaGora']
};

function hero(data, P) {
  const n = data.slides.length;
  const slides = data.slides.map((s, i) => {
    const p = P[s.product], on = i === 0, ti = on ? '' : ' tabindex="-1"';
    return `<article class="hero-slide${on ? ' is-active' : ''}" id="slide-${i + 1}" data-i="${i}" aria-roledescription="slajd" aria-label="${i + 1} od ${n}: ${esc(s.title.join(' '))}"${on ? '' : ' aria-hidden="true"'}>
        <p class="eyebrow">${esc(s.eyebrow)}</p>
        <h2 class="hero-title">${s.title.map(t => `<span class="ln"><span>${esc(t)}</span></span>`).join('')}</h2>
        <p class="hero-text">${esc(s.text)}</p>
        <div class="hero-buy">
          <span class="price">${fmt(p.price)}<small>RSD</small></span>
          <button class="btn btn-primary" type="button" data-add="${p.id}"${ti}>${icon('bag')}Dodaj u korpu</button>
          <a class="btn btn-ghost" href="${productUrl(p)}"${ti}>Detaljnije</a>
        </div>
      </article>`;
  }).join('\n      ');
  const visuals = data.slides.map((s, i) => `<div class="hero-visual${i === 0 ? ' is-active' : ''}" data-i="${i}">
        <img src="assets/img/hero/${s.visual.src}" width="${s.visual.w}" height="${s.visual.h}" alt=""${i === 0 ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>
      </div>`).join('\n      ');
  const thumbs = data.slides.map((s, i) => {
    const p = P[s.product];
    return `<button class="thumb" type="button" data-go="${i}" aria-label="Prikaži: ${esc(p.name)}" aria-current="${i === 0}"><img src="assets/img/p/${p.id}.webp" alt="" loading="lazy" width="${p.img.w}" height="${p.img.h}"></button>`;
  }).join('\n        ');
  return `<section class="hero" id="hero" data-tint="${data.slides[0].tint}" aria-roledescription="karusel" aria-label="Izdvojeni proizvodi">
  <div class="wrap hero-inner">
    <h1 class="hero-kicker">${icon('leaf', 'leaf')}Prirodna kozmetika, ručno rađena na Fruškoj gori</h1>

    <div class="hero-copy" aria-live="off" id="hero-copy">
      ${slides}
    </div>

    <div class="hero-stage" aria-hidden="true">
      <div class="hero-blob"></div>
      ${pill('hero-pill')}
      ${visuals}
    </div>

    <div class="hero-ctrl">
      <div class="arrows">
        <button class="arrow" type="button" data-prev aria-label="Prethodni proizvod" aria-controls="hero-copy">${icon('left')}</button>
        <button class="arrow" type="button" data-next aria-label="Sledeći proizvod" aria-controls="hero-copy">${icon('right')}</button>
      </div>
      <p class="counter" aria-hidden="true"><b data-cur>01</b> <span>/ ${String(n).padStart(2, '0')}</span></p>
      <div class="timer">
        <div class="timer-stitches" aria-hidden="true">${stitches(10)}</div>
        <button class="timer-btn" type="button" data-pause aria-pressed="false" aria-label="Zaustavi automatsko listanje">${icon('pause')}</button>
      </div>
      <div class="thumbs" role="group" aria-label="Izaberi proizvod">
        ${thumbs}
      </div>
    </div>
  </div>
</section>`;
}

const trust = `<section class="trust" aria-label="Zašto Freshka Gora">
  <ul class="wrap">
    <li>${icon('hand')}<p><strong>Ručno rađeno</strong><span>na Fruškoj gori</span></p></li>
    <li>${icon('leaf')}<p><strong>Prirodni sastojci</strong><span>bilje, med, vosak i ulja</span></p></li>
    <li>${icon('truck')}<p><strong>Besplatna dostava</strong><span>za porudžbine preko 4.000 RSD</span></p></li>
    <li>${icon('undo')}<p><strong>Povrat novca</strong><span>ako vam proizvod ne odgovara</span></p></li>
  </ul>
</section>`;

function categories(data, P) {
  return `<section class="sec" id="kategorije" aria-labelledby="cat-title">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><p class="eyebrow">Kategorije</p><h2 class="h-sec" id="cat-title">Šta vašoj koži <em>treba danas?</em></h2></div>
      <a class="link-arrow" href="prodavnica/">Cela prodavnica ${icon('right')}</a>
    </div>
    <div class="cats reveal">
      ${data.categories.map(c => {
        const p = P[c.cover], n = data.products.filter(x => x.cat === c.id).length;
        return `<a class="cat" href="prodavnica/#${c.id}" data-tint="${c.tint}" data-filter="${c.id}">
        <span class="cat-img"><img src="assets/img/p/${p.id}.webp" width="${p.img.w}" height="${p.img.h}" alt="" loading="lazy" decoding="async"${p.photo ? ' class="is-photo"' : ''}></span>
        <span class="cat-name"><b>${esc(c.name)}</b><span>${plural(n)}</span></span>
      </a>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`;
}

function shop(data) {
  return `<section class="sec" id="prodavnica" aria-labelledby="shop-title" style="padding-top:0" data-shop data-limit="8">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><p class="eyebrow">Prodavnica</p><h2 class="h-sec" id="shop-title">Sve iz <em>radionice</em></h2></div>
      <p class="lede">${data.products.length} proizvoda od bilja, meda, pčelinjeg voska i biljnih ulja. Kliknite na proizvod da vidite ceo sastav.</p>
    </div>
    <div class="shop-bar">
      ${chips(data.categories)}
      <p class="shop-count" data-shop-count aria-hidden="true"></p>
      ${sorter('sort')}
    </div>
    <p class="sr-only" aria-live="polite" data-shop-status></p>
    <ul class="grid" data-grid>
      ${data.products.map((p, i) => card(p, '', { i })).join('\n      ')}
    </ul>
    <div class="more-row"><a class="btn btn-ghost" href="prodavnica/" data-more>Prikaži sve proizvode (${data.products.length})</a></div>
  </div>
</section>`;
}

function story(P) {
  const p = P['nevenova-mast'];
  return `<section class="story" id="prica" aria-labelledby="story-title">
  <div class="story-track">
    <div class="wrap story-stage">
      <div class="story-copy">
        <p class="eyebrow" id="story-title">Kako je sve počelo</p>
        <ol class="beats">
          <li class="beat"><h3>U bašti je rastao neven.</h3><p>Sanja Kun, diplomirani agronom, od detinjstva šeta Fruškom gorom i upoznaje bilje. Njena koža je osetljiva, pa je krenula od nevena.</p></li>
          <li class="beat"><h3>Med, ulje i vosak već su bili tu.</h3><p>Vlastimir je prodavao maslinovo ulje, čajeve i med. Sve što je trebalo za prvu kremu bilo je u kući.</p></li>
          <li class="beat"><h3>Tako je nastala Nevenova mast.</h3><p>Krema koja je trebalo da prija jednoj osetljivoj koži postala je prvi proizvod Freshka Gore.</p></li>
        </ol>
        <div class="story-cta">
          <button class="btn btn-primary" type="button" data-add="${p.id}">${icon('bag')}${esc(p.name)} · ${fmt(p.price)} RSD</button>
          <a class="btn btn-ghost" href="#o-nama">Cela priča</a>
        </div>
        <div class="story-progress" aria-hidden="true">${stitches(12)}</div>
      </div>
      <div class="story-scene" aria-hidden="true">
        ${pill('story-pill')}
        <div class="story-el e-cal2"><img src="assets/img/herb/herb-calendula.webp" width="600" height="374" alt="" loading="lazy"></div>
        <div class="story-el e-dipper"><img src="assets/img/herb/herb-dipper.webp" width="261" height="219" alt="" loading="lazy"></div>
        <div class="story-el e-lav"><img src="assets/img/herb/herb-lavender.webp" width="256" height="288" alt="" loading="lazy"></div>
        <div class="story-el e-mint"><img src="assets/img/herb/herb-mint.webp" width="232" height="149" alt="" loading="lazy"></div>
        <div class="story-el story-jar"><img src="assets/img/p/${p.id}.webp" width="${p.img.w}" height="${p.img.h}" alt="" loading="lazy"></div>
        <div class="story-el e-cal1"><img src="assets/img/herb/herb-calendula.webp" width="600" height="374" alt="" loading="lazy"></div>
        <div class="story-el e-honey"><img src="assets/img/herb/herb-honeycomb.webp" width="203" height="211" alt="" loading="lazy"></div>
      </div>
    </div>
  </div>
</section>`;
}

const about = `<section class="sec" id="o-nama" aria-labelledby="about-title">
  <div class="wrap founder">
    <figure class="arch reveal">
      <div class="arch-img"><img src="assets/img/lavanda-polje.webp" width="1500" height="674" alt="Polje lavande u cvatu" loading="lazy" decoding="async"></div>
      <div class="arch-badge"><img src="assets/img/p/blago-licu-mom.webp" width="221" height="221" alt="Tegla melema Blago licu mom" loading="lazy"></div>
    </figure>
    <div class="founder-copy reveal">
      <p class="eyebrow">O nama</p>
      <h2 class="sr-only" id="about-title">Priča Freshka Gore</h2>
      <blockquote class="quote"><p>Od detinjstva sam uživala u šetnjama po Fruškoj gori i u skupljanju i upoznavanju bilja.</p></blockquote>
      <div class="cite"><span class="cite-mark">${icon('leaf')}</span><p><b>Sanja Kun</b><span>diplomirani agronom, osnivač</span></p></div>
      <div class="stitch-band" aria-hidden="true"></div>
      <p class="lede">Ručno rađeni proizvodi od prirodnih sastojaka, koji donose svežinu šuma i livada Fruške gore. Prvi je nastao iz ljubavi prema bilju i potrebe za kremom koja prija osetljivoj koži.</p>
      <div><a class="btn btn-primary" href="prodavnica/">Pogledaj proizvode ${icon('right')}</a></div>
    </div>
  </div>
</section>`;

function gifts(data) {
  return `<section class="sec gifts" id="pokloni" aria-labelledby="gift-title">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><p class="eyebrow">Poklon paketi</p><h2 class="h-sec" id="gift-title">Poklon koji <em>miriše na livadu</em></h2></div>
      <div class="arrows">
        <button class="arrow" type="button" data-rail="-1" aria-label="Prethodni paketi" aria-controls="gift-rail">${icon('left')}</button>
        <button class="arrow" type="button" data-rail="1" aria-label="Sledeći paketi" aria-controls="gift-rail">${icon('right')}</button>
      </div>
    </div>
    <ul class="rail" id="gift-rail">
      ${data.products.filter(p => p.cat === 'paketi').map(p => card(p, '', { rail: true })).join('\n      ')}
    </ul>
  </div>
</section>`;
}

export const faqBlock = (open = 0) => `<div class="reveal">
      ${FAQ.map(([q, a], i) => `<details class="qa"${i === open ? ' open' : ''}>
        <summary>${q}<i>${icon('plus')}</i></summary>
        <p>${a}</p>
      </details>`).join('\n      ')}
    </div>`;

const faq = `<section class="sec" id="pitanja" aria-labelledby="faq-title">
  <div class="wrap faq">
    <div class="faq-side reveal">
      <p class="eyebrow">Pitanja</p>
      <h2 class="h-sec" id="faq-title">Pre nego što <em>naručite</em></h2>
      <p class="lede">Nešto drugo vas zanima? Pišite nam preko kontakt forme i javljamo se brzo.</p>
      <div><a class="btn btn-ghost" href="kontakt/">Kontakt forma</a></div>
    </div>
    ${faqBlock()}
  </div>
</section>`;

export const news = `<section class="wrap" aria-labelledby="news-title">
  <div class="news reveal">
    <div class="stitch-band t" aria-hidden="true"></div>
    <div style="display:grid;gap:14px">
      <h2 class="h-sec" id="news-title">Novi proizvodi i akcije, <em>prvo kod vas</em></h2>
      <p class="lede">Jedan mejl kad izađe nešto novo. Bez gomile poruka.</p>
    </div>
    <form class="news-form" data-news novalidate>
      <div class="field"><label for="news-email">Vaša email adresa</label><input class="input" id="news-email" name="email" type="email" autocomplete="email" placeholder="ime@primer.rs" required></div>
      <button class="btn btn-primary" type="submit">Prijavi me</button>
      <p class="err" data-news-err hidden>Upišite ispravnu email adresu.</p>
    </form>
    <div class="stitch-band b" aria-hidden="true"></div>
  </div>
</section>`;

export function homePage(data, P) {
  const ld = {
    '@context': 'https://schema.org', '@graph': [
      ORG,
      { '@type': 'WebSite', '@id': SITE + '#website', url: SITE, name: 'Freshka Gora', inLanguage: 'sr-Latn', publisher: { '@id': SITE + '#org' } },
      { '@type': 'ItemList', '@id': SITE + '#proizvodi', name: 'Prirodna kozmetika Freshka Gora', numberOfItems: data.products.length,
        itemListElement: data.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + productUrl(p), name: p.name })) },
      { '@type': 'FAQPage', '@id': SITE + '#pitanja', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  };
  const s0 = data.slides[0].visual;
  return head({
    root: '', path: '', title: 'Freshka Gora | Prirodna kozmetika ručno rađena na Fruškoj gori',
    desc: 'Ručno rađena prirodna kozmetika sa Fruške gore: melemi, kreme, sapuni, dezodoransi i zubne paste od bilja, meda i voska. Besplatna dostava preko 4.000 RSD.',
    ld, preload: `<link rel="preload" as="image" href="assets/img/hero/${s0.src}" fetchpriority="high">\n`
  }) + '\n' + header('', '') + `
<main id="main" tabindex="-1">

${hero(data, P)}

${trust}

${categories(data, P)}

${shop(data)}

${story(P)}

${about}

${gifts(data)}

${faq}

${news}

</main>
` + footer('', data.categories) + overlays('', data.categories);
}

export { ORG };
