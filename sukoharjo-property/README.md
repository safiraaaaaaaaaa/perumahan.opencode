# Perumahan Sukoharjo — Landing Page

Landing page pemasaran perumahan di Kabupaten Sukoharjo, Jawa Tengah.
Dibangun dengan **HTML5, CSS3, dan Vanilla JavaScript** (tanpa framework, tanpa build step), sesuai PRD versi 1.0.

## Cara Menjalankan

1. Buka folder `sukoharjo-property/` di file explorer.
2. Klik dua kali `index.html` untuk membuka di browser.
3. Tidak diperlukan instalasi dependensi atau server khusus.

## Sebelum Publish — 5 Hal yang Wajib Diganti

Saat ini seluruh data di bawah adalah **contoh/placeholder**. Jangan publish sebelum menggantinya dengan data proyek sebenarnya.

1. **Nomor WhatsApp.** Buka `js/script.js`, bagian `CONFIG`:

   ```js
   whatsappNumber: "6281234567890", // format internasional, tanpa + dan spasi
   whatsappDisplay: "0812-3456-7890", // tampilan di halaman
   ```

   Nomor ini adalah **satu-satunya sumber kebenaran**. Semua tombol WhatsApp di halaman tidak memiliki nomor hardcoded di `index.html` — mereka memakai atribut `data-wa-message` lalu diisi oleh `initWhatsAppLinks()`.

2. **Nama brand.** Ganti "Perumahan Sukoharjo" di `index.html` (navbar, hero, footer, metadata) dengan nama perumahan resmi. Perbarui juga `og:title`, `og:description`, dan `og:url`.

3. **Gambar.** Ganti lima file di `assets/images/` dengan foto proyek asli:

   | File | Digunakan untuk |
   | --- | --- |
   | `hero-house.jpg` | Hero Section |
   | `house-1.jpg` | Tipe Minimalis |
   | `house-2.jpg` | Tipe Modern |
   | `house-3.jpg` | Tipe Premium |
   | `testimonial.jpg` | Avatar placeholder testimoni |

   Gambar saat ini adalah **ilustrasi stok**, bukan foto proyek. Sesuaikan `alt` text dengan foto baru.

4. **Data produk dan harga.** Di `js/script.js`, ganti array `products` (luas tanah, luas bangunan, kamar, spesifikasi) dan `pricing` (harga, `dp`, `payment`) dengan data resmi developer. Hapus awalan "Contoh:" pada `dp` dan `payment` setelah datanya valid.

5. **Testimoni.** Array `testimonials` berisi **placeholder anonim** (`Pelanggan contoh 1` dan seterusnya) dengan label "Contoh testimoni — ganti dengan testimoni pelanggan asli". Ganti dengan kutipan pelanggan nyata yang **sudah mendapat izin**, lalu hapus `TESTIMONIAL_LABEL` dan `.testimonial-label` jika tidak diperlukan.

> Harga, DP, metode pembayaran, dan spesifikasi dapat berubah sewaktu-waktu sesuai ketersediaan unit dan ketentuan developer.

## Cara Kerja WhatsApp

- Setiap tombol WhatsApp memakai atribut `data-wa-message="..."` di `index.html` (atau dihasilkan oleh `renderProducts()` / `renderPricing()` di `js/script.js`).
- Saat halaman dimuat, `initWhatsAppLinks()` mengubah `href` menjadi `https://wa.me/<CONFIG.whatsappNumber>?text=<pesan terenkode>`.
- **JavaScript diperlukan** agar tombol WhatsApp menuju nomor marketing: tanpa JS, `href` tetap `https://wa.me/` (halaman umum) dan kartu produk/harga tidak dirender. Ini disengaja agar nomor hanya tersimpan di satu tempat.
- Form kontak divalidasi oleh `validateForm()`; jika valid, form membuka WhatsApp dengan pesan berisi nama, telepon, tipe, dan pesan tambahan. Form **tidak menyimpan data ke server** — diperlukan backend atau layanan formulir eksternal untuk menyimpan leads.

## Fitur

- Tujuh section utama: Hero, Tentang Kami (Problem & Solution), Tipe Rumah, Keunggulan, Testimoni, Harga, Kontak/CTA.
- Navbar sticky dengan smooth scroll dan highlight section aktif.
- Menu mobile (hamburger) dengan `aria-expanded` / `aria-controls`.
- Kartu produk, testimoni, dan harga dirender dari data di `js/script.js`.
- Tombol WhatsApp di hero, navbar, kartu produk, kartu harga, CTA, footer, floating button, dan form.
- Validasi form inline + ringkasan error yang menerima fokus.
- Skip link, fokus terlihat, dukungan `prefers-reduced-motion`, target sentuh minimal 44px.
- Lazy loading gambar di bawah hero, metadata SEO, dan Open Graph.

## Struktur Folder

```text
sukoharjo-property/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── hero-house.jpg
│       ├── house-1.jpg
│       ├── house-2.jpg
│       ├── house-3.jpg
│       └── testimonial.jpg
├── docs/superpowers/
│   ├── specs/     # desain & keputusan
│   ├── plans/     # rencana implementasi
│   └── sdd/       # ledger eksekusi
├── tests/
│   └── site.test.mjs
└── README.md
```

## Verifikasi

Jalankan pemeriksaan statis tanpa dependensi:

```bash
node --test tests/site.test.mjs
```

Pemeriksaan mencakup: CONFIG dan nomor WhatsApp terpusat, tidak ada nomor hardcoded di HTML, semua gambar ada dan punya `alt`, tidak ada emoji sebagai ikon, SVG memiliki penanganan aksesibilitas, testimoni berlabel placeholder, info DP/payment hadir, form jujur dan tervalidasi, serta skip link / reduced motion / target sentuh.

## Responsive Breakpoints

- Desktop: 1440px
- Laptop: 1024px
- Tablet: 768px
- Smartphone: 375px–430px

## Teknologi

HTML5 semantik, CSS3 (custom properties, Flexbox, Grid, media queries), Vanilla JavaScript ES6+, Google Fonts (Poppins & Inter).
