/* Freshka Gora demo: korpa, slider, filteri, redosled, stranica proizvoda. Bez baze, sve radi u pregledaču. */
(function () {
  'use strict';
  var DATA = window.FG_DATA;
  var ROOT = document.body.dataset.root || '';
  var P = {};
  DATA.products.forEach(function (p) { P[p.id] = p; });
  var CATS = {};
  DATA.categories.forEach(function (c) { CATS[c.id] = c; });
  var FREE = 4000, SHIP = 420, COD = 150;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = function (id) { return ROOT + 'assets/img/p/' + id + '.webp'; };
  var URL_OF = function (id) { return ROOT + P[id].url; };
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE = 'cubic-bezier(.22,.8,.24,1)';
  var ICON = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    bag: '<path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    back: '<path d="M15 6l-6 6 6 6"/>'
  };
  var svg = function (n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; };
  var stitch = function (on) { return '<svg class="stitch' + (on ? ' on' : '') + '" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var plural = function (n) { return n + (n % 10 === 1 && n % 100 !== 11 ? ' proizvod' : ' proizvoda'); };

  /* stanje, sačuvano lokalno da korpa preživi osvežavanje i prelazak na drugu stranicu */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('fg-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fg-' + k, JSON.stringify(v)); } catch (e) { /* privatni prozor */ } }
  };
  var cart = store.get('cart', {});
  var wish = store.get('wish', []);
  Object.keys(cart).forEach(function (id) { if (!P[id]) delete cart[id]; });
  wish = wish.filter(function (id) { return P[id]; });
  /* druga kartica pregledača menja korpu: osveži brojače */
  window.addEventListener('storage', function (e) {
    if (e.key === 'fg-cart') { cart = store.get('cart', {}); counts(false); if (openEl && openEl.id === 'cart') renderCart(); }
    if (e.key === 'fg-wish') { wish = store.get('wish', []); syncWish(); }
  });

  /* ---------- header ---------- */
  var header = $('#header');
  var onScrollHeader = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  function counts(animate) {
    var n = Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0);
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n; el.dataset.n = n; if (animate) bump(el); });
    $$('[data-wish-count]').forEach(function (el) { el.textContent = wish.length; el.dataset.n = wish.length; });
    $$('[data-pp-ship]').forEach(function (el) { el.innerHTML = shipInner(sub()); });
  }

  /* ---------- overlay menadžer ---------- */
  var scrim = $('[data-scrim]');
  var openEl = null, lastFocus = null;
  var page = $('.fg-page');
  function openLayer(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (openEl && openEl !== el) closeLayer(true);
    lastFocus = document.activeElement;
    openEl = el;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-open');
    page.inert = true;
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.documentElement.style.overflow = 'hidden';
    if (id === 'cart') renderCart();
    setTimeout(function () {
      var f = id === 'search' ? $('[data-search]') : el.querySelector('button, a[href], input, select, textarea');
      if (f) f.focus({ preventScroll: true });
    }, 60);
  }
  function closeLayer(silent) {
    if (!openEl) return;
    var id = openEl.id;
    openEl.classList.remove('is-open');
    openEl.setAttribute('aria-hidden', 'true');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    openEl = null;
    if (!silent) {
      scrim.classList.remove('is-open');
      page.inert = false;
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
  }
  scrim.addEventListener('click', function () { closeLayer(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openEl) { e.preventDefault(); closeLayer(); }
    if (e.key === 'Tab' && openEl) {
      var f = $$('button:not([disabled]), a[href], input:not([type=hidden]), select, textarea', openEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- toast ---------- */
  var toast = $('[data-toast]'), toastT;
  function showToast(p, text) {
    $('[data-toast-img]').src = IMG(p.id);
    $('[data-toast-text]').textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2800);
  }

  /* ---------- korpa ---------- */
  function flashAdded(btn) {
    if (!btn || btn.classList.contains('is-added')) return;
    var old = btn.innerHTML;
    btn.classList.add('is-added');
    btn.innerHTML = svg('check') + '<span class="add-label">Dodato</span>';
    setTimeout(function () { btn.classList.remove('is-added'); btn.innerHTML = old; }, 1400);
  }
  function addToCart(id, q, btn) {
    var p = P[id]; if (!p) return;
    cart[id] = (cart[id] || 0) + (q || 1);
    store.set('cart', cart);
    counts(true);
    showToast(p, (q > 1 ? q + ' × ' : '') + p.name + ' je u korpi');
    if (btn && (btn.classList.contains('add') || btn.classList.contains('pp-add'))) flashAdded(btn);
    if (openEl && openEl.id === 'cart') renderCart();
  }
  var step = 'cart', order = null;
  function sub() { return Object.keys(cart).reduce(function (s, id) { return s + P[id].price * cart[id]; }, 0); }
  function shipInner(s) {
    var n = Math.min(20, Math.round(s / FREE * 20)), st = '';
    for (var i = 0; i < 20; i++) st += stitch(i < n);
    var msg = s >= FREE ? 'Dostava je besplatna za ovu porudžbinu.' : s ? 'Još <b>' + fmt(FREE - s) + ' RSD</b> do besplatne dostave.' : 'Besplatna dostava za porudžbine preko <b>4.000 RSD</b>.';
    return '<p>' + msg + '</p><div class="ship-stitches" aria-hidden="true">' + st + '</div>';
  }
  function liImg(p) { return '<span class="li-img' + (p.photo ? ' is-photo' : '') + '" data-tint="' + p.tint + '"><img src="' + IMG(p.id) + '" alt="" loading="lazy"></span>'; }
  function renderCart() {
    var body = $('[data-cart-body]'), foot = $('[data-cart-foot]'), title = $('[data-cart-title]');
    var ids = Object.keys(cart), s = sub();
    var n = ids.reduce(function (a, id) { return a + cart[id]; }, 0);
    if (step === 'done') {
      title.textContent = 'Porudžbina primljena';
      body.innerHTML = '<div class="done"><span class="done-mark">' + svg('check') + '</span><h3>Hvala, ' + esc(order.name.split(' ')[0]) + '!</h3><p>Porudžbina <span class="order-no">' + order.no + '</span> u iznosu od ' + fmt(order.total) + ' RSD je primljena. Potvrda stiže na ' + esc(order.email) + '.</p><p class="demo-note">Ovo je demo prodavnica. Porudžbina nije stvarno poslata.</p></div>';
      foot.innerHTML = '<button class="btn btn-primary btn-block" type="button" data-finish>Nazad u prodavnicu</button>';
      return;
    }
    if (!ids.length) {
      step = 'cart';
      title.textContent = 'Korpa';
      var shopLink = grid ? '<a class="btn btn-primary btn-block" href="#prodavnica" data-close>Idi u prodavnicu</a>' : '<a class="btn btn-primary btn-block" href="' + ROOT + 'prodavnica/">Idi u prodavnicu</a>';
      body.innerHTML = '<div class="empty">' + svg('bag').replace('<svg', '<svg width="56" height="56"') + '<h3 class="h-sec" style="font-size:28px">Korpa je prazna</h3><p>Pogledajte melem, sapun ili poklon paket.</p></div>';
      foot.innerHTML = shopLink;
      return;
    }
    var ship = s >= FREE ? 0 : SHIP;
    if (step === 'cart') {
      title.textContent = 'Korpa (' + n + ')';
      body.innerHTML = '<div class="ship">' + shipInner(s) + '</div><ul class="line-items">' + ids.map(function (id) {
        var p = P[id];
        return '<li class="li"><a href="' + URL_OF(id) + '" tabindex="-1" aria-hidden="true">' + liImg(p) + '</a><div><p class="li-name"><a href="' + URL_OF(id) + '">' + esc(p.name) + '</a></p><p class="li-meta">' + fmt(p.price) + ' RSD</p>' +
          '<div class="qty" role="group" aria-label="Količina za ' + esc(p.name) + '"><button type="button" data-dec="' + id + '" aria-label="Smanji">' + svg('minus') + '</button><output>' + cart[id] + '</output><button type="button" data-inc="' + id + '" aria-label="Povećaj">' + svg('plus') + '</button></div></div>' +
          '<div class="li-right"><span class="price">' + fmt(p.price * cart[id]) + '<small>RSD</small></span><button class="remove" type="button" data-remove="' + id + '">Ukloni</button></div></li>';
      }).join('') + '</ul>';
      foot.innerHTML = '<div class="totals"><div><span>Međuzbir</span><span>' + fmt(s) + ' RSD</span></div><div><span>Dostava (Post Express)</span><span>' + (ship ? fmt(ship) + ' RSD' : 'Besplatna') + '</span></div><div class="grand"><span>Ukupno</span><span class="price">' + fmt(s + ship) + '<small>RSD</small></span></div></div><button class="btn btn-primary btn-block" type="button" data-checkout>Nastavi na plaćanje</button>';
      return;
    }
    /* korak: podaci za dostavu */
    title.textContent = 'Plaćanje i dostava';
    var payCod = !order || order.pay !== 'racun';
    body.innerHTML = '<button class="back" type="button" data-back>' + svg('back') + 'Nazad na korpu</button>' +
      '<form class="form-grid" data-order novalidate style="margin-top:10px">' +
      field('ime', 'Ime i prezime', 'text', 'name', 'full') + field('tel', 'Telefon', 'tel', 'tel', '') + field('email', 'Email', 'email', 'email', '') +
      field('adresa', 'Ulica i broj', 'text', 'street-address', 'full') + field('grad', 'Grad', 'text', 'address-level2', '') + field('pb', 'Poštanski broj', 'text', 'postal-code', '') +
      '<fieldset class="pay full"><legend>Način plaćanja</legend>' +
      '<label class="radio"><input type="radio" name="pay" value="pouzece"' + (payCod ? ' checked' : '') + '><span><b>Pouzećem</b><span>Plaćate kuriru pri preuzimanju, dodatnih ' + COD + ' RSD.</span></span></label>' +
      '<label class="radio"><input type="radio" name="pay" value="racun"' + (payCod ? '' : ' checked') + '><span><b>Uplata na račun</b><span>Šaljemo podatke za uplatu, paket kreće kad uplata stigne.</span></span></label></fieldset>' +
      '<div class="field full"><label for="o-nap">Napomena (nije obavezno)</label><textarea class="input" id="o-nap" name="napomena" rows="2"></textarea></div>' +
      '<p class="err full" data-order-err hidden>Popunite polja označena iznad.</p></form>';
    renderCheckoutFoot();
  }
  function field(id, label, type, ac, cls) {
    return '<div class="field ' + cls + '"><label for="o-' + id + '">' + label + '</label><input class="input" id="o-' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + ac + '" required></div>';
  }
  function renderCheckoutFoot() {
    var s = sub(), ship = s >= FREE ? 0 : SHIP;
    var f = $('[data-order]');
    var cod = f && f.pay && f.pay.value === 'pouzece' ? COD : 0;
    $('[data-cart-foot]').innerHTML = '<div class="totals"><div><span>Proizvodi</span><span>' + fmt(s) + ' RSD</span></div><div><span>Dostava</span><span>' + (ship ? fmt(ship) + ' RSD' : 'Besplatna') + '</span></div>' + (cod ? '<div><span>Plaćanje pouzećem</span><span>' + COD + ' RSD</span></div>' : '') + '<div class="grand"><span>Za plaćanje</span><span class="price">' + fmt(s + ship + cod) + '<small>RSD</small></span></div></div><button class="btn btn-primary btn-block" type="button" data-place>Potvrdi porudžbinu</button>';
  }
  function validate(form, extra) {
    var ok = true;
    $$('input[required], textarea[required]', form).forEach(function (i) {
      var v = i.value.trim(), bad = !v || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      i.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { ok = false; i.focus(); }
    });
    return ok;
  }
  function placeOrder() {
    var f = $('[data-order]'); if (!f) return;
    var ok = validate(f);
    $('[data-order-err]').hidden = ok;
    if (!ok) return;
    var s = sub(), ship = s >= FREE ? 0 : SHIP, cod = f.pay.value === 'pouzece' ? COD : 0;
    order = { name: f.ime.value.trim(), email: f.email.value.trim(), pay: f.pay.value, total: s + ship + cod, no: 'FG-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000)) };
    cart = {}; store.set('cart', cart); counts(false);
    step = 'done'; renderCart();
    $('[data-cart-body]').scrollTop = 0;
  }
  document.addEventListener('change', function (e) {
    if (e.target.name === 'pay') renderCheckoutFoot();
  });
  document.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false');
  });

  /* ---------- omiljeni ---------- */
  function syncWish() {
    $$('[data-wish]').forEach(function (b) {
      var on = wish.indexOf(b.dataset.wish) > -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', (on ? 'Ukloni iz omiljenih: ' : 'Dodaj u omiljene: ') + P[b.dataset.wish].name);
    });
    counts(false);
  }
  function toggleWish(id, btn) {
    var i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1); else { wish.push(id); showToast(P[id], 'Sačuvano u omiljenim'); if (btn) bump(btn); }
    store.set('wish', wish);
    syncWish();
    if (grid && filter === 'omiljeni') applyShop(true);
  }

  /* ---------- prodavnica: filteri, redosled, animirano premeštanje kartica ---------- */
  var shopSec = $('[data-shop]'), grid = $('[data-grid]');
  var cards = grid ? $$('.card', grid) : [], filter = 'sve', sortBy = 'pop';
  var LIMIT = shopSec ? +shopSec.dataset.limit : 0;
  var moreBtn = $('[data-more]'), status = $('[data-shop-status]'), countEl = $('[data-shop-count]');
  var shopHero = $('[data-shop-hero]');
  var onShopPage = !!shopHero;
  function applyShop(animate) {
    if (!grid) return;
    var anim = animate && !reduce.matches && grid.animate, first = {};
    if (anim) cards.forEach(function (c) { if (!c.hidden) first[c.dataset.id] = c.getBoundingClientRect(); });
    var list = cards.slice();
    if (sortBy === 'asc') list.sort(function (a, b) { return a.dataset.price - b.dataset.price || a.dataset.i - b.dataset.i; });
    if (sortBy === 'desc') list.sort(function (a, b) { return b.dataset.price - a.dataset.price || a.dataset.i - b.dataset.i; });
    if (sortBy === 'az') list.sort(function (a, b) { return P[a.dataset.id].name.localeCompare(P[b.dataset.id].name, 'sr'); });
    if (sortBy === 'pop') list.sort(function (a, b) { return a.dataset.i - b.dataset.i; });
    list.forEach(function (c) { grid.appendChild(c); });
    var shown = 0, matched = 0;
    list.forEach(function (c) {
      var m = filter === 'sve' || (filter === 'omiljeni' ? wish.indexOf(c.dataset.id) > -1 : c.dataset.cat === filter);
      if (m) matched++;
      var vis = m && (filter !== 'sve' || !LIMIT || matched <= LIMIT);
      c.hidden = !vis;
      if (vis) shown++;
    });
    var empty = $('.empty-note', grid);
    if (!matched) {
      if (!empty) { empty = document.createElement('li'); empty.className = 'empty-note'; grid.appendChild(empty); }
      empty.textContent = filter === 'omiljeni' ? 'Još niste sačuvali nijedan proizvod. Kliknite srce na kartici proizvoda.' : 'Nema proizvoda u ovoj kategoriji.';
    } else if (empty) { empty.remove(); }
    if (moreBtn) moreBtn.parentElement.hidden = !(filter === 'sve' && LIMIT && matched > LIMIT);
    $$('.chip[data-filter]', shopSec).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.filter === filter ? 'true' : 'false'); });
    status.textContent = 'Prikazano ' + shown + ' proizvoda';
    if (countEl) countEl.textContent = plural(matched);
    if (anim) {
      var vh = window.innerHeight, k = 0;
      list.forEach(function (c) {
        if (c.hidden) return;
        var f = first[c.dataset.id], r = c.getBoundingClientRect();
        if (r.top > vh + 200 || r.bottom < -200) return;
        if (f && Math.abs(f.top - r.top) < vh * 1.5) {
          var dx = f.left - r.left, dy = f.top - r.top;
          if (dx || dy) c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: EASE });
        } else {
          c.animate([{ opacity: 0, transform: 'translateY(22px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: Math.min(k++ * 45, 360), easing: EASE, fill: 'backwards' });
        }
      });
    }
  }
  function setFilter(f, scroll) {
    if (f !== 'sve' && f !== 'omiljeni' && !CATS[f]) f = 'sve';
    var changed = f !== filter;
    filter = f; applyShop(changed);
    if (onShopPage) {
      updateShopHero();
      if (history.replaceState) history.replaceState(null, '', f === 'sve' ? location.pathname + location.search : '#' + f);
    }
    if (scroll) shopSec.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  }

  /* zaglavlje prodavnice prati izabranu kategoriju: naslov, boja i proizvod u kapsuli */
  var phImg = shopHero ? $('.ph-visual', shopHero).dataset.cover : null;
  function updateShopHero() {
    var c = CATS[filter], t, intro, tint, cover;
    var n = filter === 'sve' ? DATA.products.length : filter === 'omiljeni' ? wish.length : DATA.products.filter(function (p) { return p.cat === filter; }).length;
    if (c) {
      var w = c.name.split(' '), last = w.pop();
      t = (w.length ? esc(w.join(' ')) + ' ' : '') + '<em>' + esc(last) + '</em>';
      intro = esc(c.intro) + ' ' + plural(n) + '.';
      tint = c.tint; cover = c.cover;
    } else if (filter === 'omiljeni') {
      t = 'Vaši <em>omiljeni</em>'; tint = 'rose'; cover = wish[0] || 'blago-licu-mom';
      intro = n ? 'Sačuvali ste ' + plural(n) + '. Ostaju ovde i kad se vratite.' : 'Kliknite srce na proizvodu i sačuvajte ga za kasnije.';
    } else {
      t = 'Sve iz <em>radionice</em>'; tint = 'sage'; cover = 'nevenova-mast';
      intro = n + ' proizvoda od bilja, meda, pčelinjeg voska i biljnih ulja, ručno rađenih na Fruškoj gori.';
    }
    $('[data-shop-title]').innerHTML = t;
    $('[data-shop-intro]').innerHTML = intro;
    shopHero.dataset.tint = tint;
    var stage = $('.page-hero-stage', shopHero), cur = $('.ph-visual.is-active', stage);
    if (phImg === cover) return;
    phImg = cover;
    var p = P[cover], v = document.createElement('div');
    v.className = 'ph-visual' + (p.photo ? ' is-photo' : '');
    v.innerHTML = '<img src="' + IMG(cover) + '" alt="">';
    stage.appendChild(v);
    if (cur) { cur.classList.remove('is-active'); cur.classList.add('out'); setTimeout(function () { cur.remove(); }, 900); }
    void v.offsetWidth;
    v.classList.add('is-active');
  }

  /* ---------- redosled: dugme + lista, na telefonu panel odozdo ---------- */
  function Sorter(root, onChange) {
    var btn = $('[data-sorter-btn]', root), list = $('[data-sorter-list]', root);
    var pop = $('[data-sorter-pop]', root), shade = $('.sorter-scrim', root);
    var opts = $$('[role="option"]', list), valEl = $('[data-sorter-value]', root), icoEl = $('[data-sorter-ico]', root);
    var sheet = window.matchMedia('(max-width: 760px)');
    var cur = 0, active = 0, isOpen = false, typed = '', typedT;
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    /* lista živi u body: van kontejnera stranice, da panel odozdo bude vezan za ekran */
    document.body.appendChild(shade);
    document.body.appendChild(pop);
    function place() {
      if (sheet.matches) { pop.style.top = pop.style.left = ''; return; }
      var r = btn.getBoundingClientRect();
      pop.style.top = (r.bottom + window.scrollY + 10) + 'px';
      pop.style.left = Math.max(12, r.right + window.scrollX - pop.offsetWidth) + 'px';
    }
    function setActive(i) {
      active = (i + opts.length) % opts.length;
      opts.forEach(function (o, j) { o.classList.toggle('is-active', j === active); });
      list.setAttribute('aria-activedescendant', opts[active].id);
    }
    function open() {
      if (isOpen) return;
      isOpen = true;
      place();
      root.classList.add('is-open'); pop.classList.add('is-open'); shade.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      setActive(cur);
      if (sheet.matches) document.documentElement.style.overflow = 'hidden';
      list.focus({ preventScroll: true });
    }
    function close(focusBtn) {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove('is-open'); pop.classList.remove('is-open'); shade.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (!openEl) document.documentElement.style.overflow = '';
      if (focusBtn) btn.focus({ preventScroll: true });
    }
    function choose(i) {
      var o = opts[i], changed = i !== cur;
      cur = i;
      opts.forEach(function (x) { x.setAttribute('aria-selected', x === o ? 'true' : 'false'); });
      valEl.textContent = $('b', o).textContent;
      icoEl.innerHTML = $('.opt-ico', o).innerHTML;
      if (changed) { root.classList.remove('just-set'); void root.offsetWidth; root.classList.add('just-set'); }
      close(true);
      if (changed) onChange(o.dataset.value);
    }
    btn.addEventListener('click', function () { if (isOpen) close(true); else open(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
    });
    list.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (k === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (k === 'Home') { e.preventDefault(); setActive(0); }
      else if (k === 'End') { e.preventDefault(); setActive(opts.length - 1); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
      else if (k === 'Escape') { e.preventDefault(); close(true); }
      else if (k === 'Tab') { close(false); }
      else if (k.length === 1) {
        /* kucanje prvog slova skače na opciju */
        clearTimeout(typedT); typed += norm(k); typedT = setTimeout(function () { typed = ''; }, 700);
        var start = typed.length > 1 ? active : active + 1;
        for (var j = 0; j < opts.length; j++) {
          var o = opts[(start + j) % opts.length];
          if (norm($('b', o).textContent).indexOf(typed) === 0) { setActive(opts.indexOf(o)); break; }
        }
      }
    });
    opts.forEach(function (o, i) {
      o.addEventListener('click', function () { choose(i); });
      o.addEventListener('pointermove', function () { if (active !== i) setActive(i); });
    });
    shade.addEventListener('click', function () { close(true); });
    /* na telefonu se panel zatvara i povlačenjem nadole */
    var dragY = null, dragD = 0;
    pop.addEventListener('touchstart', function (e) { if (sheet.matches && isOpen) { dragY = e.touches[0].clientY; dragD = 0; pop.style.transition = 'none'; } }, { passive: true });
    pop.addEventListener('touchmove', function (e) {
      if (dragY === null) return;
      dragD = Math.max(0, e.touches[0].clientY - dragY);
      pop.style.transform = 'translateY(' + dragD + 'px)';
    }, { passive: true });
    pop.addEventListener('touchend', function () {
      if (dragY === null) return;
      dragY = null; pop.style.transition = ''; pop.style.transform = '';
      if (dragD > 80) close(true);
    });
    document.addEventListener('pointerdown', function (e) { if (isOpen && !root.contains(e.target) && !pop.contains(e.target) && e.target !== shade) close(false); });
    window.addEventListener('resize', function () { if (isOpen && !sheet.matches) place(); });
    if (sheet.addEventListener) sheet.addEventListener('change', function () { close(false); });
  }

  if (grid) {
    var sorterEl = $('[data-sorter]', shopSec);
    if (sorterEl) Sorter(sorterEl, function (v) { sortBy = v; applyShop(true); });
    if (onShopPage) {
      var h0 = decodeURIComponent(location.hash.slice(1));
      if (CATS[h0] || h0 === 'omiljeni') filter = h0;
      window.addEventListener('hashchange', function () { var h = decodeURIComponent(location.hash.slice(1)); if (h !== filter) setFilter(h || 'sve', false); });
    }
  }

  /* ---------- brzi pregled ---------- */
  var qv = { id: null, qty: 1 };
  function openQV(id) {
    var p = P[id]; if (!p) return;
    qv.id = id; qv.qty = 1;
    var media = $('[data-qv-media]');
    media.dataset.tint = p.tint;
    media.classList.toggle('is-photo', !!p.photo);
    var img = $('[data-qv-img]'); img.src = IMG(id); img.alt = p.alt;
    $('[data-qv-cat]').textContent = CATS[p.cat].name;
    $('[data-qv-name]').textContent = p.name;
    $('[data-qv-price]').innerHTML = fmt(p.price) + '<small>RSD</small>';
    $('[data-qv-desc]').textContent = p.short + ' ' + p.desc;
    var ing = $('[data-qv-ing]');
    ing.hidden = !p.ing;
    $('span', ing).textContent = p.ing;
    $('[data-qv-qty]').textContent = '1';
    $('[data-qv-link]').href = URL_OF(id);
    var w = $('[data-qv-wish]'); w.dataset.wish = id; syncWish();
    openLayer('qv');
  }

  /* ---------- pretraga ---------- */
  var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj'); };
  $('[data-search]').addEventListener('input', function (e) {
    var q = norm(e.target.value.trim()), box = $('[data-results]');
    if (q.length < 2) { box.innerHTML = ''; return; }
    var hits = DATA.products.filter(function (p) { return norm(p.name + ' ' + p.short + ' ' + p.ing + ' ' + CATS[p.cat].name).indexOf(q) > -1; }).slice(0, 7);
    box.innerHTML = hits.length ? hits.map(function (p) {
      return '<a class="result" href="' + URL_OF(p.id) + '">' + liImg(p) + '<span><b>' + esc(p.name) + '</b><span>' + esc(CATS[p.cat].name) + '</span></span><span class="price">' + fmt(p.price) + '<small>RSD</small></span></a>';
    }).join('') : '<p class="results-empty">Nema proizvoda za „' + esc(e.target.value.trim()) + '“. Probajte neven, lavanda ili med.</p>';
  });

  /* ---------- delegirani klikovi ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a');
    if (!t) return;
    var d = t.dataset;
    if (d.add) { e.preventDefault(); addToCart(d.add, 1, t); return; }
    if (d.qv) { e.preventDefault(); if (openEl) closeLayer(true); openQV(d.qv); return; }
    if (d.wish) { e.preventDefault(); toggleWish(d.wish, t); return; }
    if (d.filter) {
      if (!grid) { if (openEl) closeLayer(); return; } /* nema mreže na ovoj stranici: link vodi u prodavnicu */
      e.preventDefault();
      var wasOpen = !!openEl;
      if (wasOpen) closeLayer();
      setFilter(d.filter, !t.classList.contains('chip') || wasOpen || t.closest('.mcats'));
      return;
    }
    if (d.open) { e.preventDefault(); if (d.open === 'cart') { toast.classList.remove('is-on'); } openLayer(d.open); return; }
    if (d.close !== undefined) {
      var href = t.getAttribute('href');
      closeLayer();
      if (href && href.charAt(0) === '#') { e.preventDefault(); var tg = document.querySelector(href); if (tg) setTimeout(function () { tg.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }); }, 30); }
      return;
    }
    if (d.showWish !== undefined) {
      if (grid) setFilter('omiljeni', true); else location.href = ROOT + 'prodavnica/#omiljeni';
      return;
    }
    if (d.inc) { cart[d.inc]++; store.set('cart', cart); counts(false); renderCart(); return; }
    if (d.dec) { cart[d.dec]--; if (cart[d.dec] < 1) delete cart[d.dec]; store.set('cart', cart); counts(false); renderCart(); return; }
    if (d.remove) { delete cart[d.remove]; store.set('cart', cart); counts(false); renderCart(); return; }
    if (d.checkout !== undefined) { step = 'form'; renderCart(); var first = $('#o-ime'); if (first) first.focus(); return; }
    if (d.back !== undefined) { step = 'cart'; renderCart(); return; }
    if (d.place !== undefined) { placeOrder(); return; }
    if (d.finish !== undefined) { step = 'cart'; order = null; closeLayer(); if (grid) setFilter('sve', true); return; }
    if (d.qvInc !== undefined) { qv.qty = Math.min(20, qv.qty + 1); $('[data-qv-qty]').textContent = qv.qty; return; }
    if (d.qvDec !== undefined) { qv.qty = Math.max(1, qv.qty - 1); $('[data-qv-qty]').textContent = qv.qty; return; }
    if (d.qvAdd !== undefined) { addToCart(qv.id, qv.qty); closeLayer(); return; }
    if (d.ppInc !== undefined) { pp.qty = Math.min(20, pp.qty + 1); pp.out.textContent = pp.qty; return; }
    if (d.ppDec !== undefined) { pp.qty = Math.max(1, pp.qty - 1); pp.out.textContent = pp.qty; return; }
    if (d.ppAdd) { addToCart(d.ppAdd, pp.qty, t); pp.qty = 1; pp.out.textContent = 1; return; }
    if (d.rail) {
      var r = document.getElementById(t.getAttribute('aria-controls'));
      if (r) r.scrollBy({ left: d.rail * r.clientWidth * 0.8, behavior: reduce.matches ? 'auto' : 'smooth' });
      return;
    }
  });

  /* ---------- stranica proizvoda ---------- */
  var pp = { qty: 1, out: $('[data-pp-qty]') };
  var buyRow = $('[data-pp-buy]'), buybar = $('[data-buybar]');
  if (buyRow && buybar && 'IntersectionObserver' in window) {
    /* traka za kupovinu na dnu ekrana kad glavno dugme ode iznad */
    new IntersectionObserver(function (en) {
      var on = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      buybar.classList.toggle('is-on', on);
      buybar.setAttribute('aria-hidden', on ? 'false' : 'true');
      $('button', buybar).tabIndex = on ? 0 : -1;
      document.body.classList.toggle('has-buybar', on);
    }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' }).observe(buyRow);
  }

  /* ---------- newsletter i kontakt (demo: ništa se ne šalje) ---------- */
  var news = $('[data-news]');
  if (news) news.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, v = f.email.value.trim(), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    $('[data-news-err]').hidden = ok;
    f.email.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (!ok) { f.email.focus(); return; }
    f.innerHTML = '<p class="news-ok" role="status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' + ICON.check + '</svg>Hvala! Prijavljeni ste sa ' + esc(v) + '.</p>';
  });
  var contact = $('[data-contact]');
  if (contact) contact.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = validate(contact);
    $('[data-contact-err]').hidden = ok;
    if (!ok) return;
    var name = contact.ime.value.trim().split(' ')[0];
    contact.innerHTML = '<div class="done" role="status"><span class="done-mark">' + svg('check') + '</span><h3>Hvala, ' + esc(name) + '!</h3><p>Poruka je primljena. Odgovor stiže na ' + esc(contact.email.value.trim()) + '.</p><p class="demo-note">Ovo je demo sajt. Poruka nije stvarno poslata.</p></div>';
  });

  /* ---------- HERO slider: strelice + automatski posle 10 s ---------- */
  var hero = $('#hero');
  if (hero) (function () {
    var slides = $$('.hero-slide', hero), visuals = $$('.hero-visual', hero), thumbs = $$('.thumb', hero);
    var stitches = $$('.timer-stitches .stitch', hero), pauseBtn = $('[data-pause]', hero);
    var cur = 0, tick = 0, paused = false, userPaused = false, busy = false;
    var N = slides.length, STEP = 10;
    function drawTimer() { stitches.forEach(function (s, i) { s.classList.toggle('on', i < tick); }); }
    function go(to, dir, byUser) {
      to = (to + N) % N;
      if (to === cur || busy) return;
      busy = true; setTimeout(function () { busy = false; }, 650);
      if (dir === undefined) dir = to > cur ? 1 : -1;
      var from = cur; cur = to;
      hero.dataset.tint = DATA.slides[to].tint;
      $('#hero-copy').setAttribute('aria-live', byUser ? 'polite' : 'off');
      slides.forEach(function (s, i) {
        var on = i === to;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        $$('a, button', s).forEach(function (b) { b.tabIndex = on ? 0 : -1; });
      });
      var vin = visuals[to], vout = visuals[from];
      visuals.forEach(function (v, i) { if (i !== to && i !== from) v.className = 'hero-visual'; });
      vout.className = 'hero-visual ' + (dir > 0 ? 'out-left' : 'out-right');
      vin.className = 'hero-visual no-anim' + (dir > 0 ? '' : ' from-left');
      void vin.offsetWidth;
      vin.className = 'hero-visual is-active';
      thumbs.forEach(function (t, i) { t.setAttribute('aria-current', i === to ? 'true' : 'false'); });
      $('[data-cur]', hero).textContent = String(to + 1).padStart(2, '0');
      tick = 0; drawTimer();
    }
    $('[data-next]', hero).addEventListener('click', function () { go(cur + 1, 1, true); });
    $('[data-prev]', hero).addEventListener('click', function () { go(cur - 1, -1, true); });
    thumbs.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.go, undefined, true); }); });
    hero.addEventListener('keydown', function (e) {
      if (e.target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, -1, true); }
    });
    /* prevlačenje prstom na telefonu */
    var sx = null, sy = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1, true);
      sx = null;
    }, { passive: true });
    function setPaused(p) {
      userPaused = p;
      pauseBtn.setAttribute('aria-pressed', p ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', p ? 'Pokreni automatsko listanje' : 'Zaustavi automatsko listanje');
      pauseBtn.innerHTML = p ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
    }
    pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });
    /* pauza dok je fokus tastature u slideru ili je slider van ekrana */
    var heroVisible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }, { threshold: 0.25 }).observe(hero);
    hero.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) paused = true; });
    hero.addEventListener('focusout', function () { paused = false; });
    setInterval(function () {
      if (userPaused || paused || !heroVisible || document.hidden || openEl) return;
      if (tick >= STEP) return;
      tick++;
      drawTimer();
      if (tick >= STEP) setTimeout(function () { if (tick < STEP) return; if (busy) { tick = STEP - 1; return; } go(cur + 1, 1, false); }, 380);
    }, 1000);
    if (reduce.matches) setPaused(true);
    drawTimer();
  })();

  /* ---------- scroll priča ---------- */
  var story = $('#prica');
  if (story && !reduce.matches && window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) story.classList.add('is-cine');

  /* ---------- ulazne animacije ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rev.forEach(function (r) { io.observe(r); });
  } else rev.forEach(function (r) { r.classList.add('is-in'); });

  /* ---------- start ---------- */
  counts(false); syncWish();
  if (grid) { applyShop(false); if (onShopPage) updateShopHero(); }
  requestAnimationFrame(function () { document.documentElement.classList.add('is-ready'); });
})();
