# EndoPima — Future Steps (ARCHIVE — project is now COMPLETE, v1.0, 3 Sep 2026)

> **Status: not required.** Everything below is optional, needs other people, and is only relevant **if** the prototype is ever taken beyond a labelled demo. The delivered project is finished: see `PROJECT_COMPLETE.md`.

Four readiness packages, built in one pass, each in this folder. They are designed to run **in this order**:

```
  ① Clinical review  →  ② Field usability  →  ③ Ethics gate  →  ④ Pilot
     (you are here)        (needs ① done)        (before ANY      (ethics +
                                                   real data)       approvals)
  ④ Deploy: any time (independent, ~10 min, free)
```

| # | Package | File | What it's for | Who does it |
|---|---|---|---|---|
| ① | **Pima Review Kit** | `review/Pima_Review_Kit.md` | The exact 24 questions + weights + safety logic + bilingual sheet + a 15-min feedback form, ready to send to 2–3 Kenyan clinicians and one patient-org rep | You send it; we fix what comes back |
| ② | **CHP Usability Kit** | `review/CHP_Usability_Kit.md` | Script + task list + observation grid + safeguarding for 2–3 CHPs and 6–8 young women (EN/SW) | You run (or recruit for) it; we fix the app |
| ③ | **Ethics & Consent Roadmap** | `review/Ethics_Consent_Roadmap.md` | ODPC registration (mandatory for health), DPIA, NACOSTI-accredited IRB + licence, county/MOH engagement, model EN/SW consent wording — with verified references | You & (later) a Kenyan research partner |
| ④ | **Deploy Guide** | `deploy/DEPLOY.md` | GitHub Pages (6 steps, free) or Netlify Drop → real shareable link + “first real feature” decision menu | You (10 min, no code) |

## Immediately actionable (this week)
1. **Deploy (④):** 10 minutes with a free GitHub account → a real link to send to anyone.
2. **Review round (①):** send the review kit to 2–3 clinicians (KOGS members, a gynaecologist you know, Endo Sisters East Africa). Promise them ≤ 20 minutes.
3. **If you want a pilot later:** read ③, then line up a Kenyan research partner (university, KEMRI, or a county health office) — the ethics + county path runs on their institutional backing.

## What the app itself should NOT change before ①
- The score/weights stay as-is until clinicians weigh in (that's the point of the kit).
- No real-data collection, no new integrations, no “validated” language — the current honest labelling is the correct posture.

## Backlog candidates (for after ① completes)
- Instrument V1.1 (incorporate clinical feedback) + app version bump
- Cloud sync behind an explicit, EN/SW consent flow
- CHP-vetted “known good” facility list for the Thibiti directory (with county health team)
- A real USSD shortcode evaluation (costed, Africa's Talking-style gateway)
- County pilot plan (partner + ethics + 6-month timeline per ③ §2.9)
