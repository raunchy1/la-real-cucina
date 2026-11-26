#!/usr/bin/env python3
"""Genera le pagine /en/ /fr/ /de/ dalla pagina italiana (index.html).

Uso (dalla cartella del sito):  python3 tools/genera_lingue.py

- index.html resta la fonte: si modifica solo quella, poi si rilancia questo script.
- Le traduzioni stanno in i18n/traduzioni.json:
    testi  -> i testi con data-k (gli stessi del pannello)
    alt    -> descrizioni delle 4 foto grandi
    frasi  -> tutte le altre scritte fisse (menu, pulsanti, modulo, meta)
    menu   -> categorie, nomi e descrizioni dei piatti (chiave = testo italiano)
- Scrive anche admin/traduzioni.json, che il pannello usa come traduzioni di partenza.
Lo script si ferma se una frase da tradurre non si trova più nella pagina italiana.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITO = 'https://larealcucina.it'


def leggi(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()


def scrivi(p, testo):
    os.makedirs(os.path.dirname(os.path.join(ROOT, p)) or ROOT, exist_ok=True)
    with open(os.path.join(ROOT, p), 'w', encoding='utf-8') as f:
        f.write(testo)


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def marcatura(t):
    """Stessa resa del sito (funzione marcatura in index.html)."""
    h = esc(t)
    h = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+|tel:[^\s)]+|mailto:[^\s)]+)\)',
               lambda m: '<a href="%s"%s>%s</a>' % (m.group(2), ' target="_blank" rel="noopener"' if m.group(2).startswith('http') else '', m.group(1)), h)
    h = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', h)
    return h.replace('\n', '<br>')


def rendi(tipo, v):
    if tipo == 'righe':
        return ' '.join('<span class="ln">%s</span>' % marcatura(r) for r in v.split('\n') if r)
    if tipo == 'lista':
        return ''.join('<li>%s</li>' % esc(x.strip()) for x in v.split('\n') if x.strip())
    return marcatura(v)


def json_in_html(dati):
    return json.dumps(dati, ensure_ascii=False).replace('</', '<\\/')


def genera(lang, T, src, testi_it, errori):
    s = src
    # gli script restano intatti (contengono codice, non testo da tradurre)
    scrigno = []

    def metti_via(m):
        scrigno.append(m.group(0))
        return '\x00%d\x00' % (len(scrigno) - 1)
    s = re.sub(r'<script\b[^>]*>.*?</script>', metti_via, s, flags=re.S)

    # 1. testi del pannello (data-k)
    for k, v in T['testi'].items():
        if k.startswith('meta_'):
            continue
        rx = re.compile(r'(<(\w+)\b[^>]*\bdata-k="%s"[^>]*>)(.*?)(</\2>)' % re.escape(k), re.S)
        m = rx.search(s)
        if not m:
            errori.append('%s: testo %s non trovato' % (lang, k))
            continue
        tipo = (re.search(r'data-t="(\w+)"', m.group(1)) or [None, 'testo'])[1]
        s = s[:m.start()] + m.group(1) + rendi(tipo, v) + m.group(4) + s[m.end():]

    # 2. descrizioni delle foto grandi
    for k, v in T['alt'].items():
        rx = re.compile(r'(<img\b[^>]*\bdata-img="%s"[^>]*\balt=")[^"]*(")' % re.escape(k))
        s, n = rx.subn(lambda m: m.group(1) + esc(v) + m.group(2), s)
        if not n:
            errori.append('%s: foto %s non trovata' % (lang, k))

    # 3. frasi fisse e carta di riserva (dalla più lunga alla più corta)
    coppie = list(T['frasi'].items()) + list(T['menu'].items())
    coppie.sort(key=lambda x: -len(x[0]))
    for it, tr in coppie:
        n_tot = 0
        rx_testo = re.compile(r'>(\s*)' + re.escape(it) + r'(\s*)<')
        s, n = rx_testo.subn(lambda m: '>' + m.group(1) + esc(tr).replace('&quot;', '"') + m.group(2) + '<', s)
        n_tot += n
        rx_attr = re.compile(r'\b(alt|aria-label|placeholder|data-alt|content|title)="' + re.escape(it) + '"')
        s, n = rx_attr.subn(lambda m: m.group(1) + '="' + esc(tr) + '"', s)
        n_tot += n
        if not n_tot and it in T['frasi']:
            errori.append('%s: frase non trovata: %s' % (lang, it))

    # 4. lingua, indirizzi e selettore
    url = '%s/%s/' % (SITO, lang)
    s = s.replace('<html lang="it">', '<html lang="%s">' % lang, 1)
    s = s.replace('<link rel="canonical" href="%s/">' % SITO, '<link rel="canonical" href="%s">' % url, 1)
    s = s.replace('<meta property="og:url" content="%s/">' % SITO, '<meta property="og:url" content="%s">' % url, 1)
    s = s.replace('<meta property="og:locale" content="it_IT">', '<meta property="og:locale" content="%s">' % T['locale'], 1)
    s = s.replace(' aria-current="page">IT</a>', '>IT</a>')
    s = s.replace('hreflang="%s">%s</a>' % (lang, lang.upper()), 'hreflang="%s" aria-current="page">%s</a>' % (lang, lang.upper()))

    # rimetti gli script
    s = re.sub('\x00(\\d+)\x00', lambda m: scrigno[int(m.group(1))], s)

    # 5. dati per Google (JSON-LD)
    m = re.search(r'(<script type="application/ld\+json" id="ld-json">)(.*?)(</script>)', s, re.S)
    if m:
        ld = json.loads(m.group(2))
        ld['description'] = T['ld_descrizione']
        ld['url'] = url
        ld['hasMenu'] = url + '#carta'
        s = s[:m.start()] + m.group(1) + '\n' + json.dumps(ld, ensure_ascii=False, indent=2) + '\n' + m.group(3) + s[m.end():]
    else:
        errori.append('%s: JSON-LD non trovato' % lang)

    # 6. dati per lo script della pagina: carta tradotta e testi italiani di partenza
    blocco = ('<script type="application/json" id="menu-tradotto">%s</script>\n'
              '<script type="application/json" id="testi-it">%s</script>\n') % (json_in_html(T['menu']), json_in_html(testi_it))
    punto = '<script>\n/* ============================================================\n   CONTENUTI DAL PANNELLO'
    if punto not in s:
        errori.append('%s: script principale non trovato' % lang)
    s = s.replace(punto, blocco + punto, 1)
    return s


def main():
    src = leggi('index.html')
    tr = json.loads(leggi('i18n/traduzioni.json'))
    campi = json.loads(leggi('admin/campi.json'))
    testi_it = {c['chiave']: c['predefinito'] for c in campi if c['tipo'] != 'foto'}
    errori = []
    for c in campi:
        if c['tipo'] == 'foto':
            continue
        for lang, T in tr.items():
            if c['chiave'] not in T['testi']:
                errori.append('%s: manca la traduzione di %s' % (lang, c['chiave']))
    pagine = {lang: genera(lang, T, src, testi_it, errori) for lang, T in tr.items()}
    if errori:
        print('\n'.join(errori))
        sys.exit(1)
    for lang, html in pagine.items():
        scrivi('%s/index.html' % lang, html)
        print('scritto %s/index.html' % lang)
    pannello = {lang: {'nome': T['nome'], 'testi': T['testi'], 'menu': T['menu']} for lang, T in tr.items()}
    scrivi('admin/traduzioni.json', json.dumps(pannello, ensure_ascii=False, indent=1) + '\n')
    print('scritto admin/traduzioni.json')


if __name__ == '__main__':
    main()
