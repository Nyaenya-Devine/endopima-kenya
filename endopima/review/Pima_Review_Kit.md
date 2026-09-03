# EndoPima — PIMA Review Kit (V1.0)

**Instrument version being reviewed:** V1.0 (the version live in `index.html`, v0.3)
**Purpose:** to get structured clinical feedback on the PIMA symptom-priority screener from Kenyan clinicians (gynaecologists, endometriosis specialists, CHP supervisors) and people who live with these symptoms.
**Time for a reviewer:** ~15–25 minutes. The feedback form is at the end — you only need to fill the parts you have an opinion on.

> ⚠️ Everything in this kit is **prototype decision-support logic — not clinically validated, not a diagnosis, not a medical device.** The goal of this review is to make the instrument *better and more defensible* — not to claim it is validated.

---

## 1. What PIMA does (as shipped)

- A **24-question symptom-priority screener** in 5 groups (A–E), answered in ~3 minutes, in English or Kiswahili, at any time, with a natural switch between languages.
- Each answer carries a **weight**; the answer weights are summed and divided by the theoretical maximum (190) to produce a **0–100 priority score**.
- A **separate 3-item safety check** is analysed **independently of the score**. Any “Yes” on the safety check overrides the band → **URGENT** (go to a facility now).
- Output is a **care-priority flag** (LOW / MODERATE / HIGH / URGENT) — deliberately *not* a diagnosis and never a probability.

### Bands (as shipped)

| Band | Rule | Message shown |
|---|---|---|
| 🟢 LOW | score < 30, no safety flags | Continue monitoring and education; re-check if pain changes or worsens |
| 🟠 MODERATE | 30–59, no safety flags | Consider discussing persistent symptoms with a health professional; use the Endo Passport to prepare |
| 🔴 HIGH | ≥ 60, no safety flags | Arrange clinical assessment (see Thibiti for what to ask/bring) |
| 🚨 URGENT | any safety question answered “Yes” | Go to the nearest health facility now — this overrides the score |

**Score formula (as shipped):** `score = min(100, round(100 × Σanswer-weights / 190))`.
“Major contributors” = the up-to-6 highest-weighted answers (weight ≥ 6), shown on the result card so the user sees **why** the flag looks the way it does.

---

## 2. The instrument — question by question

Weights (w) are the prototype weights. **The three most important review questions for every item:** (1) is the wording clear & non-leading? (2) is the weight sensible? (3) does the Kiswahili mean the same thing?

### Group A · Your pain *(6 questions)*

| # | Question (EN) / (SW) | Options (w) | Rationale & review note |
|---|---|---|---|
| 1 | How old are you? / Una umri gani? | Under 18 (0) · 18–24 (2) · 25–34 (3) · 35–44 (2) · 45+ (1) | Context, not a symptom. Peaks 25–34 (typical symptomatic presentation age band). **Note:** does the <18 branch need special handling in your view? |
| 2 | How bad is your period pain? / Maumivu ya mwezi ni makali kiasi gani? | Mild — painkillers usually work (0) · Moderate — sometimes I miss school/work (10) · Severe — I regularly miss school/work, painkillers don't help (20) | Highest-weight single item. Resistance to simple analgesia + activity loss is the strongest everyday signal. **Note:** wording assumes access to painkillers — is that fair for all users? |
| 3 | How long have your periods been this painful (or getting worse)? Painful duration | <6 months (2) · 6–12 months (4) · 1–3 years (8) · >3 years (12) | Progressive/chronic pattern. **Note:** is 6 months the right floor, or should shorter-but-worsening be weighted more? |
| 4 | When does the pain happen? | Mostly during my period (0) · Starts before my period and lasts after it (6) · Throughout most of the month (10) | Cyclicity pattern: premenstrual + postmenstrual and non-cyclic pain are the strongest discriminators. |
| 5 | Pelvic pain at other times of the month (not just during your period)? | No (0) · Sometimes (5) · Often (10) | Non-menstrual pelvic pain is a core signal. |
| 6 | Pain when passing stool, especially during your period? | No (0) · Yes (10) | Dyschezia — classical associated symptom. **Note:** does “especially during your period” lose pain that is constant? |

### Group B · Associated symptoms *(6 questions)*

| # | Question (EN) / (SW) | Options (w) | Rationale & review note |
|---|---|---|---|
| 7 | Pain when passing urine, especially during your period? | No (0) · Yes (8) | Dysuria cyclical pattern. |
| 8 | Pain during or after sex? | Never / not applicable (0) · Sometimes (4) · Often or always (8) | Deep dyspareunia. **Note:** “not applicable” option is deliberate for younger/not-active users — is it adequate? |
| 9 | Very heavy or very long periods (7+ days, or changing every 1–2 hours)? | No (0) · Yes (6) | Heavy menstrual bleeding. **Note:** “changing every 1–2 hours” — standard enough? |
| 10 | Troublesome bloating around your period? | No (0) · Yes (4) | Bloating — common but low specificity; low weight. |
| 11 | Constipation or diarrhoea that gets worse with your period? | No (0) · Yes (5) | Cyclical GI symptoms. |
| 12 | Does tiredness/exhaustion limit your daily life? | No (0) · Sometimes (3) · Often (6) | Fatigue/impact — moderate weight. |

### Group C · History & family *(3 questions)*

| # | Question (EN) / (SW) | Options (w) | Rationale & review note |
|---|---|---|---|
| 13 | Trying to conceive 12+ months without success? | Not trying (0) · No (0) · Yes (12) | Subfertility history. **Note:** “12+ months” may be too long in some age bands — clinical view? |
| 14 | Anyone in your close family with endometriosis (mother, sister, aunt)? | No / I don't know (0) · Yes (10) | Family history — significant signal. **Note:** most Kenyans cannot know this; the “I don't know” path is important. |
| 15 | Treated for a pelvic condition before (e.g. PID, ovarian cyst, fibroids)? | No / not sure (0) · Yes (3) | Prior pelvic pathology — low weight but useful context. |

### Group D · How it affects your life *(3 questions)*

| # | Question (EN) / (SW) | Options (w) | Rationale & review note |
|---|---|---|---|
| 16 | In a typical month, how many days does pain stop you from normal activities? | 0 (0) · 1–2 (6) · 3–5 (12) · 6+ (18) | Days lost — the single strongest “life impact” measure. |
| 17 | How often does pain affect school or work? | Never (0) · Sometimes (6) · Often (12) | Functional impact; school-specific framing matters for adolescents. |
| 18 | Does pain disturb your sleep? | No (0) · Sometimes (3) · Often (6) | Sleep disruption. |

### Group E · Your healthcare journey so far *(6 questions)*

| # | Question (EN) / (SW) | Options (w) | Rationale & review note |
|---|---|---|---|
| 19 | Have you previously sought medical care for these symptoms? | No (0) · Yes (4) | Care-seeking history. |
| 20 | About how many healthcare visits for these symptoms? | None yet (0) · 1–2 (2) · 3–5 (5) · 6+ (8) | Repeated visits without resolution — a proxy for diagnostic delay. |
| 21 | What explanation were you given before? | Nothing specific (0) · A common condition (e.g. malaria, typhoid, ulcers, stress) (3) · Possibly a pelvic condition (2) · Not sure (1) | Previous explanations received. **Note:** wording is deliberately neutral — the app never accuses clinicians. Is “malaria, typhoid, ulcers, stress” the right example set for Kenya? |
| 22 | What treatment did you receive? | None (0) · Painkillers only (0) · Hormonal treatment (1) · Other (1) | Treatment history — low weight, mostly descriptive. |
| 23 | Did the treatment help? | Not applicable (0) · Yes, it helped (2) · Little or no help (8) | Poor response to prior treatment — meaningful signal. |
| 24 | Were you ever referred to a specialist? | No (0) · Yes (3) | Referral pathway. |

### ⚠️ Safety check (separate, always analysed independently of the score)

| # | Question (EN) / (SW) | Weight |
|---|---|---|
| S1 | Sudden, very severe pelvic or abdominal pain — different from your usual pain / Maumivu ya ghafla makali sana ya fupanyonga au tumbo — tofauti na kawaida yako | Any “Yes” → URGENT |
| S2 | Pelvic pain together with fever / Maumivu ya fupanyonga pamoja na homa | Any “Yes” → URGENT |
| S3 | Very heavy bleeding making you dizzy, faint or breathless / Damu nyingi sana zinazokufanya uzunguke, uzime au ukose pumzi | Any “Yes” → URGENT |

**Review note on safety:** should any of these be split (e.g., S1 “different from your usual pain” could miss a first-ever severe episode — is the wording right)? Are there missing red-flag items an adolescent should be asked (permission: keep it short — the safety tier must stay fast)?

---

## 3. Design positions we already hold (review these too)

1. **No diagnosis, no probability.** Output is a care-priority flag. We will not add “likelihood of endometriosis” text under any circumstances.
2. **Not a gate.** The tool never withholds information or reinforces a single path (laparoscopy is *not* framed as mandatory; the Thibiti pathway says clinical assessment and appropriate imaging come first).
3. **Neutral about past care.** Option text never implies misdiagnosis by health workers.
4. **Plain Kiswahili.** No Sheng; medical terms kept minimal (e.g. “fupanyonga” for pelvis).
5. **Safety beats score.** URGENT overrides everything, and the app says so in plain words.
6. **Devices & ages.** The app is used by young women and people in pain: short questions, large targets, no required reading level above ~Grade 6.
7. **Everything local-first.** No data leaves the device unless the user connects cloud sync — and research participation is always optional.

---

## 4. Feedback form (copy into an email / print & annotate)

**Reviewer:** ______________  **Role:** ☐ Gynaecologist ☐ Endo specialist ☐ Nurse/CHP supervisor ☐ Patient-org rep ☐ Other ____  **Date:** ______

### A. Per-question verdicts (tick or write “—” if you have no comment)

| # | Keep as-is | Reword | Remove | Comment (what and why) |
|---|---|---|---|---|
| 1 | ☐ | ☐ | ☐ | |
| 2 | ☐ | ☐ | ☐ | |
| … (copy rows 1–24 + S1–S3) | | | | |

### B. Scoring

- Are the weights broadly sensible? Which single question is most over-weighted / under-weighted?
- Is 30/60 the right split for LOW/MODERATE/HIGH? Should URGENT have intermediate rules (e.g., S2 with no fever history)?
- Should the score be called a **priority indicator** or renamed (we will not rename it into a probability)?

### C. Translation check (Kiswahili)

Any option or question that reads wrong in Kiswahili? (e.g. “fupanyonga”, “haja kubwa”, “haja ndogo”, “virutubisho” — list exact items.)

### D. Safety check

Add / remove / reword any red-flag items?

### E. Anything we are missing that matters in Kenya

(Cultural, school-age, faith, privacy-with-family, cost-related, or health-system realities we should adjust for.)

### F. Overall verdict

☐ Fit for a supervised usability pilot once comments are incorporated
☐ Fit after *minor* changes (list them)
☐ Needs substantial revision before any testing (what first?)

**Signed:** ______________  **Contact:** ______________

---

## 5. Change log

| Date | Version | Change | By |
|---|---|---|---|
| 2026-09-03 | V1.0 | Instrument as shipped in app v0.3, documented for review | EndoPima build |

*After review, V1.1 will list each accepted change and re-issue this document before any field testing.*
