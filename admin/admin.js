/* Pannello La Real Cucina — testi, foto, carta, orari, contatti. Dati su Supabase (tabelle site_*). */
(function () {
'use strict';
var CFG = {
  url: 'https://ntcofaxoxjvzovkqgypy.supabase.co',
  key: 'sb_publishable_tCgLTY5zUUG2M1wsUi0iSw_ErBATyaM',
  site: 'larealcucina',
  bucket: 'site-media'
};
var sb = window.supabase.createClient(CFG.url, CFG.key, {auth: {persistSession: true, storageKey: 'pannello-' + CFG.site}});
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var el = function (tag, attrs, figli) {
  var e = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function (k) {
    if (k === 'text') e.textContent = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
  });
  (figli || []).forEach(function (f) { if (f) e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
  return e;
};

/* ---------- stato ---------- */
var CAMPI = [];          // da campi.json (testi e foto del sito, con valori predefiniti)
var VAL = {};            // valori salvati su Supabase: chiave -> testo
var MENU = [];           // righe di site_menu
var MODIFICHE = {};      // chiave -> nuovo valore (testi, foto, contatti, orari)
var scheda = 'carta';

var toast = function (t, errore) {
  var d = el('div', {'class': 'toast' + (errore ? ' err' : ''), role: 'status', text: t});
  document.body.appendChild(d);
  setTimeout(function () { d.remove(); }, errore ? 6000 : 2800);
};
var messaggioErrore = function (e) {
  var m = (e && (e.message || e.error_description || e.msg)) || String(e || '');
  if (/Invalid login/i.test(m)) return 'Utente o password non corretti.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Connessione assente. Riprovate tra poco.';
  if (/row-level security|permission/i.test(m)) return 'Questo account non può modificare il sito.';
  if (/JWT|expired/i.test(m)) return 'La sessione è scaduta: uscite e rientrate.';
  return 'Qualcosa non ha funzionato: ' + m;
};
var urlFoto = function (v) {
  v = String(v || '').trim();
  if (!v) return '';
  if (/^https:\/\//.test(v)) return v;
  return location.origin + '/' + v.replace(/^(\.\.\/|\.?\/)+/, '');
};
// se una foto non si carica (rete lenta, sito in aggiornamento) riprova da sola fino a 3 volte
var conRiprova = function (img) {
  var n = 0;
  img.addEventListener('error', function () {
    if (n >= 3 || !img.getAttribute('src')) return;
    n++;
    var base = img.getAttribute('src').replace(/[?&]r=\d+$/, '');
    setTimeout(function () { img.src = base + (base.indexOf('?') === -1 ? '?' : '&') + 'r=' + Date.now(); }, 1500 * n);
  });
  return img;
};
var valore = function (chiave, predefinito) { return chiave in MODIFICHE ? MODIFICHE[chiave] : (chiave in VAL ? VAL[chiave] : (predefinito || '')); };

/* ---------- accesso ---------- */
var mostraPannello = function (si) {
  $('#v-accesso').classList.toggle('nascosto', si);
  $('#v-pannello').classList.toggle('nascosto', !si);
};
$('#f-accesso').addEventListener('submit', function (e) {
  e.preventDefault();
  var b = $('#b-accedi'); b.disabled = true; b.textContent = 'Accesso…';
  $('#err-accesso').textContent = '';
  var utente = $('#email').value.trim().toLowerCase();
  if (utente.indexOf('@') === -1) utente += '@websardegna.xyz';
  sb.auth.signInWithPassword({email: utente, password: $('#password').value})
    .then(function (r) {
      if (r.error) throw r.error;
      return avvia();
    })
    .catch(function (err) { $('#err-accesso').textContent = messaggioErrore(err); })
    .then(function () { b.disabled = false; b.textContent = 'Entra'; });
});
$('#b-esci').addEventListener('click', function () {
  if (Object.keys(MODIFICHE).length && !confirm('Ci sono modifiche non salvate. Uscire lo stesso?')) return;
  sb.auth.signOut().then(function () { MODIFICHE = {}; mostraPannello(false); });
});

var avvia = function () {
  return sb.from('site_editors').select('site').eq('site', CFG.site).then(function (r) {
    if (r.error) throw r.error;
    if (!r.data.length) { sb.auth.signOut(); throw new Error('Questo account non può modificare La Real Cucina.'); }
    mostraPannello(true);
    return carica();
  });
};

var carica = function () {
  $('#contenuto').innerHTML = '<p class="caricamento">Caricamento…</p>';
  return Promise.all([
    fetch('campi.json', {cache: 'no-store'}).then(function (r) { return r.json(); }),
    sb.from('site_content').select('key,value').eq('site', CFG.site),
    sb.from('site_menu').select('*').eq('site', CFG.site).order('ordine').order('id')
  ]).then(function (r) {
    if (r[1].error) throw r[1].error;
    if (r[2].error) throw r[2].error;
    CAMPI = r[0];
    VAL = {};
    r[1].data.forEach(function (x) { VAL[x.key] = x.value; });
    MENU = r[2].data;
    MODIFICHE = {};
    aggiornaBarra();
    disegna();
  }).catch(function (e) { $('#contenuto').innerHTML = ''; $('#contenuto').appendChild(el('p', {'class': 'errore', text: messaggioErrore(e)})); });
};

/* ---------- schede ---------- */
$$('[data-scheda]').forEach(function (b) {
  b.addEventListener('click', function () {
    scheda = b.getAttribute('data-scheda');
    $$('[data-scheda]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
    disegna();
    window.scrollTo(0, 0);
  });
});
var disegna = function () {
  var m = $('#contenuto'); m.innerHTML = '';
  ({carta: vistaCarta, testi: vistaTesti, foto: vistaFoto, orari: vistaOrari, contatti: vistaContatti, google: vistaGoogle})[scheda](m);
};

/* ---------- modifiche e salvataggio (testi, foto, contatti, orari) ---------- */
var aggiornaBarra = function () {
  var n = Object.keys(MODIFICHE).length;
  $('#barra-salva').classList.toggle('nascosto', !n);
  $('#barra-testo').textContent = n === 1 ? '1 modifica da salvare' : n + ' modifiche da salvare';
};
var segnaModifica = function (chiave, v, input, predefinito) {
  var originale = chiave in VAL ? VAL[chiave] : (predefinito || '');
  if (v === originale) delete MODIFICHE[chiave]; else MODIFICHE[chiave] = v;
  if (input) input.classList.toggle('modificato', chiave in MODIFICHE);
  aggiornaBarra();
};
$('#b-salva').addEventListener('click', function () {
  var b = this, chiavi = Object.keys(MODIFICHE);
  if (!chiavi.length) return;
  b.disabled = true; b.textContent = 'Salvataggio…';
  var righe = chiavi.map(function (k) { return {site: CFG.site, key: k, value: MODIFICHE[k]}; });
  sb.from('site_content').upsert(righe, {onConflict: 'site,key'}).then(function (r) {
    if (r.error) throw r.error;
    chiavi.forEach(function (k) { VAL[k] = MODIFICHE[k]; });
    MODIFICHE = {};
    aggiornaBarra(); disegna();
    toast('Salvato. Il sito è già aggiornato.');
  }).catch(function (e) { toast(messaggioErrore(e), true); })
    .then(function () { b.disabled = false; b.textContent = 'Salva le modifiche'; });
});
window.addEventListener('beforeunload', function (e) { if (Object.keys(MODIFICHE).length) { e.preventDefault(); e.returnValue = ''; } });

var campoTesto = function (chiave, etichetta, predefinito, opz) {
  opz = opz || {};
  var id = 'c-' + chiave;
  var lungo = opz.lungo || (predefinito || '').length > 60 || /\n/.test(predefinito || '');
  var inp = el(lungo ? 'textarea' : 'input', {id: id, type: lungo ? null : (opz.tipo || 'text'), placeholder: opz.placeholder || null});
  inp.value = valore(chiave, predefinito);
  if (lungo) inp.rows = Math.min(8, Math.max(2, Math.ceil(inp.value.length / 60) + (inp.value.split('\n').length - 1)));
  inp.classList.toggle('modificato', chiave in MODIFICHE);
  inp.addEventListener('input', function () { segnaModifica(chiave, inp.value, inp, predefinito); });
  var piede = el('div', {'class': 'piede'});
  if (opz.aiuto) piede.appendChild(el('span', {'class': 'aiuto', text: opz.aiuto}));
  if (predefinito != null && chiave in VAL && VAL[chiave] !== predefinito && !opz.senzaRipristino) {
    piede.appendChild(el('button', {'class': 'link-ripristina', type: 'button', text: 'Torna al testo originale', onclick: function () {
      inp.value = predefinito; segnaModifica(chiave, predefinito, inp, predefinito);
    }}));
  }
  return el('div', {'class': 'campo'}, [el('label', {'for': id, text: etichetta}), inp, piede.childNodes.length ? piede : null]);
};

/* ---------- TESTI ---------- */
var AIUTO = {
  testo: 'Per il corsivo scrivete tra asterischi: *così*. Per un link: [testo](https://indirizzo).',
  righe: 'Ogni riga del riquadro è una riga del titolo. Corsivo: *così*.',
  lista: 'Una voce per riga.'
};
var vistaTesti = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'Tutti i testi del sito, nell’ordine in cui compaiono. Cambiate quello che volete e premete “Salva le modifiche” in basso.'}));
  var sezioni = {};
  CAMPI.filter(function (c) { return c.tipo !== 'foto'; }).forEach(function (c) { (sezioni[c.sezione] = sezioni[c.sezione] || []).push(c); });
  Object.keys(sezioni).forEach(function (s) {
    m.appendChild(el('h2', {text: s}));
    var box = el('div', {'class': 'scheda'});
    sezioni[s].forEach(function (c) {
      var aiuto = c.tipo === 'righe' ? AIUTO.righe : c.tipo === 'lista' ? AIUTO.lista : (/\*|\[/.test(c.predefinito) ? AIUTO.testo : null);
      box.appendChild(campoTesto(c.chiave, c.etichetta.replace(/\s*\(.*\)$/, ''), c.predefinito, {aiuto: aiuto, lungo: c.tipo !== 'testo' || c.predefinito.length > 60}));
    });
    m.appendChild(box);
  });
};

/* ---------- FOTO (caricamento ridimensionato nel browser) ---------- */
var scegliFoto = function () {
  return new Promise(function (ok, ko) {
    var f = $('#file'); f.value = '';
    f.onchange = function () { f.files[0] ? ok(f.files[0]) : ko(new Error('Nessuna foto')); };
    f.click();
  });
};
var riduci = function (file, lato) {
  return new Promise(function (ok, ko) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var s = Math.min(1, lato / Math.max(img.naturalWidth, img.naturalHeight));
      var c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(function (b) { b ? ok(b) : ko(new Error('Foto non leggibile')); }, 'image/jpeg', 0.84);
    };
    img.onerror = function () { ko(new Error('Questo file non è una foto leggibile (usate JPG o PNG).')); };
    img.src = url;
  });
};
var carica_foto = function (nome) {
  return scegliFoto().then(function (f) { return riduci(f, 1600); }).then(function (blob) {
    var path = CFG.site + '/' + nome + '-' + Date.now() + '.jpg';
    return sb.storage.from(CFG.bucket).upload(path, blob, {contentType: 'image/jpeg', cacheControl: '31536000', upsert: false}).then(function (r) {
      if (r.error) throw r.error;
      return sb.storage.from(CFG.bucket).getPublicUrl(path).data.publicUrl;
    });
  });
};
var vistaFoto = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'Le foto grandi del sito. Per le foto dei piatti andate in “La carta”. Le foto vengono rimpicciolite da sole: potete caricarle direttamente dal telefono.'}));
  var g = el('div', {'class': 'griglia-foto'});
  CAMPI.filter(function (c) { return c.tipo === 'foto'; }).forEach(function (c) {
    var src = valore(c.chiave, c.predefinito);
    var img = conRiprova(el('img', {src: urlFoto(src), alt: ''}));
    var box = el('div', {'class': 'scheda'}, [el('strong', {text: c.sezione + ' · ' + c.etichetta}), el('div', {style: 'height:10px'}), img]);
    var com = el('div', {'class': 'comandi'});
    com.appendChild(el('button', {'class': 'btn piccolo', type: 'button', text: 'Carica nuova foto', onclick: function () {
      var b = this; b.disabled = true; b.textContent = 'Caricamento…';
      carica_foto(c.chiave).then(function (u) { img.src = u; segnaModifica(c.chiave, u, null, c.predefinito); toast('Foto pronta: premete “Salva le modifiche”.'); })
        .catch(function (e) { if (!/Nessuna foto/.test(e.message)) toast(messaggioErrore(e), true); })
        .then(function () { b.disabled = false; b.textContent = 'Carica nuova foto'; });
    }}));
    if (src !== c.predefinito) com.appendChild(el('button', {'class': 'btn piccolo secondario', type: 'button', text: 'Torna alla foto originale', onclick: function () {
      img.src = urlFoto(c.predefinito); segnaModifica(c.chiave, c.predefinito, null, c.predefinito);
    }}));
    box.appendChild(com);
    box.appendChild(campoTesto(c.chiave + '_alt', 'Descrizione della foto (per chi non vede e per Google)', c.alt, {lungo: true, senzaRipristino: true}));
    g.appendChild(box);
  });
  m.appendChild(g);
};

/* ---------- CONTATTI ---------- */
var vistaContatti = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'Questi dati aggiornano tutti i pulsanti del sito: chiama, WhatsApp, Instagram, indicazioni stradali e prenotazione.'}));
  var box = el('div', {'class': 'scheda'});
  box.appendChild(campoTesto('telefono', 'Telefono (come si legge sul sito)', '', {tipo: 'tel', placeholder: '+39 339 125 7711'}));
  box.appendChild(campoTesto('whatsapp', 'Numero WhatsApp (con 39 davanti, senza spazi)', '', {tipo: 'tel', placeholder: '393391257711'}));
  box.appendChild(campoTesto('instagram', 'Nome Instagram (senza @)', '', {placeholder: 'larealcucina'}));
  box.appendChild(campoTesto('indirizzo_mappa', 'Indirizzo per le indicazioni stradali', '', {placeholder: 'Via della Consolata 7D, 10122 Torino'}));
  box.appendChild(campoTesto('link_prenotazione', 'Link per prenotare online (lasciate vuoto per usare WhatsApp)', '', {tipo: 'url', placeholder: 'https://…', aiuto: 'Quando c’è un link, tutti i pulsanti “Prenota” portano lì.'}));
  m.appendChild(box);
  m.appendChild(el('p', {'class': 'aiuto', text: 'L’indirizzo scritto sulla pagina si cambia in “Testi” → Orari e dove.'}));
};

/* ---------- GOOGLE ---------- */
var vistaGoogle = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'Come appare il sito nei risultati di Google e quando lo condividete su WhatsApp.'}));
  var box = el('div', {'class': 'scheda'});
  box.appendChild(campoTesto('meta_titolo', 'Titolo (circa 60 caratteri)', '', {}));
  box.appendChild(campoTesto('meta_descrizione', 'Descrizione (circa 150 caratteri)', '', {lungo: true}));
  m.appendChild(box);
};

/* ---------- ORARI ---------- */
var GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
var IDX = [1, 2, 3, 4, 5, 6, 0];
var vistaOrari = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'Questi orari decidono la scritta “Aperto ora / Chiuso ora” e i giorni che si possono scegliere nel modulo di prenotazione.'}));
  m.appendChild(el('div', {'class': 'avviso', html: 'Se cambiate gli orari, aggiornate anche le frasi scritte sul sito in <b>Testi</b> (Prima pagina → Orari in breve, Prenota → Riquadro “Orari”, Orari e dove).'}));
  var o;
  try { o = JSON.parse(valore('orari_settimana', '{}')) || {}; } catch (e) { o = {}; }
  var salva = function () { segnaModifica('orari_settimana', JSON.stringify(o), null, VAL.orari_settimana); };
  var tab = el('table', {'class': 'orari'});
  tab.appendChild(el('thead', null, [el('tr', null, [el('th', {text: 'Giorno'}), el('th', {text: 'Pranzo'}), el('th', {text: 'Cena'})])]));
  var tb = el('tbody');
  IDX.forEach(function (d, i) {
    o[d] = o[d] || {pranzo: '', cena: ''};
    var tr = el('tr', null, [el('td', {'class': 'giorno', text: GIORNI[i]})]);
    ['pranzo', 'cena'].forEach(function (sv) {
      var p = String(o[d][sv] || '').split('-');
      var a = el('input', {type: 'time', value: p[0] || '', 'aria-label': GIORNI[i] + ' ' + sv + ' dalle'});
      var b = el('input', {type: 'time', value: p[1] || '', 'aria-label': GIORNI[i] + ' ' + sv + ' alle'});
      var chiuso = el('input', {type: 'checkbox'}); chiuso.checked = !o[d][sv];
      var agg = function () {
        a.disabled = b.disabled = chiuso.checked;
        o[d][sv] = chiuso.checked || !a.value || !b.value ? '' : a.value + '-' + b.value;
        salva();
      };
      a.addEventListener('change', agg); b.addEventListener('change', agg);
      chiuso.addEventListener('change', function () { if (!chiuso.checked && !a.value) { a.value = sv === 'pranzo' ? '12:00' : '19:00'; b.value = sv === 'pranzo' ? '15:00' : '22:00'; } agg(); });
      a.disabled = b.disabled = chiuso.checked;
      tr.appendChild(el('td', {'data-l': sv === 'pranzo' ? 'Pranzo' : 'Cena'}, [el('div', {'class': 'fascia'}, [a, '–', b, el('label', {'class': 'interruttore'}, [chiuso, 'chiuso'])])]));
    });
    tb.appendChild(tr);
  });
  tab.appendChild(tb);
  m.appendChild(el('div', {'class': 'scheda'}, [tab]));
};

/* ---------- LA CARTA ---------- */
var categorie = function () {
  var c = valore('menu_categorie', '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
  MENU.forEach(function (p) { if (p.categoria && c.indexOf(p.categoria) === -1) c.push(p.categoria); });
  return c;
};
var salvaCategorie = function (lista) {
  return sb.from('site_content').upsert({site: CFG.site, key: 'menu_categorie', value: lista.join('\n')}, {onConflict: 'site,key'}).then(function (r) {
    if (r.error) throw r.error; VAL.menu_categorie = lista.join('\n'); delete MODIFICHE.menu_categorie;
  });
};
var salvaPiatto = function (p, campi) {
  return sb.from('site_menu').update(campi).eq('id', p.id).select().single().then(function (r) {
    if (r.error) throw r.error; Object.assign(p, r.data);
  });
};
// Se un piatto cambia nome e una didascalia del sito porta lo stesso nome
// (es. la foto in copertina), la aggiorna insieme: così il nome cambia ovunque.
var allineaDidascalie = function (vecchio, nuovo) {
  if (!vecchio || vecchio === nuovo) return Promise.resolve();
  var righe = CAMPI.filter(function (c) {
    return c.tipo === 'testo' && !(c.chiave in MODIFICHE) && String(valore(c.chiave, c.predefinito)).trim() === vecchio.trim();
  }).map(function (c) { return {site: CFG.site, key: c.chiave, value: nuovo}; });
  if (!righe.length) return Promise.resolve();
  return sb.from('site_content').upsert(righe, {onConflict: 'site,key'}).then(function (r) {
    if (r.error) throw r.error;
    righe.forEach(function (x) { VAL[x.key] = x.value; });
    toast('Aggiornata anche la didascalia della foto con il nuovo nome.');
  });
};
var vistaCarta = function (m) {
  m.appendChild(el('p', {'class': 'intro', text: 'I piatti della carta. Ogni piatto si salva da solo con il suo pulsante. Togliete la spunta “Sul sito” per nascondere un piatto senza cancellarlo.'}));
  var cats = categorie();
  cats.forEach(function (cat, ci) {
    var piatti = MENU.filter(function (p) { return p.categoria === cat; }).sort(function (a, b) { return a.ordine - b.ordine || a.id - b.id; });
    var sez = el('div', {'class': 'cat'});
    var testa = el('div', {'class': 'cat-testa'}, [el('h3', {text: cat})]);
    var sp = el('span', {'class': 'sposta'}, [
      el('button', {type: 'button', title: 'Sposta su', 'aria-label': 'Sposta categoria su', text: '↑', disabled: ci === 0, onclick: function () { var l = cats.slice(); l.splice(ci - 1, 0, l.splice(ci, 1)[0]); salvaCategorie(l).then(disegna).catch(function (e) { toast(messaggioErrore(e), true); }); }}),
      el('button', {type: 'button', title: 'Sposta giù', 'aria-label': 'Sposta categoria giù', text: '↓', disabled: ci === cats.length - 1, onclick: function () { var l = cats.slice(); l.splice(ci + 1, 0, l.splice(ci, 1)[0]); salvaCategorie(l).then(disegna).catch(function (e) { toast(messaggioErrore(e), true); }); }})
    ]);
    testa.appendChild(sp);
    testa.appendChild(el('button', {'class': 'btn piccolo secondario', type: 'button', text: 'Rinomina', onclick: function () {
      var n = prompt('Nuovo nome della categoria:', cat); if (!n || !n.trim() || n.trim() === cat) return; n = n.trim();
      var l = cats.map(function (x) { return x === cat ? n : x; });
      sb.from('site_menu').update({categoria: n}).eq('site', CFG.site).eq('categoria', cat).then(function (r) {
        if (r.error) throw r.error; MENU.forEach(function (p) { if (p.categoria === cat) p.categoria = n; }); return salvaCategorie(l);
      }).then(function () { disegna(); toast('Categoria rinominata.'); }).catch(function (e) { toast(messaggioErrore(e), true); });
    }}));
    if (!piatti.length) testa.appendChild(el('button', {'class': 'btn piccolo pericolo', type: 'button', text: 'Elimina', onclick: function () {
      salvaCategorie(cats.filter(function (x) { return x !== cat; })).then(disegna).catch(function (e) { toast(messaggioErrore(e), true); });
    }}));
    sez.appendChild(testa);
    piatti.forEach(function (p, pi) { sez.appendChild(schedaPiatto(p, piatti, pi)); });
    sez.appendChild(el('button', {'class': 'btn piccolo secondario', type: 'button', text: '+ Aggiungi un piatto in “' + cat + '”', onclick: function () {
      var b = this; b.disabled = true;
      var ordine = piatti.length ? piatti[piatti.length - 1].ordine + 10 : 10;
      sb.from('site_menu').insert({site: CFG.site, categoria: cat, ordine: ordine, nome: 'Nuovo piatto', attivo: false}).select().single().then(function (r) {
        if (r.error) throw r.error; MENU.push(r.data); disegna(); toast('Piatto aggiunto (nascosto): scrivete nome e descrizione, poi salvate.');
      }).catch(function (e) { b.disabled = false; toast(messaggioErrore(e), true); });
    }}));
    m.appendChild(sez);
  });
  m.appendChild(el('button', {'class': 'btn', type: 'button', text: '+ Nuova categoria', onclick: function () {
    var n = prompt('Nome della nuova categoria (per esempio “Piatti del giorno”):'); if (!n || !n.trim()) return;
    if (cats.indexOf(n.trim()) !== -1) { toast('Questa categoria c’è già.', true); return; }
    salvaCategorie(cats.concat([n.trim()])).then(function () { disegna(); toast('Categoria creata: ora aggiungete i piatti.'); }).catch(function (e) { toast(messaggioErrore(e), true); });
  }}));
};
var schedaPiatto = function (p, piatti, pi) {
  var box = el('div', {'class': 'piatto' + (p.attivo ? '' : ' spento')});
  var foto = el('div', {'class': 'foto' + (p.foto ? '' : ' vuota')});
  var mostraFoto = function () {
    foto.textContent = p.foto ? '' : 'Nessuna foto'; foto.className = 'foto' + (p.foto ? '' : ' vuota');
    foto.style.backgroundImage = '';
    if (!p.foto) return;
    var pre = conRiprova(new Image());
    pre.onload = function () { foto.style.backgroundImage = 'url("' + pre.src + '")'; };
    pre.src = urlFoto(p.foto);
  };
  mostraFoto();
  var nome = el('input', {type: 'text', 'aria-label': 'Nome del piatto'}); nome.value = p.nome;
  var desc = el('textarea', {rows: 2, 'aria-label': 'Descrizione'}); desc.value = p.descrizione;
  var prezzo = el('input', {type: 'text', 'aria-label': 'Prezzo', placeholder: 'es. 14'}); prezzo.value = p.prezzo;
  var attivo = el('input', {type: 'checkbox'}); attivo.checked = p.attivo;
  var stato = el('span', {'class': 'stato'});
  var salva = el('button', {'class': 'btn piccolo', type: 'button', text: 'Salva', disabled: true});
  var sporco = function () {
    var d = nome.value !== p.nome || desc.value !== p.descrizione || prezzo.value !== p.prezzo || attivo.checked !== p.attivo;
    salva.disabled = !d; stato.textContent = d ? 'da salvare' : ''; stato.className = 'stato';
    nome.classList.toggle('modificato', nome.value !== p.nome);
    desc.classList.toggle('modificato', desc.value !== p.descrizione);
    prezzo.classList.toggle('modificato', prezzo.value !== p.prezzo);
  };
  [nome, desc, prezzo].forEach(function (i) { i.addEventListener('input', sporco); });
  attivo.addEventListener('change', sporco);
  salva.addEventListener('click', function () {
    if (!nome.value.trim()) { toast('Il piatto ha bisogno di un nome.', true); nome.focus(); return; }
    salva.disabled = true; stato.textContent = 'salvataggio…';
    var vecchioNome = p.nome;
    salvaPiatto(p, {nome: nome.value.trim(), descrizione: desc.value.trim(), prezzo: prezzo.value.trim(), attivo: attivo.checked})
      .then(function () { return allineaDidascalie(vecchioNome, p.nome); })
      .then(function () { nome.value = p.nome; desc.value = p.descrizione; prezzo.value = p.prezzo; box.classList.toggle('spento', !p.attivo); sporco(); stato.textContent = 'Salvato ✓'; stato.className = 'stato ok'; })
      .catch(function (e) { salva.disabled = false; stato.textContent = messaggioErrore(e); stato.className = 'stato err'; });
  });
  var sposta = function (dir) {
    var altro = piatti[pi + dir]; if (!altro) return;
    var a = p.ordine, b = altro.ordine; if (a === b) b = a + dir;
    Promise.all([salvaPiatto(p, {ordine: b}), salvaPiatto(altro, {ordine: a})]).then(disegna).catch(function (e) { toast(messaggioErrore(e), true); });
  };
  var cambiaCat = el('select', {'aria-label': 'Sposta in un’altra categoria'});
  categorie().forEach(function (c) { var o = el('option', {value: c, text: c}); if (c === p.categoria) o.selected = true; cambiaCat.appendChild(o); });
  cambiaCat.addEventListener('change', function () { salvaPiatto(p, {categoria: cambiaCat.value}).then(function () { disegna(); toast('Piatto spostato.'); }).catch(function (e) { toast(messaggioErrore(e), true); }); });
  var com = el('div', {'class': 'comandi'}, [
    salva, stato,
    el('label', {'class': 'interruttore'}, [attivo, 'Sul sito']),
    el('span', {'class': 'sposta'}, [
      el('button', {type: 'button', 'aria-label': 'Sposta su', title: 'Sposta su', text: '↑', disabled: pi === 0, onclick: function () { sposta(-1); }}),
      el('button', {type: 'button', 'aria-label': 'Sposta giù', title: 'Sposta giù', text: '↓', disabled: pi === piatti.length - 1, onclick: function () { sposta(1); }})
    ]),
    el('button', {'class': 'btn piccolo secondario', type: 'button', text: p.foto ? 'Cambia foto' : 'Aggiungi foto', onclick: function () {
      var b = this; b.disabled = true;
      carica_foto('piatto-' + p.id).then(function (u) { return salvaPiatto(p, {foto: u}); }).then(function () { box.replaceWith(schedaPiatto(p, piatti, pi)); toast('Foto del piatto salvata.'); })
        .catch(function (e) { if (!/Nessuna foto/.test(e.message)) toast(messaggioErrore(e), true); }).then(function () { b.disabled = false; });
    }}),
    p.foto ? el('button', {'class': 'btn piccolo secondario', type: 'button', text: 'Togli foto', onclick: function () { salvaPiatto(p, {foto: ''}).then(function () { box.replaceWith(schedaPiatto(p, piatti, pi)); }).catch(function (e) { toast(messaggioErrore(e), true); }); }}) : null,
    el('button', {'class': 'btn piccolo pericolo', type: 'button', text: 'Elimina', onclick: function () {
      if (!confirm('Eliminare “' + p.nome + '” dalla carta? (Se volete solo nasconderlo, togliete la spunta “Sul sito”.)')) return;
      sb.from('site_menu').delete().eq('id', p.id).then(function (r) { if (r.error) throw r.error; MENU = MENU.filter(function (x) { return x.id !== p.id; }); disegna(); toast('Piatto eliminato.'); }).catch(function (e) { toast(messaggioErrore(e), true); });
    }})
  ]);
  var campi = el('div', {'class': 'campi'}, [
    el('label', {text: 'Nome'}), nome,
    el('div', {'class': 'riga2'}, [
      el('div', null, [el('label', {text: 'Descrizione'}), desc]),
      el('div', null, [el('label', {text: 'Prezzo (facoltativo)'}), prezzo, el('label', {text: 'Categoria'}), cambiaCat])
    ]),
    com
  ]);
  box.appendChild(foto); box.appendChild(campi);
  return box;
};

/* ---------- avvio ---------- */
sb.auth.getSession().then(function (r) {
  if (r.data && r.data.session) avvia().catch(function (e) { mostraPannello(false); $('#err-accesso').textContent = messaggioErrore(e); });
});
})();
