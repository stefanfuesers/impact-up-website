// ============================================
// Nav: Transparenz über dem Hero, Wortmarke, Scrollspy
// (zuerst & unabhängig vom 3D-Netz – falls WebGL fehlt und das
//  Netz wirft, bleibt die Nav-Logik trotzdem aktiv)
// ============================================
(function () {
  'use strict';
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const hero = document.querySelector('.hero');

  // Solange das große Hero-Lockup im Bild ist: Nav transparent.
  // Beim Wegscrollen wird die Nav solide (Hintergrund + Goldlinie + Wortmarke).
  function navState() {
    const trigger = hero ? hero.offsetHeight * 0.6 : 320;
    nav.classList.toggle('nav--transparent', window.scrollY < trigger);
  }
  window.addEventListener('scroll', navState, { passive: true });
  window.addEventListener('resize', navState);
  navState();

  // Scrollspy: das Nav-Item der gerade sichtbaren Sektion leuchtet auf.
  const links = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  const watched = links
    .map(a => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  if (watched.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach(w => obs.observe(w.el));
  }
})();

// ============================================
// Impact Up · 3D-Netz Vier Wirkungsfelder
// three.js v0.149 (UMD, global THREE)
// ============================================

(function () {
'use strict';

if (typeof THREE === 'undefined') {
  console.error('three.js wurde nicht geladen.');
  return;
}

const canvas = document.getElementById('netz-canvas');
if (!canvas) { console.warn('Netz-Canvas nicht gefunden'); return; }

const wrapper = canvas.parentElement;

// ---------- Scene / Camera / Renderer ----------
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 15.8);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  console.warn('WebGL nicht verfügbar – 3D-Netz wird übersprungen.', e);
  return;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(wrapper.clientWidth, wrapper.clientHeight, false);

// ---------- Lichter ----------
scene.add(new THREE.AmbientLight(0xfff5dd, 0.8));
const key = new THREE.DirectionalLight(0xffe9b8, 1.0);
key.position.set(5, 6, 8);
scene.add(key);
const fill = new THREE.DirectionalLight(0xc9a961, 0.35);
fill.position.set(-6, -3, 4);
scene.add(fill);

// ---------- Sprach-Labels (DE / EN / ES / FR) ----------
const NETZ_LABELS = {
  de: {
    erde: 'Ökosystem\nErde',
    erdeSubs: ['Planetare\nGrenzen', 'Klima-\ngerechtigkeit', 'Postwachstum'],
    frieden: 'Frieden &\nGewaltfreiheit',
    friedenSubs: ['Würde', 'GFK', 'Kooperation', 'Konstruktiv', 'Menschlichkeit'],
    sozial: 'Soziale\nTeilhabe',
    sozialSubs: ['Grund-\neinkommen', 'Gemeinwohl', 'NANK', 'Wohnen &\nNahrung', 'Kultur &\nMobilität'],
    demokratie: 'Demokratie',
    demokratieSubs: ['Dialog', 'Partizipation', 'Systemisches\nKonsensieren', 'Digitale\nDemokratie', 'Entscheidungs-\nfindung'],
  },
  en: {
    erde: 'Earth as\nEcosystem',
    erdeSubs: ['Planetary\nBoundaries', 'Climate\nJustice', 'Post-Growth'],
    frieden: 'Peace &\nNon-Violence',
    friedenSubs: ['Dignity', 'NVC', 'Cooperation', 'Constructive', 'Humanity'],
    sozial: 'Social\nParticipation',
    sozialSubs: ['Basic\nIncome', 'Common\nGood', 'New Work\nNew Culture', 'Housing &\nFood', 'Culture &\nMobility'],
    demokratie: 'Democracy',
    demokratieSubs: ['Dialogue', 'Participation', 'Systemic\nConsensing', 'Digital\nDemocracy', 'Decision-\nMaking'],
  },
  es: {
    erde: 'Ecosistema\nTierra',
    erdeSubs: ['Límites\nplanetarios', 'Justicia\nclimática', 'Postcrecimiento'],
    frieden: 'Paz y\nNo Violencia',
    friedenSubs: ['Dignidad', 'CNV', 'Cooperación', 'Constructivo', 'Humanidad'],
    sozial: 'Participación\nSocial',
    sozialSubs: ['Renta\nbásica', 'Bien común', 'NANK', 'Vivienda y\nalimentación', 'Cultura y\nmovilidad'],
    demokratie: 'Democracia',
    demokratieSubs: ['Diálogo', 'Participación', 'Consenso\nsistémico', 'Democracia\ndigital', 'Toma de\ndecisiones'],
  },
  fr: {
    erde: 'Écosystème\nTerre',
    erdeSubs: ['Limites\nplanétaires', 'Justice\nclimatique', 'Post-croissance'],
    frieden: 'Paix &\nNon-violence',
    friedenSubs: ['Dignité', 'CNV', 'Coopération', 'Constructif', 'Humanité'],
    sozial: 'Participation\nsociale',
    sozialSubs: ['Revenu\nde base', 'Bien commun', 'NANK', 'Logement &\nalimentation', 'Culture &\nmobilité'],
    demokratie: 'Démocratie',
    demokratieSubs: ['Dialogue', 'Participation', 'Consensus\nsystémique', 'Démocratie\nnumérique', 'Prise de\ndécision'],
  },
};
const L = NETZ_LABELS[document.documentElement.lang] || NETZ_LABELS.de;

// ---------- Knoten-Definitionen ----------
const MAINS = [
  {
    id: 'erde',
    label: L.erde,
    color: 0x2D4A2B, // Moos-Tief – Grün (war Impact, jetzt Erde)
    pos: [-6.6, 2.2, -2.4],
    radius: 0.78,
    subs: L.erdeSubs,
  },
  {
    id: 'frieden',
    label: L.frieden,
    color: 0x1F1A14, // Tinte – wird halb-transparent (durchscheinend)
    pos: [6.6, 2.0, 2.2],
    radius: 0.78,
    subs: L.friedenSubs,
    transparent: true,
  },
  {
    id: 'sozial',
    label: L.sozial,
    color: 0x4A2B5C, // Reflexionslila – wird halb-transparent
    pos: [-3.2, -3.1, 1.6],
    radius: 0.78,
    subs: L.sozialSubs,
    transparent: true,
  },
  {
    id: 'demokratie',
    label: L.demokratie,
    color: 0x2B4A5C, // Demokratie-Blau – tiefes Blau in der Tonlage von Moos und Lila
    pos: [3.4, -2.9, -1.8],
    radius: 0.78,
    subs: L.demokratieSubs,
    transparent: true,
  },
];

// Goldene Impact-Up-Knoten, klein und verteilt
// 2 mittig (innerer Cluster, leicht durch z-Tiefe getrennt)
// 4 weiter außen, je eine außerhalb der Teilsysteme
const IMPACTS = [
  { color: 0xC9A961, pos: [-0.8,  0.4,  1.4], radius: 0.24 },  // mittig vorne
  { color: 0xC9A961, pos: [ 0.9, -0.3, -1.6], radius: 0.24 },  // mittig hinten
  { color: 0xC9A961, pos: [-8.0,  2.6, -2.0], radius: 0.24 },  // außen bei Erde
  { color: 0xC9A961, pos: [ 8.0,  2.4,  2.6], radius: 0.24 },  // außen bei Frieden
  { color: 0xC9A961, pos: [-3.8, -4.7,  1.4], radius: 0.24 },  // außen bei Sozial
  { color: 0xC9A961, pos: [ 4.0, -4.5, -2.2], radius: 0.24 },  // außen bei Demokratie
];

// Sub-Knoten generieren – als kreisende Satelliten um den Hauptknoten
// (Orbital-Parameter; die Position wird pro Frame in tick() aus der
//  aktuellen Position des Hauptknotens berechnet)
const SUBS = [];
MAINS.forEach((parent, pi) => {
  const n = parent.subs.length;
  parent.subs.forEach((text, i) => {
    const angle0 = (i / n) * Math.PI * 2 + pi * 0.4;
    const dist = 1.9 + (i % 3) * 0.3;
    const speed = 0.30 - (dist - 1.9) * 0.18; // innere Bahnen schneller, wie Planeten
    SUBS.push({
      label: text,
      color: parent.color,
      // Initialposition bei t=0 – dieselbe Formel wie in tick(),
      // damit die Verbindungslinien von Anfang an stimmen
      pos: [
        parent.pos[0] + Math.cos(angle0) * dist,
        parent.pos[1] + Math.sin(angle0) * dist * 0.75,
        parent.pos[2] + Math.sin(angle0 * 1.3 + pi) * 0.9,
      ],
      radius: 0.30,
      parentIdx: pi,
      angle0: angle0,
      dist: dist,
      speed: speed,
    });
  });
});

// ---------- Group ----------
const group = new THREE.Group();
scene.add(group);

// ---------- Helper: Label-Texture (transparenter Hintergrund) ----------
function makeLabelTexture(text, opts) {
  const { fontSize = 64, fontWeight = 600, fontFamily = "'Cormorant Garamond', Georgia, serif",
          color = '#ffffff', shadow = 'rgba(0,0,0,0.55)', shadowBlur = 12 } = opts || {};
  const cnv = document.createElement('canvas');
  const lines = String(text).split('\n');
  const lh = fontSize * 1.05;
  const w = 512;
  const h = 256;
  cnv.width = w; cnv.height = h;
  const ctx = cnv.getContext('2d');
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = shadow;
  ctx.shadowBlur = shadowBlur;
  const startY = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, k) => ctx.fillText(ln, w / 2, startY + k * lh));
  const tex = new THREE.CanvasTexture(cnv);
  tex.anisotropy = 4;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function makeSprite(text, opts, scale) {
  const tex = makeLabelTexture(text, opts);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
  const s = new THREE.Sprite(mat);
  s.renderOrder = 999;
  s.scale.set(scale.x, scale.y, 1);
  return s;
}

// ---------- Sphäre ----------
function makeSphere(node, isHero) {
  const geo = new THREE.SphereGeometry(node.radius, 48, 48);
  const mat = new THREE.MeshStandardMaterial({
    color: node.color,
    roughness: 0.4,
    metalness: isHero ? 0.7 : 0.2,
    emissive: new THREE.Color(node.color),
    emissiveIntensity: isHero ? 0.55 : 0.22,
    transparent: !!node.transparent,
    opacity: node.transparent ? 0.6 : 1.0,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...node.pos);
  return m;
}

// ---------- Hauptknoten ----------
const mainMeshes = [];
MAINS.forEach(n => {
  const m = makeSphere(n, false);
  group.add(m);
  // Alle Hauptknoten sind jetzt dunkel → Pergament-Schrift
  const isLight = false;
  const lbl = makeSprite(n.label,
    { fontSize: 60,
      color: isLight ? '#1F1A14' : '#F4ECD8',
      shadow: isLight ? 'rgba(244,236,216,0.85)' : 'rgba(31,26,20,0.75)',
      shadowBlur: 14 },
    { x: 1.6, y: 0.8 });
  lbl.position.copy(m.position);
  group.add(lbl);
  m.userData.label = lbl;
  m.userData.def = n;
  mainMeshes.push(m);
});

// ---------- 5 kleine Impact-Up-Knoten mit Wortmarke ----------
const impactMeshes = [];
IMPACTS.forEach((node, i) => {
  const m = makeSphere(node, true);
  group.add(m);
  // Halo
  const haloGeo = new THREE.SphereGeometry(node.radius * 1.8, 24, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xC9A961, transparent: true, opacity: 0.22, side: THREE.BackSide,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  m.add(halo);

  // Wortmarke „Impact Up" weiß, klein, direkt auf der Kugel
  const lbl = makeSprite('Impact\nUp',
    { fontSize: 64, fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif",
      color: '#FFFFFF', shadow: 'rgba(31,26,20,0.9)', shadowBlur: 14 },
    { x: 0.85, y: 0.42 });
  lbl.position.copy(m.position);
  group.add(lbl);
  m.userData.label = lbl;
  m.userData.def = node;
  m.userData.phase = i * 0.7;
  impactMeshes.push(m);
});

// ---------- Sub-Knoten ----------
const subMeshes = [];
SUBS.forEach(s => {
  const m = makeSphere(s, false);
  m.material.metalness = 0.1;
  m.material.emissiveIntensity = 0.35;
  group.add(m);
  const lbl = makeSprite(s.label,
    { fontSize: 50, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif",
      color: '#1F1A14', shadow: 'rgba(244,236,216,0.95)', shadowBlur: 14 },
    { x: 1.5, y: 0.75 });
  lbl.position.copy(m.position);
  lbl.position.y += s.radius + 0.15;
  group.add(lbl);
  m.userData.label = lbl;
  m.userData.def = s;
  m.userData.labelOffset = s.radius + 0.15;
  subMeshes.push(m);
});

// ---------- Verbindungslinien ----------
const lines = [];

function addLine(meshA, meshB, opts) {
  const { color = 0xC9A961, opacity = 0.55, dashSize = 0.18, gapSize = 0.12, linewidth = 1 } = opts || {};
  const mat = new THREE.LineDashedMaterial({
    color, transparent: true, opacity, dashSize, gapSize, linewidth, depthWrite: false,
  });
  const geo = new THREE.BufferGeometry().setFromPoints([
    meshA.position.clone(), meshB.position.clone(),
  ]);
  const ln = new THREE.Line(geo, mat);
  ln.computeLineDistances();
  ln.userData = { a: meshA, b: meshB, baseOpacity: opacity };
  group.add(ln);
  lines.push(ln);
}

// Impact-Knoten ↔ Hauptknoten: jeder Impact verbunden mit allen vier Wirkungsfeldern
impactMeshes.forEach(im => {
  mainMeshes.forEach(mm => {
    addLine(im, mm, { color: 0x4A2B5C, opacity: 0.7, dashSize: 0.22, gapSize: 0.1 });
  });
});

// Impact-Cluster: alle Impacts untereinander vernetzt – eckiges Innennetz
for (let i = 0; i < impactMeshes.length; i++) {
  for (let j = i + 1; j < impactMeshes.length; j++) {
    addLine(impactMeshes[i], impactMeshes[j], {
      color: 0xC9A961, opacity: 0.5, dashSize: 0.12, gapSize: 0.1,
    });
  }
}

// Hauptknoten ↔ ihre Sub-Knoten (in Quellfarbe)
subMeshes.forEach(s => {
  const parent = mainMeshes[s.userData.def.parentIdx];
  addLine(parent, s, { color: s.userData.def.color, opacity: 0.55, dashSize: 0.14, gapSize: 0.1 });
});

// Einige Sub-Knoten ↔ einer Impact-Kugel (sparsam, Vernetzung in den Cluster)
[0, 4, 9, 14].forEach((subIdx, k) => {
  const im = impactMeshes[k % impactMeshes.length];
  if (subMeshes[subIdx]) addLine(im, subMeshes[subIdx], {
    color: 0x4A2B5C, opacity: 0.25, dashSize: 0.08, gapSize: 0.14,
  });
});

// Hauptknoten untereinander (alle Paare – das gespannte Dach)
for (let i = 0; i < mainMeshes.length; i++) {
  for (let j = i + 1; j < mainMeshes.length; j++) {
    addLine(mainMeshes[i], mainMeshes[j], { color: 0x4A2B5C, opacity: 0.55, dashSize: 0.18, gapSize: 0.12 });
  }
}

// Sub ↔ Sub Cross-System: jeder Sub mit 3 Subs aus anderen Quellen verbunden
// (zeigt: Konzepte sind nicht system-exklusiv)
subMeshes.forEach((s, i) => {
  const others = subMeshes
    .map((o, j) => ({ o, j }))
    .filter(({ o, j }) => j !== i && o.userData.def.parentIdx !== s.userData.def.parentIdx)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  others.forEach(({ o, j }) => {
    if (j > i) { // jede Verbindung nur einmal zeichnen
      addLine(s, o, { color: 0x4A2B5C, opacity: 0.32, dashSize: 0.08, gapSize: 0.12 });
    }
  });
});

// ---------- Drag Controls ----------
let isDragging = false;
let lastX = 0, lastY = 0;
let rotX = 0.18, rotY = 0;
let autoRotate = true;
let autoRotateTimeout = null;

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  autoRotate = false;
  if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
  lastX = e.clientX; lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  rotY += (e.clientX - lastX) * 0.005;
  rotX += (e.clientY - lastY) * 0.004;
  rotX = Math.max(-0.9, Math.min(0.9, rotX));
  lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener('pointerup', (e) => {
  isDragging = false;
  canvas.releasePointerCapture(e.pointerId);
  autoRotateTimeout = setTimeout(() => { autoRotate = true; }, 3000);
});
canvas.addEventListener('pointerleave', () => { isDragging = false; });

// ---------- Resize ----------
function onResize() {
  const w = wrapper.clientWidth, h = wrapper.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener('resize', onResize);

// ---------- Animation ----------
// Nur Haupt- und Impact-Knoten schweben frei – die Sub-Knoten kreisen
// als Satelliten um ihren Hauptknoten (eigene Schleife in tick())
const allDynamic = [...mainMeshes, ...impactMeshes];
const baseY = allDynamic.map(m => m.position.y);
const baseX = allDynamic.map(m => m.position.x);
const baseZ = allDynamic.map(m => m.position.z);
const clock = new THREE.Clock();

// Sub-Knoten cyclen zwischen den vier Quellfarben (Erde / Frieden / Sozial / Demokratie)
const SUB_COLORS = [
  new THREE.Color(0x2D4A2B), // Moos-Tief – Erde
  new THREE.Color(0x1F1A14), // Tinte – Frieden
  new THREE.Color(0x4A2B5C), // Reflexionslila – Sozial
  new THREE.Color(0x2B4A5C), // Demokratie-Blau
];
function blendSubColor(t, phase, out) {
  const period = 5; // Sekunden pro Übergang
  const total = period * SUB_COLORS.length;
  const cycle = ((t + phase) % total + total) % total;
  const seg = Math.floor(cycle / period);
  const x = (cycle - seg * period) / period;
  out.lerpColors(SUB_COLORS[seg], SUB_COLORS[(seg + 1) % SUB_COLORS.length], x);
  return out;
}

function tick() {
  const t = clock.getElapsedTime();

  // Haupt- und Impact-Knoten schweben
  allDynamic.forEach((m, i) => {
    const phase = i * 1.3;
    const amp = 0.18;
    m.position.x = baseX[i] + Math.cos(t * 0.4 + phase) * amp;
    m.position.y = baseY[i] + Math.sin(t * 0.6 + phase) * amp;
    m.position.z = baseZ[i] + Math.sin(t * 0.5 + phase * 0.7) * amp;
    if (m.userData.label) {
      m.userData.label.position.x = m.position.x;
      m.userData.label.position.y = m.position.y + (m.userData.labelOffset || 0);
      m.userData.label.position.z = m.position.z;
    }
  });

  // Sub-Knoten kreisen als Satelliten um die aktuelle (schwebende)
  // Position ihres Hauptknotens – sie ziehen mit und kreisen zugleich
  subMeshes.forEach(m => {
    const d = m.userData.def;
    const parent = mainMeshes[d.parentIdx];
    const theta = d.angle0 + t * d.speed;
    m.position.x = parent.position.x + Math.cos(theta) * d.dist;
    m.position.y = parent.position.y + Math.sin(theta) * d.dist * 0.75;
    m.position.z = parent.position.z + Math.sin(theta * 1.3 + d.parentIdx) * 0.9;
    if (m.userData.label) {
      m.userData.label.position.x = m.position.x;
      m.userData.label.position.y = m.position.y + (m.userData.labelOffset || 0);
      m.userData.label.position.z = m.position.z;
    }
  });

  // Linien folgen den Knoten
  lines.forEach(ln => {
    const positions = ln.geometry.attributes.position;
    positions.setXYZ(0, ln.userData.a.position.x, ln.userData.a.position.y, ln.userData.a.position.z);
    positions.setXYZ(1, ln.userData.b.position.x, ln.userData.b.position.y, ln.userData.b.position.z);
    positions.needsUpdate = true;
    ln.computeLineDistances();
    ln.material.opacity = ln.userData.baseOpacity * (0.85 + 0.25 * Math.sin(t * 0.9 + ln.userData.a.id));
  });

  // Sub-Knoten: langsamer Farbwechsel zwischen den vier Quellfarben
  subMeshes.forEach((m, i) => {
    blendSubColor(t, i * 1.4, m.material.color);
    m.material.emissive.copy(m.material.color);
  });

  // Hero-Pulsation: jede Impact-Kugel mit eigener Phase
  impactMeshes.forEach((im, i) => {
    im.scale.setScalar(1 + Math.sin(t * 1.4 + i * 0.9) * 0.07);
  });

  // Auto-rotate
  if (autoRotate) rotY += 0.0022;
  group.rotation.y = rotY;
  group.rotation.x = rotX;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

})();
