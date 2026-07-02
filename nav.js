// ============================================
// Mobile-Nav: Hamburger + Drawer
// Eigenständig, auf ALLEN Seiten eingebunden (nicht von main.js abhängig).
// Liest die bestehende .nav sprachneutral aus und baut daraus ein Overlay-Menü.
// ============================================
(function () {
  'use strict';
  const nav = document.querySelector('.nav');
  if (!nav || nav.querySelector('.nav__toggle')) return;

  // Hamburger in der Bar
  const toggle = document.createElement('button');
  toggle.className = 'nav__toggle';
  toggle.setAttribute('aria-label', 'Menü');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(toggle);

  // Drawer als Overlay
  const drawer = document.createElement('div');
  drawer.className = 'nav__drawer';
  const close = document.createElement('button');
  close.className = 'nav__drawer-close';
  close.setAttribute('aria-label', 'Menü schließen');
  close.innerHTML = '&times;';
  drawer.appendChild(close);

  // Links aus der bestehenden Nav übernehmen.
  // Punkte mit Dropdown werden als zugeklappte Gruppe gebaut:
  // Text navigiert, Pfeil klappt die Unterpunkte aus.
  nav.querySelectorAll('.nav__links > li').forEach(li => {
    const top = li.querySelector(':scope > a');
    if (!top) return;
    const subs = li.querySelectorAll('.nav__dropdown a');

    if (subs.length) {
      const group = document.createElement('div');
      group.className = 'drawer-group';

      const row = document.createElement('div');
      row.className = 'drawer-row';

      const a = document.createElement('a');
      a.href = top.getAttribute('href');
      a.textContent = top.textContent.replace(/[▾\s]+$/, '').trim();
      row.appendChild(a);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drawer-toggle';
      btn.setAttribute('aria-label', 'Unterpunkte anzeigen');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span>▾</span>';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const offen = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', offen ? 'true' : 'false');
      });
      row.appendChild(btn);
      group.appendChild(row);

      const wrap = document.createElement('div');
      wrap.className = 'drawer-subs';
      subs.forEach(d => {
        const s = document.createElement('a');
        s.href = d.getAttribute('href');
        s.textContent = d.textContent.trim();
        s.className = 'sub';
        wrap.appendChild(s);
      });
      group.appendChild(wrap);
      drawer.appendChild(group);
    } else {
      const a = document.createElement('a');
      a.href = top.getAttribute('href');
      a.textContent = top.textContent.replace(/[▾\s]+$/, '').trim();
      if (li.classList.contains('nav__lang')) a.className = 'lang';
      drawer.appendChild(a);
    }
  });

  document.body.appendChild(drawer);

  function open() {
    drawer.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function shut() {
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => drawer.classList.contains('open') ? shut() : open());
  close.addEventListener('click', shut);
  drawer.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    // Anker auf derselben Seite: erst Menü schließen (Scroll-Sperre lösen),
    // dann explizit scrollen – der Standard-Sprung scheitert sonst in iOS Safari
    // an der noch aktiven overflow:hidden-Sperre.
    if (href.startsWith('#')) {
      const ziel = document.getElementById(href.slice(1));
      if (ziel) {
        e.preventDefault();
        shut();
        requestAnimationFrame(() => {
          ziel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', href);
        });
        return;
      }
    }
    shut();
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();
