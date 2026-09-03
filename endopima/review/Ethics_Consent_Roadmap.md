# EndoPima — Ethics, Data Protection & Consent Roadmap (V1.0)

**What this is:** the honest path from “prototype with demo data” to “supervised pilot that collects real data, lawfully and ethically.” It maps the Kenyan requirements we verified in September 2026 and the work each stage needs.
**What this is NOT:** legal advice, a guarantee of approval, or a claim that EndoPima is compliant today. **Today the app stores everything on-device and is not compliant or non-compliant — it simply collects no real data. Requirements below change; re-verify on [odpc.go.ke](https://odpc.go.ke) and [nacosti.go.ke](https://nacosti.go.ke) before each step.**

> Rule that governs everything: **research participation stays optional, never a condition of getting help. No data collection without informed consent — no silent collection, ever.** (This is already how the prototype is built.)

---

## 0. Where we are now (no real data)

- App = single HTML file; all answers saved **on the device only**; cloud sync is *off by default* and needs an explicit user-provided Supabase URL + key (both empty in the shipped file).
- The research-consent toggle in the app is a **demo UI** — it writes to device storage only.
- Conclusion: no personal data leaves the device, so the Kenya **Data Protection Act 2019 (DPA)** duties are not triggered by the prototype itself. This is the safe place to stay until the roadmap below is done.

---

## 1. Stage 1 — Before any real data flows (still no pilot)

| # | Task | Why / reference |
|---|---|---|
| 1.1 | **Map the data.** List every field the app would sync: screening answers, score/band, safety flags, passport entries, consent status, journey events (appointments, referrals), device ID. Identify every field that is **personal** (health status = sensitive personal data under DPA s.2) and what can be pseudonymised immediately (e.g., store age band, not DOB; county, not address). | DPA 2019 definition of sensitive personal data (health status, sex, family details…) |
| 1.2 | **Decide who the controller is.** A Kenyan company/NGO, a Kenyan research institution, or the county (for a county pilot)? This determines everything else. **Recommendation:** a registered Kenyan entity as controller; researchers/data processors under contract. | |
| 1.3 | **ODPC registration.** Under the Data Protection (Registration of Data Controllers and Data Processors) Regulations 2021, entities processing personal data in **health administration / provision of patient care** must register with the Office of the Data Protection Commissioner **regardless of revenue or staff size** (non-exempt mandatory sector). Fee ≈ KES 4,000; renewal ≈ KES 2,000; certificate valid 24 months. Apply via the ODPC portal. | [ODPC Guidance Note on Registration](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf); [DPA 2019 s.18](https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf) |
| 1.4 | **Designate a responsible person / DPO.** Required where processing sensitive data at scale, or core monitoring activities. For a small pilot, a named lead may suffice — confirm with the ODPC. | DPA 2019 |
| 1.5 | **Data Protection Impact Assessment (DPIA).** Mandatory for high-risk processing (DPA s.31). Health + adolescents + research = high risk by any reading. Document: data flows, lawful basis (consent — s.30), risks, mitigations (encryption at rest/in transit, pseudonymisation, access control, breach plan), and consult ODPC where residual risk remains. | DPA 2019 s.30–31 |
| 1.6 | **Security baseline.** HTTPS; encrypted project DB (Supabase RLS + encryption); row-level policies per user; server logs minimised; **72-hour breach notification to ODPC** and data subjects where required. | DPA 2019 s.43 |
| 1.7 | **Cross-border transfers.** If hosting outside Kenya (e.g., Supabase EU region), transfers need adequacy/consent/contractual safeguards per DPA s.41 — document the lawful basis for any transfer; consider hosting in-country. | DPA 2019 s.41 |
| 1.8 | **Privacy policy + in-app consent text in EN & SW** (see §3 model wording). Never hidden; plain language; mention minors' data separately. | |
| 1.9 | **Adolescent handling.** Under-18s: the app should not collect identifiers from minors without guardian consent + the minor's assent; consider a guardian-companion flow for the under-18 path. (Age of majority in Kenya: 18.) | NACOSTI guidelines; ClinRegs Kenya age-of-minors note |

## 2. Stage 2 — If the next step is a RESEARCH pilot (recommended before any pilot)

Kenya requires **independent ethics review by a NACOSTI-accredited institutional ethics committee (EC/IRB)** for research involving human participants, and a **NACOSTI research licence** before fieldwork starts (STI Act 2013; NACOSTI research-licensing guidelines).

| # | Task | Notes |
|---|---|---|
| 2.1 | **Write the protocol.** Objectives; study question (e.g., “does the PIMA flag + navigation guidance change time-to-appropriate-care-seeking in the pilot county?” — *not* “does PIMA diagnose?”); design (observational, not a trial); sites; participants; inclusion/exclusion; endpoints; sample; analysis; risks/benefits; compensation; confidentiality; dissemination plan. | NACOSTI National Guidelines for Ethical Conduct of Biomedical Research in Kenya list the required protocol elements |
| 2.2 | **Choose an accredited IRB/EC.** Well-known NACOSTI-accredited committees include KEMRI's Scientific & Ethics Review Unit (SERU), KNH/UoN Ethics & Research Committee, AMREF ERC, Aga Khan University ERC, Moi University/MTRH IREC. Check the current accredited list (KEN-25 on ClinRegs or NACOSTI). Fees vary by institution. | [ClinRegs Kenya](https://clinregs.niaid.nih.gov/country/kenya) |
| 2.3 | **PI requirements.** PI should have GCP training documentation (relevant for clinical research); CVs; host/institutional affiliation letter. | NACOSTI licensing guidelines |
| 2.4 | **NACOSTI research licence.** Apply on the NACOSTI portal after ethics approval; upload approved protocol, ethics letter, affiliation letters. **Do not start fieldwork without it.** | |
| 2.5 | **Consent process.** Information sheet + consent form in EN & **Kiswahili**, signed/thumb-printed (or documented verbal consent with a witness — common and acceptable for low-literacy settings with the EC's approval); separate assent for 16–17-year-olds + guardian consent; consent must state: purpose, what is collected, who sees it, storage, voluntary, right to withdraw with no effect on care, complaint contact, and **that the tool is experimental**. | NACOSTI guidelines on consent elements; EC review |
| 2.6 | **County & MOH engagement.** CHP engagement runs through **county health management teams** (CHPs are county-programme workers) — a county no-objection/approval letter is standard for facility-adjacent work. Align with MOH's **eCHIS/Digital Health Strategy** direction; the app is meant to strengthen, not bypass, existing systems. | MOH Digital Health Strategy 2020–2030 (policy direction; not a legal requirement) |
| 2.7 | **Research-only opt-in.** In-app: participation must be a separate, explicit, revocable opt-in **after** the tool has helped the person (help first, research second). The current app design already does this — preserve it. | |
| 2.8 | **Not a medical device (for now).** So long as PIMA stays an educational/decision-support prototype and we claim nothing, Kenya's **Pharmacy & Poisons Board / clinical-trial** authorisation path is not triggered. This changes the moment the tool is positioned as a diagnostic or a device — keep the current positioning until clinically validated (see the review kit). | ClinRegs Kenya (PPB ECCT path is for trials/devices) |
| 2.9 | **Timeline reality.** Ethics review ≈ 2–4 months (plus revisions), NACOSTI licence ≈ 2–6 weeks after approval, ODPC registration a few weeks. **Plan 6–9 months before any pilot start date.** | |

## 3. Model consent wording (to be adapted + approved by the reviewing EC — not legal advice)

**Information sheet (short version, EN / SW):**
> “EndoPima is a prototype tool for education and navigation — it is **not a diagnosis and not a replacement for a clinician**. We are testing whether it helps people seek care sooner. If you join: the answers you enter, the result shown, and the steps you take will be saved in a secure study database, with no names attached and no way to identify you in reports. This is voluntary. You can stop at any time, and your decision will not affect any care or services you receive. You may ask questions at any time: [contact]. If you are under 18, your parent/guardian will also be asked and both of you must agree.”
> “EndoPima ni zana ya mfano ya elimu na mwongozo — **si utambuzi na si mbadala wa daktari**. Tunajaribu kama inasaidia watu kutafuta huduma mapema. Ukijiunga: majibu unayoweka, matokeo, na hatua unazochukua zitahifadhiwa kwenye hifadhidata salama ya utafiti, bila majina, na hakuna njia ya kukutambua kwenye ripoti. Hii ni ya hiari. Unaweza kusimama wakati wowote, na uamuzi wako hauathiri huduma unazopata. Unaweza kuuliza maswali wakati wowote: [mawasiliano]. Ukiwa chini ya miaka 18, mzazi/lezi pia ataombwa ridhaa na nyote wawili lazima mkubali.”

**Model consent statement (checkbox/tap in-app; the only “signature” required):**
> “I understand this is a prototype, not a medical diagnosis. I agree that my anonymised answers may be used for research. I know I can withdraw at any time without any effect on my care.” / “Naelewa hii ni mfano, si utambuzi wa kimatibabu. Nakubali majibu yangu yasiyo na jina yaweze kutumika kwa utafiti. Najua naweza kujiondoa wakati wowote bila kuathiri huduma yangu.”

## 4. What we will NOT do (standing positions)

- No data collection without genuine informed consent; no silent telemetry.
- No claims of compliance/certification before they exist (the app already says exactly this in Zaidi).
- No clinical validation claims before an appropriately designed, ethics-approved study.
- No “diagnosis” language, no probability, no mandatory treatment path.
- No minors' data collection outside guardian consent + assent.

## 5. Reference documents

- Kenya Data Protection Act, No. 24 of 2019 — [PDF](https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf)
- ODPC Guidance Note on Registration of Data Controllers and Data Processors — [PDF](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf)
- NACOSTI Guidelines on Research Licensing and Institutional Affiliation — [PDF](https://www.nacosti.go.ke/nacosti/Docs/QUICK%20DOWNLOADS/GUIDELINES_ON_RESEARCH_LICENSING_AND_INSTITUTIONAL_AFFILIATION_compressed.pdf)
- NACOSTI National Guidelines for Ethical Conduct of Biomedical Research Involving Human Participants in Kenya — [PDF](https://www.nacosti.go.ke/nacosti/Docs/QUICK%20DOWNLOADS/National%20Guidelines%20for%20Ethical%20Conduct%20of%20Biomedical%20Research%20Involving%20Human%20Participants%20in%20Kenya.pdf)
- ClinRegs (NIH) — Clinical Research Regulation for Kenya (accredited EC list, PPB path, minors) — [page](https://clinregs.niaid.nih.gov/country/kenya)

*Document date: 3 September 2026. Re-verify thresholds/fees/portals at each step.*
