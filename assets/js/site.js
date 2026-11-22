/* Super Speedy — bozza WebSardegna */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eur = c => (c / 100).toFixed(2).replace('.', ',') + ' €';
  const WA = '393406479266';

  /* ---------- nav mobile ---------- */
  const tog = $('.nav-toggle'), nav = $('#nav');
  tog?.addEventListener('click', () => {
    const open = tog.getAttribute('aria-expanded') !== 'true';
    tog.setAttribute('aria-expanded', open);
    tog.querySelector('.vh').textContent = open ? 'Chiudi il menu di navigazione' : 'Apri il menu di navigazione';
    nav.classList.toggle('open', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { if (nav.classList.contains('open')) tog.click(); }));

  /* ---------- orari: oggi (Europe/Rome) ---------- */
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const mins = (+get('hour') % 24) * 60 + +get('minute');
  const row = $(`#hours tr[data-d="${day}"]`); row?.classList.add('today');
  const slots = day === 0 ? [] : day === 6 ? [[1140, 1380]] : [[750, 870], [1140, 1380]];
  const fmt = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const line = $('#today-line');
  if (line) {
    let txt;
    const now = slots.find(([a, b]) => mins >= a && mins < b);
    if (day === 0) txt = 'Oggi è domenica: siamo chiusi. Ci vediamo lunedì alle 12:30.';
    else if (now) txt = `Aperti adesso, fino alle ${fmt(now[1])}.`;
    else {
      const next = slots.find(([a]) => mins < a);
      txt = next ? `Oggi apriamo alle ${fmt(next[0])}.` : (day === 6 ? 'Per oggi abbiamo chiuso. Domenica riposo, ci vediamo lunedì.' : 'Per oggi abbiamo chiuso. Domani dalle ' + (day === 5 ? '19:00.' : '12:30.'));
    }
    line.innerHTML = `<span class="dot" aria-hidden="true"></span>${txt}`;
  }

  /* ---------- video hero ---------- */
  const media = $('#hero-media'), v = $('#hero-video'), bA = $('#vid-audio'), bP = $('#vid-pause');
  if (v) {
    const src = v.querySelector('source');
    const noVideo = () => media.classList.add('no-video');
    src?.addEventListener('error', noVideo);
    v.addEventListener('error', noVideo);
    const setPaused = p => { bP.classList.toggle('paused', p); bP.setAttribute('aria-label', p ? 'Riproduci il video' : 'Metti in pausa il video'); };
    if (!reduce) { v.autoplay = true; v.play().catch(() => setPaused(true)); } else setPaused(true);
    v.addEventListener('play', () => setPaused(false));
    v.addEventListener('pause', () => setPaused(true));
    bP?.addEventListener('click', () => v.paused ? v.play() : v.pause());
    bA?.addEventListener('click', () => {
      const on = v.muted;
      v.muted = !on;
      if (on) { v.currentTime = 0; v.play(); }
      bA.setAttribute('aria-pressed', on);
      bA.querySelector('.lbl').textContent = on ? 'Togli l’audio' : 'Guarda il video con audio';
    });
    // poster resta visibile se il file non c'è ancora
    fetch(src.src, { method: 'HEAD' }).then(r => { if (!r.ok) noVideo(); }).catch(noVideo);
  }

  /* ---------- top 5 ---------- */
  const rows = $$('.top-row'), pics = $$('.top-pic');
  const setTop = i => { rows.forEach(r => r.classList.toggle('is-on', r.dataset.i == i)); pics.forEach(p => p.classList.toggle('is-on', p.dataset.i == i)); };
  rows.forEach(r => { r.addEventListener('mouseenter', () => setTop(r.dataset.i)); r.addEventListener('focusin', () => setTop(r.dataset.i)); });

  /* ---------- filtri menù ---------- */
  const chips = $$('.chip'), count = $('#filt-count');
  const applyFilters = () => {
    const on = chips.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.f);
    let n = 0;
    $$('.item').forEach(it => {
      const tags = it.dataset.tags.split(' ');
      const ok = !on.length || on.some(f => f === 'vg' ? (tags.includes('vg') || tags.includes('vgp')) : tags.includes(f));
      it.classList.toggle('is-hidden', !ok); if (ok) n++;
    });
    $$('.group').forEach(g => g.classList.toggle('is-hidden', on.length && !g.querySelector('.item:not(.is-hidden)')));
    $$('.cat').forEach(c => c.classList.toggle('is-hidden', on.length > 0 && !c.querySelector('.item:not(.is-hidden)')));
    $('.groups')?.toggleAttribute('hidden', on.length > 0);
    count.textContent = on.length ? `${n} piatti trovati` : '';
  };
  chips.forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true'); applyFilters(); }));
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => {
    const c = chips.find(x => x.dataset.f === a.dataset.filterLink);
    if (c && c.getAttribute('aria-pressed') !== 'true') { c.setAttribute('aria-pressed', 'true'); applyFilters(); }
  }));

  /* ---------- scroll spy categorie ---------- */
  const idxLinks = $$('.idx a');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          idxLinks.forEach(a => { const on = a.hash === '#' + e.target.id; a.classList.toggle('is-on', on); if (on) { a.setAttribute('aria-current', 'true'); const ul = a.closest('.idx'); if (ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: a.parentElement.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' }); } else a.removeAttribute('aria-current'); });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.cat').forEach(c => io.observe(c));
  }

  /* ---------- comanda ---------- */
  const KEY = 'ss-comanda';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  const lines = $('#lines'), empty = $('#com-empty'), sub = $('#t-sub'), tot = $('#t-tot'), warn = $('#min-warn'), send = $('#wa-send'), del = $('.t-del'), barCount = $('#bar-count'), barLbl = $('.bar-lbl');
  const mode = () => $('input[name="mode"]:checked')?.value || 'ritiro';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const render = (newId) => {
    lines.innerHTML = cart.map(l => `<li class="line${l.id === newId ? ' new' : ''}" data-id="${l.id}"><span class="line-n">${l.name}</span><span class="line-p">${eur(l.price * l.q)}</span>
      <span class="qty"><button type="button" data-d="-1" aria-label="Togli una ${l.name}">−</button><output aria-label="Quantità">${l.q}</output><button type="button" data-d="1" aria-label="Aggiungi un’altra ${l.name}">+</button></span></li>`).join('');
    const s = cart.reduce((a, l) => a + l.price * l.q, 0), n = cart.reduce((a, l) => a + l.q, 0);
    const isDel = mode() === 'consegna';
    empty.hidden = n > 0;
    del.hidden = !isDel;
    sub.textContent = eur(s);
    tot.textContent = eur(s + (isDel && n ? 200 : 0));
    const short = isDel && n && s < 800;
    warn.hidden = !short;
    if (short) warn.textContent = `Per la consegna l’ordine minimo è 8 €: mancano ${eur(800 - s)}.`;
    const msg = n
      ? `Ciao Super Speedy! Vorrei ordinare:\n${cart.map(l => `- ${l.q} × ${l.name}`).join('\n')}\n\nTotale indicativo: ${eur(s + (isDel ? 200 : 0))}${isDel ? ' (con consegna)' : ''}\n${isDel ? 'Consegna a: (indirizzo)\n' : 'Passo a ritirarla alle: (orario)\n'}Nome: `
      : 'Ciao Super Speedy! Vorrei ordinare: ';
    send.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    send.setAttribute('aria-disabled', short ? 'true' : 'false');
    barCount.hidden = !n; barCount.textContent = n;
    barLbl.textContent = n ? 'Comanda' : 'Menù';
    $$('[data-id]').forEach(b => { if (b.matches('.add,.add-chip')) b.classList.toggle('done', cart.some(l => l.id === b.dataset.id)); });
    save();
  };
  const add = (id, name, price) => {
    const l = cart.find(x => x.id === id);
    if (l) l.q++; else cart.push({ id, name, price: +price, q: 1 });
    render(l ? null : id);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('.add,.add-chip');
    if (b) { add(b.dataset.id, b.dataset.name, b.dataset.price); return; }
    const q = e.target.closest('.qty button');
    if (q) {
      const id = q.closest('.line').dataset.id, l = cart.find(x => x.id === id);
      l.q += +q.dataset.d; if (l.q <= 0) cart = cart.filter(x => x !== l);
      render();
    }
  });
  $$('input[name="mode"]').forEach(r => r.addEventListener('change', () => render()));
  $('#com-clear')?.addEventListener('click', () => { cart = []; render(); });
  render();

  /* sheet mobile */
  const com = $('#comanda'), scrim = $('#scrim'), barMenu = $('#bar-menu');
  const mq = matchMedia('(max-width:980px)');
  const openSheet = o => { com.classList.toggle('open', o); scrim.hidden = !o; if (o) $('.com-close').focus(); else barMenu.focus({ preventScroll: true }); };
  barMenu?.addEventListener('click', e => { if (cart.length && mq.matches) { e.preventDefault(); openSheet(true); } });
  $('.com-close')?.addEventListener('click', () => openSheet(false));
  scrim?.addEventListener('click', () => openSheet(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && com.classList.contains('open')) openSheet(false); });

  /* ---------- impasto: Napoli + Roma = Cagliari ---------- */
  const eq = $('#eq');
  if (eq && !reduce && 'IntersectionObserver' in window) {
    const r = eq.getBoundingClientRect();
    if (r.top > innerHeight) {
      eq.classList.add('pre');
      const io2 = new IntersectionObserver(es => { if (es[0].isIntersecting) { eq.classList.remove('pre'); io2.disconnect(); } }, { threshold: .35 });
      io2.observe(eq);
    }
  }
})();
