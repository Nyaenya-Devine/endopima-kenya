# EndoPima — Kupima Mapema (Check Early)

**A community-first endometriosis early-recognition, care-navigation, affordability and health-intelligence platform concept for Kenya.**

> Prototype **v1.2** — single-file, zero-setup, bilingual (English ⇄ Kiswahili), mobile-first, fully self-contained.
> v1.2 = final pre-human-verification refinement: woman-first first screen, personal hierarchy (me → symptoms → story → next step → care), ecosystem content secondary, statistics with provenance, 5 embedded illustrations.
> 🟢 **Live demo:** https://nyaenya-devine.github.io/endopima-kenya/ (project complete — see `PROJECT_COMPLETE.md`; previous surge.sh hosting abandoned)
> Based on the research report: `../Endometriosis_Kenya_Research_and_Idea.md`

---

## 🧭 What's inside (v1.0)

| Area | Features |
|---|---|
| **Habari** | Hero (evidence-conscious messaging), **living interface** — floating petals, drifting pastel blobs, typewriter reassurance line (EN⇄SW live), count-up stats, breathing CTA, shimmering kanga stripe, flywheel — 4-stage pipeline, myth/fact system, "Why Kenya" with assets perspective, **potential-partner ecosystem**, honest roadmap |
| **Pima** | *(framed as \"let's make sense of what you're experiencing\"; result is human: \"what your answers tell you\" + \"what you can do next\", no big scary gauge)*  24-question grouped screener (pain → associated symptoms → history → impact → healthcare journey) + **separate 3-item safety check** → visual symptom-priority indicator (0–100), LOW/MODERATE/HIGH/URGENT bands with icons + text, major contributors, "what this does NOT mean" box, referral actions · **calm breathing pause before starting** (skippable, reduced-motion aware) · **resume-where-you-left-off** (on-device only, gentle warning before starting fresh) |
| **Pasipoti** (Endo Passport) | Symptom timeline builder (add/delete), symptom & impact chips, previous-care records (facility, date, treatment, response, referral), investigations log ("record only what you were told"), **My Doctor Summary** (one-page printable, downloadable .txt, share via phone), appointment-preparation checklist |
| **Thibiti** | Care-pathway visual ("not a straight line; surgery not mandatory"), **Find My Next Step** (location + need → facility type + demo facilities), filterable demo care directory, community support |
| **Fanya** | **My Care Cost** builder (9 categories, illustrative ranges, SHA caveats), **PimaPocket** savings planner (goal/current/monthly + 3 contribution scenarios), **Future Endo Care Fund** concept (clearly not operational) |
| **Observatory** | Care funnel, diagnostic-journey/care-gap chart, age & symptom patterns, school/work impact, county equity table — **every number labelled DEMONSTRATION DATA** |
| **Shule** | Learn lessons (5), expanded quiz (8 Q with explanations), **story-scenario game** (3 scenarios), optional attendance tracker (device-only) |
| **Jamii** | **Village Mode** (interactive USSD/feature-phone simulation), **CHP Mode** (7-step workflow: identify → explain → consent → screen → guidance → referral → track, demo dashboard + roster + nav flags), **Dada Navigator** (mock peer-navigation chat with quick-reply chips) — **both languages re-render live, no matter when you switch** |
| **Safari** (My Journey) | Current stage, symptom-flag summary, next recommended action, appointments, referrals, **"How are you doing?"** follow-up engine, **"Are you stuck?"** navigation-failure detection |
| **Zaidi** | Evidence & limitations, **Future Lab** (AI ultrasound / biomarkers / Kenyan AI model — all RESEARCH/FUTURE), research-consent demo, **consent centre + privacy dashboard**, roadmap |

## 🏷️ Trust architecture (used everywhere)

- **LIVE** (green) — only for on-device actions that genuinely work
- **DEMO** (amber) — fictional data / simulated features
- **CONCEPT** (violet) — proposed workflows (e.g., EndoNurse clinic, Endo Care Fund)
- **RESEARCH** (blue) — future technology (AI ultrasound, biomarkers, Kenyan AI model)
- **PROTOTYPE** (neutral) — unvalidated logic (e.g., the risk score)

## ⚠️ Honest limitations (also on the Evidence page in-app)

- **Not a medical device.** The score is described as a *symptom-priority indicator* — never a diagnosis.
- Risk logic is **prototype decision-support — not clinically validated**. No accuracy claims.
- All Observatory statistics are **fictional demonstration data**, not Kenyan prevalence.
- Care directory is **not live**; no availability or quality implied.
- No real USSD, eCHIS, SHA, M-Pesa or hospital integration (labelled as simulations).
- All motion is decorative and **fully disabled for `prefers-reduced-motion` users** (typewriter falls back to static text, stats show final values, no reveal animations).
- No partnerships claimed — ecosystem listings say "potential partners".
- Data is stored **only in your browser** (localStorage with in-memory fallback); nothing is collected or sent. Research consent is a concept demo.

## 🏗️ Architecture notes

Single-file prototype with clean separation, ready to be swapped for a real backend:

- **I18N** — `data-i18n` attributes + `L(en, sw)` helper; every dynamic view re-renders on language switch
- **Store** — safe storage adapter (localStorage with memory fallback for sandboxed contexts)
- **DemoData** — one centralised fictional dataset; all charts read from it (never scatter fake numbers)
- **API** — mock service layer (screening, passport, consent, journey, attendance, research) with documented conceptual data models (User, Consent, Screening, EndoPassport, Referral, Appointment, CareJourney, FollowUp, CostPlan, AggregatedRegistryRecord, CHPProfile…)

## 📁 Files

- `index.html` — the entire app (prototype v1.2)
- `backend/supabase_schema.sql` — drop-in Postgres/Supabase schema (tables + RLS notes)
- `backend/adapter.example.js` — no-SDK REST adapter documentation
- `backend/README.md` — how to switch cloud sync ON (off by default; data stays on-device otherwise)
- `../Endometriosis_Kenya_Research_and_Idea.md` — full research report & concept (sources inside)

**Next-steps pack (built 3 Sep 2026):**
- `NEXT_STEPS.md` — master index; the recommended order: clinical review → field usability → ethics gate → pilot (deploy is independent)
- `review/Pima_Review_Kit.md` — the exact 24-question instrument + weights + safety logic + 15-min clinician feedback form
- `review/CHP_Usability_Kit.md` — field-test script, tasks, observation grid & safeguarding for CHPs and users (EN/SW)
- `review/Ethics_Consent_Roadmap.md` — ODPC, DPIA, NACOSTI IRB + licence, county/MOH steps, model EN/SW consent wording (verified refs)
- `deploy/DEPLOY.md` — 10-minute free hosting (GitHub Pages/Netlify) + "first real feature" decision menu

## ▶️ Run

Open `index.html` in any browser. No build, no dependencies, works offline.

## 🗺️ Real-world roadmap (also in-app)

NOW prototype → NEXT clinical co-design → PILOT 1–2 counties → VALIDATE clinically → SCALE counties → RESEARCH Kenyan longitudinal dataset → FUTURE African endometriosis intelligence network.

*Education and navigation concept only — not medical advice, not a medical device.*
