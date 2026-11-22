# Menù reale di Super Speedy (fonte: research/*.txt dal loro sito). Prezzi in euro.
# tag: vg = vegana così com'è · vgp = vegana togliendo formaggio · hot = piccante · mare = pesce/frutti di mare
# * prodotto surgelato · ** prodotto sott'olio (note del locale, mantenute negli ingredienti)

PIZZE = [
  ("Classiche", [
    ("Marinara", "doppio sugo, origano, aglio", 5.5, "vg"),
    ("Bruschetta", "pasta pizza con olio e origano", 4, "vg"),
    ("Margherita", "sugo, mozzarella", 6, "vgp top"),
    ("Sugo e mozzarella senza glutine", "sugo, mozzarella · base gluten free non certificata", 9, ""),
    ("Bufala", "sugo, mozzarella di bufala", 8, ""),
    ("Napoli", "sugo, mozzarella, capperi, acciughe", 7.5, "mare"),
    ("Caprese", "sugo, mozzarella, pomodorini, basilico", 7, "vgp"),
    ("Rucola & Grana", "sugo, mozzarella, rucola, grana", 9, "vgp"),
    ("Parmigiana", "doppio sugo, mozzarella, melanzane, parmigiano", 9, "vgp"),
    ("Canadese", "sugo, mozzarella, cotto, funghi, würstel", 9, "top"),
    ("Vegetariana", "sugo, mozzarella, melanzane, zucchine, peperoni", 9, "vgp top"),
    ("4 Formaggi", "sugo, mozzarella, gorgonzola, fontina, emmental", 9, "top"),
    ("4 Stagioni", "sugo, mozzarella, olive, funghi, cotto, carciofini**", 9, ""),
    ("Capricciosa", "sugo, mozzarella, cotto, funghi, uovo", 9, ""),
    ("Fritte & Würstel", "sugo, mozzarella, fritte*, würstel", 8.5, "top"),
  ]),
  ("Piccanti", [
    ("Texana", "sugo, mozzarella, salsiccia fresca, cipolla, peperone, peperoncino, origano", 9.5, "hot"),
    ("Diavola", "sugo, mozzarella, peperoni, olive, salsiccia secca, olio piccante, peperoncino", 9, "hot"),
    ("Inferno", "sugo, mozzarella, salsiccia secca, cipolle, olio piccante", 8, "hot"),
  ]),
  ("Di terra", [
    ("Piemontese", "sugo, mozzarella, salsiccia secca, funghi", 8, ""),
    ("Sarda", "sugo, mozzarella, salsiccia secca, pecorino", 8, ""),
    ("Calzone", "sugo, mozzarella, prosciutto cotto, funghi", 8, ""),
    ("Casereccia", "sugo, mozzarella, patate al forno, salsiccia secca", 8.5, ""),
    ("Affumicata", "sugo, mozzarella, speck, provola affumicata", 9, ""),
    ("Taleggio & Speck", "sugo, mozzarella, speck, taleggio", 9.5, ""),
    ("Carbonara", "sugo, mozzarella, pancetta, uovo, cipolla", 9.5, ""),
    ("Giove", "sugo, mozzarella, salsiccia fresca, funghi di carne**", 9, ""),
  ]),
  ("Di mare", [
    ("Nostromo", "sugo, mozzarella, tonno**, cipolla", 8.5, "mare"),
    ("Catalana", "sugo, mozzarella, polpa di granchio**, cipolla, pomodorini, aglio, prezzemolo", 9.5, "mare"),
    ("Panna & Gamberetti", "sugo, mozzarella, panna, gamberetti**", 8.5, "mare"),
    ("Panna & Salmone", "sugo, mozzarella, panna, salmone*", 9, "mare"),
    ("Bottarga & Carciofi", "sugo, mozzarella, bottarga, carciofi (freschi +1 €)", 9, "mare"),
    ("Frutti di mare", "sugo, mozzarella, frutti di mare**", 9, "mare"),
    ("Carlofortina", "sugo, mozzarella, pomodorini, tonno**, pesto", 9.5, "mare"),
  ]),
  ("Speciali", [
    ("Braccio di Ferro", "sugo, mozzarella, spinaci*, uovo, grana", 9.5, ""),
    ("Stracchino & Guanciale", "sugo, mozzarella, stracchino, guanciale", 9, ""),
    ("Kebab", "kebab*, cipolle, radicchio, lattuga, mais, olio piccante", 9.5, "hot"),
    ("Ola", "sugo, mozzarella, bresaola, rucola, grana, succo di limone", 10.5, ""),
    ("Rustica", "sugo, mozzarella, mortadella, burrata, granella di pistacchio", 12, ""),
  ]),
  ("Bianche", [
    ("Fiore", "mozzarella, fiori di zucca, alici", 9, "mare"),
    ("Walnut", "mozzarella, gorgonzola, noci", 8, ""),
    ("Vesuvio", "mozzarella di bufala, salsiccia fresca, friarielli", 10.5, ""),
    ("Buona", "pasta, guanciale, fiori di zucca", 9, ""),
  ]),
  ("Pizze dolci", [
    ("Nutella", "pasta, Nutella", 6.5, ""),
    ("Paradiso", "pasta, Nutella, scaglie di cocco, zucchero a velo", 7.5, ""),
    ("Smarties", "pasta, Nutella, Smarties", 7.5, ""),
    ("Sweety", "pasta, Nutella, granella di nocciola", 7.5, ""),
    ("Nuvole di Nutella", "palline croccanti con Nutella, per 3 persone", 10, ""),
  ]),
]

FOCACCE = [
  ("Focaccia", "olio extravergine e origano", 4, "vg"),
  ("Sfiziosa", "mozzarella, pancetta, melanzane, maionese", 7, ""),
  ("Caliente", "provola, salame, peperoni, salsiccia piccante", 7, "hot"),
  ("Caprese", "pomodoro, doppia mozzarella, origano, basilico", 7, "vgp"),
  ("4 Formaggi", "mozzarella, groviera, fontina, gorgonzola", 7, ""),
  ("Golosa", "prosciutto cotto, fontina, funghi, maionese", 7, ""),
  ("Vegetariana", "mozzarella, melanzane, peperoni, zucchine", 7, "vgp"),
  ("Scozzese", "salmone, rucola, mozzarella, maionese", 7, "mare"),
  ("Caddozzona", "salsiccia fresca, patate fritte, ketchup, maionese, cipolla, fontina", 7, ""),
  ("Buongustaia", "pancetta, provola affumicata, lattuga, pomodoro, salsa rosa", 7, ""),
  ("Gustosa", "2 würstel grandi, ketchup, maionese, formaggio, patate fritte*", 7.5, ""),
  ("Kebab", "kebab*, lattuga, radicchio, mais, cipolla, peperoni, salsa yogurt, salsa piccante", 8, "hot"),
  ("Milanese", "cotoletta alla milanese*, lattuga, fontina, maionese", 8, ""),
  ("Classica", "pomodoro, mozzarella, crudo, maionese", 7.5, ""),
  ("Ola", "pomodoro, mozzarella, bresaola, rucola, grana, succo di limone", 8, ""),
  ("Bufocaccia", "crudo, mozzarella di bufala, pomodoro fresco, basilico", 8.5, ""),
  ("Poldo", "2 hamburger*, patate fritte*, fontina, salsa rosa", 8, ""),
  ("Focaccia con Nutella", "", 5.5, ""),
]

HAMBURGER = [
  ("Cheeseburger", "pane bun, hamburger*, ketchup, lattuga, cheddar", 6.5, ""),
  ("Bacon Burger", "pane bun, 2 hamburger*, salsa burger, pancetta, cipolle, cheddar", 9, ""),
  ("Doppio Cheeseburger", "pane bun, 2 hamburger*, salsa burger, lattuga, doppio cheddar", 9, ""),
  ("Hot Dog", "pane bun, würstel, cipolla, senape", 6, ""),
  ("Chicken Burger", "pane bun, cotoletta di pollo*, cheddar, lattuga, maionese", 8, ""),
]

SNACK = [
  ("Patate fritte o al forno", "", 4, "vg"),
  ("Hamburger con contorno", "circa 200 g di carne, patate fritte o al forno", 10, ""),
  ("Milanese con contorno", "", 10, ""),
  ("Nuggets", "8 pezzi", 5, ""),
  ("Olive ascolane", "8 pezzi", 5, ""),
  ("Mozzarelline", "8 pezzi", 5, ""),
  ("Crocchette di patate", "8 pezzi", 5, ""),
  ("Anellini di cipolla", "8 pezzi", 5, ""),
  ("Verdure arrosto", "200 g", 5, "vg"),
  ("Red Hot Chili Peppers", "6 pezzi", 5, "hot"),
  ("Chele di granchio", "8 pezzi", 6.5, "mare"),
  ("Alette di pollo", "6 pezzi", 6.5, ""),
  ("Gamberi in tempura", "8 pezzi", 10, "mare"),
  ("Gran fritto", "4 crocchette, 4 ascolane, 4 anelli, 4 mozzarelline, 4 chele, 4 alette, 4 nuggets", 13, ""),
  ("Bustina maionese o ketchup", "", 0.5, ""),
]

INSALATE = [
  ("Base", "insalata verde, insalata rossa, pomodoro", 4.5, "vg"),
  ("Capri", "pomodoro, insalata verde, mozzarella di bufala, basilico", 7, ""),
  ("Completa", "insalata base, carote, tonno**, uovo, mozzarella", 8.5, "mare"),
  ("Chicken", "insalata base, olive nere, pollo*, capperi, origano", 8.5, ""),
  ("Mare", "insalata base, tonno**, polpa di granchio*, carote", 8, "mare"),
  ("Bomba", "insalata base, semini vari, crudo, olive, burrata", 10, ""),
]

DOLCI = [
  ("Sebadas con miele", "", 3.5, ""),
  ("Tiramisù", "", 5, ""),
  ("Torroncino", "", 5, ""),
  ("Cheesecake all'amarena", "in coppa di vetro", 5, ""),
  ("Coppa al pistacchio", "in bicchiere di vetro", 5, ""),
  ("Cocco", "", 6, ""),
  ("Coppa al caramello salato", "", 6.5, ""),
  ("Cheesecake al mirtillo", "", 6.5, ""),
  ("Coppa stracciatella", "in bicchiere di vetro", 7, ""),
  ("Cornetto panna", "", 2.7, ""),
  ("Gruvi al pistacchio", "", 3, ""),
  ("Sansonì", "", 3, ""),
  ("Torta al croccantino e caramello salato", "da condividere", 20, ""),
  ("Torta ai frutti di bosco", "da condividere", 20, ""),
]

# (nome, lattina, bottiglietta, bottiglia)
BIBITE = [
  ("Acqua naturale", None, 1, 2),
  ("Acqua frizzante", None, 1, 2),
  ("Coca-Cola", 2, 2.5, 3.5),
  ("Coca-Cola Zero", 2, 2.5, None),
  ("Fanta", 2, 2.5, 3.5),
  ("Sprite", 2, 2.5, None),
  ("Chinotto", 2, None, None),
  ("Tè al limone", 2, 2.5, None),
  ("Tè alla pesca", 2, 2.5, None),
  ("Red Bull", 3.5, None, None),
  ("Monster", 3.5, None, None),
]
BIRRE = [
  ("Ichnusa", 2, 2.5, 3.5),
  ("Ichnusa Non Filtrata", None, 2.5, 3.5),
  ("Ichnusa Lemon", None, 2.5, None),
  ("Heineken", 2, 2.5, 3.5),
  ("Beck's", None, 2.5, None),
  ("Ceres Strong", None, 3.5, None),
  ("Ceres Red Erick", None, 3.5, None),
  ("Birra senza glutine 33 cl", None, 3.5, None),
  ("Perdera, vino rosso", None, 6.5, 11),
  ("Costamolino, vino bianco", None, 6.5, 11),
  ("Prosecco Mionetto", None, None, 18),
]

AGGIUNTE = [
  ("0,50 €", "sugo, capperi, lattuga, salse varie"),
  ("1 €", "pesto, cotto, funghi, salame, uovo, zucchine, salsiccia secca, peperoni, melanzane, gorgonzola, olive, cipolle, pomodorini, panna, carciofini*, pecorino, spinaci*, fontina, radicchio, groviera, acciughe, würstel, mortadella, noci, miele, banana, mela, granella di nocciola o di pistacchio, cocco, Smarties"),
  ("1,50 €", "patate fritte o al forno*, rucola, funghi di carne** o porcini, pancetta, polpa di granchio*, salsiccia fresca*, gamberetti*, kebab*, taleggio, grana, mozzarella AD, tonno**, guanciale, stracchino, mozzarella vaccina, provola"),
  ("2–4 €", "carciofi freschi, speck, bresaola, crudo, salmone*, friarielli, fiori di zucca, Nutella, cioccolato bianco · frutti di mare** 3 € · bottarga 3 € · bufala 3 € · burrata 4 €"),
]
