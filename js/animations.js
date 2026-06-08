/* js/animations.js — Motion-powered animations.
 *
 * Loaded as an ES module by app.js (script type="module"). Imports
 * animate / scroll / inView / stagger from Motion via the bundler-free
 * jsdelivr ESM mirror (matches the package the project installed with
 * `npm install motion`, but resolved over CDN so we keep our no-build setup).
 *
 * Behavior owned by this file:
 *   - reveal + fade-in via inView (replaces old IntersectionObserver code)
 *   - scroll-linked SVG stroke draw for baguette, footer loaf,
 *     wheat ornament, croissant ornament, steam ornament (reversible)
 *   - scroll progress bar at top of viewport
 *   - product card entrance stagger + spring hover lift
 *   - magnetic pull on primary buttons
 *   - footer link stagger on first entry
 *   - mobile nav: stagger nav links in when panel opens
 *   - page transition crossfade (fade-out on internal link click)
 *   - typewriter on .editorial-line.typewriter
 *   - menu pill scroll-spy via inView
 *   - floating menu photo cursor on menu rows with data-menu-photo
 *   - preloader removal after one-shot 1.6s animation (sessionStorage-gated)
 *   - parallax via custom RAF (Motion's scroll() doesn't fit this pattern)
 *   - footer year stamp
 *
 * All effects honor prefers-reduced-motion. */
import { animate, scroll, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const isTouchDevice = isCoarsePointer || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;

/* ───── PRELOADER: one-shot per session ───── */
(function bindPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const shouldSkip =
    sessionStorage.getItem('loumaSeen') === '1' ||
    document.documentElement.dataset.preloaderSkip === '1' ||
    reduceMotion;
  if (shouldSkip) {
    preloader.classList.add('is-skip');
    preloader.remove();
    return;
  }
  sessionStorage.setItem('loumaSeen', '1');
  // The preloader CSS animation fades out at ~2s. Remove it after.
  setTimeout(() => {
    if (preloader.parentNode) preloader.remove();
  }, 2200);
})();

/* Scroll progress bar removed — felt noisy. */

/* ───── REVEAL + FADE-IN via Motion inView ───── */
inView('.reveal, .fade-in', (entry) => {
  entry.target.classList.add('is-revealed');
}, { amount: 0.15 });

/* ───── SCROLL-LINKED SVG STROKE DRAWS ─────
   Each path's strokeDashoffset is tied to scroll progress of its parent
   SVG, so the line draws as the element scrolls into view and reverses
   on scroll up. */
function bindScrollDraw(svg) {
  const path = svg.querySelector('path');
  if (!path) return;
  let len = 700;
  try { len = Math.ceil(path.getTotalLength()); } catch (_) { /* keep fallback */ }
  path.style.strokeDasharray = len;
  if (reduceMotion) {
    path.style.strokeDashoffset = 0;
    return;
  }
  // Start drawing when element top hits 92% of viewport height,
  // finish when its bottom hits 30%. Matches the prior vanilla feel.
  scroll(
    animate(path, { strokeDashoffset: [len, 0] }, { ease: 'linear' }),
    { target: svg, offset: ['start 0.92', 'end 0.30'] }
  );
}
document.querySelectorAll(
  '#baguette-svg, .footer-loaf, .ornament-wheat, .ornament-croissant, .ornament-steam'
).forEach(bindScrollDraw);

/* ───── PRODUCT CARDS — entrance stagger + spring hover lift ───── */
(function bindProductCards() {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;
  // Entrance stagger (only if not reduced motion).
  if (!reduceMotion) {
    inView(cards[0].parentElement, () => {
      animate(
        cards,
        { y: [32, 0], opacity: [0, 1] },
        { delay: stagger(0.08), type: 'spring', stiffness: 90, damping: 18 }
      );
    }, { amount: 0.1 });
  }
  // Hover lift via Motion spring (no CSS hover transform — see _components.css).
  if (!reduceMotion && !isCoarsePointer && !isTouchDevice) {
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        animate(card, { y: -8 }, { type: 'spring', stiffness: 280, damping: 18 });
      });
      card.addEventListener('mouseleave', () => {
        animate(card, { y: 0 }, { type: 'spring', stiffness: 280, damping: 18 });
      });
    });
  }
})();

/* ───── MAGNETIC PULL on primary CTAs ─────
   Pulls the button toward the cursor with spring physics. Disabled on
   touch and reduced-motion. */
if (!reduceMotion && !isCoarsePointer && !isTouchDevice) {
  document.querySelectorAll('.btn-primary, .btn-donate, .nav-cta, .btn-dark').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      animate(btn, { x: x * 0.18, y: y * 0.18 }, { type: 'spring', stiffness: 220, damping: 14 });
    });
    btn.addEventListener('mouseleave', () => {
      animate(btn, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 14 });
    });
  });
}

/* ───── FOOTER LINK STAGGER on first entry ───── */
if (!reduceMotion) {
  const footer = document.querySelector('footer');
  const footerLinks = document.querySelectorAll('footer .footer-col a');
  if (footer && footerLinks.length) {
    inView(footer, () => {
      animate(
        footerLinks,
        { y: [12, 0], opacity: [0, 1] },
        { delay: stagger(0.03), duration: 0.55 }
      );
    }, { amount: 0.1 });
  }
}

/* ───── MOBILE NAV — stagger nav links in when panel opens ───── */
(function bindMobileNavStagger() {
  if (reduceMotion) return;
  const navLinksWrap = document.getElementById('navLinks');
  if (!navLinksWrap) return;
  const obs = new MutationObserver(() => {
    if (navLinksWrap.classList.contains('open')) {
      const links = navLinksWrap.querySelectorAll('.nav-link');
      animate(
        links,
        { y: [24, 0], opacity: [0, 1] },
        { delay: stagger(0.06), type: 'spring', stiffness: 110, damping: 18 }
      );
    }
  });
  obs.observe(navLinksWrap, { attributes: true, attributeFilter: ['class'] });
})();

/* ───── PAGE TRANSITION CROSSFADE (Motion-driven fade-out) ───── */
(function bindPageTransitions() {
  if (reduceMotion) return;
  const body = document.body;
  if (!body.classList.contains('page-transition')) return;
  document.addEventListener('click', (e) => {
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
    const out = animate(body, { opacity: [1, 0] }, { duration: 0.18, ease: 'ease-in' });
    out.finished.then(() => { location.href = url.href; });
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) body.classList.remove('is-leaving');
  });
})();

/* ───── TYPEWRITER on .editorial-line.typewriter ───── */
inView('.typewriter[data-typewriter]', (entry) => {
  const el = entry.target;
  if (reduceMotion) { el.textContent = el.dataset.typewriter; return; }
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
}, { amount: 0.6 });

/* ───── MENU PILL SCROLL-SPY via Motion inView ───── */
(function bindMenuPills() {
  const pills = document.querySelectorAll('.menu-pill');
  if (!pills.length) return;
  const targets = [...pills]
    .map((p) => document.querySelector(p.getAttribute('href')))
    .filter(Boolean);
  if (!targets.length) return;
  const setActive = (id) => {
    pills.forEach((p) => p.classList.toggle('is-active', p.getAttribute('href') === '#' + id));
  };
  targets.forEach((t) => {
    inView(t, () => { setActive(t.id); }, { margin: '-140px 0px -55% 0px' });
  });
  setActive(targets[0].id);
})();

/* ───── FLOATING MENU PHOTO CURSOR ───── */
(function bindMenuPhotoCursor() {
  const cursor = document.getElementById('menuPhotoCursor');
  if (!cursor) return;
  const rows = document.querySelectorAll('.menu-row[data-menu-photo]');
  if (!rows.length || isCoarsePointer || reduceMotion) { cursor.remove(); return; }
  const img = cursor.querySelector('img');
  function moveTo(e) {
    cursor.style.transform = `translate(${e.clientX + 28}px, ${e.clientY - 120}px)`;
  }
  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      if (img) {
        img.src = row.dataset.menuPhoto;
        img.alt = row.dataset.menuName || '';
      }
      cursor.classList.add('is-visible');
      moveTo(e);
    });
    row.addEventListener('mousemove', moveTo);
    row.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-visible');
    });
  });
})();

/* ───── PARALLAX (vanilla — Motion's scroll doesn't fit the per-element
         viewport-center pattern cleanly) ───── */
(function bindParallax() {
  if (reduceMotion) return;
  if (isMobileViewport) return;             // off on phones — fights momentum scroll
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

/* ───── 3D TILT on cards (perspective set in CSS on parent) ───── */
if (!reduceMotion && !isCoarsePointer && !isTouchDevice && !isMobileViewport) {
  const tiltSelectors = '.tier-card, .value-card, .info-card, .product-card, .tilt-3d';
  document.querySelectorAll(tiltSelectors).forEach((card) => {
    let raf = 0;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        // Spring-ish via Motion — light damping so it stays responsive.
        animate(card, { rotateY: x * 7, rotateX: -y * 7 },
          { type: 'spring', stiffness: 220, damping: 18 });
      });
    });
    card.addEventListener('mouseleave', () => {
      animate(card, { rotateY: 0, rotateX: 0 },
        { type: 'spring', stiffness: 180, damping: 16 });
    });
  });
}

/* ───── IMAGE TILT PARALLAX — gentle on .alt-overlay / hero images ───── */
if (!reduceMotion && !isCoarsePointer && !isTouchDevice && !isMobileViewport) {
  document.querySelectorAll('.alt-overlay-media, .hero-media, .visit-stay-media, .catering-hero')
    .forEach((host) => {
      const img = host.querySelector('img');
      if (!img) return;
      host.addEventListener('mousemove', (e) => {
        const rect = host.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        animate(img, { x: x * 14, y: y * 10 },
          { type: 'spring', stiffness: 80, damping: 20 });
      });
      host.addEventListener('mouseleave', () => {
        animate(img, { x: 0, y: 0 },
          { type: 'spring', stiffness: 80, damping: 20 });
      });
    });
}

/* ───── FLOUR-DUST CURSOR — sparse particle trail ───── */
(function bindFlourDust() {
  if (reduceMotion || isCoarsePointer || isTouchDevice || isMobileViewport) return;
  let lastSpawn = 0;
  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < 36) return;    // throttle ~28 spawns/sec
    lastSpawn = now;
    const dust = document.createElement('div');
    dust.className = 'flour-dust';
    dust.style.left = e.clientX + 'px';
    dust.style.top = e.clientY + 'px';
    dust.style.setProperty('--dx', ((Math.random() - 0.5) * 24).toFixed(1) + 'px');
    dust.style.width = (3 + Math.random() * 5).toFixed(1) + 'px';
    dust.style.height = dust.style.width;
    document.body.appendChild(dust);
    setTimeout(() => dust.remove(), 900);
  });
})();

/* ───── INGREDIENT SLIDER — sync dots with active card on scroll ───── */
(function bindIngredientSlider() {
  const track = document.querySelector('.ingredient-track');
  if (!track) return;
  const cards = track.querySelectorAll('.ingredient-card');
  const dotsHost = document.querySelector('.ingredient-dots');
  if (!cards.length || !dotsHost) return;

  // Build dots
  dotsHost.innerHTML = '';
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'ingredient-dot';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Scroll to ingredient ${i + 1}`);
    if (i === 0) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsHost.appendChild(btn);
  });
  const dots = dotsHost.querySelectorAll('.ingredient-dot');

  // Sync active dot when a card crosses 40% from track's left edge.
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) {
        const idx = [...cards].indexOf(e.target);
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      }
    });
  }, { root: track, threshold: [0.55, 0.9] });
  cards.forEach((c) => io.observe(c));
})();

/* ───── STORY SCROLLYTELLING — chapter rail active state ───── */
(function bindStoryRail() {
  const chapters = document.querySelectorAll('.story-chapter');
  const sections = document.querySelectorAll('main .story-section, main .story-section--founder');
  if (!chapters.length || !sections.length) return;
  chapters.forEach((c, i) => {
    c.addEventListener('click', () => {
      const target = sections[i];
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = [...sections].indexOf(e.target);
        chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach((s) => io.observe(s));
})();

/* ───── FOOTER YEAR ───── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
