/* =========================================
   Perumahan Sukoharjo — Landing Page Scripts
   ========================================= */

// Single source of truth — GANTI dengan data proyek asli sebelum publish
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

// ------------------------------------------------------------------
// Product data (Tipe Rumah)
// Ganti data ini dengan informasi proyek perumahan sebenarnya
// ------------------------------------------------------------------
const products = [
  {
    name: "Tipe Minimalis",
    image: "assets/images/house-1.jpg",
    alt: "Ilustrasi placeholder rumah Tipe Minimalis",
    land: "72 m²",
    building: "36 m²",
    bedrooms: "2 kamar tidur",
    bathrooms: "1 kamar mandi",
    price: "Mulai dari Rp250 juta",
  },
  {
    name: "Tipe Modern",
    image: "assets/images/house-2.jpg",
    alt: "Ilustrasi placeholder rumah Tipe Modern",
    land: "90 m²",
    building: "45 m²",
    bedrooms: "2 kamar tidur",
    bathrooms: "1 kamar mandi",
    price: "Mulai dari Rp350 juta",
  },
  {
    name: "Tipe Premium",
    image: "assets/images/house-3.jpg",
    alt: "Ilustrasi placeholder rumah Tipe Premium",
    land: "120 m²",
    building: "70 m²",
    bedrooms: "3 kamar tidur",
    bathrooms: "2 kamar mandi",
    price: "Mulai dari Rp450 juta",
  },
];

// ------------------------------------------------------------------
// Testimonial placeholders — CONTOH, bukan testimoni pelanggan nyata.
// Ganti dengan kutipan pelanggan asli yang sudah mendapat izin.
// ------------------------------------------------------------------
const TESTIMONIAL_LABEL = "Contoh testimoni — ganti dengan testimoni pelanggan asli";
const testimonials = [
  {
    name: "Pelanggan contoh 1",
    type: "Tipe Minimalis",
    image: "assets/images/testimonial.jpg",
    alt: "Ilustrasi placeholder avatar, bukan foto pelanggan",
    text: "Contoh kalimat testimoni: rumah terasa nyaman dan lingkungannya mendukung aktivitas keluarga.",
  },
  {
    name: "Pelanggan contoh 2",
    type: "Tipe Modern",
    image: "assets/images/testimonial.jpg",
    alt: "Ilustrasi placeholder avatar, bukan foto pelanggan",
    text: "Contoh kalimat testimoni: proses konsultasi mudah dan informasi harga disampaikan dengan jelas.",
  },
  {
    name: "Pelanggan contoh 3",
    type: "Tipe Premium",
    image: "assets/images/testimonial.jpg",
    alt: "Ilustrasi placeholder avatar, bukan foto pelanggan",
    text: "Contoh kalimat testimoni: lokasi mudah dijangkau dan fasilitas umum tersedia di sekitar perumahan.",
  },
];

// ------------------------------------------------------------------
// Pricing data
// ------------------------------------------------------------------
const pricing = [
  {
    name: "Tipe Minimalis",
    price: "250 juta",
    priceUnit: "/unit",
    specs: ["Luas tanah 72 m²", "Luas bangunan 36 m²", "2 kamar tidur", "1 kamar mandi"],
    dp: "Contoh: DP mulai 10%",
    payment: "Contoh: cash, KPR, atau cicilan developer",
    featured: false,
  },
  {
    name: "Tipe Modern",
    price: "350 juta",
    priceUnit: "/unit",
    specs: ["Luas tanah 90 m²", "Luas bangunan 45 m²", "2 kamar tidur", "1 kamar mandi"],
    dp: "Contoh: DP mulai 15%",
    payment: "Contoh: cash, KPR, atau cicilan developer",
    featured: true,
  },
  {
    name: "Tipe Premium",
    price: "450 juta",
    priceUnit: "/unit",
    specs: ["Luas tanah 120 m²", "Luas bangunan 70 m²", "3 kamar tidur", "2 kamar mandi"],
    dp: "Contoh: DP mulai 20%",
    payment: "Contoh: cash, KPR, atau cicilan developer",
    featured: false,
  },
];

// ------------------------------------------------------------------
// Render Product Cards
// ------------------------------------------------------------------
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (p) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.alt}" loading="lazy" width="400" height="220" />
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-spec">
          <span>Tanah ${p.land}</span>
          <span>Bangunan ${p.building}</span>
        </div>
        <div class="product-spec">
          <span>${p.bedrooms}</span>
          <span>${p.bathrooms}</span>
        </div>
      </div>
      <div class="product-actions">
        <a href="https://wa.me/" data-wa-message="${CONFIG.messages.product(p.name)}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Konsultasi</a>
        <a href="#kontak" class="btn btn-primary">Detail</a>
      </div>
    </article>
  `
    )
    .join("");
}

// ------------------------------------------------------------------
// Render Testimonial Cards
// ------------------------------------------------------------------
function renderTestimonials() {
  const grid = document.getElementById("testimonial-grid");
  if (!grid) return;

  grid.innerHTML = testimonials
    .map(
      (t) => `
    <article class="testimonial-card">
      <span class="testimonial-label">${TESTIMONIAL_LABEL}</span>
      <div class="testimonial-content">
        <img src="${t.image}" alt="${t.alt}" class="testimonial-avatar" loading="lazy" width="48" height="48" />
        “${t.text}”
      </div>
      <div class="testimonial-author">${t.name}</div>
      <div class="testimonial-type">${t.type}</div>
    </article>
  `
    )
    .join("");
}

// ------------------------------------------------------------------
// Render Pricing Cards
// ------------------------------------------------------------------
function renderPricing() {
  const grid = document.getElementById("pricing-grid");
  if (!grid) return;

  grid.innerHTML = pricing
    .map(
      (p) => `
    <article class="pricing-card${p.featured ? " featured" : ""}">
      ${p.featured ? '<span class="pricing-badge">Populer</span>' : ""}
      <div class="pricing-name">${p.name}</div>
      <div class="pricing-price">Rp${p.price}<span>${p.priceUnit}</span></div>
      <div class="pricing-spec">
        <ul>
          ${p.specs.map((s) => `<li>${s}</li>`).join("")}
        </ul>
      </div>
      <div class="pricing-extra">
        <span>${p.dp}</span>
        <span>${p.payment}</span>
      </div>
      <div class="pricing-actions">
        <a href="https://wa.me/" data-wa-message="${CONFIG.messages.pricing(p.name)}" class="btn btn-primary btn-full" target="_blank" rel="noopener noreferrer">Konsultasi Harga</a>
      </div>
    </article>
  `
    )
    .join("");
}

// ------------------------------------------------------------------
// WhatsApp link hydration — one number, one place
// ------------------------------------------------------------------
function initWhatsAppLinks() {
  document.querySelectorAll("a[data-wa-message]").forEach((el) => {
    el.href = buildWhatsAppUrl(el.dataset.waMessage);
  });
  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = CONFIG.whatsappDisplay;
  });
}

// ------------------------------------------------------------------
// Mobile Navigation Toggle
// ------------------------------------------------------------------
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const bars = document.querySelectorAll(".nav-toggle-bar");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    bars.forEach((bar) => bar.classList.toggle("open"));
  });

  // Tutup menu saat klik link navigasi
  links.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      bars.forEach((bar) => bar.classList.remove("open"));
    });
  });
}

// ------------------------------------------------------------------
// Smooth Scroll + Active Nav Highlight
// ------------------------------------------------------------------
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(navLinks).map((link) => {
    const id = link.getAttribute("href");
    return document.querySelector(id);
  }).filter(Boolean);

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0% -60%",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// ------------------------------------------------------------------
// Navbar Scratch Style on Scroll
// ------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
    } else {
      navbar.style.boxShadow = "none";
    }
    lastScrollY = window.scrollY;
  });
}

// ------------------------------------------------------------------
// Lazy Loading for images below the fold
// ------------------------------------------------------------------
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading supported — nothing needed
    return;
  }

  const images = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => observer.observe(img));
}

// ------------------------------------------------------------------
// Contact Form Validation & WhatsApp Handoff
// ------------------------------------------------------------------
function validateForm(form) {
  const fields = {
    nama: { element: form.querySelector("#nama"), error: form.querySelector("#error-nama") },
    telepon: { element: form.querySelector("#telepon"), error: form.querySelector("#error-telepon") },
  };
  const summary = form.querySelector("#form-error-summary");
  const messages = [];
  let firstInvalid = null;

  for (const [key, field] of Object.entries(fields)) {
    const value = field.element.value.trim();
    let message = "";
    if (key === "nama" && !value) message = "Nama lengkap wajib diisi.";
    if (key === "telepon") {
      const digitCount = value.replace(/\D/g, "").length;
      if (!/^[0-9+\s()-]{10,}$/.test(value) || digitCount < 8) {
        message = "Masukkan nomor telepon yang valid.";
      }
    }
    if (message) {
      field.element.classList.add("error");
      field.element.setAttribute("aria-invalid", "true");
      field.error.textContent = message;
      field.error.style.display = "block";
      messages.push(message);
      if (!firstInvalid) firstInvalid = field.element;
    }
  }

  summary.innerHTML = messages.length
    ? `<p>Silakan perbaiki ${messages.length} kolom berikut:</p><ul>${messages
        .map((m) => `<li>${m}</li>`)
        .join("")}</ul>`
    : "";
  summary.hidden = messages.length === 0;

  return { valid: messages.length === 0, firstInvalid, summary };
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    nama: { element: form.querySelector("#nama"), error: form.querySelector("#error-nama") },
    telepon: { element: form.querySelector("#telepon"), error: form.querySelector("#error-telepon") },
  };

  const summary = form.querySelector("#form-error-summary");

  Object.values(fields).forEach(({ element, error }) => {
    element.addEventListener("input", () => {
      element.classList.remove("error");
      element.removeAttribute("aria-invalid");
      error.textContent = "";
      error.style.display = "none";
      summary.hidden = true;
      summary.innerHTML = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const existingSuccess = form.querySelector(".form-success");
    if (existingSuccess) existingSuccess.remove();
    const { valid, summary } = validateForm(form);
    if (!valid) {
      summary.focus();
      return;
    }

    const namaVal = fields.nama.element.value.trim();
    const teleponVal = fields.telepon.element.value.trim();
    const tipe = form.querySelector("#tipe").value;
    const pesan = form.querySelector("#pesan").value.trim();
    let waText = `Halo, saya ${namaVal} (${teleponVal})`;
    if (tipe) waText += `\nTipe: ${tipe}`;
    if (pesan) waText += `\nPesan: ${pesan}`;
    waText += "\n\nMohon informasi selengkapnya mengenai perumahan Sukoharjo.";

    const existing = form.querySelector(".form-success");
    if (existing) existing.remove();
    const success = document.createElement("div");
    success.className = "form-success";
    success.textContent = "Anda akan diarahkan ke WhatsApp untuk melanjutkan pertanyaan Anda.";
    form.insertBefore(success, form.querySelector("#submit-btn"));

    window.open(buildWhatsAppUrl(waText), "_blank");
    form.reset();
  });
}

// ------------------------------------------------------------------
// Initialize
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTestimonials();
  renderPricing();
  initWhatsAppLinks();
  initMobileNav();
  initScrollSpy();
  initNavbarScroll();
  initLazyLoading();
  initContactForm();
});

window.PropKuConfig = { CONFIG, buildWhatsAppUrl };
