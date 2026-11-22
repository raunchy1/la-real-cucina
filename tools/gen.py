#!/usr/bin/env python3
"""Genera index.html da tools/template.html + tools/menu_data.py.
Facoltativo: index.html è già committato e statico. Uso: python3 tools/gen.py"""
import json, re, os, html
from menu_data import *

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
P = '/bozze/super-speedy/assets/'
META = json.load(open(os.path.join(ROOT, 'assets/img/meta.json')))
esc = html.escape

def img(key, alt, sizes='100vw', cls='', eager=False):
    m = META[key]['sizes']
    src = m[-1]
    srcset = ', '.join(f"{P}img/{fn} {w}w" for w, h, fn in m)
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    c = f' class="{cls}"' if cls else ''
    return (f'<img{c} src="{P}img/{src[2]}" srcset="{srcset}" sizes="{sizes}" '
            f'width="{src[0]}" height="{src[1]}" alt="{esc(alt)}" {load} decoding="async">')

def price(v):
    s = f"{v:.2f}".replace('.', ',')
    return s

def slug(s):
    s = s.lower()
    s = re.sub(r"[àá]", "a", s); s = re.sub(r"[èé]", "e", s); s = re.sub(r"[ìí]", "i", s)
    s = re.sub(r"[òó]", "o", s); s = re.sub(r"[ùúü]", "u", s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

TAGLABEL = {'vg': 'vegana', 'vgp': 'vegana senza formaggio', 'hot': 'piccante', 'mare': 'di mare'}

def icon(name, cls='ico'):
    svg = open(os.path.join(ROOT, f'assets/icons/{name}.svg')).read()
    svg = re.sub(r'<title>.*?</title>', '', svg)
    return svg.replace('<svg ', f'<svg class="{cls}" aria-hidden="true" focusable="false" fill="currentColor" ').replace(' role="img"', '')

def item(cat, name, ing, p, tags, label=None):
    iid = f"{slug(cat)}-{slug(name)}"
    t = tags.split()
    marks = ''.join(f'<span class="mark mark-{x}">{TAGLABEL[x]}</span>' for x in t if x in TAGLABEL)
    full = label or name
    ing_html = f'<p class="ing">{esc(ing)}</p>' if ing else ''
    return f'''<li class="item" data-tags="{' '.join(t)}" id="m-{iid}">
  <div class="item-head"><h4 class="name">{esc(name)}</h4><span class="lead" aria-hidden="true"></span><span class="price"><span class="vh">prezzo </span>{price(p)}<span class="eur"> €</span></span>
  <button class="add" type="button" data-id="{iid}" data-name="{esc(full)}" data-price="{round(p*100)}" aria-label="Aggiungi {esc(full)} alla comanda"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
  {ing_html}{('<p class="marks">'+marks+'</p>') if marks else ''}
</li>'''

def cat_block(cid, title, items_html, photo=None, note=''):
    ph = f'<figure class="cat-photo">{photo}</figure>' if photo else ''
    n = f'<p class="cat-note">{note}</p>' if note else ''
    return f'''<section class="cat" id="{cid}" aria-labelledby="{cid}-h">
<h3 class="cat-h" id="{cid}-h">{title}</h3>{n}{ph}
{items_html}
</section>'''

def simple(cat, rows, label_prefix=''):
    return '<ul class="items">' + ''.join(item(cat, n, i, p, t, (label_prefix + n) if label_prefix else None) for n, i, p, t in rows) + '</ul>'

def drinks(cat, rows):
    out = ['<table class="drinks"><thead><tr><th scope="col"><span class="vh">Bevanda</span></th><th scope="col">Lattina</th><th scope="col">Bottiglietta</th><th scope="col">Bottiglia</th></tr></thead><tbody>']
    for n, *ps in rows:
        cells = []
        for fmt, p in zip(['lattina', 'bottiglietta', 'bottiglia'], ps):
            if p is None:
                cells.append('<td class="na"><span aria-hidden="true">–</span><span class="vh">non disponibile</span></td>')
            else:
                iid = f"{slug(cat)}-{slug(n)}-{fmt}"
                cells.append(f'<td><button class="add-chip" type="button" data-id="{iid}" data-name="{esc(n)} ({fmt})" data-price="{round(p*100)}" aria-label="Aggiungi {esc(n)} {fmt}, {price(p)} euro">{price(p)}</button></td>')
        out.append(f'<tr><th scope="row">{esc(n)}</th>{"".join(cells)}</tr>')
    out.append('</tbody></table>')
    return ''.join(out)

# ---------- MENU ----------
blocks = []
pz = []
for g, rows in PIZZE:
    gid = 'pizze-' + slug(g)
    lp = 'Pizza ' if g != 'Pizze dolci' else 'Pizza dolce '
    pz.append(f'<div class="group" id="{gid}"><h4 class="group-h">{esc(g)}</h4>{simple("pizza", rows, lp)}</div>')
blocks.append(cat_block('pizze', 'Le pizze', ''.join(pz),
    img('bufalina', 'Pizza bufalina con pomodorini e basilico sul bancone di granito', '(min-width: 1100px) 640px, 92vw'),
    'Formato ridotto −1 €, gigante +1 €. Ogni pizza si può fare senza mozzarella: l’impasto non contiene latte.'))
blocks.append(cat_block('focacce', 'Le focacce', simple('focaccia', FOCACCE, 'Focaccia '),
    img('focaccia-kebab', 'Focaccia farcita al kebab con salse, tagliata a metà', '(min-width: 1100px) 640px, 92vw'),
    'Bianche o al pomodoro, vuote o farcite.'))
blocks.append(cat_block('hamburger', 'Hamburger', simple('burger', HAMBURGER),
    img('burger', 'Cheeseburger con doppio formaggio su ardesia', '(min-width: 1100px) 640px, 92vw')))
blocks.append(cat_block('snack', 'Snack e fritti', simple('snack', SNACK),
    img('mozzarelline', 'Mozzarelline fritte nella vaschetta di cartone', '(min-width: 1100px) 640px, 92vw')))
blocks.append(cat_block('insalate', 'Insalate', simple('insalata', INSALATE, 'Insalata '),
    img('insalata', 'Insalatona Capri con bufala e pomodoro', '(min-width: 1100px) 640px, 92vw')))
blocks.append(cat_block('dolci', 'Dolci', simple('dolce', DOLCI)))
blocks.append(cat_block('bibite', 'Bibite', drinks('bibita', BIBITE)))
blocks.append(cat_block('birre', 'Birre e vini', drinks('birra', BIRRE)))
agg = ''.join(f'<div class="agg-row"><dt>{a}</dt><dd>{esc(b)}</dd></div>' for a, b in AGGIUNTE)
blocks.append(f'''<section class="cat" id="aggiunte" aria-labelledby="aggiunte-h"><h3 class="cat-h" id="aggiunte-h">Componi la tua</h3>
<p class="cat-note">Parti da una base (pizza, focaccia vuota 4 €, insalata base 4,50 €) e aggiungi quello che vuoi. Le aggiunte le dici al telefono o le scrivi nel messaggio.</p>
<dl class="agg">{agg}</dl></section>''')
MENU = '\n'.join(blocks)

INDEX = [('pizze', 'Pizze'), ('focacce', 'Focacce'), ('hamburger', 'Hamburger'), ('snack', 'Snack'),
         ('insalate', 'Insalate'), ('dolci', 'Dolci'), ('bibite', 'Bibite'), ('birre', 'Birre e vini'), ('aggiunte', 'Componi la tua')]
MENU_INDEX = ''.join(f'<li><a href="#{i}">{t}</a></li>' for i, t in INDEX)
PIZZA_GROUPS = ''.join(f'<li><a href="#pizze-{slug(g)}">{g}</a></li>' for g, _ in PIZZE)

# ---------- TOP 5 ----------
top = [
  ('Margherita', 'sugo, mozzarella', 6, 'margherita', 'Pizza margherita appena sfornata sul tagliere di legno'),
  ('Würstel e fritte', 'sugo, mozzarella, patatine fritte, würstel', 8.5, 'wurstel-fritte', 'Pizza con patatine fritte sul tagliere di legno'),
  ('Vegetariana', 'sugo, mozzarella, melanzane, zucchine, peperoni', 9, 'condimento', 'Il pizzaiolo condisce una pizza con le verdure sul bancone di granito'),
  ('Canadese', 'sugo, mozzarella, cotto, funghi, würstel', 9, 'canadese', 'Pizza con würstel e prosciutto cotto sul tagliere'),
  ('Quattro formaggi', 'sugo, mozzarella, gorgonzola, fontina, emmental', 9, 'formaggi', 'Pizza ai formaggi filanti sul tagliere'),
]
ids = ['pizza-margherita', 'pizza-fritte-wurstel', 'pizza-vegetariana', 'pizza-canadese', 'pizza-4-formaggi']
names = ['Pizza Margherita', 'Pizza Fritte & Würstel', 'Pizza Vegetariana', 'Pizza Canadese', 'Pizza 4 Formaggi']
TOP_LIST, TOP_PICS = [], []
for i, (n, ing, p, k, alt) in enumerate(top):
    TOP_LIST.append(f'''<li class="top-row{' is-on' if i == 0 else ''}" data-i="{i}">
  <span class="top-n" aria-hidden="true">{i+1}</span>
  <div class="top-body"><h3 class="top-name">{n}</h3><p class="ing">{ing}</p></div>
  <span class="price">{price(p)}<span class="eur"> €</span></span>
  <button class="add" type="button" data-id="{ids[i]}" data-name="{names[i]}" data-price="{round(p*100)}" aria-label="Aggiungi {names[i]} alla comanda"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
  <div class="top-thumb">{img(k, alt, '96px')}</div>
</li>''')
    TOP_PICS.append(f'<div class="top-pic{" is-on" if i == 0 else ""}" data-i="{i}">{img(k, alt, "(min-width: 900px) 520px, 1px")}</div>')

# ---------- REVIEWS ----------
REVIEWS = [
  ('Pizza deliziosa, personale gentilissimo cordiale. Ci ritornerò sicuramente!!!', 'Stefano D.F.'),
  ('Pizza buonissima, puntuali e precisi nella consegna a domicilio.', 'Recensione su Google'),
  ('Veloci, ottima la pizza e panini, ingredienti di qualità.', 'Recensione su Google'),
  ('Buonissime le pizze! Molta gentilezza.', 'Giovanni S.'),
  ('Prima volta che ho ordinato, le pizze erano buone e sono arrivate puntualissime.', 'Recensione su Google'),
]
REV = ''.join(f'<figure class="rev rev-{i}"><blockquote><p>«{esc(q)}»</p></blockquote><figcaption>{esc(a)}</figcaption></figure>' for i, (q, a) in enumerate(REVIEWS))

t = open(os.path.join(HERE, 'template.html')).read()
rep = {
  'MENU': MENU, 'MENU_INDEX': MENU_INDEX, 'PIZZA_GROUPS': PIZZA_GROUPS,
  'TOP_LIST': '\n'.join(TOP_LIST), 'TOP_PICS': '\n'.join(TOP_PICS), 'REVIEWS': REV,
  'I_INSTAGRAM': icon('instagram'), 'I_FACEBOOK': icon('facebook'), 'I_TIKTOK': icon('tiktok'),
  'I_YOUTUBE': icon('youtube'), 'I_WHATSAPP': icon('whatsapp'), 'I_JUSTEAT': icon('justeat'), 'I_GOOGLE': icon('google'),
  'IMG_SALA_AMPIA': img('sala-ampia', 'La nuova sala con i tavoli in legno, il televisore e il murale della mascotte', '(min-width: 900px) 56vw, 92vw'),
  'IMG_SALA_MURALE': img('sala-murale', 'Il murale con lo spicchio di pizza che fa un selfie, accanto ai tavoli', '(min-width: 900px) 34vw, 92vw'),
  'IMG_SALA_BANCO': img('sala-banco', 'Il banco con l’insegna Super Speedy pizza, dove si ordina e si ritira', '(min-width: 900px) 34vw, 92vw'),
  'IMG_STESURA': img('impasto-stesura', 'Le mani del pizzaiolo sollevano un disco di impasto sottile', '(min-width: 900px) 30vw, 92vw'),
  'IMG_FARINA': img('impasto-farina', 'Mano infarinata che lavora la farina sul granito', '(min-width: 900px) 18vw, 45vw'),
  'IMG_FORNO': img('forno', 'Pizza sulla pala davanti al fuoco del forno a legna', '(min-width: 900px) 18vw, 45vw'),
  'IMG_CARTONE': img('cartone', 'Pizza margherita nel cartone da asporto con la scritta «Il buono della vita inizia qui»', '(min-width: 900px) 40vw, 92vw'),
  'IMG_PIZZAIOLO': img('pizzaiolo', 'Il pizzaiolo con il cappellino bianco al lavoro davanti al forno', '(min-width: 900px) 26vw, 60vw'),
}
for k, v in rep.items():
    t = t.replace('{{' + k + '}}', v)
left = re.findall(r'\{\{[A-Z_]+\}\}', t)
assert not left, left
open(os.path.join(ROOT, 'index.html'), 'w').write(t)
print('index.html', len(t))
