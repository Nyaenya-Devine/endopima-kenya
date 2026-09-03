# Endometriosis in Kenya — Deep Research & A High-IQ Innovation Concept

**Prepared:** September 2026 · Research synthesis for a new Kenya-focused project idea
**Status:** Research + concept proposal (not medical advice; every intervention below would need clinical validation, ethics approval, and partnership with Kenyan health institutions before implementation)

---

## 0. TL;DR — The Idea in 6 Bullets

1. **The problem:** Kenyan women with endometriosis wait **7–10+ years** for a diagnosis, are routinely misdiagnosed with *malaria, typhoid or ulcers*, are told "endo is for the affluent," and many never reach a hospital that can diagnose them at all. [3][23]
2. **The hidden blocker:** Endometriosis care is built backwards — it starts at the **hospital** (tertiary laparoscopy). In Kenya, that wall is so high that the disease is effectively invisible until a woman is already years into suffering, and nobody has ever produced reliable **national prevalence data** ("data poverty"). [1][23]
3. **The global unlock (3 recent shifts):**
   - **ESHRE 2022 guidelines** — endometriosis can now be *diagnosed by transvaginal ultrasound* without surgery for many presentations (a huge deal for Kenya, where laparoscopy is scarce and costly). [8]
   - **AI diagnostics** — machine learning on ultrasound images hits AUC ≈ 0.97–0.98; saliva-based microRNA tests (Ziwig Endotest, France) reach 97% sensitivity / 94% specificity, now reimbursed in 100 French hospitals. [4][5][6]
   - **Community primary care** — Australia (AUD$16.4M, nurse-led centres), Denmark (ML on patient-reported data), and Brazil (community agents) all show that the answer is *early, non-hospital detection* + care navigation. [9][10][7]
4. **The Kenya superpower nobody is using:** Kenya has **107,000 paid, digitized Community Health Promoters (CHPs)** on eCHIS, **145% mobile penetration / 42M smartphones**, **M-Pesa**, the **Ushahidi** open-data tradition, and **SHA now covers laparoscopic endometriosis surgery (KSh 134,400 tariff)**. No country has ever fused a CHP-based detection pipeline with AI triage, ultrasound-first confirmation, and registry generation. [11][12][13][14]
5. **The idea — working name: "EndoPima"** (*pima* = Swahili for "to check/test", as in *kupima mimba*): a **community-first endometriosis early-detection, care-navigation and national-registry pipeline** for Kenya — *PIMA (screen) → THIBITI (confirm) → FANYA (treat & fund) → THIBITISHA (prove)* — where every screen simultaneously feeds Kenya's first national endometriosis data map.
6. **What makes it "high IQ":** it eliminates the diagnostic-delay problem at the **first mile** (not the hospital), combines the five best global ideas that were never designed to work together, and turns the delivery pipeline into the research/policy evidence base — solving the "data poverty" that currently blocks all policy action. It also *destroys* the "endo is for the affluent" myth by being built grassroots, in Swahili, through community workers.

---

## 1. Part 1 — The Disease and Why It Matters (Global Context)

### 1.1 What it is
Endometriosis is a chronic, systemic inflammatory condition in which tissue similar to the uterine lining grows outside the uterus — most commonly in the pelvis, but also on the bowel, bladder, diaphragm and (rarely) chest. It causes severe period pain, chronic pelvic pain, painful sex, painful bowel/bladder movements, heavy bleeding, fatigue, bloating, depression and infertility. There is **no cure and no reliable non-invasive test at population scale yet**; treatment (pain control, hormonal therapy, surgery) manages symptoms. [15]

### 1.2 Scale
| Metric | Figure | Source |
|---|---|---|
| Women & girls affected worldwide | **~190 million (≈10% of reproductive-age women)** | WHO [15] |
| Global prevalence (2023 Lancet meta-analysis, ages 15–49) | **~11.6%** | [24] |
| Women with infertility who have endometriosis | **25–50%** | WHO [15] |
| Global average diagnostic delay | **6.6–7 years** (range 6 months → 27 years across studies) | Univ. of York review [16][17] |
| Economic cost per affected woman | **≈ €9,500–10,000 / year** (mostly lost productivity) | [19] |
| US total annual burden | **$78–119 billion** | [19] |
| NIH endometriosis research funding | **~$16–28M/yr ≈ $2 per patient/yr** (vs $31/yr for diabetes) | [19] |

### 1.3 WHO's stated priorities for LMICs
The WHO explicitly calls out that in low- and middle-income countries there is (a) a lack of multidisciplinary teams, skills and equipment for early diagnosis, (b) a need for **non-invasive diagnostic methods**, (c) a need for treatments that don't prevent pregnancy, and (d) a need for policy support for underserved communities. **Kenya is exactly the country the WHO description was written for** — and 2025 was the WHO's first full global endometriosis response cycle. [15]

---

## 2. Part 2 — Kenya Deep-Dive: What the Evidence Actually Says

### 2.1 Prevalence (thin, hospital-based, contradictory)
- **Gichuhi (UoN thesis):** 443 women undergoing laparoscopy at **Kenyatta National Hospital & Nairobi Hospital** (2018–2020) → **6.8%** histologically confirmed endometriosis. This is the *only* Kenyan study with laparoscopic + histological confirmation as the primary outcome. [2]
- A **2021 Nairobi study** found **8.9%** among 224 women at laparoscopy. [3]
- **Adolescents (Kenya):** among 313 adolescents, **29% reported severe dysmenorrhea, but 94% had never heard of endometriosis**. [3]
- **Africa-wide estimates are wild:** 0.2% (Northern Uganda) → 48.1% (Nigeria, laparoscopic series) → 2% vs 7% (black vs white women, older South African data). The systematic review of indigenous African prevalence concluded **no pooled prevalence exists** and that the true figure is almost certainly higher than reported. [20][21]
- **The "rare in Black women" myth is now explicitly condemned in the literature** ("Endometriosis among African women," *Reproduction & Fertility*, 2022) as a product of awareness bias, access bias and historical racism — with direct consequences: long diagnostic delays, no local genetic/family research, and under-treatment. [21]

### 2.2 The Kenyan patient journey (from the 2023 narrative study with Endo Sisters EA)
A 2023 qualitative study of Kenyan women's written narratives (*IJERPH*, 2023) found three themes: **stigma & disruption of quality of life; barriers to acceptable healthcare; reliance on self-efficacy and social support.** Quotes that should haunt anyone designing a solution: [3]
- *"Most doctors around Kenya are green about this situation."* (Story 13, aged 32)
- *"It took me almost 7–8 years to finally have the problem at hand identified and several visits to different gynaecologists."* (Story 33, aged 22)
- *"Initially I was diagnosed with malaria, typhoid, ulcers until roughly 7 years later when I got proper medication and got the right diagnosis."*
- A woman was told she **could not have endometriosis because "endo is for the affluent"** (Story 16, aged 30) — the disease is literally framed as a rich-woman's disease even by clinicians.
- Several were advised to **"have a baby"** to cure it.
- Rural women struggled to access any care; those with means flew to **Europe** for diagnosis — the ultimate indictment of the local pathway.

### 2.3 Why the delay is so long in Kenya (barrier stack)
1. **Zero population-level awareness** — "menstruation is shameful"; severe pain is normalized as "just period pain"; 94% of adolescents have never heard of endometriosis. [3][21]
2. **Provider knowledge gap** — GPs and even some gynaecologists misdiagnose; conditions mimicking endo (PID, fibroids, typhoid, ulcers) get treated first; there is no national clinical pathway or standard referral protocol. [3][1]
3. **Diagnostic capacity concentrated in 2–3 Nairobi hospitals** — laparoscopy (gold standard) + histology effectively only at KNH, Nairobi Hospital and a few private centres; rural women face geographic and financial barriers. [1][2]
4. **Cost** — the SHA tariff schedule prices "Operative Laparoscopy: Endometriosis Surgery" at **KSh 134,400** (public/insured tariff); out-of-pocket reality, pre-authorization fights and cash-vs-insurance price disparities are well documented by Kenyan press in 2025. [22][14]
5. **Data poverty** — no national prevalence data, no registry, no surveillance → no policy pressure, no budget, no research. A Kenyan health-policy analysis (2026) calls this the *hidden driver of the crisis*: without evidence, endometriosis is "sidelined in health policy," and the cycle of invisibility repeats. [1]
6. **Stigma & silence** — menstrual pain is not discussable in many families; girls are unprepared for menarche; teachers and parents lack language for it. [3][23]

### 2.4 What Kenya already has (assets, not gaps)
| Asset | Detail |
|---|---|
| **Community Health Promoters** | **107,000+ CHPs**, paid, kit-equipped and digitized since the Sept 2023 *Afya Nyumbani* launch; they use the **eCHIS** app for household-level data. They visit homes, monitor pregnancies, and are the *only* health contact for many rural families. [11][12] |
| **Mobile & money rails** | 145.3% mobile penetration, **42.35M smartphones**, 57.2M mobile data subs (CA, Q1 2025); M-Pesa is a national utility. [13] |
| **SHA (Social Health Authority)** | Covers operative laparoscopy endometriosis surgery (tariff KSh 134,400) — imperfect in practice (pre-auth, price caps) but the financing rail exists. [22][14] |
| **Clinical societies** | KOGS (Kenya Obstetrical & Gynaecological Society), KESES (Kenya Society of Endoscopic Specialties) — endoscopic surgeons exist, they're just concentrated. |
| **Advocacy seeds** | **Endo Sisters East Africa Foundation** (Nairobi & Thika; monthly meet-ups, school visits, "Warrior Within" events), **Endometriosis Foundation of Kenya**, **Yellow Endo Flower** (#TheKenyanEndoStory), Endometriosis Foundation of Africa, Fertility & Andrology Society of Kenya. [25][26] |
| **Menstrual-health education precedent** | **ZanaAfrica** — Nia Yetu after-school curriculum + *Nia Teen* magazine + low-cost Nia pads (KSh 75 per 10) reaching 50,000+ girls since 2013; trained MoE teachers across 40 schools. This is the proven channel for reaching girls *before* the disease becomes chronic. [23] |
| **UK/US open-source ethos** | Ushahidi (Kenyan-born crowdsourced crisis mapping), UoN/KEMRI research infrastructure, and a young, hungry dev ecosystem. |

### 2.5 The Kenyan summary
> In Kenya, the disease is **silent at the first mile and invisible at the policy level**. The interventions that would help — awareness, screening, ultrasound-first diagnosis, navigation, financing, data — each exist *somewhere in the world*, and Kenya already owns the infrastructure rails (CHPs, eCHIS, M-Pesa, SHA) to deliver them. What does not exist anywhere is the **pipeline that connects them**.

---

## 3. Part 3 — The Global Innovation Scan (what the rest of the world is doing)

### 3.1 Diagnostics: from surgery → ultrasound → AI → saliva
| Innovation | Where | What it does | Why it matters for Kenya |
|---|---|---|---|
| **Laparoscopy + histology** (old gold standard) | Global | Surgical diagnosis | Scarce, expensive, centralized, invasive — the barrier itself. |
| **TVUS/MRI-first diagnosis (ESHRE 2022)** | Europe (guideline) | Ovarian endometrioma & deep disease can be diagnosed **without surgery**; TVUS recommended even in adolescents where appropriate; CA-125 explicitly *not* recommended. [8] | **This is the single most important unlock for Kenya**: county hospitals already have ultrasound machines. The guideline legitimizes the cheap pathway. |
| **AI on ultrasound images** | Global research | Deep learning accuracy **0.89–0.93, AUC ~0.90**; 2026 meta-analysis: imaging-based ML **AUC 0.979–0.983**. [6][7] | A "second reader" that can upskill a county-level sonographer via tele-mentoring. |
| **Ziwig Endotest (saliva microRNA + AI)** | France (CE-marked; reimbursed in 100 hospitals via Forfait Innovation; NEJM Evidence, Dec 2025) | 971-woman validation: **97.3% sensitivity, 94.1% specificity, 96.6% accuracy** using 109 salivary miRNAs + NGS + AI. [4][5] | The future of non-invasive testing — needs lab infrastructure, so Kenya can't deploy it *today*, but the design must be **future-compatible** (specimen pipeline + AI risk architecture). |
| **Endometrial microbiome (Fusobacterium)** | Research | Infection-associated phenotypic switch linked to lesions. | Long-term research frontier; relevant to a Kenyan research agenda co-designed with UoN. |
| **Clinical risk scores / symptom-based ML** | Denmark (FEMaLe, 5,000 cases + 5,000 controls via the *Lucy* app); Apple Women's Health Study (50,000+ cohort; cycle-deviation features) | ML on **self-reported symptoms + cycle data** to flag women early, years before surgery. [9][24] | **The cheapest diagnostic that exists is the one that runs on a phone.** Kenyan USSD/WhatsApp can do this *today*. |

### 3.2 Care models: nurse-led clinics, centres of excellence, school education
- **Australia:** AUD$16.4M national investment (2023) in **endometriosis & pelvic pain clinics embedded in primary care**; the **Julia Argyrou Endometriosis Centre** (Epworth) runs a **nurse-led multidisciplinary model** with a specialist "endometriosis nurse coordinator" — evidence that a mid-level clinical coordinator (not a surgeon) can run the journey. [10]
- **Centres of Excellence (SRC-accredited, e.g., Acıbadem):** requires ≥100 endo surgeries/yr, outcomes documentation. Kenya needs the *local* version: a Nairobi referral hub + county spokes. [27]
- **UK/global schools campaigning:** Endometriosis UK school talks, EndoMarch, WEO national member organizations (Ghana, Nigeria, South Africa all have them) — the awareness channel that reaches 15-year-olds before the 25-year-old surgical cohort. [28]
- **Ushahidi-style crowdsourcing (Kenya's own gift):** used for disaster mapping; never yet used for *chronic-disease symptom mapping*.

### 3.3 Financing & access models
- **Brazil's community health agents (ACS):** ~300,000 agents cover most of the population — the model that Kenya's CHP program copied and *improved* (paid + digitized). [11]
- **Scotland:** free period products by law; **India:** ultra-low-cost products; **Uganda (AFRIpads):** reusable cups + education — all show "access + education" bundles move the needle. [23]
- **France's "Forfait Innovation"** early-access reimbursement path for breakthrough diagnostics — a model for how a future saliva test could be brought to LMICs at tiered prices. [5]
- **M-Pesa micro-savings (Kenya):** already used for school fees, health SACCOs, and insurance top-ups — the natural rail for an "endo fund."

### 3.4 The synthesis insight
**Every region solved a different slice of the same problem:**
- *Europe* solved the *diagnosis* (guidelines, ultrasound-first, AI, saliva tests).
- *Denmark/US* solved *early flagging* (ML on patient-reported data) — but only for women who already have data-driven apps.
- *Australia* solved *care navigation* (nurse-led multidisciplinary, government-funded clinics).
- *Brazil/Kenya* solved *the first mile* (community health workers) — but haven't applied it to gynaecology at all.
- *France* solved *financing breakthrough diagnostics* (early-access reimbursement).
- *Kenya's own civil society* solved *stigma* (Endo Sisters EA, ZanaAfrica schools model) — at tiny scale.

**Nobody has fused these.** That fusion is the high-IQ idea.

---

## 4. Part 4 — THE IDEA: "EndoPima"

> **A community-first, ultrasound-gated, data-generating endometriosis detection & care pipeline for Kenya — running from the village outward, not the hospital inward.**

**Working name:** **EndoPima** — from *kupima* (Swahili: to test/measure/check, as in *kupima mimba* — taking a pregnancy test). A woman in a village already knows what "pima" means. It also doubles as an English backronym along the pipeline below.

### 4.1 The four-stage pipeline

**Stage 1 — PIMA (Screen) · *the first mile***
- A **USSD shortcode + WhatsApp bot + eCHIS module** for CHPs carrying a validated, culturally adapted symptom questionnaire (period pain severity, pain with sex, pain with bowel/bladder, heavy bleeding, fatigue, infertility, family history, NSAID non-response — the EPHect/ESHRE-style indicators, simplified to lay Swahili/Sheng).
- CHPs ask **two extra questions during every routine household visit** for women of reproductive age (they already do household surveys; this is a marginal cost).
- Schools: "**Pain Is Not Normal**" module baked into the ZanaAfrica-style menstrual-health curriculum for Form 2–4 girls (turning the user's "education = early detection" insight into a national channel).
- Output: an **EndoRisk score** from an ML model initially designed like FEMaLe/Apple-study logic, *retrained on Kenyan data as it arrives*. Low risk → reassurance + education; medium/high → Stage 2 referral.

**Stage 2 — THIBITI (Confirm) · *the cheap definitive step***
- **EndoNurse** — a trained nurse/sonographer (the Australian "endometriosis nurse coordinator" paradigm, transplanted to a Kenyan cadre) at **Level 4/5 hospitals**.
- **AI-assisted transvaginal ultrasound** following the ESHRE 2022 "diagnose without laparoscopy" pathway, with **tele-mentoring** from Nairobi/KNH specialists (a Huawei/Starlink-grade or even 4G video call + AI second-reader).
- Ultrasound machines, unlike laparoscopes, are *already in county hospitals*. The staging problem is **human** (skill) and **protocol** (no pathway), not hardware.
- Only genuine surgical candidates (deep disease, endometrioma, fertility issues, failed medical therapy) get referred to the **excision surgeon hub** — of which Kenya has a handful.
- *Future-proof:* the registry + specimen model is designed so a **saliva test circuit** (Ziwig-style) can be layered in via partner labs when the price/warmer drops — tiered pricing, shared-risk partnerships.

**Stage 3 — FANYA (Treat & Fund) · *the affordability bridge***
- **Dada Navigator** — a peer support worker (an endometriosis warrior — the Endo Sisters EA model, scaled) who walks each patient through the journey: answers questions, fights stigma, attends appointments, and handles the paperwork.
- **Building on SHA:** a simple "**EndoSHA**" claims navigator that helps patients get the KSh 134,400 laparoscopy tariff through pre-authorization — the 2025 Nation investigation shows this is where insured patients currently *fall through*. [22]
- **PimaPocket** — an M-Pesa micro-savings/layaway "EndoFund" (family + employer + SACCO contributions; mobile money rails) so surgical costs don't collapse a household. This is M-Pesa's *kupiga hesabu* culture applied to a chronic disease.
- Pain-management protocols, physio/pelvic-floor referral, mental-health screening (depression rates among endo patients are severe but untreated in Kenya).

**Stage 4 — THIBITISHA (Prove) · *the flywheel that makes it policy*'**
- Every screen, referral, scan and surgery writes to a **de-identified national endometriosis registry** (Ushahidi-style open architecture; Data Protection Act 2019-compliant).
- Outputs: the **first Kenyan endometriosis prevalence map**, a **diagnostic-delay index per county** (like Australia's hospital maps, but bottom-up), county-level dashboards for the **Ministry of Health**, and anonymized research datasets for **KEMRI/UoN** partners.
- This directly answers the "**data poverty**" critique: no more arguing without numbers. With data comes policy — a school curriculum mandate, county ultrasound capacity, SHA benefit design, national guidelines. [1]

### 4.2 The flywheel (why this compound-interest idea beats any single app)

```
  Awareness (schools + CHPs + WhatsApp)
        ↓
  More women screened  →  More flagging
        ↓
  More confirmed cases    →  Registry grows
        ↓                              ↓
  ML model improves (Kenyan data)   Policy pressure (MOH data)
        ↓                              ↓
  Better screening           Funding, guidelines, capacity
        └────────── loop repeats ──────┘
```

### 4.3 Why it's new — "never done anywhere" table
| Ingredient | Exists somewhere | Fused into EndoPima? |
|---|---|---|
| AI/ML symptom scoring (Denmark FEMaLe, Apple WH) | High-income, app-only | ✅ + USSD/CHP (no smartphone needed) |
| Ultrasound-first diagnosis (ESHRE 2022) | Europe guidelines | ✅ + tele-mentoring + AI second reader, county level |
| Nurse-led MDT coordination (Australia) | High-income clinics | ✅ + CHP first mile + Dada Navigator |
| Community health worker screening | Brazil/India (maternal & child health) | ✅ **first time applied to endometriosis** |
| National registry & maps | Rich-country registries | ✅ **first African endometriosis registry** |
| Micro-savings/financing for surgery | Kenya (M-Pesa SACCOs) | ✅ first time targeted at endo surgical tariff |
| School-based menstrual pain education | Kenya (ZanaAfrica MHM) | ✅ extended from hygiene → **disease awareness** |

**The one-line novelty claim:** *EndoPima is the world's first population-level endometriosis detection pipeline routed through a national community health workforce, where the screening acts simultaneously as the diagnostic funnel, the financing channel, and the epidemiological registry — designed for a country with 107,000 CHPs, M-Pesa and SHA rather than for a country with 100 endo surgeons.*

### 4.4 Why Kenya, and why *now* (the perfect-storm argument)
1. **WHO 2023–2026 global focus** on LMIC endometriosis — funders (WHO, Amref, Grand Challenges, Wellcome, national innovation funds) are actively looking for African proposals. [15]
2. **CHPs exist and are paid** (2023+) — the delivery channel is brand new and underused for non-MCH conditions. [11][12]
3. **eCHIS digitization** — CHP data already flows to county dashboards; adding a module is an integration, not a build. [12]
4. **ESHRE 2022 + AI-ultrasound** make county-level diagnosis legitimate — the scientific consensus moved *just in time*.
5. **SHA exists** — imperfect, but the financing rail is new and being renegotiated; now is the moment to design benefits in. [14][22]
6. **Local champions exist** — Endo Sisters EA, KOGS, KESES, UoN (Gichuhi thesis), ZanaAfrica — the coalition is waiting for a common platform.
7. **The data gap is the lever** — the 2026 "data poverty" analysis shows Kenya's policy machinery will move *if* someone produces numbers. The registry doubles as the political instrument. [1]

### 4.5 Honest risks & mitigations
| Risk | Mitigation |
|---|---|
| **Clinical validity** — a screener must not create false reassurance or panic | Co-design with UoN/KNH gynaecologists; validate instrument in a Kenyan cohort; clear "this is not a diagnosis" framing; clinician gate at every step. |
| **Ultrasound capacity** — machines exist but sonographers & TVUS expertise are scarce | Phased rollout with tele-mentoring; AI second-reader as *support*, not replacement; start with 3–5 pilot hospitals. |
| **AI bias** — models trained on rich-country data can misfire on African populations | Local data-first design; report calibration; never ship a model trained only on European/US data. |
| **Stigma** — women may hide symptoms, families may block care | Peer "Dada Navigator" role; Swahili-first language; school entry point normalizes the conversation early. |
| **Privacy** — reproductive health data is sensitive | Data Protection Act 2019 compliance, de-identification, community consent, county data agreements. |
| **Cost sustainability** | M-Pesa micro-savings + SHA + county budgets + catalytic philanthropy; unit economics per screened woman are very low (a USSD session is nearly free). |
| **Overpromising saliva tests** | Position Endotest-class diagnostics as phase-3 research/beta, not the core deliverable. |
| **CHP workload** | Two questions during existing household visits; eCHIS module; incentives. |

### 4.6 Suggested 24-month roadmap
- **Phase 0 (0–3 mo):** coalition building (Endo Sisters EA, KESES, KOGS, UoN, Amref); design of the validated screener in Kiswahili/Sheng/English; ethics & data-protection review.
- **Phase 1 (3–9 mo):** **functional MVP** — USSD/WhatsApp screener + risk score + referral map; CHP eCHIS module; 2 county pilots (e.g., Kiambu + Kisumu); 3 pilot hospitals with EndoNurse + tele-mentoring.
- **Phase 2 (9–18 mo):** registry live, county dashboards, AI-ultrasound assistance pilot, PimaPocket savings pilot, school module in partnership with ZanaAfrica; first prevalence publication with UoN.
- **Phase 3 (18–24 mo):** MOH advocacy briefing with real data; scale to 8–10 counties; SHA benefit navigation at scale; research partnerships (saliva-test beta feasibility study).

### 4.7 What YOU could build now (this is the fun part)
As a developer project, the **MVP prototype** is fully buildable by you — and it's the exact artifact that starts the coalition:
1. **Symptom checker (Swahili/English/EMPA?)** — USSD-style flow or WhatsApp bot, with the *validated-style* questions, disclaimers, and referral outputs (ties in USSD: *384* code working on feature phones).
2. **EndoRisk gauge** — visual risk engine + plain-language guidance.
3. **Find Care map** — facilities, EndoNurse clinics, specialist surgeons (public + private).
4. **SHA/E ndoFund calculator** — explains the KSh 134,400 pathway, shows savings goals, M-Pesa-style contributions.
5. **Community data dashboard** — demo of the future registry (anonymous, county-level).
6. **(Optional, fun) "Pain Is Not Normal" mini-game** for schools — a quiz/adventure teaching girls to recognize red-flag period pain. This is your "game" and "real project" in one.

---

## 5. Part 5 — 10 Alternative Ideas (Ranked, in case you want variety)

| # | Idea | Why | Effort |
|---|---|---|---|
| 1 | **EndoPima MVP** (above) | Highest impact; the research supports it; you'd be first in Africa | 1–3 months for prototype |
| 2 | **"Pain Is Not Normal" school game/app** | Fast, joyful, needed; rides ZanaAfrica's channel | 2–6 weeks |
| 3 | **EndoMap Kenya** — Ushahidi-style crowdsourced symptom & clinic map | Simple, high visibility, produces the "data poverty" fix | 2–4 weeks |
| 4 | **EndoSHA claims navigator** — explainer + pre-auth assistant app | Attacks the documented 2025 SHA failure point | 3–6 weeks |
| 5 | **USSD/WhatsApp pain triage bot** (works on feature phones) | The actual accessibility play; nearly free to run | 3–6 weeks |
| 6 | **PimaPocket M-Pesa endo savings + financial literacy app** | Unique angle; needs Safaricom partnership | 1–3 months |
| 7 | **AI-ultrasound helper** (annotate TVUS images, flag cysts/deep lesions) | Cutting-edge; needs medical images & ethics; great if you want AI skills | 3+ months |
| 8 | **CHP training toolkit** — video/audio mini-course + job aid cards in Kiswahili | Leverages the 107k CHPs; low-tech, high-leverage | 3–6 weeks |
| 9 | **Localized period-tracker with risk flagging** (female-dev-friendly, offline-first) | Catches the "app gap"; like FEMaLe but Kenya-first | 1–2 months |
| 10 | **Research study participation** — co-author a prevalence/knowledge study with UoN | One thesis is worth more than ten apps for credibility | variable |

---

## 6. References & Sources

1. **Data Poverty & Kenya's Endometriosis Crisis** (2026), Epic Pulse Research — https://epicpulse.co.ke/data-poverty-drives-kenyas-endometriosis-crisis/
2. **Gichuhi J.W. — Prevalence, Pattern & Clinical Presentation of Endometriosis in Indigenous Africans Undergoing Laparoscopy in Two Hospitals in Nairobi, Kenya (KNH & Nairobi Hospital, 2018–2020)** — UoN thesis — https://erepository.uonbi.ac.ke/bitstream/handle/11295/167734/Gichuhi%20J_Prevalence,%20Pattern%20and%20Clinical%20Presentation%20of%20Endometriosis%20in%20Indigenous%20Africans%20Undergoing%20Laparoscopic%20in%20Two%20Hospitals%20in%20Nairobi,%20Kenya.pdf
3. **"Living with Endometriosis: A Narrative Analysis of the Experiences of Kenyan Women"** (2023), IJERPH (with Endo Sisters EA Foundation) — https://www.mdpi.com/1660-4601/20/5/4125
4. **Ziwig Endotest validation (NEJM Evidence, 2025)** — 97.3% sens / 94.1% spec / 96.6% accuracy, n=971 — https://clpmag.com/disease-states/womens-health/saliva-based-endometriosis-test-shows-96-accuracy/ (also https://aeroflowurology.com/blog/saliva-test-for-endometriosis)
5. **Dubai DOH Health Technology Review — Ziwig Endotest approval** — https://www.doh.gov.ae/-/media/Feature/Research/Technology-status/2024/Ziwig-Endotest.ashx
6. **"AI & ultrasound diagnosis of endometriosis: systematic review"** (2026) — DL accuracy 0.89–0.93, AUC ~0.90 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12866326/
7. **"Diagnostic accuracy of ML for endometriosis: meta-analysis"** (2026, Frontiers) — imaging AUC 0.979–0.983 — https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1735567/full
8. **ESHRE Endometriosis Guideline 2022** (ultrasound/MRI diagnosis without laparoscopy; TVUS in adolescents; CA-125 not recommended) — https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS-2022_2.pdf
9. **FEMaLe — ML for early diagnosis of endometriosis from self-reported data (Denmark, Lucy app)** — https://pubmed.ncbi.nlm.nih.gov/38722932/
10. **The endometriosis nurse coordinator — new paradigm for MDT care (Julia Argyrou Centre, Melbourne)** — https://www.sciencedirect.com/science/article/pii/S2949838424000288 ; Australia AUD$16.4M clinics investment 2023
11. **Kenya CHP launch, 100,000 kits (Sept 2023)** — https://chu4uhc.org/dream-comes-true-for-100000-kenyan-chps/
12. **Amref — 107,000 CHPs & eCHIS digitization** (2025) — https://newsroom.amref.org/blog/2025/06/built-from-the-ground-up-how-107000-community-health-promoters-are-changing-the-face-of-health-care-in-kenya/
13. **CA Kenya Q1 2025 report** — 76.16M SIMs (145.3% penetration), 42.35M smartphones — https://www.ca.go.ke/mobile-data-and-digital-services-rise-ca-report-shows
14. **MoH SHA tariff schedule** — "Operative Laparoscopy: Endometriosis Surgery — 134,400" — https://health.go.ke/sites/default/files/2024-11/TARIFFS%20TO%20THE%20BENEFIT%20PACKAGE%20TO%20THE%20SHI.pdf
15. **WHO Endometriosis fact sheet** (190 million; 10%; LMIC priorities) — https://www.who.int/news-room/fact-sheets/detail/endometriosis
16. **University of York — 6.6-year average diagnostic delay** (2024) — https://www.york.ac.uk/news-and-events/news/2024/research/diagnosis-endometriosis-delay/
17. **Endonews — diagnostic delays scoping review (6.8 yrs avg; range 0.5–27 yrs)** — https://www.endonews.com/diagnostic-delays-in-endometriosis-contributing-factors
18. **Apple Women's Health Study** — cycle irregularities & risk findings — https://www.apple.com/newsroom/2023/03/findings-from-apple-womens-health-study-advance-science-around-menstrual-cycles/
19. **Endometriosis underfunding & economic burden** (Nature 2024: €9,500/woman/yr; NIH $16M ≈ $2/patient vs $31 diabetes; US $78–119B) — https://www.nature.com/articles/s44294-024-00048-6 ; see also Frontiers "Endometriosis Is Undervalued: A Call to Action" — https://www.frontiersin.org/journals/global-womens-health/articles/10.3389/fgwh.2022.902371/full
20. **Systematic review of prevalence among indigenous Africans** (2017) — https://www.scirp.org/journal/paperinformation?paperid=78114
21. **"Endometriosis among African women"** (Reproduction & Fertility, 2022 — Mecha et al.) — myth of rarity, diagnostic delay, care gaps — https://raf.bioscientifica.com/view/journals/raf/3/3/RAF-22-0040.xml
22. **Nation (July 2025) — SHA pre-authorization & cash-vs-insurance price disparities** — https://nation.africa/kenya/health/-wait-for-your-tumour-to-grow-or-pay-cash-sha-s-impossible-choice-5102980
23. **ZanaAfrica MHM model** (Nia Yetu curriculum, Nia Teen, Nia pads KSh 75/10, 50,000+ girls) — https://ballardbrief.byu.edu/issue-briefs/lack-of-menstrual-hygiene-management-among-women-and-girls-in-east-africa ; https://www.developmentaid.org/news-stream/post/190081/kenya-period-poverty ; Kilifi school study — https://www.frontiersin.org/journals/reproductive-health/articles/10.3389/frph.2026.1717803/full
24. **Worldmetrics endometriosis statistics** (11.6% global; median diagnosis age 28; black women diagnosed 2.5 yrs later) — https://worldmetrics.org/endometriosis-statistics/
25. **Endo Sisters East Africa Foundation** — https://endosisterseastafrica.org/board/ , https://www.facebook.com/endosisterseastafrica/
26. **Kenya endometriosis support ecosystem** (Endometriosis Foundation of Kenya; Yellow Endo Flower) — https://bloominuterus.com/2016/12/21/kenya-endometriosis-care-support/
27. **SRC-accredited multidisciplinary Endometriosis Centres of Excellence** (e.g., Acıbadem) — https://hospitalsmagazine.com/multidisciplinary-endometriosis-care-acibadem-center-of-excellence/
28. **Sub-Saharan Africa & WEO member organizations** — https://www.borgenmagazine.com/endometriosis-in-sub-saharan-africa/

---

*Compiled from the sources above. Figures are as reported by those sources; a real implementation would require local clinical validation, ethics approval (e.g., KEMRI/UoN ERC), and Data Protection Act 2019 compliance. This document is a research synthesis, not medical advice.*
