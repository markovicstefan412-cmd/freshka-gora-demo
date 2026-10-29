/* Delovi koji se ponavljaju: ikonice, kartica proizvoda, filteri, redosled, mrvice. */
import { PILL_PATH } from './pattern.mjs';

export const SITE = 'https://www.freshkagora.rs/';
/* demo na GitHub Pages ne treba da se pojavi u Google pretrazi; za pravi sajt staviti false */
export const DEMO = true;
export const FREE = 4000;

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const PATHS = {
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  bag: '<path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  chevron: '<path d="M6 9.5l6 6 6-6"/>',
  chevronR: '<path d="M9.5 6l6 6-6 6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  hand: '<path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V5.5a1.5 1.5 0 0 1 3 0V10M13 10V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.7-2.3L4 15.2a1.6 1.6 0 0 1 2.4-2.1L7 13.7V11"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  undo: '<path d="M9 14l-4-4 4-4"/><path d="M5 10h9a5 5 0 0 1 0 10h-3"/>',
  cash: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
  facebook: '<path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.7-3.5h-3.2V8.6c0-.3.2-.6.5-.6z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  x: '<path d="M5 4.5l14 15M19 4.5l-14 15"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7.5l7.5 6 7.5-6"/>',
  /* ikonice za redosled */
  sortPop: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
  sortAsc: '<path d="M4 7h6M4 12h8M4 17h10"/><path d="M18.5 19V5M15.5 8l3-3 3 3"/>',
  sortDesc: '<path d="M4 7h10M4 12h8M4 17h6"/><path d="M18.5 5v14M15.5 16l3 3 3-3"/>',
  sortAz: '<path d="M3.5 18l3.5-10 3.5 10M4.8 14.5h4.4"/><path d="M14 8h6l-6 10h6"/>'
};
export const icon = (n, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[n]}</svg>`;
export const stitch = (on = false) => `<svg class="stitch${on ? ' on' : ''}" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>`;
export const stitches = n => Array.from({ length: n }, () => stitch()).join('');
export const pill = cls => `<div class="${cls}"><svg viewBox="0 -20 190 470" fill="none" aria-hidden="true" focusable="false"><path d="${PILL_PATH}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>`;

export const productUrl = p => `kupi/${p.slug}/`;
/* 1 proizvod, 2 proizvoda, 11 proizvoda, 21 proizvod */
export const plural = n => n + (n % 10 === 1 && n % 100 !== 11 ? ' proizvod' : ' proizvoda');

/* kartica proizvoda: u mreži (sa podacima za filter) ili u traci (rail); poklon paketi imaju belu podlogu */
export function card(p, root, { i = 0, rail = false } = {}) {
  const url = root + productUrl(p);
  const gift = rail && p.cat === 'paketi';
  const badge = p.badge ? `<span class="badge" data-tint="${p.badge.tint}">${esc(p.badge.text)}</span>` : '';
  const attrs = rail ? `class="card${gift ? ' gift' : ''}" data-id="${p.id}"` : `class="card" data-id="${p.id}" data-cat="${p.cat}" data-price="${p.price}" data-i="${i}"`;
  return `<li ${attrs}>
        <div class="card-fig">
          <a class="card-media${p.photo ? ' is-photo' : ''}"${gift ? '' : ` data-tint="${p.tint}"`} href="${url}" tabindex="-1" aria-hidden="true"><img src="${root}assets/img/p/${p.id}.webp" width="${p.img.w}" height="${p.img.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></a>${badge}
          <button class="heart" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="Dodaj u omiljene: ${esc(p.name)}">${icon('heart')}</button>
          <button class="qv-btn" type="button" data-qv="${p.id}" aria-label="Brzi pregled: ${esc(p.name)}">${icon('eye')}<span>Brzi pregled</span></button>
        </div>
        <div class="card-body">
          <h3 class="card-name"><a href="${url}">${esc(p.name)}</a></h3>
          <p class="card-short">${esc(p.short)}</p>
          <span class="price">${fmt(p.price)}<small>RSD</small></span>
          <button class="add" type="button" data-add="${p.id}" aria-label="Dodaj u korpu: ${esc(p.name)}">${icon('plus')}<span class="add-label">Dodaj</span></button>
        </div>
      </li>`;
}

/* filteri po kategoriji; na stranicama bez mreže vode u prodavnicu */
export function chips(cats) {
  return `<div class="chips" role="group" aria-label="Filtriraj po kategoriji">
        <button class="chip" type="button" data-filter="sve" aria-pressed="true">Sve</button>
        ${cats.map(c => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="false">${esc(c.name)}</button>`).join('\n        ')}
        <button class="chip" type="button" data-filter="omiljeni" aria-pressed="false">${icon('heart')}Omiljeni</button>
      </div>`;
}

/* redosled: dugme + lista (na telefonu se otvara kao panel odozdo) */
const SORTS = [
  { v: 'pop', ico: 'sortPop', name: 'Preporučeno', hint: 'Naš izbor iz radionice' },
  { v: 'asc', ico: 'sortAsc', name: 'Cena: od niže', hint: 'Najpovoljnije prvo' },
  { v: 'desc', ico: 'sortDesc', name: 'Cena: od više', hint: 'Najskuplje prvo' },
  { v: 'az', ico: 'sortAz', name: 'Naziv: A do Š', hint: 'Po abecedi' }
];
export function sorter(id = 'sort') {
  return `<div class="sorter" data-sorter>
        <span class="sorter-label" id="${id}-label">Redosled</span>
        <button class="sorter-btn" type="button" id="${id}-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-labelledby="${id}-label ${id}-btn" data-sorter-btn>
          <span class="sorter-ico" data-sorter-ico>${icon('sortPop')}</span>
          <span class="sorter-value" data-sorter-value>Preporučeno</span>
          <span class="sorter-chev">${icon('chevron')}</span>
        </button>
        <div class="sorter-scrim"></div>
        <div class="sorter-pop" data-sorter-pop>
          <div class="sorter-head" aria-hidden="true"><span class="sorter-grab"></span><p>Redosled</p></div>
          <ul class="sorter-list" id="${id}-list" role="listbox" aria-labelledby="${id}-label" tabindex="-1" data-sorter-list>
            ${SORTS.map((s, i) => `<li class="sorter-opt" role="option" id="${id}-${s.v}" data-value="${s.v}" aria-selected="${i === 0}" style="--i:${i}"><span class="opt-ico">${icon(s.ico)}</span><span class="opt-txt"><b>${s.name}</b><small>${s.hint}</small></span><span class="opt-check">${icon('check')}</span></li>`).join('\n            ')}
          </ul>
          <div class="sorter-stitch stitch-band" aria-hidden="true"></div>
        </div>
      </div>`;
}

export function crumbs(items) {
  return `<nav class="crumbs" aria-label="Putanja">
      <ol>${items.map((it, i) => i === items.length - 1
        ? `<li><span aria-current="page">${esc(it.name)}</span></li>`
        : `<li><a href="${it.href}">${esc(it.name)}</a>${icon('chevronR')}</li>`).join('')}</ol>
    </nav>`;
}
