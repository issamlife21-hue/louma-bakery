/* js/countdown.js — opening countdown(s) on any [data-countdown-target] section. */
(function () {
  'use strict';
  const sections = document.querySelectorAll('[data-countdown-target]');
  sections.forEach((section) => {
    const target = new Date(section.dataset.countdownTarget).getTime();
    if (Number.isNaN(target)) return;
    const dEl = section.querySelector('[data-countdown-days]');
    const hEl = section.querySelector('[data-countdown-hours]');
    const mEl = section.querySelector('[data-countdown-minutes]');
    const sEl = section.querySelector('[data-countdown-seconds]');
    if (!dEl || !hEl || !mEl || !sEl) return;
    const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
    let timer = null;
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        section.dataset.countdownState = 'done';
        dEl.textContent = '00'; hEl.textContent = '00'; mEl.textContent = '00'; sEl.textContent = '00';
        if (timer) { clearInterval(timer); timer = null; }
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      dEl.textContent = String(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(mins);
      sEl.textContent = pad(secs);
    }
    tick();
    timer = setInterval(tick, 1000);
  });
})();
