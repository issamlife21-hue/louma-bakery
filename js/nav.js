/* js/nav.js — nav active state, scroll mode, mobile menu, scroll-spy.
   Loaded by app.js. Exposes nothing globally. */
(function () {
  'use strict';
  const nav = document.getElementById('site-nav');
  const navLinksWrap = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const heroEl = document.querySelector('[data-nav-hero]');

  (function bindNavActive() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-link[href], .footer-col a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  })();

  function updateNavMode() {
    if (!nav) return;
    if (heroEl) {
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      if (heroBottom > 80) {
        nav.classList.add('on-dark');
        nav.classList.remove('no-hero', 'is-scrolled');
      } else {
        nav.classList.remove('on-dark', 'no-hero');
        nav.classList.add('is-scrolled');
      }
    } else {
      nav.classList.remove('on-dark');
      nav.classList.add('no-hero');
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
  }
  updateNavMode();
  window.addEventListener('scroll', updateNavMode, { passive: true });
  window.addEventListener('resize', updateNavMode, { passive: true });

  if (navToggle && navLinksWrap) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'navLinks');

    // Backdrop element so taps outside the panel close it.
    const navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    navBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(navBackdrop);

    function openMenu() {
      navLinksWrap.classList.add('open');
      navBackdrop.classList.add('open');
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
      const firstLink = navLinksWrap.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
    function closeMenu(returnFocus) {
      navLinksWrap.classList.remove('open');
      navBackdrop.classList.remove('open');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      if (returnFocus) navToggle.focus();
    }
    navToggle.addEventListener('click', function () {
      if (navLinksWrap.classList.contains('open')) closeMenu(true);
      else openMenu();
    });
    navBackdrop.addEventListener('click', function () { closeMenu(true); });
    // Close after tapping a link (mobile expectation).
    navLinksWrap.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (navLinksWrap.classList.contains('open')) closeMenu(true);
    });
    navLinksWrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !navLinksWrap.classList.contains('open')) return;
      const focusables = navLinksWrap.querySelectorAll('.nav-link');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* Scroll-spy: highlight in-page section links. */
  (function bindScrollSpy() {
    const sections = document.querySelectorAll('main section[id], main [id^="cat-"]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const linkByHash = new Map();
    document.querySelectorAll('.nav-link, .menu-pill').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) linkByHash.set(href.slice(1), a);
    });
    if (!linkByHash.size) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const link = linkByHash.get(e.target.id);
        if (!link) return;
        if (e.isIntersecting) link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => io.observe(s));
  })();
})();
