# Louma Bakery — Photo Manifest

This folder will hold every official Louma Bakery photo. The site currently uses Unsplash placeholders; once real photos are dropped here matching the filenames below, swap each Unsplash URL in the HTML for the local path (`images/<filename>`). No HTML structure changes needed.

## How to use this manifest

For each slot:
- **Filename** — drop the photo here, exact name (lowercase, hyphens).
- **Shot brief** — what the photo should show.
- **Min width** — largest size the page requests; deliver at least this width. Aspect ratio is flexible (the site uses `object-fit: cover`).
- **Used on** — pages and the section the photo appears in.
- **Replaces** — the Unsplash photo ID currently in the HTML; find-and-replace all instances of `https://images.unsplash.com/<id>...` with `images/<filename>`.
- **Alt** — accessibility text. Use `alt=""` only for purely decorative repeats (e.g. the photo grid).

Recommended format: `.jpg` (web-optimized, ~85% quality) or `.webp` if you also keep a `.jpg` fallback. Strip EXIF before uploading.

---

## Hero / full-bleed images

### `hero-home.jpg`
- **Shot brief:** Wide, atmospheric shot of the morning bake — bread and pastries on a counter, warm light. Sets the brand tone.
- **Min width:** 2400px
- **Used on:** `index.html` (hero), also referenced as the og:image / twitter:image for index, menu, story.
- **Replaces:** `photo-1509042239860-f550ce710b93`
- **Alt:** "Freshly baked bread and pastries at Louma Bakery"

### `hero-visit.jpg`
- **Shot brief:** Storefront exterior or warm interior establishing shot for the Visit page hero.
- **Min width:** 2000px
- **Used on:** `visit.html` (hero), `index.html` (location section), og:image for visit.
- **Replaces:** `photo-1453614512568-c4024d13c247`
- **Alt:** "Louma Bakery storefront on Wilshire"

### `hero-catering.jpg`
- **Shot brief:** A pastry box, spread, or catering setup — abundance, generosity.
- **Min width:** 2000px
- **Used on:** `catering.html` (hero), `index.html` (alt-block "Pastry boxes"), og:image for catering.
- **Replaces:** `photo-1558618666-fcd25c85cd64`
- **Alt:** "Louma Bakery pastry box for catering"

---

## Homepage alt-block sections (`index.html`)

### `home-morning.jpg`
- **Shot brief:** Out-of-the-oven moment — fresh loaves, steam, hands.
- **Min width:** 1400px (also reused at 1000px in the photo grid)
- **Used on:** `index.html` alt-block "Baked every morning" + photo grid.
- **Replaces:** `photo-1555507036-ab1f4038808a`
- **Alt:** decorative (`alt=""` in current grid use). For the alt-block, leave `alt=""` since the heading carries the meaning.

### `home-croissant.jpg`
- **Shot brief:** Hero croissant — lamination layers visible, top-down or close-up profile.
- **Min width:** 1400px
- **Used on:** `index.html` alt-block "The croissant" + photo grid; `careers.html` interior image.
- **Replaces:** `photo-1586444248902-2f64eddc13df`
- **Alt:** "A laminated butter croissant" (careers); decorative elsewhere.

_(The Louma Latte and storefront alt-blocks were removed in the design refinement — the latte appears as a product card, and the storefront moved into the `visit-stay` section as `hero-visit.jpg`.)_

---

## Product cards (homepage "From the menu")

### `product-butter-croissant.jpg`
- **Shot brief:** Single butter croissant, clean background, square-ish framing.
- **Min width:** 900px
- **Used on:** `index.html` product grid.
- **Replaces:** `photo-1530610476181-d83430b64dcd`
- **Alt:** "Butter croissant"

### `product-zaatar-croissant.jpg`
- **Shot brief:** Zaatar labneh croissant, signature item — top-down, ingredients visible.
- **Min width:** 900px
- **Used on:** `index.html` product grid.
- **Replaces:** `photo-1565299585323-38d6b0865b47`
- **Alt:** "Za'atar labneh croissant"

### `product-sourdough.jpg`
- **Shot brief:** Whole country sourdough loaf, crust detail.
- **Min width:** 900px
- **Used on:** `index.html` product grid.
- **Replaces:** `photo-1585478259715-876acc5be8eb`
- **Alt:** "Country sourdough loaf"

### `product-louma-latte.jpg`
- **Shot brief:** Louma Latte product shot — clean, single hero image. (Can be the same composition as `home-latte.jpg` but tighter.)
- **Min width:** 900px
- **Used on:** `index.html` product grid.
- **Replaces:** `photo-1517701550927-30cf4ba1dba5`
- **Alt:** "Louma latte"

---

## Page-specific images

### `mission-image.jpg`
- **Shot brief:** Image that ties to the mission narrative — a team moment, ingredients, or community.
- **Min width:** 1400px
- **Used on:** `mission.html`.
- **Replaces:** `photo-1556909211-36987daf7b4d`
- **Alt:** TBD — write a sentence tied to the mission copy on that page.

### `story-process.jpg`
- **Shot brief:** Process shot — dough being shaped, scoring, oven loading.
- **Min width:** 1400px
- **Used on:** `story.html` (section image).
- **Replaces:** `photo-1530610476181-d83430b64dcd` (currently shared with the butter croissant card; use a different shot here).
- **Alt:** TBD.

### `story-team.jpg`
- **Shot brief:** Founders / team portrait or candid.
- **Min width:** 1400px
- **Used on:** `story.html` (section image).
- **Replaces:** `photo-1573496359142-b8d87734a5a2`
- **Alt:** TBD.

---

## Swap checklist (when photos arrive)

1. Drop the file into `images/` with the exact filename above.
2. For each photo, find every instance of its Unsplash ID in the HTML and replace the full URL (including `?w=...&q=80&auto=format`) with `images/<filename>`. The site uses `srcset` with multiple sizes — currently all point to the same Unsplash photo at different widths. You can either:
   - **Quick path:** replace every `srcset` size with the same local path (browsers will downscale; one large file serves all).
   - **Optimal path:** export the photo at 3-4 sizes (e.g. `hero-home-640.jpg`, `hero-home-1200.jpg`, `hero-home-1600.jpg`, `hero-home-2400.jpg`) and update the `srcset` widths accordingly.
3. Remove the `<link rel="preconnect" href="https://images.unsplash.com" crossorigin />` line from each page once no Unsplash URLs remain.
4. Update the `<link rel="preload">` line in `index.html` and `visit.html` to point to the local hero file.
5. Update the `og:image` / `twitter:image` / schema.org `image` URLs to absolute URLs on your own domain (e.g. `https://loumabakery.com/images/hero-home.jpg`) — social platforms need absolute URLs.
6. Delete the `<!-- REPLACE WITH OFFICIAL PHOTO -->` HTML comments.
