/* Louma Bakery — front-end entry point.
   This file is a thin loader. All behavior lives in js/*.js partials,
   loaded in dependency order:

     js/nav.js          nav active state, scroll mode, mobile menu, scroll-spy
     js/animations.js   reveal, parallax, scroll-linked SVG draw, typewriter,
                        scroll progress bar, page transitions
     js/countdown.js    opening countdown ticker
     js/forms.js        Formspree submit + toast notifications
     js/video.js        hero video swap on data-hero-video

   Each partial is loaded as a deferred script, preserving the order of
   appearance. They share no module exports — they each install behavior
   directly on the DOM and are safe to load independently. */
(function () {
  'use strict';
  const PARTIALS = [
    'js/nav.js',
    'js/animations.js',
    'js/countdown.js',
    'js/forms.js',
    'js/video.js'
  ];
  // Resolve relative to the current document so the bakery works under
  // both root deployment and a sub-path on GitHub Pages.
  const base = (function () {
    const path = location.pathname.replace(/[^\/]*$/, '');
    return path.endsWith('/') ? path : path + '/';
  })();
  PARTIALS.forEach(function (src) {
    const s = document.createElement('script');
    s.src = base + src;
    // Dynamically-created scripts are async by default. Force ordered,
    // sequential execution so partials run nav -> animations -> ... in order.
    s.async = false;
    s.defer = true;
    document.head.appendChild(s);
  });
})();
