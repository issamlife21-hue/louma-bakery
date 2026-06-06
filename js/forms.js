/* js/forms.js — Formspree submission + toast notifications.
   Binds any <form data-formspree>. Surfaces success via the existing
   inline thanks block (kept for non-JS visibility) and a transient toast. */
(function () {
  'use strict';

  function showToast(message) {
    const host = document.getElementById('toastHost');
    if (!host) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9 L7 13 L15 5"/></svg>';
    const msg = document.createElement('span');
    msg.className = 'toast-msg';
    msg.textContent = message;
    toast.appendChild(icon);
    toast.appendChild(msg);
    host.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('is-leaving');
      setTimeout(function () { toast.remove(); }, 320);
    }, 4200);
  }

  function bindFormspreeForm(form) {
    const successSel = form.dataset.success;
    const thanks = successSel ? document.querySelector(successSel) : null;
    const replyTo = form.querySelector('input[name="_replyto"]');
    const emailInput = form.querySelector('input[type="email"][name="email"]');
    const successMsg = (thanks && thanks.textContent.trim()) || 'Thanks — your message is in.';
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
        showToast(successMsg);
      } catch (err) {
        if (btn) btn.disabled = false;
        showToast("Sorry — that didn't go through. Please try again.");
      }
    });
  }

  document.querySelectorAll('form[data-formspree]').forEach(bindFormspreeForm);
})();
