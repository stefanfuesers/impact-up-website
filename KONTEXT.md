# Kontext – Webseite Impact Up

*Stand: 2026-05-07*

## Worum geht's

Statische Webseite für Impact Up unter `impact-up.org`. Visitenkarte und erstes Akquise-Tool – Hamburg, deutschsprachig (DE), englische Version (EN) im Aufbau, gestaltet als „Tempel/Wald/Gold"-Welt mit Three.js-Netz im Hero.

**Tonalität:** persönlich, warm, wertebasiert, im „Wir" verfasst – nicht glatt, nicht korporativ. Kein Marketing-Sprech. Doppelpunkt-Gendern (DE). Im EN: generische Plurale + „they", keine künstlichen DE/EN-Misch-Klammern auf der Webseite.

**Sprachen:** DE ist die Quellsprache, EN als Variante-A-Duplikat (`*.en.html`) parallel. Sprachumschalter DE/EN in der Nav. Migration auf Static Site Generator (Astro/Eleventy) mit i18n-Plugin sinnvoll, sobald die Impulse-Liste auf 6+ Beiträge wächst.

## Stand

- Frontend fertig, läuft lokal.
- **Noch nicht live** – Hosting wird IONOS, Domain-Routing offen.
- Erstgespräch-Formular: Submit aktuell als `mailto:` – Umstellung auf Web3Forms parallel zum EN-Live geplant.
- Aktuell **technisch statisch** (HTML/CSS/JS direkt). EN-Version derzeit als Duplikat-Strategie (`index.en.html` etc.).
- **Datenschutzerklärung** liegt vor (`datenschutz.html`), Hosting-Anbieter IONOS eingetragen.
- **og-Tags / Favicon / Meta-Description** auf allen DE-Seiten gesetzt.

## Struktur

| Datei | Inhalt |
|---|---|
| `index.html` | Hauptseite DE: Hero + Three.js-Netz, Zugänge, Prozess (4 Schritte), Angebote, Philosophie, About, Stimmen (Referenzen GIZ 2025), Erstgespräch-Formular |
| `systems-change.html` | Subseite DE – Six-Conditions-Trapez + vertiefte Theorie (Rayner/Bonnici, School of System Change, Methoden) |
| `impulse.html` | Impulse-Seite DE (1 substanzieller Beitrag, Liste wächst) |
| `impressum.html` | Pflichtseite |
| `datenschutz.html` | Datenschutzerklärung – IONOS als Auftragsverarbeiter, Form-Hinweis |
| `*.en.html` | EN-Pendants (im Aufbau) |
| `logo_vergleich.html` | Hilfsseite – Logo-Varianten gegenüberstellen |
| `main.js` | JS für Three.js-Netz, Nav, Formular, Philo-Aufklapp |
| `style.css` | Komplettes Styling (Tempel/Wald/Gold-Welt) |
| `assets/` | Logos (`logo.svg`, `logo_alt.svg` – aktuell aktiv), Stefan-Foto |

## Wahrheit hier vs. anderswo

- **Webseite-Texte** (Hero, Angebote, Philosophie, About): Wahrheit liegt **hier** in den HTML-Dateien.
- **Design (Farben, Typografie, Tempel/Wald/Gold-Idee):** `../01_Wissensbasis/Designlogik.md`
- **Strategischer Hintergrund** (Positionierung, Geschäftsmodell, Zielgruppen): falls woanders gepflegt → `../Wissensbasis/` *(diese wird gerade entschlackt – ggf. veraltet)*
- **Was offen ist vor Live:** `TODO.md` im selben Ordner

## Referenzen / Zitate (Stimmen-Sektion auf der Hauptseite)

Quelle: *GIZ – Civil Peace Service Cambodia · Letter of Reference, 2025* (`Reference GIZ lang (1).pdf` im Eltern-Ordner). Drei Zitate eingebaut:
1. *„His ability to bring together diverse actors, identify synergies, and facilitate constructive collaboration …"*
2. *„Mr. Füsers combined systemic process consulting, organizational development, and impact-oriented PME …"*
3. *„Through partner-driven and joint learning processes, he promoted plural narratives, participatory approaches, and context-sensitive engagement …"*

Auf der DE-Seite englisches Original. Im EN bleibt es ohnehin im Original.

## Footer (Stand)

© 2026 · Impressum · Datenschutz – auf allen Seiten konsistent. LinkedIn folgt, DE/EN-Umschalter kommt mit EN-Live in die Nav (oben rechts).

## Was hier NICHT reingehört

- Strategische Grundsatzentscheidungen (Positionierung, Geschäftsmodell, Preise) – die werden andernorts getroffen, hier nur dargestellt.
- Inhalte für andere Outputs (Proposals, Ausschreibungen, Methoden-Handbücher).

## Wenn etwas geändert wird

- **Texte** ändern: direkt im HTML, neuer Stand wird zur Wahrheit.
- **Strukturelle Änderungen** (neue Subseite, Nav-Umbau): kurz mit Stefan abstimmen.
- **Vor Live-Schaltung:** Punkte aus `TODO.md` abarbeiten (Web3Forms, Hosting, Impressum/Datenschutz, Stefan-Foto).
