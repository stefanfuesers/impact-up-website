# TODO – Webseite Impact Up

*Stand: 2026-06-28.*

Der große Umbau läuft über Pläne/Briefs in `Spaene/`:
- `Master-Arbeitsplan-Umbau.md` — Positionierung & Texte („Institut für systemische Wirkungsorientierung", DE+EN).
- `Webseite-Redesign-Plan.md` — Design-Feinschliff Runde 1 (Favicon, Hero, Nav, Willkommen/Ebenen/Angebote, Brackets) — **weitgehend erledigt** (siehe unten).
- `ULTRACODE-prompt-runde3.md` — **Feinschliff-Pass 2, vorbereitet, läuft separat** (Hero-Claim, Nav/Home, 4. Ebene, Karten, Erstgespräch, Wirkungsfelder-Linien, **Mobile-Nav**, **Session-Werkstatt-Route**).

Hier nur, was **darüber hinaus** offen ist bzw. quer mitläuft.

---

## Runde 3 – vorbereitet (Brief: `Spaene/ULTRACODE-prompt-runde3.md`)
*Wird in einer frischen Session gefahren; hier nur als Merker, damit nichts runterfällt.*
- [ ] Hero-Claim wieder großzügig (einzeilig „Wir geben eurer Wirkung Raum", kein Punkt; Sub 2 Zeilen).
- [x] Nav: Wortmarke „Impact Up" ersetzt „Home" — **überall** (28.06.); Unterseiten sofort, Index fadet beim Scrollen ein.
- [ ] 4. Gestaltungsebene als **suchende/gemeinsame Bewegung** schärfen + Bridge-Text (Drei-Felder/Vier-Ebenen/Suche-Logik).
- [ ] Angebote-Karten auf gleiche Höhe (Tag-Zeilen angleichen).
- [ ] Erstgespräch-CTA verkleinern (kleine goldene Box statt großem grünen Block).
- [ ] Wirkungsfelder Erde/Frieden/Teilhabe: „eine Zeile zu viel" prüfen (Legende und/oder 3D-Netz).
- [ ] **Echtes Mobile-Nav** (Hamburger/Off-Canvas auf allen Seiten; aktuell ab ≤900px Menü komplett ausgeblendet, kein Ersatz).
- [ ] **Session-Werkstatt DE-Route reparieren** — alle DE-Links auf `session-werkstatt/index.html` vereinheitlichen; live prüfen.

## Offen (übergreifend)
- [ ] **Web3Forms Access-Key** — Session-Werkstatt-Gate hat noch Platzhalter. Registrieren + in `main.js` einbauen (DE+EN), Datenschutz Abschnitt 3 nachziehen („Auftragsverarbeiter Web3Forms").
- [ ] **Fotos einbinden** — sobald du sie gemacht hast (Ort/Seiten klären).
- [ ] **Referenzen entgizen** — die drei Zitate sind alle GIZ. Eine Nicht-GIZ-Quelle rein: **Anja Petz / KURVE Wustrow** (ggf. zweite: Manuel Erbenich). Reihenfolge klären.
- [ ] **Foto-Optimierung** — `stefan_neu.png` → WebP, max ~800px.
- [ ] **Performance** — SVG-Trenner, Three.js-Bundle, Google Fonts; Fonts ggf. selbst hosten (Datenschutz).
- [ ] **LinkedIn-Link** im Footer (sobald Profil bereit).

## Online gehen
- [ ] Site über **GitHub** deployen, Domain-Routing **IONOS** (`impact-up.org`).
- [ ] Vorher **Mobile-Check** über alle Seiten (DE+EN) — hängt an „Echtes Mobile-Nav" (Runde 3).

## Nach Live (Ideen)
- [ ] UBIE/AI-Hook bei „Soziale Teilhabe" stärker andocken.
- [ ] Migration auf Static Site Generator (Astro/Eleventy), wenn die Impulse-Liste wächst.
- [ ] Dediziertes og:image (statt `stefan_neu.png` als Behelf).

---

## Erledigt
- **28.06. – Feinschliff Runde 1 (`Webseite-Redesign-Plan.md`):** Favicon-Cache-Bust (`?v=2`, alle Seiten); Hero-Zwei-Spalten + kompaktes Band; Nav transparent-am-Top→solide-beim-Scrollen + Wortmarke + Scrollspy (Active-Highlight), Nav-JS vom 3D-Netz entkoppelt (WebGL-`try/catch`); Willkommen-Hook „Schön, dass du **zu** uns gefunden hast"; Ebenen-Labels einheitlich (Resonanz·Struktur·Kohärenz·Bewegung); Angebote ohne H2/Intro, „Kooperation moderieren" (Singular), Karten gekürzt; **alle `[Stefan-Satz]`-Brackets aufgelöst** (Repo = 0); `style.css`/`main.js` Cache-Bust.
- **28.06. – Hero-Claim EN entschieden:** „We make space for your Impact".
- **28.06. – Nav** klebt site-weit (`position:fixed`); Positionierungs-Umbau „systemische Wirkungsorientierung" gestartet (Texte DE+EN).
- Frühere Runden: git-History.
