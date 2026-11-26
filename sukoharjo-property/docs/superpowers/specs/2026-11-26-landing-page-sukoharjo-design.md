# Design: Landing Page Perumahan Sukoharjo

**Date:** 2026-11-26
**Status:** Approved by partner (approach + short design)

## Intent & why

Marketing landing page for a housing development in Kabupaten Sukoharjo. The
visitor is a young couple, family, Solo Raya worker, or investor. Success is not
"a pretty page" — it is a visitor who clicks a WhatsApp CTA or submits the
survey/consultation request and reaches marketing. Everything else serves that.

The PRD v1.0 was supplied **inline by the partner** (not as a workspace file) and
is the authoritative requirement source. This document is self-contained: it
restates the requirements it depends on and records the decisions made on top
of them.

Requirements relied on: seven sections in PRD order (Hero, Problem/Solution,
Tipe Rumah, Keunggulan, Testimoni, Harga, CTA/Kontak); nav items Home, Tentang
Kami, Tipe Rumah, Keunggulan, Harga, Testimoni, Kontak with smooth scroll; FR-01
openable in a browser; FR-02 nav links to sections; FR-03 mobile menu open/close;
FR-04 product cards; FR-05 WhatsApp to marketing; FR-06 form validation; FR-07
survey button opens WhatsApp with an auto message; FR-08 responsive; FR-09 alt
text on all images; FR-10 prices/specs editable from HTML or JS. Pricing must
carry the "harga dapat berubah sewaktu-waktu" disclaimer; testimonials must not
be fabricated as real buyers.

## Goals

- All seven sections present: Hero, Problem/Solution, Tipe Rumah, Keunggulan,
  Testimoni, Harga, CTA/Kontak.
- Pure HTML5 + CSS3 + Vanilla JavaScript. No framework, no build step.
- Deep Green / Sage / Off White / Charcoal / Warm Gold palette; Poppins for
  headings, Inter for body.
- Responsive at 1440 / 1024 / 768 / 375–430px with no horizontal scroll.
- WhatsApp lead flow plus a validated consultation/survey form.

## Non-goals

- No backend, no lead storage, no analytics integration (the PRD marks these
  as requiring external services).
- No fabricated real-customer testimonials.
- No final pricing/spec data — those belong to the developer.

## Constraints & decisions (calls made)

- **Start from the existing scaffold** at `sukoharjo-property/`, not from
  scratch. It already has correct section structure, sticky nav, card rendering,
  and responsive CSS. Chosen because it is the lowest-risk path and the partner
  approved it.
- **Content strategy (partner chose):** generate local illustrative images,
  keep prices/specs clearly labeled as `contoh`, and replace invented
  testimonials with honestly labeled placeholders.
- **Tooling:** Python is not installed on this machine, so the ui-ux-pro-max CLI
  searches are skipped. Its Quick Reference rules and the fully specified PRD
  palette/typography are used instead. No software installation.
- **Brand name:** generic "Perumahan Sukoharjo" remains as a clearly editable
  placeholder; the partner did not supply a brand.

## Changes to the existing scaffold

1. **Assets.** Generate five local illustrative images in `assets/images/`
   (`hero-house.jpg`, `house-1.jpg`, `house-2.jpg`, `house-3.jpg`,
   `testimonial.jpg`). All are marked illustrative in the README and in image
   alt text where it affects meaning.
2. **Icons.** Replace all emoji (🏠 📍 🏗️ 🌳 🏘️ 🏊 📞 💬) with one consistent
   inline-SVG icon set, stroke 1.75px, decorative icons `aria-hidden="true"`.
   Rationale: ui-ux-pro-max "No Emoji as Structural Icons" rule.
3. **WhatsApp number.** Move the single source of truth to a `CONFIG` object in
   `js/script.js`. Remove every hardcoded `wa.me/6281234567890` from
   `index.html`. Rationale: the old README claimed only JS needed editing but
   HTML had ~8 copies — a real publish hazard (FR-05).
4. **Testimonials.** No invented names quoted as real buyers. Cards are labeled
   `Contoh testimoni — ganti dengan testimoni pelanggan asli` with illustrative
   text, and the required type field is retained. Rationale: explicit PRD note
   in §3.5.
5. **Pricing.** Add illustrative DP and payment-method lines to each pricing
   card, and keep the price-change disclaimer. Rationale: §3.6 FR.
6. **Form honesty.** Replace "Pesan terkirim!" with a truthful message that the
   visitor will be handed off to WhatsApp. Keep inline validation; add an error
   summary that receives focus on a failed submit. Rationale: PRD §6 FR-06 and
   ui-ux-pro-max form accessibility guidance.
7. **Accessibility & polish.** Add skip link, `aria-controls` on the nav
   toggle, focus-visible styles, `prefers-reduced-motion` support, ≥44px touch
   targets, and passive scroll listeners. Confirm no horizontal scroll at 375px.
8. **README.** Turn it into the single "replace before publish" checklist:
   WA number, brand, images, prices/specs, testimonials.

## Calls made after reviewer check

- **WhatsApp preset copy:** keep the scaffold's existing preset texts
  (consultation, "jadwalkan survei lokasi", per-product and per-pricing
  "tertarik dengan <tipe>", and the form-composed message) and move them into
  `CONFIG`. They already satisfy FR-05/FR-07; no new copy is needed.
- **Testimonial placeholders:** use generic anonymous placeholders (e.g.
  "Pelanggan contoh 1"), **not** the invented names Andi Setiawan / Siti Rahayu
  / Budi Santoso, and rewrite the section subtitle so it no longer asserts real
  customers. This is the stricter reading of the "no fabricated testimonials"
  constraint.
- **Form placement:** keep the contact form as its own visual block directly
  after the `#kontak` CTA, but treat it as part of the "Kontak" nav group for
  scroll-spy and skip-link purposes. It is not counted as an eighth main
  section; the seven PRD sections remain intact.

## What stays as-is

- Section order, IDs, and nav labels from the PRD.
- CSS custom properties and grid layouts (already match the PRD).
- Google Fonts link, SEO metadata, Open Graph tags.
- Lazy loading on below-the-fold images.

## Verification

- Open `index.html` in a browser; check all seven sections render.
- Check every WhatsApp link resolves to the CONFIG number with the right preset
  message (hero, nav, product cards, pricing cards, CTA, floating button, form).
- Test form: empty submit shows errors + focused summary; valid submit opens a
  correct `wa.me` URL and never claims a message was "sent".
- Toggle mobile nav at 768px and 375px; verify open/close and link click.
- Confirm no console errors and no horizontal scroll at 375 / 768 / 1024 / 1440.
- Confirm images load and all `<img>` have alt text.
