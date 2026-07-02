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

  // Links aus der bestehenden Nav übernehmen
  nav.querySelectorAll('.nav__links > li').forEach(li => {
    const top = li.querySelector(':scope > a');
    if (top) {
      const a = document.createElement('a');
      a.href = top.getAttribute('href');
      a.textContent = top.textContent.replace(/[▾\s]+$/, '').trim();
      if (li.classList.contains('nav__lang')) a.className = 'lang';
      drawer.appendChild(a);
    }
    li.querySelectorAll('.nav__dropdown a').forEach(d => {
      const a = document.createElement('a');
      a.href = d.getAttribute('href');
      a.textContent = d.textContent.trim();
      a.className = 'sub';
      drawer.appendChild(a);
    });
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
