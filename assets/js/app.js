/* ==========================================================================
   MURAIYA OLBIA — Orario Live (Europe/Rome), Ricerca Corsie & Lista WhatsApp
   ========================================================================== */

(() => {
  'use strict';

  const WA_NUMBER = '393513779673';

  // 40 prodotti e categorie reali con prezzi verificati dai post @muraiyaolbia
  const PRODOTTI = [
    // CORSIA 01 — Asian Food & Snack
    { id: 'mogu-mogu', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Mogu Mogu (vari gusti con nata de coco)', price: '1,50 €', unit: 'bottiglia 320 ml', note: 'Litchi, mango, fragola, pesca, melone, cocco e uva' },
    { id: 'mochi-boba', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Mochi & Boba Mochi giapponesi', price: 'da 2,90 €', unit: 'confezione', note: 'Matcha, tiramisù, caramello salato, mirtillo, taro e litchi' },
    { id: 'spesa-asian-20', corsia: '01', cat: 'asian', stagione: false, under10: false, name: 'Cestino Spesa Asiatica Completa', price: '20,00 €', unit: 'selezione mista', note: 'Combinazione di ramen, salse, mochi, snack e bibite orientali' },
    { id: 'lays-speciali', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Patatine Lay’s gusti speciali asiatici', price: '3,30 €', unit: 'tubo / busta', note: 'Alga nori, lime, avocado, bistecca al pepe e gusti import' },
    { id: 'bibita-borraccia', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Bevanda asiatica con borraccia riutilizzabile', price: '5,50 €', unit: 'borraccia inclusa', note: 'Anche bibite a tema Anime, Meco e Starbucks iced coffee' },
    { id: 'ramen-kimchi', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Ramen istantanei, Udon, Yopokki & Kimchi', price: 'da 1,50 €', unit: 'a confezione', note: 'Ampia scelta piccante e classica + vermicelli di soia' },
    { id: 'sushi-kit', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Occorrente Sushi fatto in casa (Nori, riso, soia)', price: 'da 2,50 €', unit: 'a ingrediente', note: 'Alghe Nori 4,00 €, Kikkoman, poke sauce, wasabi e sriracha' },
    { id: 'latiao-pringles', corsia: '01', cat: 'asian', stagione: false, under10: true, name: 'Latiao speziati, Pringles tartufo & Fluffy Cake', price: 'da 1,90 €', unit: 'snack import', note: 'Anche Oreo gusti introvabili, caramelle Haribo e Fini' },

    // CORSIA 02 — Stagionale, Natale & Feste
    { id: 'alberi-natale', corsia: '02', cat: 'natale', stagione: true, under10: false, name: 'Alberi di Natale (verdi, innevati e slim + basi)', price: 'Reparto Natale', unit: 'varie altezze', note: 'Modelli da 120 cm fino a grandi formati con copribase' },
    { id: 'tema-grinch', corsia: '02', cat: 'natale', stagione: true, under10: true, name: 'Decorazioni natalizie collezione Grinch', price: 'Nuovi arrivi', unit: 'linea festiva', note: 'Pupazzi, targhe pendenti, sfere verdi e addobbi a tema' },
    { id: 'palline-ghirlande', corsia: '02', cat: 'natale', stagione: true, under10: true, name: 'Set palline di Natale, ghirlande & centrotavola', price: 'Set risparmio', unit: 'box assortiti', note: 'Finiture oro, argento, rosse, verdi e blu + luci LED' },
    { id: 'lampioni-cassette', corsia: '02', cat: 'natale', stagione: true, under10: false, name: 'Lampioni natalizi & cassette postali Babbo Natale', price: 'Allestimento', unit: 'interno / esterno', note: 'Decorazioni scenografiche per ingresso, casa e vetrine' },
    { id: 'cucce-natale', corsia: '02', cat: 'natale', stagione: true, under10: false, name: 'Cucce natalizie imbottite per cani e gatti', price: 'Ed. Inverno', unit: 'reparto stagionale', note: 'Morbide a tema feste per piccoli e medi animali' },

    // CORSIA 03 — Riscaldamento, Pellet & Clima
    { id: 'sacco-pellet', corsia: '03', cat: 'clima', stagione: true, under10: true, name: 'Sacco Pellet puro legno ENplus A1 (15 kg)', price: '7,49 €', unit: '7,20 € su pedana', note: 'Alta resa calorica · ritiro immediato con auto davanti ingresso' },
    { id: 'pedana-pellet', corsia: '03', cat: 'clima', stagione: true, under10: false, name: 'Pedana intera Pellet (70 sacchi da 15 kg)', price: '7,20 €', unit: 'al sacco (tot. 504 €)', note: 'Prezzo bloccato su bancale intero da 70 sacchi' },
    { id: 'stufa-bagno', corsia: '03', cat: 'clima', stagione: true, under10: true, name: 'Stufa termoventilatore compatta / da bagno', price: 'da 8,90 €', unit: 'pronta consegna', note: 'Ideale per scaldare rapidamente bagno e piccoli ambienti' },
    { id: 'termoconvettore', corsia: '03', cat: 'clima', stagione: true, under10: false, name: 'Termoconvettore elettrico regolabile', price: '36,90 €', unit: 'con termostato', note: 'Silenzioso per camere da letto, studio e soggiorno' },
    { id: 'stufa-carbonio', corsia: '03', cat: 'clima', stagione: true, under10: false, name: 'Stufa al carbonio oscillante', price: '43,90 €', unit: 'basso consumo', note: 'Calore immediato a infrarossi con griglia di sicurezza' },
    { id: 'fungo-esterno', corsia: '03', cat: 'clima', stagione: true, under10: false, name: 'Fungo riscaldante da esterno', price: '169,90 €', unit: 'per verande / dehors', note: 'Per giardini, terrazze coperte e attività commerciali' },
    { id: 'borsa-calda', corsia: '03', cat: 'clima', stagione: true, under10: true, name: 'Borsa dell’acqua calda elettrica ricaricabile', price: 'Corsia Clima', unit: 'in vari colori', note: 'Pronta in pochi minuti con spegnimento automatico' },

    // CORSIA 04 — Brico, Ferramenta & Auto
    { id: 'olio-auto', corsia: '04', cat: 'brico', stagione: false, under10: false, name: 'Olio motore 5W-40, additivi & spazzole tergicristallo', price: 'Reparto Auto', unit: 'tutte le misure', note: 'Anche liquidi radiatore/lavavetri, profumatori e cura auto' },
    { id: 'copriauto-set', corsia: '04', cat: 'brico', stagione: false, under10: false, name: 'Telo copriauto 4 stagioni, coprisedili & tappetini', price: 'Tutte le taglie', unit: 'fino a misura XL', note: 'Coprivolante, copricerchioni e accessori abitacolo' },
    { id: 'utensili-brico', corsia: '04', cat: 'brico', stagione: false, under10: true, name: 'Chiavi, cacciaviti, fascette & minuteria EmiTools', price: 'da 0,70 €', unit: 'ferramenta', note: 'Utensili manuali ed elettrici, scale e materiale elettrico' },
    { id: 'idropulitrice-2in1', corsia: '04', cat: 'brico', stagione: false, under10: false, name: 'Valigetta idropulitrice e soffiatore 2-in-1', price: 'Kit portatile', unit: 'con batteria', note: 'Pratica per lavaggio auto, balconi, moto e giardino' },

    // CORSIA 05 — Casa, Cucina & Caffè
    { id: 'caffe-portatile', corsia: '05', cat: 'casa', stagione: false, under10: false, name: 'Macchinetta del caffè espresso portatile', price: '39,90 €', unit: 'da viaggio / auto', note: 'Compatta, funziona con capsule e polvere di caffè' },
    { id: 'porta-cialde', corsia: '05', cat: 'casa', stagione: false, under10: false, name: 'Porta cialde caffè (cassetto ed espositori)', price: '19,90 €', unit: 'vari modelli', note: 'Disponibili anche cialde compatibili Nespresso e Dolce Gusto' },
    { id: 'pentole-thermos', corsia: '05', cat: 'casa', stagione: false, under10: true, name: 'Padelle, pentole, teglie forno & thermos inox', price: 'Corsia Cucina', unit: '500 ml / 750 ml / 1 L', note: 'Anche borraccia termica porta-smartphone, mestoli e contenitori' },
    { id: 'monouso-lilla', corsia: '05', cat: 'casa', stagione: false, under10: true, name: 'Piatti, bicchieri, tovaglie monouso & linea Lillà', price: 'da 1,45 €', unit: 'a confezione', note: 'Forniture pratiche per casa, feste ed eventi' },
    { id: 'trapunte-letto', corsia: '05', cat: 'casa', stagione: true, under10: true, name: 'Trapunte e copriletti scontati', price: 'da 6,99 €', unit: 'tessile casa', note: 'Misure singole e matrimoniali in varie fantasie' },

    // CORSIA 06 — Arredo, Mobili & Illuminazione
    { id: 'scarpiera-5', corsia: '06', cat: 'arredo', stagione: false, under10: false, name: 'Scarpiera salvaspazio impilabile a 5 scomparti', price: '12,90 €', unit: 'anche con specchio', note: 'Compatta per ingresso, ripostiglio o cabina armadio' },
    { id: 'mobili-sconto30', corsia: '06', cat: 'arredo', stagione: false, under10: false, name: 'Porta scope, cassettiere & vetrine arredo', price: 'Promo -30%', unit: 'da 67,80 €', note: 'Porta scope 67,80 € · cassettiera 74,40 € · vetrina 108,40 €' },
    { id: 'lampadari-led', corsia: '06', cat: 'arredo', stagione: false, under10: false, name: 'Lampadari LED, cristallo, corda & plafoniere', price: 'Corsia Luce', unit: 'ampia esposizione', note: 'Anche applique, lampade da tavolo e orologi da parete' },

    // CORSIA 07 — Giardino, Piante & Barbecue
    { id: 'piante-finte-vere', corsia: '07', cat: 'giardino', stagione: false, under10: true, name: 'Piante finte d’arredo, fiori & piantine vere', price: 'da 6,50 €', unit: 'con vasi coordinati', note: 'Vasi, sottovasi e fioriere da interno ed esterno' },
    { id: 'traliccio-verde', corsia: '07', cat: 'giardino', stagione: false, under10: true, name: 'Traliccio estensibile con fogliame decorativo', price: '7,90 €', unit: 'per balconi / recinzioni', note: 'Schermatura verde pronta da fissare su ringhiere e muri' },
    { id: 'barbecue-carbone', corsia: '07', cat: 'giardino', stagione: false, under10: false, name: 'Barbecue con griglia & sacchi carbone (2/5/10 kg)', price: '29,90 €', unit: 'set grigliata', note: 'Anche salottini outdoor, dondoli e ombrelloni da giardino' },

    // CORSIA 08 — Pet Shop, Cura Persona & Cartoleria
    { id: 'pet-shop', corsia: '08', cat: 'pet', stagione: false, under10: true, name: 'Guinzagli, pettorine, cucce, trasportini & crocchette', price: 'Pet Shop', unit: 'cani e gatti', note: 'Lettiere, ciotole, snack e passeggini per animali' },
    { id: 'detersivo-xxl', corsia: '08', cat: 'pet', stagione: false, under10: true, name: 'Detersivo bucato formato XXL & cura casa', price: '2,49 €', unit: 'formato convenienza', note: 'Ammorbidente 1,36 € · detersivo piatti da 0,96 €' },
    { id: 'malizia-astra', corsia: '08', cat: 'pet', stagione: false, under10: true, name: 'Bagnoschiuma Malizia (15+ profumi) & Astra Skin', price: '1,99 €', unit: '1 litro / skincare', note: 'Igiene quotidiana + nuova linea make-up e skincare Astra' },
    { id: 'risma-a4', corsia: '08', cat: 'pet', stagione: false, under10: true, name: 'Risma carta A4 (500 fogli), quaderni & scuola', price: '3,49 €', unit: '500 fogli 80 g', note: 'Raccoglitori, zaini, astucci, colori Giotto e ufficio' },
    { id: 'pacchi-sorpresa', corsia: '08', cat: 'pet', stagione: false, under10: true, name: 'Pacchi Sorpresa / Pacchi Smarriti', price: 'da 4,90 €', unit: '3 pacchi a 12,90 €', note: '1 pacco 5,90 € · 2 pacchi 9,90 € · 3 pacchi 12,90 €' }
  ];

  const state = {
    filter: 'all',
    query: '',
    when: 'Oggi',
    items: new Map(), // key -> { name, price, qty }
  };

  // Load saved list if available
  try {
    const raw = sessionStorage.getItem('muraiya_lista_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(it => {
          if (it && it.id && it.qty > 0) state.items.set(it.id, { name: it.name, price: it.price || '', qty: it.qty });
        });
      }
    }
  } catch (_) {}

  function saveState() {
    try {
      const arr = [...state.items.entries()].map(([id, v]) => ({ id, ...v }));
      sessionStorage.setItem('muraiya_lista_v1', JSON.stringify(arr));
    } catch (_) {}
  }

  // 1. LIVE HOURS BADGE (Europe/Rome: 08:30 - 20:30, 7 days a week including Sunday)
  function updateLiveHours() {
    const badges = document.querySelectorAll('[data-live-hours]');
    const detailEl = document.getElementById('orario-live-detail');
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        hour12: false
      }).formatToParts(now);

      const h = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
      const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
      const day = parts.find(p => p.type === 'weekday')?.value || '';
      const mins = h * 60 + m;
      // 08:30 = 510, 20:30 = 1230
      const isOpen = mins >= 510 && mins < 1230;
      const closingSoon = isOpen && mins >= 1170; // after 19:30

      const label = isOpen
        ? (closingSoon ? 'APERTO ORA · chiude alle 20:30' : 'APERTO ORA · 8:30–20:30')
        : (mins < 510 ? 'CHIUSO ORA · apre oggi 8:30' : 'CHIUSO ORA · apre domani 8:30');

      badges.forEach(b => {
        b.setAttribute('data-open', isOpen ? 'true' : 'false');
        const txt = b.querySelector('.live-text');
        if (txt) txt.textContent = label;
      });

      if (detailEl) {
        const dayCap = day ? day.charAt(0).toUpperCase() + day.slice(1) : 'Oggi';
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        detailEl.textContent = isOpen
          ? `${dayCap}, ore ${hh}:${mm} a Olbia — Negozio aperto con orario continuato fino alle 20:30.`
          : `${dayCap}, ore ${hh}:${mm} a Olbia — Riapre alle 08:30 (aperto 7 giorni su 7, inclusa la domenica).`;
      }
    } catch (_) {}
  }

  // 2. ESCAPE HTML HELPER
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 3. FILTER & RENDER PRODUCTS
  const gridEl = document.getElementById('prodotti-grid');
  const countEl = document.getElementById('results-count');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');

  function matchesProduct(p) {
    if (state.filter === 'under10' && !p.under10) return false;
    if (state.filter === 'stagione' && !p.stagione) return false;
    if (state.filter !== 'all' && state.filter !== 'under10' && state.filter !== 'stagione' && p.cat !== state.filter) {
      return false;
    }
    if (state.query) {
      const q = state.query.toLowerCase();
      const hay = `${p.name} ${p.note} ${p.price} ${p.unit} corsia ${p.corsia}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  }

  function renderProducts() {
    if (!gridEl) return;
    const list = PRODOTTI.filter(matchesProduct);
    if (countEl) {
      countEl.textContent = `${list.length} ${list.length === 1 ? 'articolo mostrato' : 'articoli a banco'}`;
    }
    if (clearBtn) {
      clearBtn.hidden = !state.query;
    }

    if (list.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-search">
          <p style="margin:0 0 10px;font-weight:700;font-size:1.05rem;">Nessun articolo in elenco per «${esc(state.query)}».</p>
          <p style="margin:0 0 16px;color:var(--testo-sec);font-size:0.92rem;">In negozio abbiamo migliaia di referenze: puoi scriverlo direttamente nel campo «Altro prodotto» qui accanto e chiedere disponibilità su WhatsApp.</p>
          <button type="button" class="btn btn-secondary" id="btn-reset-filters">Mostra tutti i ${PRODOTTI.length} articoli</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.filter = 'all';
          state.query = '';
          if (searchInput) searchInput.value = '';
          syncFilterChips();
          renderProducts();
        });
      }
      return;
    }

    gridEl.innerHTML = list.map(p => {
      const entry = state.items.get(p.id);
      const qty = entry ? entry.qty : 0;
      return `
        <article class="prod-item${qty > 0 ? ' in-list' : ''}" data-prod-id="${esc(p.id)}">
          <div>
            <div class="prod-top">
              <span class="prod-corsia tabular">CORSIA ${esc(p.corsia)}</span>
            </div>
            <h3 class="prod-name">${esc(p.name)}</h3>
            <p class="prod-note">${esc(p.note)}</p>
          </div>
          <div class="prod-bottom">
            <div>
              <span class="scaffale-tag tabular">${esc(p.price)}</span>
              <span class="prod-unit">${esc(p.unit)}</span>
            </div>
            ${qty === 0
              ? `<button type="button" class="btn-ask" data-action="add" data-id="${esc(p.id)}" aria-label="Aggiungi ${esc(p.name)} alla richiesta">+ Chiedi</button>`
              : `<div class="qty-ctrl" role="group" aria-label="Quantità per ${esc(p.name)}">
                   <button type="button" class="qty-btn" data-action="dec" data-id="${esc(p.id)}" aria-label="Riduci quantità">−</button>
                   <span class="qty-val tabular">${qty}</span>
                   <button type="button" class="qty-btn" data-action="inc" data-id="${esc(p.id)}" aria-label="Aumenta quantità">+</button>
                 </div>`
            }
          </div>
        </article>
      `;
    }).join('');
  }

  // 4. BUILD WHATSAPP MESSAGE & RENDER REQUEST PANEL
  function buildWaMessage() {
    const entries = [...state.items.values()];
    if (entries.length === 0) {
      return 'Ciao Muraiya Olbia! Vorrei chiedere informazioni sulla disponibilità di alcuni articoli nel punto vendita di Via India 3.';
    }
    const lines = entries.map(it => {
      const qStr = it.qty > 1 ? ` (x${it.qty})` : '';
      const pStr = it.price ? ` [${it.price}]` : '';
      return `• ${it.name}${qStr}${pStr}`;
    });
    return `Ciao Muraiya Olbia! Vorrei sapere se avete disponibili in negozio in Via India 3:\n${lines.join('\n')}\n\nPasserei per l'acquisto in negozio: ${state.when}. Grazie!`;
  }

  function renderPanel() {
    const selList = document.getElementById('selected-list');
    const previewEl = document.getElementById('wa-preview');
    const waSend = document.getElementById('wa-send');
    const totalQty = [...state.items.values()].reduce((acc, v) => acc + v.qty, 0);

    document.querySelectorAll('[data-list-count]').forEach(el => {
      el.textContent = String(totalQty);
    });

    if (selList) {
      if (state.items.size === 0) {
        selList.innerHTML = `<li class="sel-row" style="color:var(--testo-sec);">Nessun articolo selezionato. Premi «+ Chiedi» sui prodotti o scrivi qui sotto cosa cerchi.</li>`;
      } else {
        selList.innerHTML = [...state.items.entries()].map(([id, it]) => `
          <li class="sel-row">
            <span class="sel-title">${esc(it.name)}${it.qty > 1 ? ` <strong class="tabular">×${it.qty}</strong>` : ''}</span>
            <button type="button" class="sel-remove" data-remove-id="${esc(id)}" aria-label="Rimuovi ${esc(it.name)}">×</button>
          </li>
        `).join('');
      }
    }

    const msg = buildWaMessage();
    if (previewEl) previewEl.textContent = msg;
    if (waSend) {
      waSend.setAttribute('href', `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);
    }
    saveState();
  }

  function syncFilterChips() {
    document.querySelectorAll('.chip[data-filter]').forEach(ch => {
      const active = ch.getAttribute('data-filter') === state.filter;
      ch.classList.toggle('is-active', active);
      ch.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function modifyItem(id, delta) {
    const prod = PRODOTTI.find(p => p.id === id);
    const cur = state.items.get(id);
    if (!cur && delta > 0 && prod) {
      state.items.set(id, { name: prod.name, price: prod.price, qty: 1 });
    } else if (cur) {
      const next = cur.qty + delta;
      if (next <= 0) state.items.delete(id);
      else cur.qty = next;
    }
    renderProducts();
    renderPanel();
  }

  // Event delegation on product grid
  if (gridEl) {
    gridEl.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const act = btn.getAttribute('data-action');
      if (act === 'add' || act === 'inc') modifyItem(id, 1);
      if (act === 'dec') modifyItem(id, -1);
    });
  }

  // Remove item in panel
  const selListEl = document.getElementById('selected-list');
  if (selListEl) {
    selListEl.addEventListener('click', e => {
      const rm = e.target.closest('button[data-remove-id]');
      if (!rm) return;
      state.items.delete(rm.getAttribute('data-remove-id'));
      renderProducts();
      renderPanel();
    });
  }

  // Filter chips
  document.querySelectorAll('.chip[data-filter]').forEach(ch => {
    ch.addEventListener('click', () => {
      state.filter = ch.getAttribute('data-filter') || 'all';
      syncFilterChips();
      renderProducts();
    });
  });

  // Corsia cards -> jump & filter catalog
  document.querySelectorAll('[data-jump-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-jump-filter') || 'all';
      state.filter = f;
      state.query = '';
      if (searchInput) searchInput.value = '';
      syncFilterChips();
      renderProducts();
      const catSec = document.getElementById('catalogo');
      if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Quick add buttons in Focus section (e.g. Pellet / Spesa Asian)
  document.querySelectorAll('[data-quick-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-quick-item');
      modifyItem(id, 1);
      if (window.innerWidth <= 1040) {
        openDrawer();
      } else {
        const catSec = document.getElementById('catalogo');
        if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.query = searchInput.value.trim();
      renderProducts();
    });
  }
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      state.query = '';
      searchInput.value = '';
      searchInput.focus();
      renderProducts();
    });
  }

  // Custom free-text item form
  const customForm = document.getElementById('custom-add-form');
  const customInput = document.getElementById('custom-item-input');
  if (customForm && customInput) {
    customForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = customInput.value.trim();
      if (!val) return;
      const id = 'custom-' + val.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32);
      const existing = state.items.get(id);
      if (existing) existing.qty += 1;
      else state.items.set(id, { name: val, price: 'da verificare', qty: 1 });
      customInput.value = '';
      renderPanel();
    });
  }

  // When selector
  document.querySelectorAll('.when-opt[data-when]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.when = btn.getAttribute('data-when') || 'Oggi';
      document.querySelectorAll('.when-opt[data-when]').forEach(b => {
        b.classList.toggle('is-active', b === btn);
      });
      renderPanel();
    });
  });

  // Mobile drawer open/close
  const panelEl = document.getElementById('richiesta-panel');
  const backdropEl = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('drawer-close');

  function openDrawer() {
    if (window.innerWidth <= 1040 && panelEl && backdropEl) {
      panelEl.classList.add('is-open');
      backdropEl.classList.add('is-open');
    } else if (panelEl) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function closeDrawer() {
    if (panelEl) panelEl.classList.remove('is-open');
    if (backdropEl) backdropEl.classList.remove('is-open');
  }

  document.querySelectorAll('[data-open-drawer]').forEach(b => {
    b.addEventListener('click', openDrawer);
  });
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (backdropEl) backdropEl.addEventListener('click', closeDrawer);

  // Mobile bottom bar "Cerca nei Reparti" focuses search input
  const mbarSearch = document.getElementById('mbar-search');
  if (mbarSearch && searchInput) {
    mbarSearch.addEventListener('click', e => {
      e.preventDefault();
      closeDrawer();
      const catSec = document.getElementById('catalogo');
      if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => searchInput.focus({ preventScroll: true }), 350);
    });
  }

  // Mobile header menu toggle
  const menuBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (mobileMenu && menuBtn) {
        mobileMenu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Init
  updateLiveHours();
  setInterval(updateLiveHours, 60000);
  syncFilterChips();
  renderProducts();
  renderPanel();
})();
