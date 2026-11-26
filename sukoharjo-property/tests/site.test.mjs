import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = (name) => fileURLToPath(new URL(`../${name}`, import.meta.url));
const html = fs.readFileSync(root("index.html"), "utf8");
const js = fs.readFileSync(root("js/script.js"), "utf8");
const css = fs.readFileSync(root("css/style.css"), "utf8");

// --- Task 1: CONFIG foundation ---
test("script.js defines a CONFIG object with the canonical WhatsApp number", () => {
  assert.match(js, /const CONFIG\s*=\s*\{/);
  assert.match(js, /whatsappNumber:\s*"6281234567890"/);
});

test("script.js defines buildWhatsAppUrl()", () => {
  assert.match(js, /function buildWhatsAppUrl\s*\(/);
});

test("index.html contains no hardcoded WhatsApp number", () => {
  assert.ok(!html.includes("6281234567890"));
});

test("index.html uses data-driven WhatsApp anchors", () => {
  const count = (html.match(/data-wa-message=/g) || []).length;
  assert.ok(count >= 8, `expected at least 8 data-wa-message anchors, found ${count}`);
});

test("js/script.js contains no invented testimonial names", () => {
  for (const name of ["Andi Setiawan", "Siti Rahayu", "Budi Santoso"]) {
    assert.ok(!js.includes(name), `invented name still present: ${name}`);
  }
});

// --- Task 2: local illustrative images ---
test("all five local image assets exist and are non-trivial", () => {
  for (const name of [
    "hero-house.jpg",
    "house-1.jpg",
    "house-2.jpg",
    "house-3.jpg",
    "testimonial.jpg",
  ]) {
    const path = root(`assets/images/${name}`);
    assert.ok(fs.existsSync(path), `missing image: ${name}`);
    assert.ok(fs.statSync(path).size > 5000, `image too small: ${name}`);
  }
});

test("every img tag in index.html has alt text", () => {
  const tags = html.match(/<img\b[^>]*>/g) || [];
  assert.ok(tags.length > 0, "no img tags found");
  for (const tag of tags) {
    assert.match(tag, /\balt="/, `img without alt: ${tag}`);
  }
});

// --- Task 3: SVG icons, no emoji ---
test("index.html contains no structural emoji icons", () => {
  for (const emoji of ["🏠", "📍", "🏗️", "🌳", "🏘️", "🏊", "📞", "💬"]) {
    assert.ok(!html.includes(emoji), `emoji still used as icon: ${emoji}`);
  }
});

test("index.html uses accessible inline SVG icons", () => {
  const svgs = html.match(/<svg\b[^>]*>/g) || [];
  assert.ok(svgs.length >= 9, `expected at least 9 svg tags, found ${svgs.length}`);
  for (const svg of svgs) {
    assert.match(
      svg,
      /aria-hidden="true"|role="img"/,
      `svg without accessible handling: ${svg}`,
    );
  }
});

// --- Task 4: centralized WhatsApp links ---
test("every data-driven WhatsApp anchor is safe and unencoded in markup", () => {
  const anchors = html.match(/<a\b[^>]*data-wa-message=[^>]*>/g) || [];
  assert.ok(anchors.length >= 8, `expected at least 8 anchors, found ${anchors.length}`);
  for (const anchor of anchors) {
    assert.match(anchor, /href="https:\/\/wa\.me\/"/, `wrong fallback href: ${anchor}`);
    assert.match(anchor, /target="_blank"/, `missing target: ${anchor}`);
    assert.match(anchor, /rel="noopener noreferrer"/, `missing rel: ${anchor}`);
  }
});

test("script.js rewrites WhatsApp anchors from CONFIG at runtime", () => {
  assert.match(js, /function initWhatsAppLinks\s*\(/);
  assert.match(js, /dataset\.waMessage/);
  assert.match(js, /buildWhatsAppUrl\(el\.dataset\.waMessage\)/);
  assert.match(js, /messages:\s*\{/);
  assert.match(js, /consultation:\s*"/);
  assert.match(js, /survey:\s*"/);
});

// --- Task 5: honest testimonials and complete pricing info ---
test("testimonials are labeled placeholders, not invented real buyers", () => {
  for (const name of ["Andi Setiawan", "Siti Rahayu", "Budi Santoso"]) {
    assert.ok(!js.includes(name), `invented name still present: ${name}`);
  }
  assert.match(js, /Contoh testimoni/);
  assert.ok(
    !html.includes("Cerita dari para pemilik rumah yang telah memilih"),
    "testimonial subtitle still asserts real customers",
  );
});

test("pricing cards carry the disclaimer and DP/payment information", () => {
  assert.match(html, /Harga dapat berubah sewaktu-waktu/);
  assert.match(js, /dp:\s*"/);
  assert.match(js, /payment:\s*"/);
  assert.match(js, /pricing-extra/);
});

// --- Task 6: truthful, accessible form ---
test("contact form has an error summary and no false success claim", () => {
  assert.match(html, /id="form-error-summary"/);
  assert.match(html, /role="alert"/);
  assert.ok(!html.includes("Pesan terkirim!"));
  assert.ok(!js.includes("Pesan terkirim!"));
});

test("script.js validates fields and focuses the error summary", () => {
  assert.match(js, /function validateForm\s*\(/);
  assert.match(js, /firstInvalid/);
  assert.match(js, /form-error-summary/);
  assert.match(js, /\.focus\(\)/);
  assert.match(js, /Anda akan diarahkan ke WhatsApp/);
});

// --- Task 7: accessibility and responsive polish ---
test("page has a skip link and the nav toggle declares its controls", () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /class="skip-link" href="#home"/);
  assert.match(html, /id="nav-toggle"[^>]*aria-controls="nav-links"/);
});

test("CSS supports reduced motion, visible focus and 44px tap targets", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
});

test("mobile nav breakpoint covers laptop widths to prevent navbar overflow", () => {
  assert.match(css, /@media\s*\(max-width:\s*1080px\)/);
  assert.match(css, /@media\s*\(max-width:\s*1080px\)[\s\S]*?\.nav-links\s*\{[\s\S]*?position:\s*fixed/);
});

test("closed mobile nav does not sit off-canvas and inflate scroll width", () => {
  assert.ok(!css.includes("translateX(100%)"), "off-canvas transform creates horizontal overflow");
  assert.match(css, /\.nav-links\s*\{[\s\S]*?visibility:\s*hidden/);
  assert.match(css, /\.nav-links\.open\s*\{[\s\S]*?visibility:\s*visible/);
});

// --- Final review fixes: Lighthouse accessibility findings ---
test("gold badge and WhatsApp float use readable text colors", () => {
  assert.match(css, /\.pricing-badge\s*\{[\s\S]*?color:\s*(#0E392B|#164E3B|#3D2E0B)/i);
  assert.match(css, /\.float-whatsapp\s*\{[\s\S]*?color:\s*(#0E392B|#164E3B)/i);
});

test("logo accessible name contains its visible text and page has a main landmark", () => {
  assert.match(html, /class="logo"[^>]*aria-label="Perumahan Sukoharjo/);
  assert.match(html, /<main\b/);
  assert.match(html, /<\/main>/);
});

// --- Executable behavior tests (real code, no source-text regex) ---
const sandbox = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(sandbox);
vm.runInContext(js, sandbox);
const { buildWhatsAppUrl } = sandbox.window.PropKuConfig;
const validateForm = vm.runInContext("validateForm", sandbox);

function fakeField(value) {
  return {
    value,
    classList: { add() {}, remove() {} },
    setAttribute() {},
    removeAttribute() {},
    error: { textContent: "", style: {} },
  };
}

function fakeForm(nama, telepon) {
  const fields = { "#nama": fakeField(nama), "#telepon": fakeField(telepon) };
  const errors = { "#error-nama": fields["#nama"].error, "#error-telepon": fields["#telepon"].error };
  const summary = { innerHTML: "", hidden: true };
  return {
    fields,
    summary,
    querySelector(sel) {
      if (sel === "#form-error-summary") return summary;
      if (errors[sel]) return errors[sel];
      return fields[sel] || null;
    },
  };
}

test("buildWhatsAppUrl puts the exact message into the query string", () => {
  const message = "Halo & selamat? 100%";
  const url = buildWhatsAppUrl(message);
  assert.ok(url.startsWith("https://wa.me/6281234567890?text="));
  assert.equal(new URL(url).searchParams.get("text"), message);
});

test("validateForm rejects blank names and phone numbers with no digits", () => {
  const form = fakeForm("   ", "++++++++++");
  const result = validateForm(form);
  assert.equal(result.valid, false);
  assert.equal(result.firstInvalid, form.fields["#nama"]);
  assert.equal(form.fields["#telepon"].error.textContent, "Masukkan nomor telepon yang valid.");
  assert.equal(form.summary.hidden, false);
});

test("validateForm accepts a real name and a plausible phone number", () => {
  const form = fakeForm("Budi Uji Coba", "0812-3456-7890");
  const result = validateForm(form);
  assert.equal(result.valid, true);
  assert.equal(form.summary.hidden, true);
});
