/* js/animations.js — reveal, parallax, scroll-linked SVG draw,
   typewriter, scroll progress bar, page transitions, menu pill spy. */
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll progress bar (2px line at top of viewport). */
  (function bindScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    let ticking = false;
    function update() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      bar.style.width = pct.toFixed(2) + '%';
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* Page transition crossfade — intercepts internal same-origin clicks. */
  (function bindPageTransitions() {
    if (reduceMotion) return;
    const body = document.body;
    if (!body.classList.contains('page-transition')) return;
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let url;
      try { url = new URL(href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      if (!/\.html?$/.test(url.pathname) && url.pathname !== '/') return;
      e.preventDefault();
      body.classList.add('is-leaving');
      setTimeout(function () { location.href = url.href; }, 280);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) body.classList.remove('is-leaving');
    });
  })();

  /* Fire-once / replay draw on view (for legacy ornaments + bake/loaf). */
  function setupDrawOnView(selector, opts) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const { varName, fallback = '700', threshold = 0.4, replay = false } = opts || {};
    els.forEach((svg) => {
      const path = svg.querySelector('path');
      if (!path) return;
      try { svg.style.setProperty(varName, Math.ceil(path.getTotalLength())); }
      catch (_) { svg.style.setProperty(varName, fallback); }
    });
    if ((!replay && reduceMotion) || !('IntersectionObserver' in window)) {
      els.forEach((svg) => svg.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (replay) {
            entry.target.classList.remove('in-view');
            void entry.target.getBoundingClientRect();
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        } else if (replay) {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold });
    els.forEach((svg) => io.observe(svg));
  }

  /* Scroll-linked draw: --draw-progress 0..1 maps to dashoffset, reversible. */
  (function bindScrollDraw() {
    const els = document.querySelectorAll('.scroll-driven');
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach((el) => el.style.setProperty('--draw-progress', '1'));
      return;
    }
    const lens = new WeakMap();
    els.forEach((el) => {
      const path = el.querySelector('path');
      if (!path) return;
      let len = 700;
      try { len = Math.ceil(path.getTotalLength()); } catch (_) {}
      lens.set(el, len);
      el.style.setProperty('--draw-len', len);
      el.style.setProperty('--draw-progress', '0');
    });
    let ticking = false;
    function update() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach((el) => {
        const len = lens.get(el);
        if (!len) return;
        const rect = el.getBoundingClientRect();
        const start = vh * 0.95;
        const end = vh * 0.30;
        const center = rect.top + rect.height / 2;
        const t = (start - center) / (start - end);
        const p = Math.max(0, Math.min(1, t));
        el.style.setProperty('--draw-progress', p.toFixed(3));
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  setupDrawOnView('.footer-loaf:not(.scroll-driven)', { varName: '--loaf-len', replay: true });
  setupDrawOnView('#baguette-svg:not(.scroll-driven)', { varName: '--baguette-len', fallback: '1400', threshold: 0.35, replay: true });
  setupDrawOnView('.ornament-wheat.draw:not(.scroll-driven)', { varName: '--wheat-len', fallback: '600', replay: true });
  setupDrawOnView('.ornament-steam:not(.scroll-driven)', { varName: '--steam-len', fallback: '400', threshold: 0.3 });
  setupDrawOnView('.ornament-croissant:not(.scroll-driven)', { varName: '--croissant-len', fallback: '600', threshold: 0.3 });

  /* Parallax: y-translate based on viewport center distance. */
  (function bindParallax() {
    if (reduceMotion) return;
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    const factors = new WeakMap();
    els.forEach((el) => {
      const f = parseFloat(el.dataset.parallax);
      factors.set(el, isNaN(f) ? 0.12 : f);
    });
    let ticking = false;
    const vh = () => window.innerHeight || document.documentElement.clientHeight;
    function update() {
      const center = vh() / 2;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh() + 200) return;
        const elCenter = rect.top + rect.height / 2;
        const offset = (center - elCenter) * factors.get(el);
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* Reveal + fade-in on view. */
  (function bindReveal() {
    const els = document.querySelectorAll('.reveal, .fade-in');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
        else entry.target.classList.remove('is-revealed');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  })();

  /* Typewriter (editorial main line). */
  (function bindTypewriter() {
    const els = document.querySelectorAll('.typewriter[data-typewriter]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => { el.textContent = el.dataset.typewriter; });
      return;
    }
    function type(el) {
      const text = el.dataset.typewriter || '';
      el.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'tw-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.appendChild(cursor);
      let i = 0;
      const step = () => {
        if (i >= text.length) return;
        cursor.before(text.charAt(i));
        i++;
        setTimeout(step, 32 + Math.random() * 28);
      };
      step();
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          type(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  })();

  /* Menu pill nav scroll-spy (tighter trigger band than global scroll-spy). */
  (function bindMenuPills() {
    const pills = document.querySelectorAll('.menu-pill');
    if (!pills.length || !('IntersectionObserver' in window)) return;
    const targets = [...pills]
      .map((p) => document.querySelector(p.getAttribute('href')))
      .filter(Boolean);
    if (!targets.length) return;
    const setActive = (id) => {
      pills.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('href') === '#' + id);
      });
    };
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
      setActive(visible[0].target.id);
    }, { rootMargin: '-140px 0px -55% 0px', threshold: 0 });
    targets.forEach((t) => io.observe(t));
    setActive(targets[0].id);
  })();

  /* Footer year. */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
