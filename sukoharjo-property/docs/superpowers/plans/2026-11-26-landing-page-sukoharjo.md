# Landing Page Perumahan Sukoharjo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing `sukoharjo-property/` scaffold into a publish-ready, honest, accessible marketing landing page that drives visitors to WhatsApp.

**Architecture:** Keep the scaffold's seven-section HTML and CSS custom-property system. Move all mutable content and the WhatsApp number into one `CONFIG` object in `js/script.js`, have JS rewrite `a[data-wa-message]` links from that config, replace emoji with inline SVG, and generate local illustrative images. Verification is a dependency-free Node test file that statically asserts the invariants plus a browser pass.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6+), Node 20 `node:test` + `node:assert/strict` for checks only. No framework, no build step, no npm dependencies.

**Spec:** `docs/superpowers/specs/2026-11-26-landing-page-sukoharjo-design.md`

## Global Constraints

- Working directory is `C:\rumah.opencode\sukoharjo-property`. The workspace is **not a git repo** — omit all commit steps; the plan tracks completion via checkboxes only.
- Tech stack is fixed: HTML5 / CSS3 / Vanilla JavaScript. Do not add React, Vue, Angular, npm packages, or a build step.
- Palette verbatim: Primary `#164E3B`, Secondary `#A3BFA8`, Background `#F8FAF8`, Text `#242B28`, Accent `#D6AE63`, White `#FFFFFF`.
- Typography verbatim: headings Poppins, body Inter, weights 400/500/600/700.
- Container max width `1200px`; border radius `12–18px`.
- WhatsApp number source of truth is exactly one place: `CONFIG.whatsappNumber` in `js/script.js`. The string `6281234567890` must not appear in `index.html`.
- Prices, specs, DP, payment methods, and testimonials are illustrative and must be labeled as `contoh`; never present invented people as real buyers.
- Every `<img>` requires a meaningful `alt`. Below-the-fold images use `loading="lazy"`.
- All WhatsApp links must open in a new tab with `rel="noopener noreferrer"`.

## Review Focus

- **Wrong WhatsApp destination:** a malformed number or missing `62` prefix sends leads nowhere — Task 4 pins `buildWhatsAppUrl()` output and `CONFIG.whatsappNumber`.
- **Blanks passed as valid:** whitespace-only name or a short/garbage phone must be rejected — Task 6 tests both and checks the error summary is focused.
- **Missing/placeholder image file:** a generated file that never landed produces a broken image — Task 2 asserts all five files exist and are non-trivial in size.
- **Fake social proof:** invented names presented as customers erode trust and violate the PRD — Task 5 asserts no invented names remain and a `Contoh testimoni` label is visible.
- **375px overflow / motion sensitivity:** fixed-width elements cause horizontal scroll, and animation must respect `prefers-reduced-motion` — Task 7 asserts the CSS hook exists and Task 8 verifies in a browser at 375px.

---

### Task 1: Verification harness and CONFIG skeleton

**Files:**
- Create: `tests/site.test.mjs`
- Modify: `js/script.js`

**Interfaces:**
- Consumes: current `js/script.js`, `index.html`.
- Produces: `CONFIG` object (`whatsappNumber`, `whatsappDisplay`, `messages`) and `buildWhatsAppUrl(message)` exported on `window` for tests/browser; test file runnable with `node --test tests/site.test.mjs`.

- [ ] **Step 1: Create `tests/site.test.mjs` with failing baseline assertions**

Use `node:test`, `node:assert/strict`, and `node:fs`. Read `index.html`, `css/style.css`, `js/script.js` from the project root (resolve relative to `import.meta.url`). Assertions:
  - `script.js` matches `/const CONFIG\s*=\s*\{/`
  - `script.js` matches `/whatsappNumber:\s*"6281234567890"/`
  - `script.js` matches `/function buildWhatsAppUrl\s*\(/`
  - `index.html` does **not** contain `6281234567890`
  - `index.html` contains at least 8 occurrences of `data-wa-message=`
  - `script.js` does not contain any of `Andi Setiawan`, `Siti Rahayu`, `Budi Santoso`

- [ ] **Step 2: Run the harness and confirm it fails**

Run: `node --test tests/site.test.mjs`
Expected: FAIL — `CONFIG` not defined, `6281234567890` present in HTML, no `data-wa-message` attributes, invented names present.

- [ ] **Step 3: Add `CONFIG` and `buildWhatsAppUrl` to `js/script.js`**

At the top of `js/script.js`, replace the current `const WHATSAPP_NUMBER = "6281234567890";` line with:

```js
const CONFIG = {
  whatsappNumber: "6281234567890",
  whatsappDisplay: "0812-3456-7890",
  messages: {
    consultation: "Halo, saya tertarik dengan perumahan Sukoharjo. Mohon informasi selengkapnya.",
    survey: "Halo, saya ingin jadwalkan survei lokasi perumahan Sukoharjo.",
    product: (name) => `Halo, saya tertarik dengan ${name}. Mohon informasi harga dan spesifikasi lengkap.`,
    pricing: (name) => `Halo, saya tertarik dengan ${name}. Mohon informasi harga dan ketersediaan unit.`,
  },
};

function buildWhatsAppUrl(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
```

Keep the existing `products`, `testimonials`, and `pricing` arrays for now — Task 5 and Task 6 replace their contents. Append `window.PropKuConfig = { CONFIG, buildWhatsAppUrl };` at the end of the file so browser checks can inspect them.

- [ ] **Step 4: Run the harness and confirm the CONFIG assertions pass (remaining still fail)**

Run: `node --test tests/site.test.mjs`
Expected: CONFIG and `buildWhatsAppUrl` assertions PASS; HTML/naming assertions still FAIL.

---

### Task 2: Generate and wire local images

**Files:**
- Create: `assets/images/hero-house.jpg`
- Create: `assets/images/house-1.jpg`
- Create: `assets/images/house-2.jpg`
- Create: `assets/images/house-3.jpg`
- Create: `assets/images/testimonial.jpg`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: image paths already referenced by `index.html` and `js/script.js`.
- Produces: five real local image files; test assertions for their existence.

- [ ] **Step 1: Add failing image assertions to `tests/site.test.mjs`**

For each of the five paths, assert `fs.existsSync(path)` is true and `fs.statSync(path).size > 5000`. Assert `index.html` contains `alt=` on every `<img` tag found (regex over all `<img...>` matches).

- [ ] **Step 2: Run the harness and confirm image tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL on `assets/images/` existence.

- [ ] **Step 3: Generate the five images with `experimental_image_generate`**

Call it once per image, saving directly to the paths above. Prompts should produce modern single-family homes in a green, tidy Indonesian housing estate, natural daylight, no text, no watermark:
  - `hero-house.jpg` — wide 16:9 hero shot of a modern minimal garden house at golden hour.
  - `house-1.jpg` — compact 72 m²-class minimalis house, clean facade.
  - `house-2.jpg` — larger 90 m²-class modern house with carport.
  - `house-3.jpg` — premium 120 m²-class two-storey house with garden.
  - `testimonial.jpg` — neutral illustrative portrait placeholder, **not** a real identifiable person; a simple abstract avatar is acceptable.

The tool runs in the background — wait for each save notification before continuing.

- [ ] **Step 4: Run the harness and confirm image tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all image assertions PASS. Alt-text assertions PASS (existing scaffold already has alt text).

---

### Task 3: Replace emoji icons with inline SVG

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.logo-icon`, `.benefit-icon`, `.float-whatsapp-icon`, `.nav-toggle-bar`.
- Produces: a consistent inline-SVG icon set; CSS class `.icon` for sizing/stroke.

- [ ] **Step 1: Add failing icon assertions to `tests/site.test.mjs`**

Assert `index.html` contains **none** of `🏠`, `📍`, `🏗️`, `🌳`, `🏘️`, `🏊`, `📞`, `💬`. Assert `index.html` contains at least 10 `<svg` tags. Assert every `<svg` has `aria-hidden="true"` or `role="img"` with an accessible label.

- [ ] **Step 2: Run the harness and confirm icon tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL on emoji presence and SVG count.

- [ ] **Step 3: Replace emoji in `index.html` with inline `<svg>`**

Use one consistent stroke-based icon family (Lucide-style paths) at `stroke-width="1.75"`, `fill="none"`, `stroke="currentColor"`, wrapped as `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">`. Replace:
  - both logo `🏠` → house icon
  - the six `.benefit-icon` emoji → map-pin, building, tree, home-alt, park/droplets, phone-call
  - floating button `💬` → message-circle
Add `.icon { width: 1.5em; height: 1.5em; display: block; }` and a `.icon-lg { width: 2.5em; height: 2.5em; }` to `css/style.css`; adjust `.benefit-icon` and `.float-whatsapp-icon` to size the SVG rather than font-size.

- [ ] **Step 4: Run the harness and confirm icon tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all icon assertions PASS.

---

### Task 4: Centralize every WhatsApp link

**Files:**
- Modify: `index.html`
- Modify: `js/script.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `CONFIG`, `buildWhatsAppUrl(message)` from Task 1.
- Produces: `initWhatsAppLinks()` in `js/script.js`; `a[data-wa-message]` elements in HTML.

- [ ] **Step 1: Add failing WhatsApp assertions to `tests/site.test.mjs`**

Assert:
  - `index.html` does not contain `https://wa.me/628...` and does not contain `6281234567890`
  - every `<a` tag with `data-wa-message` has `href="https://wa.me/"`, `target="_blank"`, and `rel="noopener noreferrer"`
  - `script.js` contains `function initWhatsAppLinks`
  - `script.js` contains `el.dataset.waMessage` (or equivalent `dataset` read)
  - `script.js` contains `CONFIG.messages.consultation` and `CONFIG.messages.survey`

- [ ] **Step 2: Run the harness and confirm WhatsApp tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL — hardcoded number still in HTML.

- [ ] **Step 3: Convert static links in `index.html` to data-driven links**

For all eight WhatsApp anchors (nav CTA, hero, product/pricing renders in JS, two CTA buttons, contact info, footer, floating button):
  - HTML anchors become `<a href="https://wa.me/" data-wa-message="…" target="_blank" rel="noopener noreferrer">…</a>` using the existing preset text from the scaffold (verbatim where present).
  - Contact info number becomes `<span data-wa-display></span>`; footer link keeps `data-wa-message`.
  - In `js/script.js`, product and pricing cards render anchors with a raw `data-wa-message` attribute filled from `CONFIG.messages.product(p.name)` and `CONFIG.messages.pricing(p.name)`. `initWhatsAppLinks()` performs the URL-encoding, so the attribute must stay unencoded.
  - Implement `initWhatsAppLinks()`:

```js
function initWhatsAppLinks() {
  document.querySelectorAll("a[data-wa-message]").forEach((el) => {
    el.href = buildWhatsAppUrl(el.dataset.waMessage);
  });
  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = CONFIG.whatsappDisplay;
  });
}
```

Call it inside the existing `DOMContentLoaded` handler, before the render functions.

- [ ] **Step 4: Run the harness and confirm WhatsApp tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all WhatsApp assertions PASS.

---

### Task 5: Honest testimonials and complete pricing info

**Files:**
- Modify: `js/script.js`
- Modify: `index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `testimonials`, `pricing` arrays from the scaffold.
- Produces: labeled placeholder testimonials; `dp` and `payment` fields on pricing cards.

- [ ] **Step 1: Add failing content assertions to `tests/site.test.mjs`**

Assert:
  - `script.js` does not contain `Andi Setiawan`, `Siti Rahayu`, `Budi Santoso`
  - `script.js` contains `Contoh testimoni`
  - `index.html` does not contain `Cerita dari para pemilik rumah yang telah memilih`
  - `index.html` contains `Harga dapat berubah sewaktu-waktu`
  - `script.js` contains `dp:` and `payment:` in the pricing array

- [ ] **Step 2: Run the harness and confirm content tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL on invented names, subtitle, DP/payment.

- [ ] **Step 3: Rewrite testimonial/pricing content in `js/script.js` and copy in `index.html`**

Replace `testimonials` with three clearly labeled placeholders using generic names `Pelanggan contoh 1..3`, type retained, and text that reads as sample copy. Add a `label: "Contoh testimoni — ganti dengan testimoni pelanggan asli"` field and render it in `renderTestimonials()` as a visible `.testimonial-label`. Add `dp` (e.g. `DP mulai 10%`) and `payment` (e.g. `Cash, KPR, atau cicilan developer`) fields to each pricing entry and render them as a `.pricing-extra` line. Rewrite the testimonial subtitle in `index.html` to `Contoh tampilan testimoni. Ganti dengan testimoni pelanggan asli yang telah mendapat izin.`

- [ ] **Step 4: Run the harness and confirm content tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all content assertions PASS.

---

### Task 6: Truthful, accessible contact form

**Files:**
- Modify: `index.html`
- Modify: `js/script.js`
- Modify: `css/style.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `CONFIG`, `buildWhatsAppUrl`, `initWhatsAppLinks` from Task 4.
- Produces: `validateForm(form)` returning `{ valid: boolean, firstInvalid: Element|null }`; error summary element `#form-error-summary`.

- [ ] **Step 1: Add failing form assertions to `tests/site.test.mjs`**

Assert:
  - `index.html` contains `id="form-error-summary"`
  - `index.html` does not contain `Pesan terkirim!`
  - `script.js` contains `function validateForm`
  - `script.js` contains `role="alert"` in the error-summary markup and `.focus()` on the summary
  - `script.js` contains the string `Anda akan diarahkan ke WhatsApp`

- [ ] **Step 2: Run the harness and confirm form tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL on summary, success copy, validation helper.

- [ ] **Step 3: Implement validation and honest handoff**

In `index.html`, add `<div id="form-error-summary" role="alert" tabindex="-1" class="form-error-summary" hidden></div>` as the first child of the form. In `js/script.js`, implement `validateForm(form)`:
  - trim `nama`; require non-empty, else error `Nama lengkap wajib diisi.`
  - trim `telepon`; require `/^[0-9+\s()-]{10,}$/`, else error `Masukkan nomor telepon yang valid.`
  - return `{ valid, firstInvalid }`; populate per-field error spans and the summary list.
In the submit handler: `e.preventDefault()`, call `validateForm(form)`, if invalid reveal the summary and call `.focus()` on it; if valid, show success text `Anda akan diarahkan ke WhatsApp untuk melanjutkan pertanyaan Anda.` then `window.open(buildWhatsAppUrl(...), "_blank")` with a message composed from CONFIG that includes name, phone, type, and pesan. Remove setTimeout fake "Mengirim..." state. Add `.form-error-summary` styling in `css/style.css` (light red surface, dark red text, ≥4.5:1 contrast).

- [ ] **Step 4: Run the harness and confirm form tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all form assertions PASS.

---

### Task 7: Accessibility and responsive polish

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: nav markup from scaffold, `.icon` from Task 3.
- Produces: skip link, `aria-controls`, reduced-motion block, 44px tap targets.

- [ ] **Step 1: Add failing accessibility assertions to `tests/site.test.mjs`**

Assert:
  - `index.html` contains `class="skip-link"` and `href="#home"`
  - `#nav-toggle` markup contains `aria-controls="nav-links"`
  - `css/style.css` contains `@media (prefers-reduced-motion: reduce)`
  - `css/style.css` contains `:focus-visible`
  - `css/style.css` contains `min-height: 44px` (or `min-width: 44px`) in a nav/button rule

- [ ] **Step 2: Run the harness and confirm accessibility tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL on skip link, aria-controls, reduced motion, tap targets.

- [ ] **Step 3: Apply accessibility changes**

Add `<a class="skip-link" href="#home">Lewati ke konten utama</a>` as the first body element and style it off-screen until focused. Add `aria-controls="nav-links"` to `#nav-toggle`. In `css/style.css`, add a `@media (prefers-reduced-motion: reduce)` block that sets `scroll-behavior: auto` and zeroes `transition-duration`/`animation-duration` for `*`, and ensure `.nav-toggle`, `.btn`, and `.nav-link` have at least 44px tap targets. Confirm `:focus-visible` outline remains on buttons and links.

- [ ] **Step 4: Run the harness and confirm accessibility tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all assertions PASS — the full suite is green.

---

### Task 8: Publish checklist and browser verification

**Files:**
- Modify: `README.md`
- Verify: `index.html`, `css/style.css`, `js/script.js`, `assets/images/`

**Interfaces:**
- Consumes: all tasks above.
- Produces: accurate README; verified page at 1440 / 1024 / 768 / 375px with no console errors.

- [ ] **Step 1: Rewrite `README.md` as the single publish checklist**

Sections: Cara Menjalankan (open `index.html`, no build step); "Sebelum Publish — 5 hal yang wajib diganti" (1. `CONFIG.whatsappNumber` + `whatsappDisplay` in `js/script.js`, 2. brand name in `index.html`, 3. five images in `assets/images/`, 4. `products`/`pricing` data including DP/payment, 5. `testimonials` placeholders with real permissioned quotes); Cara Kerja WhatsApp (`data-wa-message` → `initWhatsAppLinks()`); Struktur Folder; Teknologi; Catatan harga/contoh. Remove the false claim that only `script.js` needs editing for the number.

- [ ] **Step 2: Run the complete test suite**

Run: `node --test tests/site.test.mjs`
Expected: all tests PASS, zero failures.

- [ ] **Step 3: Browser verification**

Load the browser skill, open `index.html` via `file:///C:/rumah.opencode/sukoharjo-property/index.html`. Check: all seven sections render, images display, no console errors, navbar sticky, mobile hamburger opens/closes at 768px and 375px, no horizontal scroll at 1440/1024/768/375px, and clicking a WhatsApp CTA produces a `wa.me/6281234567890?text=…` URL with the correct preset message.

- [ ] **Step 4: Final confirmation**

Report the exact test output line (e.g. `pass 40`, `fail 0`) and the browser verification result. Do not claim completion before both are observed.
