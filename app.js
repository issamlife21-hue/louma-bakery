/* Louma Bakery — front-end entry point.
   This file is a thin loader. All behavior lives in js/*.js partials,
   loaded in dependency order:

     js/nav.js          nav active state, scroll mode, mobile menu, scroll-spy
                        (classic script)
     js/animations.js   Motion-powered reveal/scroll/animate/stagger;
                        loaded as ES module so it can `import` from
                        https://cdn.jsdelivr.net/npm/motion@latest/+esm
     js/countdown.js    opening countdown ticker (classic script)
     js/forms.js        Formspree submit + toast notifications (classic script)
     js/video.js        hero video swap on data-hero-video (classic script)

   Each partial installs behavior directly on the DOM and shares no
   module exports — they're safe to load independently. The animations
   module is loaded with type=module; the rest are classic scripts forced
   into ordered execution via async=false. */
(function () {
  'use strict';
  const PARTIALS = [
    { src: 'js/nav.js' },
    { src: 'js/animations.js', module: true },
    { src: 'js/countdown.js' },
    { src: 'js/forms.js' },
    { src: 'js/video.js' }
  ];
  // Resolve relative to the current document so the bakery works under
  // both root deployment and a sub-path on GitHub Pages.
  const base = (function () {
    const path = location.pathname.replace(/[^\/]*$/, '');
    return path.endsWith('/') ? path : path + '/';
  })();
  PARTIALS.forEach(function (p) {
    const s = document.createElement('script');
    s.src = base + p.src;
    if (p.module) {
      // Module scripts defer by default and have their own ordering;
      // they can `import` from the Motion ESM bundle on jsdelivr.
      s.type = 'module';
    } else {
      // Classic scripts: force ordered, sequential execution.
      s.async = false;
      s.defer = true;
    }
    document.head.appendChild(s);
  });
})();
