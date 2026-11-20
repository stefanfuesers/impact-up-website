/* =====================================================================
   Session-Builder · Schnittstelle für KI-Assistenten (window.SessionBuilder)
   Lädt nach dem Hauptskript. Nutzt dessen globale Werte: METHODEN, A,
   schritt, M (#inhalt), render, downloadPdf, PRINTKOPF, quellenHtml, esc.
   Beschreibung für KI: https://impact-up.org/ki/session-builder.md
   Ein KI-Ablauf wird nur angezeigt. Er verlässt den Browser nicht.
   ===================================================================== */
(function(){
"use strict";
const LANG = (document.documentElement.lang || "de").slice(0,2);
const TX = {
  de:{link:"Einen Ablauf aus deiner KI einfügen", eyebrow:"Ablauf aus deiner KI", paste:"Ablauf einfügen",
      pasteLead:"Hier fügst du einen Ablauf ein, den eine KI wie Claude oder ChatGPT mit den Methoden des Session-Builders entworfen hat. Gib deiner KI dafür den Link impact-up.org/llms.txt mit. Der Ablauf wird nur hier in deinem Browser angezeigt, und du kannst ihn als PDF herunterladen.",
      show:"Anzeigen", back:"Zurück zum Start", err:"Diesen Text kann der Session-Builder nicht als Ablauf lesen. Erwartet wird JSON im beschriebenen Format.",
      steps:"So gehst du vor", care:"Worauf du achten solltest", deeper:"Zum Vertiefen", questions:"Fragen", material:"Material",
      fromCat:"Methode aus dem Session-Builder", unknown:"Diese Methode steht nicht im Katalog des Session-Builders:", goal:"Ziel", notes:"Hinweise", open:"Noch offen", min:"Min", download:"Download",
      note:"Diesen Ablauf hat eine KI mit den Methoden des Session-Builders entworfen. Prüft ihn mit Blick auf eure Gruppe."},
  en:{link:"Paste a session plan from your AI", eyebrow:"Session plan from your AI", paste:"Paste a plan",
      pasteLead:"Paste a session plan here that an AI such as Claude or ChatGPT has drafted with the methods of the Session Builder. Give your AI the link impact-up.org/llms.txt for this. The plan is only shown here in your browser, and you can download it as a PDF.",
      show:"Show", back:"Back to start", err:"The Session Builder cannot read this text as a plan. It expects JSON in the documented format.",
      steps:"How to do it", care:"What to watch out for", deeper:"To go deeper", questions:"Questions", material:"Materials",
      fromCat:"Method from the Session Builder", unknown:"This method is not in the Session Builder's catalogue:", goal:"Goal", notes:"Notes", open:"Still open", min:"min", download:"Download",
      note:"An AI drafted this plan with the methods of the Session Builder. Check it with your group in mind."},
  fr:{link:"Coller un déroulé proposé par votre IA", eyebrow:"Déroulé proposé par votre IA", paste:"Coller un déroulé",
      pasteLead:"Collez ici un déroulé qu’une IA comme Claude ou ChatGPT a conçu avec les méthodes du Session Builder. Donnez pour cela à votre IA le lien impact-up.org/llms.txt. Le déroulé s’affiche uniquement ici, dans votre navigateur, et vous pouvez le télécharger en PDF.",
      show:"Afficher", back:"Retour au début", err:"Le Session Builder ne peut pas lire ce texte comme un déroulé. Il attend du JSON au format décrit.",
      steps:"Comment procéder", care:"Points d’attention", deeper:"Pour approfondir", questions:"Questions", material:"Matériel",
      fromCat:"Méthode du Session Builder", unknown:"Cette méthode ne figure pas dans le catalogue du Session Builder :", goal:"Objectif", notes:"Remarques", open:"Encore ouvert", min:"min", download:"Télécharger",
      note:"Une IA a conçu ce déroulé avec les méthodes du Session Builder. Vérifiez-le en pensant à votre groupe."},
  es:{link:"Pegar un plan de tu IA", eyebrow:"Plan de tu IA", paste:"Pegar un plan",
      pasteLead:"Pega aquí un plan de sesión que una IA como Claude o ChatGPT haya elaborado con los métodos del Session Builder. Para ello, dale a tu IA el enlace impact-up.org/llms.txt. El plan solo se muestra aquí, en tu navegador, y puedes descargarlo en PDF.",
      show:"Mostrar", back:"Volver al inicio", err:"El Session Builder no puede leer este texto como un plan. Espera JSON en el formato descrito.",
      steps:"Cómo hacerlo", care:"A qué prestar atención", deeper:"Para profundizar", questions:"Preguntas", material:"Material",
      fromCat:"Método del Session Builder", unknown:"Este método no está en el catálogo del Session Builder:", goal:"Objetivo", notes:"Notas", open:"Pendiente", min:"min", download:"Descargar",
      note:"Una IA elaboró este plan con los métodos del Session Builder. Revísenlo pensando en su grupo."}
};
const T = TX[LANG] || TX.de;
const e = s => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const byId = id => METHODEN.find(m => m.id===id) || null;
const firstUrl = m => ((m.quellen||[]).find(q=>q.url)||{}).url || null;

/* ---------- Suche im Methodenkatalog ---------- */
function kompakt(m){
  return {id:m.id, name:m.name, short:m.kurz, type:m.typ, field:m.feld, minutes:[m.dauer_min,m.dauer_max], people:[m.gruppe_min,m.gruppe_max],
    phases:m.phasen, occasions:m.anlass_typen, blocks:m.blocktyp, style:m.stil, online:m.online, selfDisclosure:m.selbstoeffnung, source:firstUrl(m)};
}
const norm = s => String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
function search(q){
  q = q || {};
  const g = k => q[k]!==undefined ? q[k] : undefined;
  const text = g("text"), phase = g("phase"), people = g("people"), minutes = g("minutes"), online = g("online");
  const style = g("style"), field = g("field"), type = g("type"), occasion = g("occasion"), block = g("block");
  const words = text ? norm(text).split(/\s+/).filter(w=>w.length>1) : [];
  const has = (arr, v) => v===undefined || [].concat(v).some(x => (arr||[]).includes(x));
  const out = [];
  for(const m of METHODEN){
    if(!has(m.phasen, phase) || !has(m.stil, style) || !has(m.anlass_typen, occasion) || !has(m.blocktyp, block)) continue;
    if(field!==undefined && ![].concat(field).includes(m.feld)) continue;
    if(type!==undefined && ![].concat(type).includes(m.typ)) continue;
    if(people!==undefined && (people < m.gruppe_min || people > m.gruppe_max)) continue;
    if(minutes!==undefined && m.dauer_min > minutes) continue;
    if(online===true && m.online==="nein") continue;
    let score = 1;
    if(words.length){
      const name = norm(m.name), body = norm([m.kurz, m.zweck, (m.wann_passt||[]).join(" ")].join(" "));
      score = 0;
      for(const w of words){ if(name.includes(w)) score += 3; else if(body.includes(w)) score += 1; }
      if(!score) continue;
    }
    out.push([score, m]);
  }
  out.sort((a,b) => b[0]-a[0]);
  return out.slice(0, q.limit || 15).map(x => kompakt(x[1]));
}

/* ---------- Einen Ablauf anzeigen ---------- */
// Englische Schlüssel sind die Regel, deutsche werden ebenfalls verstanden.
const pick = (o, ...keys) => { for(const k of keys) if(o && o[k]!==undefined && o[k]!==null && o[k]!=="") return o[k]; return undefined; };
function lesePlan(p){
  if(typeof p==="string"){ const s = p.trim().replace(/^```(?:json)?\s*/i,"").replace(/```\s*$/,""); p = JSON.parse(s); }
  if(!p || typeof p!=="object") throw new Error("plan");
  const bl = pick(p, "blocks", "bloecke", "ablauf");
  if(!Array.isArray(bl) || !bl.length) throw new Error("blocks");
  return {
    title: pick(p, "title", "titel") || "",
    occasion: pick(p, "occasion", "anlass") || "",
    goal: pick(p, "goal", "ziel") || "",
    setting: pick(p, "setting", "rahmen") || "",
    start: pick(p, "start", "beginn") || "",
    notes: pick(p, "notes", "hinweise") || "",
    openPoints: [].concat(pick(p, "openPoints", "offen") || []),
    blocks: bl.map(b => ({
      title: pick(b, "title", "titel") || "",
      minutes: Math.max(0, parseInt(pick(b, "minutes", "minuten", "min"), 10) || 0),
      method: pick(b, "method", "methode") || null,
      text: pick(b, "text", "beschreibung") || "",
      questions: [].concat(pick(b, "questions", "fragen") || []),
      materials: [].concat(pick(b, "materials", "material") || []).join(", "),
      isBreak: !!pick(b, "break", "pause")
    }))
  };
}
const hhmm = m => String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
function showPlan(p){
  const P = lesePlan(p);
  let clock = /^\d{1,2}:\d{2}$/.test(P.start) ? (+P.start.split(":")[0])*60 + (+P.start.split(":")[1]) : null;
  const zeit = b => { if(clock===null || !b.minutes) return ""; const v = hhmm(clock), bis = hhmm(clock + b.minutes); clock += b.minutes; return `<span class="zeit">${v}–${bis}</span>`; };
  const dauer = b => b.minutes ? `<span class="dauer">${b.minutes} ${T.min}</span>` : "";
  let blocks = "";
  for(const b of P.blocks){
    const z = zeit(b);
    if(b.isBreak){ blocks += `<div class="block pause"><div class="kopf">${z}${dauer(b)}<span class="titel" style="font-size:1.05rem">${e(b.title)}</span></div>${b.text?`<p class="kurz">${e(b.text)}</p>`:""}</div>`; continue; }
    const m = b.method ? byId(b.method) : null;
    const extra = `${b.text?`<p class="kurz">${e(b.text)}</p>`:""}
      ${b.questions.length?`<h4>${T.questions}</h4><ul>${b.questions.map(f=>`<li>${e(f)}</li>`).join("")}</ul>`:""}
      ${b.materials?`<h4>${T.material}</h4><p class="kurz">${e(b.materials)}</p>`:""}`;
    if(m){
      blocks += `<div class="uebung"><div class="ukopf">${z}${dauer(b)}<span class="uname">${e(m.name)}</span><span class="ulabel">${e(b.title)}</span></div>
        <p class="kurz">${e(m.kurz)}</p>${extra}
        <h4>${T.steps}</h4><ol>${(m.schritte||[]).map(s=>`<li>${e(s)}</li>`).join("")}</ol>
        ${m.hinweise?`<h4>${T.care}</h4><p class="kurz">${e(m.hinweise)}</p>`:""}
        <p class="quel"><b>${T.deeper}:</b> ${quellenHtml(m)}</p></div>`;
    } else {
      blocks += `<div class="block"><div class="kopf">${z}${dauer(b)}<span class="titel">${e(b.title)}</span></div>${extra}
        ${b.method?`<p class="hint">${T.unknown} ${e(b.method)}</p>`:""}</div>`;
    }
  }
  M.innerHTML = `${PRINTKOPF}
    <div class="eyebrow">${T.eyebrow}</div>
    <h1>${e(P.title || P.occasion || T.eyebrow)}</h1>
    ${(P.occasion||P.setting||P.goal)?`<div class="kontextzeile">${P.occasion&&P.title?`<b>${e(P.occasion)}</b><br>`:""}${P.setting?`${e(P.setting)}<br>`:""}${P.goal?`<b>${T.goal}:</b> ${e(P.goal)}`:""}</div>`:""}
    ${blocks}
    ${P.notes?`<div class="begleit"><h3>${T.notes}</h3><p class="kurz">${e(P.notes)}</p></div>`:""}
    ${P.openPoints.length?`<div class="begleit"><h3>${T.open}</h3><ul>${P.openPoints.map(x=>`<li>${e(x)}</li>`).join("")}</ul></div>`:""}
    <p class="hint">${T.note}</p>
    <div class="aktionen"><button class="primary" onclick="downloadPdf(this)">${T.download}</button>
      <button class="secondary" onclick="schritt=0;window.scrollTo(0,0);render()">${T.back}</button></div>`;
  window.scrollTo(0,0);
  return {ok:true, blocks:P.blocks.length, unknownMethods:P.blocks.filter(b=>b.method && !byId(b.method)).map(b=>b.method)};
}

/* ---------- Einfügen von Hand (für KI im Chat ohne Browser) ---------- */
function pasteView(){
  M.innerHTML = `<div class="eyebrow">${T.eyebrow}</div><h1>${T.paste}</h1>
    <p class="lead breit">${e(T.pasteLead)}</p>
    <textarea id="kiplan" style="min-height:260px;font-family:monospace;font-size:.85rem" placeholder='{"title": "…", "blocks": [ … ]}'></textarea>
    <p class="hint" id="kifehler" style="display:none"></p>
    <div class="wnav"><button class="secondary" onclick="schritt=0;render()">${T.back}</button>
      <button class="primary" id="kizeigen">${T.show}</button></div>`;
  document.getElementById("kizeigen").onclick = () => {
    try{ showPlan(document.getElementById("kiplan").value); }
    catch(err){ const f = document.getElementById("kifehler"); f.textContent = T.err; f.style.display = "block"; }
  };
  window.scrollTo(0,0);
}
const origRender = window.render;
window.render = function(){
  origRender.apply(this, arguments);
  if(schritt===0 && !document.getElementById("kilink")){
    const p = document.createElement("p"); p.className = "hint"; p.id = "kilink"; p.style.marginTop = "10px";
    const a = document.createElement("a"); a.href = "#"; a.textContent = T.link; a.onclick = ev => { ev.preventDefault(); pasteView(); };
    p.appendChild(a);
    const nav = M.querySelector(".wnav"); if(nav) nav.after(p); else M.appendChild(p);
  }
};
if(schritt===0) window.render();

/* ---------- Die Schnittstelle ---------- */
window.SessionBuilder = {
  version: 1,
  language: LANG,
  docs: "https://impact-up.org/ki/session-builder.md",
  help(){ return "Session Builder API. search({text, phase, people, minutes, online, style, field, type, occasion, block, limit}) finds methods. method(id) returns one full method. methods() returns all. showPlan(plan) shows a plan in the page with PDF download. Plan format and field meanings: " + this.docs; },
  methods(){ return METHODEN; },
  method(id){ return byId(id); },
  search,
  showPlan,
  // Den Fragebogen der Seite mit Antworten füllen und dessen eigenen Vorschlag zeigen.
  questionnaire(answers){ Object.assign(A, answers||{}); schritt = maxSchritt(); render(); return {ok:true}; }
};
})();
