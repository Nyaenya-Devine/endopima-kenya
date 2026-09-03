# EndoPima — Deploy Guide & Shareable Link (V1.0)

## ✅ DONE — already live (3 Sep 2026)

**https://endopima-kenya.surge.sh** — deployed, verified HTTP 200, full app.
Updating it later: see `HOSTING_ACCOUNT.txt` (throwaway surge.sh account). The steps below document the alternatives (GitHub Pages / Netlify) if you ever want the link on your own account or domain.

---
**Goal:** put the app online so it has a real, public, HTTPS link you can send on WhatsApp — in ~10 minutes, for free, without changing the single-file architecture.

**What we are deploying:** exactly `index.html` — one file, zero build step, no dependencies, everything (CSS, JS, images, data) inline. That is what makes this fast.

---

## Option A — GitHub Pages (recommended, 6 steps)

1. Create a free account at github.com (if you don't have one).
2. New repository → name it `endopima` → **Public** → Create.
3. Upload: drag & drop `index.html` into the repo's root (keep the file at the root, not in a folder). Add the `backend/` and `review/` and `deploy/` folders too if you like.
4. Settings → **Pages** (left menu) → Source: **Deploy from a branch** → Branch: `main` / folder: `/ (root)` → Save.
5. Wait ~1–2 minutes. Your link appears at the top: `https://<your-username>.github.io/endopima/`
6. Test it on your phone.

**Notes**
- Updating the app later = upload the new `index.html` (overwrite) → Pages redeploys automatically.
- Pages serves over HTTPS ✓
- Custom domain later (Settings → Pages → Custom domain, e.g. `endopima.co.ke`) — a `.co.ke` domain costs ~KES 1,000–2,000/yr from KeNIC-accredited registrars.

## Option B — Netlify (fastest if you prefer drag-and-drop)

1. app.netlify.com → sign in (GitHub/Google) → **Add new site → Deploy manually**.
2. Drag the `endopima` folder (or just the file) onto the drop zone.
3. Site name → `endopima.netlify.app` (or rename). Done in ~30 seconds.
4. Redeploy later: drag the new file again, or connect the GitHub repo for automatic deploys.

## Option C — Vercel / Cloudflare Pages

Both work identically for a static single file (import the repo → framework preset: “Other” → deploy). Cloudflare Pages is also free with generous limits.

---

## Post-deploy checklist

- [ ] Opens on Android (low-end device) and iPhone, in Chrome + Safari
- [ ] English ⇄ Kiswahili toggle works (it re-renders *everything*)
- [ ] `prefers-reduced-motion` on the phone (Accessibility settings) → animations stop
- [ ] Open the link in WhatsApp preview → title/emoji look right (they will; everything is inline)
- [ ] Breathing pause, resume-box, Village USSD, Dada chips all work from the hosted link (same code — but test anyway)
- [ ] The status badge still says **DEMO — on-device storage only** (true until you connect cloud sync; keep it true)

---

## What should become “real” first? (decision menu)

Ranked by (value × feasibility) for a prototype at this stage — pick **one**, then wire it:

| Candidate | Effort | Risk | Note |
|---|---|---|---|
| **1. Cloud sync toggle (wired, nearly ready)** | ~1 day | Low | `Supabase.config` + adapter already in the file; docs: `backend/README.md`, schema: `backend/supabase_schema.sql`. Only after a privacy policy exists (see Ethics roadmap §1.8) |
| 2. Passport share/print (already real, on-device) | small polish | None | Works today; consider .pdf export |
| 3. Anonymous “How many checked today?” counter page | ~1 day | Low | A public, aggregate, no-personal-data heartbeat — not research data |
| 4. CHP roster dashboard as a real small DB (county pilot) | ~1–2 weeks | Medium | Needs county engagement + ethics path before real names |
| 5. Real USSD (via a gateway like Africa's Talking) | ~1–2 weeks + cost | Medium | Replaces the simulation honestly with a paid USSD shortcode — but needs the clinical review round first |
| 6. eCHIS / SHA integration | weeks–months | High | Needs formal MOH/SHA relationship. Do **not** claim it until it exists |

**Recommended sequence:** deploy now (Option A) → finish the clinical review round → fix the instrument to V1.1 → then cloud sync behind explicit consent → then a supported CHP session using `review/CHP_Usability_Kit.md`.

---

## Hosting honesty

This guide deploys the *demo*. The app still: is not connected to any real health system, has no live USSD/eCHIS/SHA/M-Pesa integration, and its statistics are demonstration data. Deploying it does not change any of that — and the app says so on every relevant screen.
