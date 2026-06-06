/* js/render.js — hydrate the DOM from window.LOUMA_CONFIG.
 *
 * Runs after data/content.js. Walks the document for any of:
 *   data-bind, data-bind-html, data-bind-href, data-bind-src,
 *   data-bind-attr, data-list
 * and overwrites the matching DOM with the canonical value from CONFIG.
 *
 * Static HTML still renders the right content on first paint (so search
 * engines, screen readers without JS, and zero-JS clients all work);
 * this layer just keeps every page in sync with data/content.js. */
(function () {
  'use strict';
  const CONFIG = window.LOUMA_CONFIG;
  if (!CONFIG) return;

  function readPath(path) {
    if (!path) return undefined;
    return path.split('.').reduce((acc, key) => {
      if (acc == null) return undefined;
      return acc[key];
    }, CONFIG);
  }

  function interpolate(template, item) {
    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const parts = key.split('.');
      let v = item;
      for (const p of parts) {
        if (v == null) return '';
        v = v[p];
      }
      return v == null ? '' : String(v);
    });
  }

  // 1. text bindings
  document.querySelectorAll('[data-bind]').forEach((el) => {
    const v = readPath(el.getAttribute('data-bind'));
    if (typeof v === 'string' || typeof v === 'number') el.textContent = String(v);
  });

  // 2. html bindings
  document.querySelectorAll('[data-bind-html]').forEach((el) => {
    const v = readPath(el.getAttribute('data-bind-html'));
    if (v != null) el.innerHTML = String(v);
  });

  // 3. href bindings
  document.querySelectorAll('[data-bind-href]').forEach((el) => {
    const v = readPath(el.getAttribute('data-bind-href'));
    if (v != null) el.setAttribute('href', String(v));
  });

  // 4. src bindings
  document.querySelectorAll('[data-bind-src]').forEach((el) => {
    const v = readPath(el.getAttribute('data-bind-src'));
    if (v != null) el.setAttribute('src', String(v));
  });

  // 5. arbitrary attribute bindings ("attr:path.to.value")
  document.querySelectorAll('[data-bind-attr]').forEach((el) => {
    const raw = el.getAttribute('data-bind-attr') || '';
    raw.split(',').forEach((pair) => {
      const [attr, path] = pair.split(':').map((s) => s.trim());
      if (!attr || !path) return;
      const v = readPath(path);
      if (v != null) el.setAttribute(attr, String(v));
    });
  });

  // 6. list rendering — repeat the first <template> child per CONFIG array item
  document.querySelectorAll('[data-list]').forEach((host) => {
    const arr = readPath(host.getAttribute('data-list'));
    if (!Array.isArray(arr)) return;
    const tpl = host.querySelector('template');
    if (!tpl) return;
    const html = tpl.innerHTML;
    // Replace the template with rendered items. Keep template in place for
    // future re-renders if needed (idempotent — we clear prior renders).
    host.querySelectorAll('[data-list-item]').forEach((n) => n.remove());
    const frag = document.createDocumentFragment();
    arr.forEach((item, i) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = interpolate(html, { ...item, index: i });
      // Move children out of wrapper to keep markup flat; tag with attribute
      // so re-runs can clean them up.
      Array.from(wrapper.children).forEach((child) => {
        child.setAttribute('data-list-item', '');
        frag.appendChild(child);
      });
    });
    host.appendChild(frag);
  });
})();
