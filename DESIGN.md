# Super Speedy — direzione della bozza

Tipo: **place** (pizzeria di quartiere, Cagliari, via Abruzzi 31). Modalità: Persuade + Operate (il menù si usa davvero).

## Concetto: «La comanda di via Abruzzi»
Il sito è il banco della pizzeria. In alto l'insegna rossa con il video (la vetrina), sotto il
**menù stampato come una comanda**: un foglio di carta crema con prezzi veri, puntini guida e note `*` / `**`,
da cui si spunta la propria ordinazione e la si manda su WhatsApp già scritta. L'unico elemento audace è
questo: la comanda. Tutto il resto è disciplinato: foto vere del cliente, colori del loro marchio, tipografia da insegna.

## Tipografia
- **Tanker** (Fontshare, ITF Free Font License) — display condensato pesante, da insegna dipinta/locandina.
  Solo titoli e numeri grandi (classifica, 4,3, prezzi della comanda in evidenza). Mai per testo corrente.
- **Archivo** variabile (Google Fonts, OFL) — testo e menù. Asse `wdth` usato: 100 per il testo, 82–88 semi-condensato
  per le righe del menù e i prezzi (cifre tabulari `tnum`), corsivo per gli ingredienti.
- Scala (base 17px, rapporto ~1.333): 17 / 22 / 29 / 39 / 52 / 70 / 96(max display). Interlinea titoli 0.9, testo 1.55.
- Niente eyebrow sopra i titoli, niente label in maiuscoletto tracciato, niente parola singola colorata nei titoli.

## Palette (dal logo e dalle grafiche IG)
| nome | hex | uso |
|---|---|---|
| rosso pomodoro | `#D7201B` | fondo hero/insegna, bottoni primari (crema su rosso 4.76:1) |
| giallo spicchio | `#F6BE2C` | fondo sezione impasto, bollini prezzo, evidenze (nero su giallo 9.5:1) |
| crema cartone | `#FFF6E6` | fondo principale, carta della comanda |
| nero logo | `#231F20` | testo, sezione «dove siamo» (nero del logo, non un #111 qualunque) |
| crosta | `#C99A6B` | filetti, puntini guida, perforazioni della comanda |
| grigio farina | `#5E524A` | testo secondario su crema (7:1) |

Texture vere: il granito del loro bancone (dalle foto) e la carta della comanda (rumore SVG leggerissimo + bordo perforato).

## Griglia
12 colonne, contenitore 1320px, margini 24px (mobile) / 48px (desktop). Asimmetrica:
```
HERO        [ titolo 5 col | video 7 col a filo destro ]         fondo rosso
TOP 5       [ classifica 7 col | foto che cambia 5 col ]          crema
MENÙ        [ indice 3 | comanda 6 | la tua comanda 3 (sticky) ] crema/carta
IMPASTO     [ NAPOLI + ROMA = CAGLIARI, foto impasto ]            giallo
SALA        [ foto grande 7 | due foto 5 ] + testo                crema
RECENSIONI  [ 4,3 enorme 4 | citazioni vere 8 ]                   rosso
ORDINA      [ chiama / whatsapp / just eat | foto cartone ]        crema
DOVE/ORARI  [ orari 5 | mappa 7 ]                                 nero
```
Allineamento a sinistra ovunque; niente blocchi centrati tranne i numeri della classifica.

## Motion
- Un momento d'apertura: lo spicchio-mascotte del logo entra correndo nell'hero (linee di velocità), una volta.
- Un momento di sezione: nell'impasto NAPOLI e ROMA scorrono uno verso l'altro e diventano CAGLIARI quando la sezione entra.
- Risposte all'utente: riga che si «stampa» nella comanda (clip-path), bottoni che si abbassano al click (scale .97, 160ms).
- Easing `cubic-bezier(0.23,1,0.32,1)`, durate 160–600ms. Niente fade-in su ogni sezione, niente parallax, niente Lenis.
- `prefers-reduced-motion`: tutto fermo e visibile, video non parte da solo.

## Copy
Voce del locale: diretta, giocosa, frasi loro («Stasera non cucinare, ci pensiamo noi», «C'è un posto per te»,
«Sei sul divano?»). Solo fatti del brief: 4,3★ su 318 recensioni, consegna 2 €, minimo 8 €, impasto senza latte,
classifica delle 5 più richieste, sala self-service, orari, domenica chiuso.
