# SDD ledger — plan: docs/superpowers/plans/2026-11-26-landing-page-sukoharjo.md

Setup: inline execution (executing-plans). No worktree and no commits: the
workspace `C:\rumah.opencode` is not a git repository. Ruling: manage this
ledger manually and omit commit steps — the spec's acceptance criteria do not
depend on git history, and inventing a repo would be a side effect outside the
work. Cost if wrong: no per-task commit history to recover from compaction; the
ledger plus test file are the recovery record.

Pre-flight interface scan:
- T1 produces `CONFIG`, `buildWhatsAppUrl` → T4 and T6 consume them. Names match.
- T3 produces `.icon` CSS + `aria-hidden` SVGs → T7 checks skip link/aria-controls, no overlap.
- T4 produces `initWhatsAppLinks()` → T6 consumes `buildWhatsAppUrl`. Match.
- T5 produces labeled testimonial + DP/payment fields → no later consumer.
- T7 produces reduced-motion + tap-target rules → T8 browser-verifies them.
- T2 produces five image files → referenced by existing HTML/JS; no later writer.

Plan defect ruling: Task 6 Step 1 says `script.js` must contain `role="alert"`,
but Step 3 places the error-summary div (with `role="alert"`) in `index.html`.
Ruling: assert `role="alert"` in `index.html` and `.focus()` in `script.js`.
Why: the element belongs in markup; asserting it in JS would pin the wrong
file. Cost if wrong: a regression could move the role into JS without breaking
the test — low, since the browser check in T8 exercises the real behavior.

Rulings I made (chronological):
- Setup: no git repo → manual ledger, no commits. Cost: no commit history.
- Task 6: error-summary role asserted in index.html, not script.js. Cost: low.
- Task 1: kept a temporary `WHATSAPP_NUMBER = CONFIG.whatsappNumber` alias so
  the page still runs between tasks; removed in Task 4. Cost: a stale alias if
  Task 4 is skipped.

Task 1: complete — `node --test tests/site.test.mjs` → pass 2 (CONFIG,
buildWhatsAppUrl), fail 3 (deferred to Tasks 4 and 5, as the plan's Step 4
expects). RED observed first: pass 0 / fail 5.

Task 2: complete — `node --test tests/site.test.mjs` → pass 4 / fail 5;
`all five local image assets exist and are non-trivial` PASS. RED observed
first for that test. Ruling: `experimental_image_generate` failed for all five
images with `Invalid credential` (provider not authorized in this environment;
not retried per tool rule). Fell back to downloading stable illustrative photo
URLs into the same local `.jpg` paths via `Invoke-WebRequest`. Cost: images are
stock illustrations rather than generated-to-order renders — README must say
they are placeholders to be replaced with real project photos. This still
satisfies "local illustrative images, clearly marked".

Task 3: RED observed — `no structural emoji icons` and `accessible inline SVG
icons` both FAIL, pass 4 / fail 5. Ruling: the plan required "at least 10"
SVGs but the scaffold had exactly 9 emoji instances to replace (navbar logo,
6 benefit icons, footer logo, floating button). Set the test threshold to 9.
Cost: none — 9 is the exact inventory; all 9 carry aria-hidden="true".

Task 3: complete — `node --test tests/site.test.mjs` → pass 6 / fail 3;
both icon assertions PASS. Remaining failures belong to Tasks 4 and 5.

Task 4: RED observed (tests 3, 4, 10, 11 failed) then complete — `node --test
tests/site.test.mjs` → pass 10 / fail 1 (test 5 belongs to Task 5).
Ruling: test 11 originally asserted `CONFIG.messages.consultation` in JS, but
the copy now lives in HTML `data-wa-message` fallback attributes; assert the
`messages.consultation` / `messages.survey` CONFIG keys instead. Cost: none —
the runtime still uses CONFIG as the number source of truth.
Ruling: kept the `WHATSAPP_NUMBER` alias until Task 6 rewrites the form; it is
now used only there. Cost: one stale alias until Task 6 lands.
Added an eighth CTA ("Masih bingung memilih tipe?") in the product section to
satisfy the ≥8 anchor count and the PRD's "CTA after product info" strategy.

Task 5: RED observed (tests 5, 12, 13 failed) then complete — `node --test
tests/site.test.mjs` → pass 13 / fail 0. No rulings beyond the already-ledgered
decision to use anonymous "Pelanggan contoh" placeholders.

Task 6: RED observed (tests 14, 15 failed) then complete — `node --test
tests/site.test.mjs` → pass 15 / fail 0. The temporary WHATSAPP_NUMBER alias
was removed here (not Task 4 as originally planned) because the old form still
used it; the form now builds its URL through buildWhatsAppUrl(). No false
"Pesan terkirim!" claim remains.

Task 7: RED observed (tests 16, 17 failed) then complete — `node --test
tests/site.test.mjs` → pass 17 / fail 0. Full suite green. No rulings.

Task 8: complete. README rewritten as the single 5-item publish checklist.
Browser verification over a local static server (the in-app browser rejects
`file://` URLs): 8 sections inside `<main>`, 14 hydrated WhatsApp links all
pointing at the configured number, 3/3/3 cards, zero console errors, zero
horizontal overflow at the available 912px viewport, all 8 images load when
eagerly requested, hamburger open/close toggles `aria-expanded`, invalid form
submit focuses a 2-item error summary, valid submit opens the correct wa.me
URL and shows truthful copy. Lighthouse: accessibility 1.0, best-practices
1.0, SEO 1.0, zero failures. `node --test tests/site.test.mjs` → pass 24 /
fail 0.

Final review (fresh general-purpose subagent): no Critical. Important fixes
applied: (1) README's false "no-JS fallback" claim removed — JS is required;
(2) added executable vm-based tests for URL encoding and validation instead
of source-text-only checks. Re-graded from Minor to Important and fixed:
garbage phone numbers with no digits were accepted; stale success/summary
state could show both messages. Other applied minors: scroll-margin-top for
the sticky nav, correct OG image dimensions, and alt text that no longer
overstates stock images as real project photos.

Final: Ruling: skip link stays `href="#home"` — the plan pins that target and
the hero is the main content start; cost is a less precise focus landing.
Final: Ruling: left `lastScrollY`, unused `firstInvalid`, the no-op
`initLazyLoading()` fallback, and popup-blocker handling unchanged — none
affect the PRD's acceptance criteria; cost is minor dead code and no fallback
if a browser blocks the WhatsApp popup.
Final: Ruling: 375px was not directly emulated — the browser tool exposes no
viewport resize; responsive behavior was verified via the pinned breakpoint
rules and the 912px browser pass; cost is a residual risk at 375px.

Final review: fresh subagent review (see above); all Critical/Important
findings fixed with tests that failed first; final suite 24/24 green and
Lighthouse 1.0/1.0/1.0 with zero failures.
