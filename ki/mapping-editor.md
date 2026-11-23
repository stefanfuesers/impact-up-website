# Mapping Editor: file format and API for AI assistants

The Mapping Editor (https://impact-up.org/mapping-editor.html) is a free browser tool by Impact Up for drawing three kinds of maps together with a group:

- **Systems Map**: factors that influence each other, feedback loops, actors, Mental Models and Leverage Points (a Causal Loop Diagram).
- **Impact Map**: a chain of effects from input through activity, output and outcome to impact, with assumptions on the arrows (Theory of Change), context factors and indicators.
- **Actors Map**: the actors around a topic, their weight, their stance and their relationships.

The tool runs entirely in the browser. Nothing is sent to a server. The interface exists in German, English, French and Spanish (`?lang=de|en|fr|es`). The data format is the same in every language.

The tool only draws. Whether a map is right is decided by the people who work with it. When you draft a map for someone, keep it simple and readable: a map with 8 to 20 elements that a group can discuss is worth more than a complete one with 60.

## Two ways to bring a map into the tool

**1. Without a browser (chat assistants).** Write the map as a JSON file in the format below, for example `my-map.json`, and give it to the user. The user opens https://impact-up.org/mapping-editor.html and loads the file with **File > Open** (German interface: **Datei > Öffnen**). From there they can move elements, edit text, present the map step by step and save it again.

**2. With a browser (agents that can run JavaScript in the page).** Open https://impact-up.org/mapping-editor.html and call:

```js
MappingEditor.help()                 // short description of all functions
MappingEditor.validate(json)         // check a map without loading it, returns a report
MappingEditor.load(json)             // replace the current project with this map or project
MappingEditor.add(json)              // add the map(s) as new tabs to the current project
MappingEditor.export()               // the whole project as JSON (all tabs)
MappingEditor.exportMap()            // only the map that is shown
MappingEditor.examples()             // built-in examples with keys and links
MappingEditor.example('nachbarschaft') // one built-in example as JSON
MappingEditor.vocabulary()           // all allowed values for types, levels, colours, methods
```

`json` may be an object or a JSON string. A loaded map counts as unsaved, and Ctrl+Z restores the previous state. The user saves with File > Save.

## Coordinates are optional

Every element can carry `x` and `y` (pixels, the origin is arbitrary, y grows downwards). If they are missing, the tool arranges the elements itself:

- In an **Impact Map** with a method (default `iooi`), the method places every element in its level. You never need coordinates there.
- In a **Systems Map** and an **Actors Map**, elements without coordinates are placed on a circle. The user then drags them into place. For a Systems Map with loops, set coordinates yourself if you can: causes on the left, effects on the right, loops arranged as circles.

`MappingEditor.load(json, {layout:true})` rearranges all elements even if they have coordinates.

## The file

A file is either a single map or a project with several maps (shown as tabs).

```json
{ "format": "cld-editor", "version": 1, "mapType": "impact", "title": "…", "nodes": [], "links": [] }
```

```json
{ "format": "cld-editor", "version": 2, "current": 0, "maps": [ { "mapType": "systems", … }, { "mapType": "impact", … } ] }
```

Fields of every map:

| Field | Meaning |
|---|---|
| `mapType` | `systems`, `impact` or `actors` |
| `title` | Title shown above the map |
| `nodes` | Elements. Every element has `id` (unique string), `type`, `text`, optionally `x`, `y`, `note` (longer text shown in the side panel), `layer` (1, 2, 3 … for step-by-step presentation, default 1) |
| `links` | Connections. Every link has `id`, `from`, `to` (element ids), `kind`, optionally `label`, `bend` (curvature in pixels, 0 is straight), `layer` |
| `colorMeanings` | What a colour stands for in the legend, e.g. `{"orange": "Strand neighbourhood café"}` |
| `showLegend` | `true` or `false` |

Colours: `orange`, `himmel` (sky blue), `gruen` (green), `gelb` (yellow), `blau` (blue), `rot` (red), `magenta`, `grau` (grey).

Missing ids are added on loading. Unknown fields are kept. Elements whose type the map kind does not use, and links whose ends are missing, are dropped; `validate` reports them.

## Systems Map (`"mapType": "systems"`)

Element types:

| `type` | Meaning | Fields |
|---|---|---|
| `factor` | A quantity that can rise or fall, e.g. "Number of volunteers" | `size` 1 to 3, `color`, `frame` (boxed), `grey` (outside the focus), `kdf` (Key Driving Factor), `lever` (Leverage Point), `peace` (peace factor) |
| `actor` | Someone who acts in the system | |
| `mm` | A Mental Model: an assumption or attitude behind the behaviour | `actorLabel` (whose model), `attach` |
| `loop` | Marker in the middle of a feedback loop | `loopType` `R` (reinforcing), `B` (balancing) or `?`, `num` (number), `dir` `cw` or `ccw` |
| `note` | A comment | `attach` |

`attach` connects an `mm` or a `note` to elements or arrows: `[{"k":"node","id":"f1"}]` or `[{"k":"link","id":"l3"}]`.

Link kinds:

| `kind` | Meaning | Fields |
|---|---|---|
| `effect` | Arrow from cause to effect | `pol` `+` (same direction), `-` (opposite direction) or `null` (only "influences"), `delay` (the effect comes late), `unc` (uncertain, dashed), `both` (both directions) |
| `line` | Belongs together, no direction, e.g. an actor and a factor it shapes | `lever` (the actor wants to use this Leverage Point) |

Example:

```json
{
  "format": "cld-editor", "version": 1, "mapType": "systems",
  "title": "Volunteer burnout in a neighbourhood initiative",
  "nodes": [
    {"id":"f1","type":"factor","text":"Number of active volunteers","x":0,"y":0,"kdf":true},
    {"id":"f2","type":"factor","text":"Workload per person","x":320,"y":-120},
    {"id":"f3","type":"factor","text":"Exhaustion","x":560,"y":0},
    {"id":"f4","type":"factor","text":"Quality of the offers","x":320,"y":160},
    {"id":"f5","type":"factor","text":"Requests from the neighbourhood","x":640,"y":220},
    {"id":"r1","type":"loop","text":"","loopType":"R","num":1,"x":290,"y":-55},
    {"id":"m1","type":"mm","text":"\"If I say no, nobody will do it.\"","x":620,"y":-170,"attach":[{"k":"node","id":"f2"}]}
  ],
  "links": [
    {"id":"l1","from":"f1","to":"f2","kind":"effect","pol":"-"},
    {"id":"l2","from":"f2","to":"f3","kind":"effect","pol":"+"},
    {"id":"l3","from":"f3","to":"f1","kind":"effect","pol":"-","delay":true},
    {"id":"l4","from":"f1","to":"f4","kind":"effect","pol":"+"},
    {"id":"l5","from":"f4","to":"f5","kind":"effect","pol":"+"},
    {"id":"l6","from":"f5","to":"f2","kind":"effect","pol":"+"}
  ]
}
```

## Impact Map (`"mapType": "impact"`)

The map carries a method in `"impact": {"method": "iooi"}`. Methods: `iooi` (Input, Output, Outcome, Impact in four levels, impact at the top, input at the bottom, the default), `treppe` (impact staircase with seven steps), `toc` (Backwards Mapping), `logframe`, `om` (Outcome Mapping), `rpp` (RPP Matrix, Reflecting on Peace Practice). The method only arranges and renames the building blocks. The data stays the same.

Element types:

| `type` | Meaning | Fields |
|---|---|---|
| `step` | A building block of the chain of effects | `level` (see below), `who` (target group or who acts), `color`, `leverPt` (the Leverage Point an activity or outcome works on), `pm1`, `pm2`, `pm3` (progress markers on an outcome: expect, like, love to see) |
| `indicator` | Shows whether something is happening | `ikind` `process` or `quality` |
| `context` | A condition from outside that supports or hinders | |
| `actor` | Someone who acts or is affected | |
| `note` | A comment | `attach` |

Levels of a `step`: `input` (what is invested: time, money, people, rooms), `activity` (an offer that takes place), `output` (a countable result of the activity), `milestone` (an interim goal), `outcome` (what changes for people: knowledge, attitude, behaviour), `impact` (the longer-term change in society), `vision` (the future state everything aims at), `status` (the situation today).

Link kinds:

| `kind` | From → to | Fields |
|---|---|---|
| `leads` | step → step ("leads to") | `assumption`: why this step leads to the next. On outcome → impact it is the Theory of Change, one assumption per line |
| `ctx` | context → step | `effect` `stützt` (supports), `bremst` (hinders) or `null` |
| `ind` | indicator → step | |
| `act` | actor → step | |

Example (no coordinates needed, the method arranges it):

```json
{
  "format": "cld-editor", "version": 1, "mapType": "impact",
  "title": "Language café for newcomers",
  "impact": {"method": "iooi"},
  "nodes": [
    {"id":"i1","type":"step","level":"input","text":"Two volunteers, room in the community centre"},
    {"id":"a1","type":"step","level":"activity","text":"Weekly language café","who":"Neighbourhood association"},
    {"id":"o1","type":"step","level":"output","text":"40 meetings a year, 15 regular participants"},
    {"id":"c1","type":"step","level":"outcome","text":"Newcomers speak German in everyday situations","who":"Newcomers in the shelter","pm1":"come regularly","pm2":"bring friends along","pm3":"organise a table themselves"},
    {"id":"im","type":"step","level":"impact","text":"Newcomers take part in neighbourhood life"},
    {"id":"k1","type":"context","text":"Shift work leaves little time"},
    {"id":"q1","type":"indicator","ikind":"quality","text":"Participants report conversations outside the café"}
  ],
  "links": [
    {"id":"l1","from":"i1","to":"a1","kind":"leads"},
    {"id":"l2","from":"a1","to":"o1","kind":"leads"},
    {"id":"l3","from":"o1","to":"c1","kind":"leads","assumption":"Practising without pressure lowers the fear of speaking"},
    {"id":"l4","from":"c1","to":"im","kind":"leads","assumption":"Language is the first door into neighbourhood life\nNeighbours are open to contact"},
    {"id":"l5","from":"k1","to":"c1","kind":"ctx","effect":"bremst"},
    {"id":"l6","from":"q1","to":"c1","kind":"ind"}
  ]
}
```

## Actors Map (`"mapType": "actors"`)

The map carries a method in `"actors": {"method": "landkarte"}`. Methods: `landkarte` (actor map with weight and stance, the default), `pim` (Power-Interest Matrix), `netmap` (Net-Map with influence towers), `zwiebel` (onion: position, interests, needs).

Element types:

| `type` | Meaning | Fields |
|---|---|---|
| `party` | An actor: a person, group or organisation | `power` 1 to 3 (weight, drawn as circle size), `stance` `+` (supports), `o` (neutral), `-` (against), `third` (third party), `color`. Per method: `pimEinfluss` and `pimInteresse` (`niedrig` or `hoch`), `nmTower` (0 to 5), `nmGoals` (short codes), `zwPosition`, `zwInteressen`, `zwBeduerfnisse` (text) |
| `camp` | A frame around actors who belong together | `w`, `h` (size), `color` |
| `note` | A comment | `attach` |

Links have `"kind": "rel"` and a relationship `rel`: `close` (close relationship), `alliance`, `informal` (loose), `broken` (disturbed), `conflict`, `influence` (one acts on the other, drawn as an arrow from `from` to `to`). Between two actors there are at most two relationships.

Example:

```json
{
  "format": "cld-editor", "version": 1, "mapType": "actors",
  "title": "Who shapes the integration of the new shelter?",
  "actors": {"method": "landkarte"},
  "nodes": [
    {"id":"p1","type":"party","text":"Shelter management","power":3,"stance":"+"},
    {"id":"p2","type":"party","text":"Neighbourhood association","power":2,"stance":"+"},
    {"id":"p3","type":"party","text":"Local council","power":3,"stance":"o"},
    {"id":"p4","type":"party","text":"Residents' initiative against the shelter","power":2,"stance":"-"},
    {"id":"p5","type":"party","text":"Residents of the shelter","power":1,"stance":"+"}
  ],
  "links": [
    {"id":"l1","from":"p1","to":"p2","kind":"rel","rel":"alliance"},
    {"id":"l2","from":"p3","to":"p1","kind":"rel","rel":"influence"},
    {"id":"l3","from":"p4","to":"p3","kind":"rel","rel":"influence"},
    {"id":"l4","from":"p4","to":"p2","kind":"rel","rel":"conflict"},
    {"id":"l5","from":"p2","to":"p5","kind":"rel","rel":"informal"}
  ]
}
```

## Built-in examples

Each kind has an example that opens by link. In the browser, `MappingEditor.example(key)` returns it as JSON, which is the most reliable reference for the format.

- Systems Map: https://impact-up.org/mapping-editor.html#beispiel=muell (and further keys from `MappingEditor.examples()`)
- Impact Map: https://impact-up.org/mapping-editor.html#beispiel=nachbarschaft
- Actors Map: https://impact-up.org/mapping-editor.html#beispiel=windkraft

The Wiki inside the tool explains every map kind and method for people.

Impact Up · Institut für systemische Wirkungsorientierung · https://impact-up.org
