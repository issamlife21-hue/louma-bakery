/* data/content.js — single source of truth for Louma Bakery content.
 *
 * Edit this file when an address changes, the menu changes, a role opens
 * or closes, a testimonial lands. Then any element marked with one of:
 *
 *   data-bind="path.to.string"          → element.textContent
 *   data-bind-html="path.to.html"       → element.innerHTML
 *   data-bind-href="path.to.url"        → element.href
 *   data-bind-src="path.to.url"         → element.src
 *   data-bind-attr="attr:path.to.value" → element.setAttribute
 *   data-list="path.to.array"           → repeat <template> child per item;
 *                                         {{field}} mustaches in template
 *                                         interpolate per-item fields.
 *
 * ... gets hydrated at runtime by js/render.js. Static HTML remains the
 * SEO/no-JS fallback; JS just overwrites with the canonical value here.
 *
 * NOTE: this script must run before js/render.js. app.js handles ordering. */
(function () {
  'use strict';

  const CONFIG = {
    bakery: {
      name: 'Louma Bakery',
      tagline: 'Flour-dusted dreams, baked fresh daily.',
      phone: '(310) 464-2733',
      phoneTel: 'tel:+13104642733',
      email: 'hello@loumabakery.com',
      emailHref: 'mailto:hello@loumabakery.com',
      address: {
        street: '3223 Wilshire Blvd',
        city: 'Santa Monica',
        state: 'CA',
        zip: '90403',
        full: '3223 Wilshire Blvd, Santa Monica, CA 90403',
        mapHref: 'https://www.google.com/maps?q=3223+Wilshire+Blvd,+Santa+Monica,+CA+90403',
        directionsHref: 'https://www.google.com/maps/dir/?api=1&destination=3223+Wilshire+Blvd,+Santa+Monica,+CA+90403'
      },
      hours: {
        short: 'Mon to Sat, 8am to 4pm',
        long: 'Monday to Saturday · 8am to 4pm'
      },
      openingNote: 'Opening July 2026',
      openingDateISO: '2026-07-01T08:00:00-07:00'
    },
    social: {
      instagramHandle: '@loumabakery',
      instagramHref: 'https://instagram.com/loumabakery',
      orderHref: 'https://www.ubereats.com/store/louma-bakery'
    },
    marquee: [
      'Fresh bread by eight',
      '81-layer croissants',
      'Levantine pastries',
      'Espresso pulled by seven',
      'Flour by five',
      'Open Mon–Sat',
      'Opening July 2026 on Wilshire'
    ],
    ingredients: [
      {
        name: 'Flour',
        eyebrow: '01 · Foundation',
        body: 'Stone-milled, high-protein, single-origin where we can. The flour is the bread — everything else just makes it interesting.'
      },
      {
        name: 'Butter',
        eyebrow: '02 · Lamination',
        body: 'European-style, 84% fat, cold from the walk-in. Folded into 81 layers by hand over three days. Crisp at the edge, tender at the centre.'
      },
      {
        name: 'Starter',
        eyebrow: '03 · Time',
        body: 'A wild yeast culture we feed every morning. Cold-fermented 72 hours. The sour is gentle; the crumb is open; the crust shatters.'
      },
      {
        name: 'Za\'atar',
        eyebrow: '04 · Soul',
        body: 'Wild-gathered Lebanese hyssop, sumac, sesame, salt. Spooned warm into pockets of labneh and folded inside the croissant.'
      }
    ],
    testimonials: [
      {
        quote: "The 81-layer croissant alone is worth the drive — and the za'atar labneh one made me text three people from the sidewalk.",
        name: 'Sara H.',
        meta: 'Eater LA · advance review (placeholder until launch coverage lands)'
      },
      {
        quote: 'Walked in for coffee, left with a loaf and a reason to come back tomorrow. The room smells the way a bakery is supposed to smell.',
        name: 'Marcus R.',
        meta: 'Neighbor · soft-open visitor (placeholder)'
      }
    ],
    instagramTiles: [
      { photo: 'photo-1509042239860-f550ce710b93', alt: 'Tray of croissants from the morning bake', rot: '-1.6deg' },
      { photo: 'photo-1555507036-ab1f4038808a',  alt: 'Cross-section of a sourdough loaf',        rot: '1.2deg'  },
      { photo: 'photo-1517701550927-30cf4ba1dba5', alt: 'Latte with rosetta latte art',            rot: '-0.8deg' },
      { photo: 'photo-1558618666-fcd25c85cd64',  alt: 'A boxed pastry assortment for catering',   rot: '1.8deg'  },
      { photo: 'photo-1565299585323-38d6b0865b47', alt: "Za'atar labneh croissant",                rot: '-1.4deg' },
      { photo: 'photo-1568471173242-461f0a730452', alt: 'Country sourdough loaf on a wooden board', rot: '0.8deg' }
    ],
    filmStrip: [
      { photo: 'photo-1509042239860-f550ce710b93',  alt: 'Pastries arranged on the morning counter' },
      { photo: 'photo-1555507036-ab1f4038808a',   alt: 'A baker pulls sourdough from the oven' },
      { photo: 'photo-1530610476181-d83430b64dcd', alt: 'Croissants cooling on a tray' },
      { photo: 'photo-1586444248902-2f64eddc13df', alt: 'Cross-section of a croissant' },
      { photo: 'photo-1517701550927-30cf4ba1dba5', alt: 'A latte poured with rosetta art' },
      { photo: 'photo-1568471173242-461f0a730452', alt: 'A country sourdough loaf' },
      { photo: 'photo-1517248135467-4c7edcad34c4', alt: 'A morning table set with coffee and pastries' },
      { photo: 'photo-1558618666-fcd25c85cd64',  alt: 'A pastry box ready for catering' }
    ],
    storyChapters: [
      { num: '01', label: 'How it started' },
      { num: '02', label: 'The food' },
      { num: '03', label: 'The founder' }
    ]
  };

  // Expose globally so render.js can read it, and so console-tweakers can
  // poke at window.LOUMA_CONFIG in development.
  window.LOUMA_CONFIG = CONFIG;
})();
