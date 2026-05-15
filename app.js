(function () {
  const nav = document.getElementById('site-nav');
  const navLinksWrap = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const heroEl = document.querySelector('[data-nav-hero]');

  (function markActive() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-link[href]').forEach((a) => {
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

    function openMenu() {
      navLinksWrap.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
      const firstLink = navLinksWrap.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
    function closeMenu(returnFocus) {
      navLinksWrap.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      if (returnFocus) navToggle.focus();
    }
    navToggle.addEventListener('click', function () {
      if (navLinksWrap.classList.contains('open')) closeMenu(true);
      else openMenu();
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

  function bindFormspreeForm(form) {
    const successSel = form.dataset.success;
    const thanks = successSel ? document.querySelector(successSel) : null;
    const replyTo = form.querySelector('input[name="_replyto"]');
    const emailInput = form.querySelector('input[type="email"][name="email"]');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (replyTo && emailInput) replyTo.value = emailInput.value;
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error('Submission failed');
        form.style.display = 'none';
        if (thanks) thanks.classList.add('show');
      } catch (err) {
        if (btn) btn.disabled = false;
        alert('Sorry, something went wrong. Please try again.');
      }
    });
  }
  document.querySelectorAll('form[data-formspree]').forEach(bindFormspreeForm);

  (function bindBaguette() {
    const svg = document.getElementById('baguette-svg');
    if (!svg) return;
    const path = svg.querySelector('path');
    if (!path) return;
    try {
      const len = Math.ceil(path.getTotalLength());
      svg.style.setProperty('--baguette-len', len);
    } catch (_) {
      svg.style.setProperty('--baguette-len', '1400');
    }
    if (!('IntersectionObserver' in window)) {
      svg.classList.add('in-view');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          svg.classList.remove('in-view');
          void svg.getBoundingClientRect();
          svg.classList.add('in-view');
        } else {
          svg.classList.remove('in-view');
        }
      });
    }, { threshold: 0.35 });
    io.observe(svg);
  })();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  (function bindReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  })();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
