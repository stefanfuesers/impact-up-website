// ============================================
// Mobile-Nav: Hamburger + Drawer
// Eigenständig, auf ALLEN Seiten eingebunden (nicht von main.js abhängig).
// Liest die bestehende .nav sprachneutral aus und baut daraus ein Overlay-Menü.
// Welle 1 (05.08.2026): Fokusführung im Drawer (Dialog + Focus-Trap),
// aria-expanded an den Desktop-Dropdowns, Kontakt als Gold-Pill am Drawer-Fuß.
// ============================================
(function () {
  'use strict';

  function init() {
    const nav = document.querySelector('.nav');
    if (!nav || nav.querySelector('.nav__toggle')) return;

    // ---------- Hamburger in der Bar ----------
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav__toggle';
    toggle.setAttribute('aria-label', 'Menü');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    // ---------- Drawer als Overlay-Dialog ----------
    const drawer = document.createElement('div');
    drawer.className = 'nav__drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Menü');
    toggle.setAttribute('aria-controls', 'nav-drawer');
    drawer.id = 'nav-drawer';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'nav__drawer-close';
    close.setAttribute('aria-label', 'Menü schließen');
    close.innerHTML = '&times;';
    drawer.appendChild(close);

    // Links aus der bestehenden Nav übernehmen.
    // Punkte mit Dropdown werden als zugeklappte Gruppe gebaut:
    // Text navigiert, Pfeil klappt die Unterpunkte aus.
    // Der Kontakt-Punkt wird herausgenommen und kommt als Gold-Pill an den Fuß.
    let ctaQuelle = null;

    nav.querySelectorAll('.nav__links > li').forEach(li => {
      const top = li.querySelector(':scope > a');
      if (!top) return;

      if (top.classList.contains('nav__cta')) {
        ctaQuelle = top;
        return;
      }

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

    // Kontakt als eigenständige Gold-Pill am Fuß des Drawers – dieselbe
    // Bauform wie der .nav__cta-Pill auf dem Desktop.
    if (ctaQuelle) {
      const cta = document.createElement('a');
      cta.href = ctaQuelle.getAttribute('href');
      cta.textContent = ctaQuelle.textContent.trim();
      cta.className = 'drawer-cta';
      drawer.appendChild(cta);
    }

    document.body.appendChild(drawer);

    // ---------- Öffnen / Schließen mit Fokusführung ----------
    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function fokussierbare() {
      // frisch bei jedem Tab: zugeklappte .drawer-subs sind display:none
      // und damit nicht fokussierbar.
      return Array.prototype.filter.call(
        drawer.querySelectorAll(FOCUSABLE),
        el => el.getClientRects().length > 0 || el === document.activeElement
      );
    }

    function open() {
      drawer.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Der Drawer blendet über visibility ein (.3s). Solange er noch
      // visibility:hidden trägt, nimmt der Schließen-Knopf keinen Fokus an –
      // deshalb so lange erneut versuchen, bis er sitzt.
      fokusAufSchliessen(24);
    }

    function fokusAufSchliessen(versuche) {
      if (!drawer.classList.contains('open')) return;
      close.focus({ preventScroll: true });
      if (document.activeElement !== close && versuche > 0) {
        requestAnimationFrame(() => fokusAufSchliessen(versuche - 1));
      }
    }

    function shut(fokusZurueck) {
      if (!drawer.classList.contains('open')) return;
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (fokusZurueck !== false) toggle.focus();
    }

    toggle.addEventListener('click', () => drawer.classList.contains('open') ? shut() : open());
    close.addEventListener('click', () => shut());

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
          shut(false);
          requestAnimationFrame(() => {
            ziel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', href);
          });
          return;
        }
      }
      // Navigation auf eine andere Seite: Fokus nicht zurückholen,
      // sonst springt er kurz vor dem Seitenwechsel.
      shut(false);
    });

    // Escape schließt; Tab bleibt im Drawer, solange er offen ist.
    drawer.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const liste = fokussierbare();
      if (!liste.length) return;
      const erster = liste[0];
      const letzter = liste[liste.length - 1];
      if (e.shiftKey && (document.activeElement === erster || !drawer.contains(document.activeElement))) {
        e.preventDefault();
        letzter.focus();
      } else if (!e.shiftKey && document.activeElement === letzter) {
        e.preventDefault();
        erster.focus();
      }
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') shut();
    });

    // Fokus, der von außen (z. B. per Klick in die Seite) in den Hintergrund
    // wandert, wird in den Drawer zurückgeholt.
    document.addEventListener('focusin', e => {
      if (!drawer.classList.contains('open')) return;
      if (drawer.contains(e.target) || e.target === toggle) return;
      close.focus();
    });

    // ---------- Desktop-Dropdowns: aria-haspopup + aria-expanded ----------
    // Die Dropdowns öffnen per CSS (:hover / :focus-within). JS spiegelt
    // diesen Zustand nur für Screenreader.
    nav.querySelectorAll('.nav__item--has-dropdown').forEach(li => {
      const trigger = li.querySelector(':scope > a');
      const menu = li.querySelector(':scope > .nav__dropdown');
      if (!trigger || !menu) return;

      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      const setzen = offen => trigger.setAttribute('aria-expanded', offen ? 'true' : 'false');

      li.addEventListener('mouseenter', () => setzen(true));
      li.addEventListener('mouseleave', () => {
        if (!li.contains(document.activeElement)) setzen(false);
      });
      li.addEventListener('focusin', () => setzen(true));
      li.addEventListener('focusout', () => {
        // focusout feuert auch beim Wandern zwischen Kindern –
        // erst im nächsten Tick steht der neue Fokus fest.
        window.setTimeout(() => {
          if (!li.contains(document.activeElement) && !li.matches(':hover')) setzen(false);
        }, 0);
      });
    });
  }

  // Robust gegen defer/async: läuft erst, wenn das Markup steht.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
