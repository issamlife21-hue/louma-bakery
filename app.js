(function () {
  const nav = document.getElementById('site-nav');
  const navLinksWrap = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const isHome = document.body.classList.contains('is-home');

  // Active nav link from pathname
  (function markActive() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-link[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path) a.classList.add('active');
    });
  })();

  function updateNavMode() {
    if (!nav) return;
    if (isHome && window.scrollY < window.innerHeight - 80) {
      nav.classList.add('on-dark');
      nav.classList.remove('no-hero', 'is-scrolled');
    } else if (isHome) {
      nav.classList.remove('on-dark', 'no-hero');
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('on-dark');
      nav.classList.add('no-hero');
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
  }
  updateNavMode();
  window.addEventListener('scroll', updateNavMode, { passive: true });

  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', function () {
      const open = navLinksWrap.classList.toggle('open');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  (function bindNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    const thanks = document.getElementById('newsletterThanks');
    const replyTo = document.getElementById('newsletterReplyTo');
    const emailInput = document.getElementById('newsletterEmail');
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
  })();

  function bindSimpleForm(formId, successId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const success = document.getElementById(successId);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (success) success.classList.add('show');
      form.reset();
    });
  }
  bindSimpleForm('cateringForm', 'cateringSuccess');
  bindSimpleForm('careersForm', 'careersSuccess');

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

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
