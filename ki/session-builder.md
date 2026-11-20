# Session Builder: method catalogue and plan format for AI assistants

The Session Builder (https://impact-up.org/session-werkstatt/) is a free browser tool by Impact Up for preparing workshops, meetings, retreats and difficult conversations. People answer a few questions, and a simple rule-based mechanism puts together a first draft from a catalogue of 190 facilitation methods. The catalogue is the core: each method has steps, duration, group size, notes on when it fits and when it does not, and at least one source.

For an AI assistant the catalogue is a method source. The assistant plans the session from the user's actual task, picks fitting methods from the catalogue, and the user gets a plan whose methods are described and sourced. The plan can be shown in the Session Builder and downloaded as a PDF.

The tool runs entirely in the browser. Nothing is sent to a server. It exists in German, English, French and Spanish.

## The catalogue

| Language | Overview (one entry per method) | Full data (JSON array after `window.METHODEN = `) | Page |
|---|---|---|---|
| German | https://impact-up.org/ki/methoden.de.md | https://impact-up.org/session-werkstatt/daten.js | https://impact-up.org/session-werkstatt/ |
| English | https://impact-up.org/ki/methoden.en.md | https://impact-up.org/session-werkstatt/daten.en.js | https://impact-up.org/session-werkstatt/index.en.html |
| French | https://impact-up.org/ki/methoden.fr.md | https://impact-up.org/session-werkstatt/daten.fr.js | https://impact-up.org/session-werkstatt/index.fr.html |
| Spanish | https://impact-up.org/ki/methoden.es.md | https://impact-up.org/session-werkstatt/daten.es.js | https://impact-up.org/session-werkstatt/index.es.html |

The method ids are the same in every language. Read the overview first, then look up the methods you want to use in the full data (about 700 KB per language) or, in the browser, with `SessionBuilder.method(id)`.

### Fields of a method

| Field | Meaning |
|---|---|
| `id` | Stable id, the same in all languages |
| `name`, `kurz` | Name and short description |
| `schritte` | Steps to run the method |
| `zweck` | What the method is for |
| `hinweise` | What to watch out for |
| `wann_passt`, `wann_nicht` | Situations where it fits, and where it does not. Take `wann_nicht` seriously |
| `fokusfragen` | Questions that can guide the method |
| `mini_form` | A smaller version |
| `beispiel` | How it sounds in practice (mainly for conversation tools) |
| `dauer_min`, `dauer_max` | Duration in minutes |
| `gruppe_min`, `gruppe_max` | Group size |
| `typ` | `methode` (something the group does), `werkzeug` (a tool for the facilitator, e.g. a question technique), `rahmenmodell` (a model to look through, not an exercise), `haltung` (an attitude) |
| `feld` | Field: `A` planning, goals and steering · `B` organisation and consulting · `C` group and team · `D` systems change, networks and design · `E` peace and conflict · `F` cross-cutting: reflection, learning, body and presence · `G` meeting craft and online facilitation |
| `phasen` | Where in a process it helps: `ankommen` (arriving), `verstehen` (understanding), `planen` (planning), `oeffnen` (opening up ideas), `vertiefen` (deepening), `konflikt` (conflict), `entscheiden` (deciding), `verstetigen` (making it last), `reflektieren` (reflecting) |
| `blocktyp` | Place in a session: `einstieg` (opening), `kern` (core), `uebergang` (transition), `energizer`, `reflexion`, `abschluss` (closing) |
| `anlass_typen` | Occasions: `schwieriges_gespraech` (difficult one-to-one conversation), `coaching`, `konfliktklaerung` (conflict resolution), `krisensitzung` (crisis meeting), `regeltermin` (regular meeting), `entscheidungstreffen` (decision meeting), `strategie` (strategy and future), `kickoff`, `retro` (retrospective), `teamtag` (team day), `dialograum` (dialogue space), `netzwerktreffen` (network meeting), `beteiligung` (participation, large group), `lernformat` (training) |
| `ebenen` | Level: `person`, `team`, `organisation`, `netzwerk` (network), `feld` (field or society) |
| `stil` | Style: `strukturiert` (structured), `gespraechsnah` (conversational), `beteiligend` (participatory), `schriftlich` (in writing), `spielerisch` (playful), `koerperlich` (physical) |
| `online` | `ja` (works online), `eingeschraenkt` (with limits), `nein` |
| `selbstoeffnung` | How much people reveal of themselves: `niedrig`, `mittel`, `hoch` (low, medium, high). High needs trust |
| `energie` | `aktivierend` (activating), `neutral`, `beruhigend` (calming) |
| `vertrauensbildend`, `braucht_raum` | Builds trust; needs physical space |
| `quellen` | Sources: `{typ, titel, url}` |

## Planning a session

Plan from the user's task, not from the catalogue. First clarify what the session has to produce, who takes part, how long it is and where it takes place. Then build the arc (arriving, working, deciding, closing) and look for methods that serve each part. Use the catalogue where a method helps. A block can also be a plain, well-guided conversation or a working step without a named method. Respect group size, duration, `wann_nicht` and the trust the group has. For a meeting tomorrow, prefer methods that need little preparation.

## The plan format

```json
{
  "title": "Project outline for a neighbourhood language café",
  "occasion": "Team workshop",
  "setting": "6 people · 2 hours · on site",
  "goal": "All information for the project outline, so that the funding application can be written afterwards",
  "start": "10:00",
  "blocks": [
    {"title": "Arriving and the target picture", "minutes": 10, "text": "Show the outline structure on the wall. The person writing the application says what it needs."},
    {"title": "Needs and starting point", "minutes": 15, "method": "1-2-4-all", "questions": ["What do newcomers in our neighbourhood need most in the first year?"]},
    {"title": "Break", "minutes": 10, "break": true},
    {"title": "Agree on the open points", "minutes": 10, "method": "gradients-of-agreement", "materials": "Cards with the levels of agreement"},
    {"title": "Who does what by when", "minutes": 10, "method": "wer-macht-was-bis-wann"}
  ],
  "notes": "One person keeps the outline document open and fills it in during the session.",
  "openPoints": ["Budget lines for the second year"]
}
```

| Field | Meaning |
|---|---|
| `title` | Title of the plan |
| `occasion`, `setting`, `goal` | Shown in the header. All optional |
| `start` | Start time `HH:MM`. With it, the Session Builder writes the clock times next to each block |
| `blocks` | The blocks in order. Each has `title` and `minutes`. Optional: `method` (an `id` from the catalogue, the page then shows the method's description, steps, notes and sources), `text` (your instructions for this block), `questions`, `materials`, `break` (`true` for a break) |
| `notes` | Notes for the whole session |
| `openPoints` | What is still open |

German keys (`titel`, `ziel`, `bloecke`, `minuten`, `methode`, `fragen`, `pause` …) are also understood.

## Showing the plan

**Without a browser (chat assistants).** Give the user the plan as JSON and tell them: open the Session Builder (https://impact-up.org/session-werkstatt/ or a language version), click **"Einen Ablauf aus deiner KI einfügen"** below the start button (English: "Paste a session plan from your AI"), paste the JSON and click **Show**. The plan appears with the method descriptions and can be downloaded as a PDF.

**With a browser.** Open the Session Builder in the user's language and call:

```js
SessionBuilder.help()
SessionBuilder.search({text: "decide together", people: 7, minutes: 30, phase: "entscheiden", online: false, limit: 10})
SessionBuilder.method("1-2-4-all")
SessionBuilder.showPlan(plan)          // shows the plan with a Download button for the PDF
```

Filters of `search`: `text` (words in name, description, purpose and "when it fits"), `phase`, `people` (group size), `minutes` (time available, methods whose minimum duration fits), `online` (`true` leaves out methods that do not work online), `style`, `field`, `type`, `occasion`, `block`, `limit` (default 15). Every filter except `text`, `people`, `minutes` and `limit` accepts one value or a list. The result is a compact list. `showPlan` returns which method ids it did not find.

`SessionBuilder.questionnaire(answers)` fills in the page's own questionnaire and shows its rule-based draft. This is rarely what you want: the draft follows a fixed template.

Impact Up · Institut für systemische Wirkungsorientierung · https://impact-up.org
