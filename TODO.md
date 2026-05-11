# TODO – Webseite Impact Up

*Stand: 2026-05-07*

Was noch offen ist, sortiert nach Priorität. Wahrheit der Texte lebt in den HTML-Dateien selbst, das hier ist nur die Restpunkt-Liste.

---

## Vor Live

### Inhalt
- [ ] **Zwei weitere Referenzen** in die Stimmen-Sektion (DE+EN) aufnehmen, zusätzlich zu den drei GIZ-Zitaten:
  - Manuel Erbenich (GIZ Civil Peace Service Cambodia, persönlich): *"His ability to navigate multi-stakeholder environments, drive impactful knowledge exchange, and implement PM&E frameworks makes him a distinguished professional in the field."*
  - Anja Petz (KURVE Wustrow): *"Er agierte stets zielorientiert bei gleichzeitigem sensiblem Einbeziehen der Bedürfnisse der Partnerorganisation."*
  - Klären: Reihenfolge der fünf Zitate? Erbenich näher zu GIZ-Kontext, Petz als deutsches Zitat als Anker für DE-Leser:innen.

- [ ] **Stefan-Bio EN**: vor Live einmal selbst gegenlesen (Tonalität, Begriffe).
- [ ] **Hero-Claim EN** (*"We make space for your impact"*) – passt das oder besser *"We give your impact room"*?
- [ ] **About-Reframing EN** auf Wärme prüfen.

### Technik
- [ ] **Mailto → Web3Forms**: Stefan registriert auf web3forms.com mit info@impact-up.org → Access Key → Einbau in `main.js` (DE+EN). Datenschutzerklärung Abschnitt 3 entsprechend updaten ("Auftragsverarbeiter Web3Forms").
- [ ] **Hosting & Domain-Routing IONOS**: Site auf IONOS hochladen, `impact-up.org` korrekt routen.
- [ ] **Mobile-Check** über alle Seiten (DE + EN), insbesondere iPhone-Breite und Tablet.
- [ ] **Foto-Optimierung**: `stefan_neu.png` → WebP, max ~800px breit.
- [ ] **Performance-Audit**: SVG-Trenner, Three.js-Bundle, Google Fonts.

### Sichtbarkeit
- [ ] **LinkedIn-Link** im Footer ergänzen (sobald Stefan sein LinkedIn-Profil für Impact Up freigegeben/aktualisiert hat).

---

## Nach Live (strategisch)

- [ ] **UBIE / AI-Hook** bei der Quelle „Soziale Teilhabe" stärker andocken (Priya).
- [ ] **A/B-Variante Hero-Sub** erwägen, wenn Daten zur Klick-Rate vorliegen (Amara).
- [ ] **Migration auf Static Site Generator** (Astro/Eleventy mit i18n-Plugin), sobald Impulse-Liste 6+ Beiträge hat.
- [ ] **Self-Hosting Google Fonts**, statt Lade-Anfrage an Google-Server (Datenschutz-Hygiene).
- [ ] **og:image dediziert gestalten** (statt stefan_neu.png als Behelf) – Yara.

---

## Erledigt seit 2026-05-02

- ✅ Prozess Schritt 04 mit Text
- ✅ Impulse-Platzhalter raus + ehrlicher Auslauf-Hinweis
- ✅ Footer einheitlich, „Testlauf" raus, Datenschutz-Link
- ✅ Datenschutzerklärung als eigene Seite + Checkbox am Formular (DE+EN)
- ✅ Favicon, og-Tags, Meta-Description auf allen Seiten
- ✅ Step 03 dem Muster „Als … im Prozess starten wir" angepasst, Macht explizit drin
- ✅ Prozess-Lead aufgebrochen in Innen/Außen-Block
- ✅ Step 03 umbenannt zu „Anschluss ans Feld" (Kohärenz entdoppelt)
- ✅ Brücke Angebote ↔ Prozess („3 Angebote = Schritte 01–03, 04 in Netzwerken")
- ✅ „Wer sind Wir?" → „Wer wir sind"
- ✅ „Kostenloses Erstgespräch" → „Erstgespräch vereinbaren" + kleiner Zusatz
- ✅ Querverweis Philosophie → Systems-Change-Subseite
- ✅ About-Reframing: Institut als organisierende Akteurin, Aufbau-Charakter
- ✅ Drei GIZ-Zitate (Letter of Reference 2025) eingebaut
- ✅ Hero-Sub B1 mit „Initiativen" + Meta/og synchron
- ✅ Theorie-Block Six Conditions / Rayner-Bonnici / School of System Change → auf `systems-change.html`
- ✅ Frieden-Methoden-Anker in der Philosophie als eigener Absatz
- ✅ IONOS in Datenschutz Abschnitt 2
- ✅ „Stimmen" → „Referenzen" / „Voices" → „References"
- ✅ Soziale Teilhabe: Cohesion-Brückenschluss in DE+EN
- ✅ EN-Übersetzung aller 5 Seiten (`*.en.html`) + Sprachumschalter in der Nav (DE↔EN)
- ✅ Three.js-Netz-Labels mit DE/EN-Switch in `main.js`
