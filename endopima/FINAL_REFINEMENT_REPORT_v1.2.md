# EndoPima — Final Pre-Human-Verification Refinement (v1.2)

**Date:** 3 September 2026 · **Scope:** last controlled pass before human verification with real women and clinicians. No new features, no AI, no backend work. Feature development now stops.
**Live:** https://endopima-kenya.surge.sh (v1.2, deployed from this pass)

---

## 1. Inspected

- Read every section's current copy and structure before changing anything: hero, home (experience, journey, bridge, voice, privacy, stats, "how the pieces fit", myths, why-Kenya, partners, roadmap), Pima, Pasipoti, Thibiti, Fanya, Shule, Observatory, Jamii, Journey, About & privacy. Preserved what already worked rather than rewriting for novelty.
- Re-read the real HTML anchors (not earlier notes) after two script aborts revealed memory had drifted from the file — every edit below was applied against freshly grepped text.
- Ran the full runtime suite (jsdom) on the finished file: **41 checks, all green** — init, hero copy, three plain CTAs, stat attributions, no banned labels, Swahili switch (all new keys), first-screen hierarchy, result bands (low/modern/high + urgent branch), Thibiti order, Pasipoti chips, Fanya sequence, Jamii, Observatory labels, wipe, 5 images, no video.

## 2. Kept (already strong, unchanged or only lightly touched)

- **"Your pain is real."** headline and the calm, private, non-diagnostic framing — the emotional core was already right.
- Full Pima screening instrument (24 questions, 5 groups, weights, independent safety check that overrides the score) — untouched.
- Honest demo labelling everywhere (demo data, no live integrations, no verified pricing, no fabricated stats or partnerships).
- Safety wording and urgent-care guidance — unweakened.
- Privacy model: everything on-device, `ep_`-prefixed keys, one-tap wipe; privacy visible on the first screen ("Your health story belongs to you").
- Warm flat-vector illustration style and calm palette (no pink/cute wellness aesthetic).
- Kiswahili as a first-class language (full parallel dictionary).
- Shule's "planned, not faked" video card, Myth & facts, roadmap honesty card.

## 3. Improved (this pass)

- **Hero (EN + SW):** new personal paragraph — "Severe period pain should not be ignored. If your period pain makes you miss school or work, keeps you from sleeping, affects your relationships, or makes everyday life difficult — you deserve to be heard. EndoPima helps you understand what you're experiencing, keep your health story together, and prepare for your next step." Actions now plain: **Check my symptoms · Keep my story · Find my next step** (no PIMA/PASIPOTI/THIBITI vocabulary on the first screen).
- **Experience block retitled** to "When pain starts taking over your life" with all 10 examples, plus a recognition line ("If you read this and think, *'This is what I've been experiencing'* — that is exactly why this space exists") and the explicit **"different causes… do not automatically mean endometriosis"** disclaimer.
- **Emotional bridge before Check symptoms:** "You don't have to figure everything out at once. Start by telling us what you've been experiencing." → CHECK MY SYMPTOMS (≈3 min · private).
- **Pasipoti:** journey chips **Symptoms → Timeline → Previous care → Investigations → Questions → Doctor summary**; "**Patient-generated health summary — not a medical record**"; handoff line now "**Your story deserves to arrive with you.** You shouldn't have to remember everything when you're sitting in front of a clinician…" (no implication that clinicians can't listen).
- **Thibiti reordered:** "**Your next step — where should I go?**" (2-question navigator) now appears FIRST; the 6-step care pathway expands underneath as detail. Pathway heading clarified.
- **Fanya:** journey sequence strip — What is happening? → What should I do? → How can I prepare? → How can I manage the cost? Money stays clearly secondary and is never a payment service.
- **Shule:** retitled/"Learn" framing for students, teachers, parents (kept "planned, not faked" video card).
- **Language switch bug fixed (real bug):** `applyI18n` previously only applied Swahili and could never restore English — a user who toggled EN→SW→EN would be stuck. Now the original text is captured once and restored.
- **Swahili dictionary quality:** removed stale/system-first strings (old hero, old Pasipoti subtitle), aligned SW values with the new English copy, added all new keys.

## 4. Moved lower / made secondary

- **Observatory** now carries "**FUTURE RESEARCH CONCEPT**" badge + "**Demonstration data — not national prevalence estimates**" note naming it as a researcher/policymaker concept, not part of a woman's journey. All technical/future material (AI ultrasound, biomarkers, Kenyan AI model, registry, Supabase, USSD, eCHIS, M-Pesa, SHA, hospital integration, African intelligence network) stays but is **not** on the personal path.
- **Jamii** (Village / CHP / Dada) stays secondary with a note: "…you don't need any of them to use EndoPima for yourself."
- **Home hierarchy verified by runtime test:** the first screen contains no Observatory/USSD/CHP/partnership/roadmap terms; ecosystem content only appears below the personal blocks (voice, privacy, stats, "how the pieces fit", why-Kenya, partners, roadmap).

## 5. Removed

- One "94%…" claim was **verified rather than removed** (see §7). No misleading content was found necessary to delete.
- Removed 30 **duplicate Swahili dictionary keys** (the later duplicate silently overrode newer values in JS — this was why old hero text survived in Swahili).

## 6. Added (this pass)

- 5th embedded illustration: **community support conversation** (two Kenyan women in supportive conversation) for Jamii — generated, compressed to ~18 KB, embedded base64 (no extra requests).
- Experience recognition line; emotional bridge block; Pasipoti journey chips; Fanya sequence strip; Observatory demo-data note; Jamii ecosystem note; ~20 new Swahili keys.

## 7. Statistics — provenance

- **190M women & girls with endometriosis (WHO estimate)** — kept, attributed to WHO.
- **7–10 yrs diagnostic delay (multi-country studies; Kenyan data limited)** — kept with the limitation stated.
- **94% of Kenyan adolescents had never heard of the condition** — **verified**: Kagia, Gichuhi & Karanja, *East African Medical Journal* 95(8), 2018 — 313 adolescents, 2 schools (Githunguri Girls, Moi Girls); corroborated by IJERPH 2023 (Kenyan narrative study citing it). Now displayed with citation: "EAMJ 2018 — 313 adolescents, 2 schools."
- **107,000+ Community Health Promoters (Kenya)** — **verified**: Ministry of Health CHP programme (launched/stipends Feb 2024; KBC/CHU4UHC coverage). Now displayed with "Ministry of Health, 2024."
- Footer context note rewritten to name the sources: WHO; EAMJ 2018 (Kagia et al.); MOH CHP programme 2024; multi-country delay studies (Kenyan data limited).
- **No unpublished, unresolvable, or invented figures remain.**

## 8. Images & video

- **Images:** 5 total, all embedded base64 (no extra requests, low bandwidth): hero (woman with tea/notebook, everyday strength), experience (student at desk), Pasipoti (preparing notes with a clinician), Thibiti (respectful clinic interaction), Jamii (supportive conversation). No abdomen-holding, dramatic, crying, or generic-stock imagery; no AI faces presented as real patients; no fake testimonials; no logo-like decorative "African" tropes.
- **Video:** none added. The Shule card honestly says videos are planned, not produced. Adding one was deliberately refused (see §13) — the brief allowed at most one, and every first-screen question is already answered in text.

## 9. Privacy & safety (audited)

- Privacy visible on first screen; all answers/story stay on-device; optional research participation is opt-in with no silent collection (consent flow in About & privacy); wipe works (verified: `ep_` keys cleared, other keys untouched).
- Safety check remains independent and always analyzed separately; urgent branch verified — urgent flag renders first with "go to nearest health facility / call for help now," ahead of everything else.
- No diagnosis is ever given; every result band ends with "not a grade and not a diagnosis"; the "you have endometriosis" phrase appears only inside a disclaimer ("A quiz or an app cannot tell you that… only a clinician can").

## 10. Remaining technical / UX issues

- **Kiswahili needs a native-speaker review** — the new copy is careful but machine-assisted; wording, tone, and medical terminology should be checked by a native speaker (flagged since v1.1, still open).
- **Band naming (LOW / MODERATE / HIGH / URGENT SAFETY FLAG) and scoring** need clinical review — this is a screening aid, and the weight/score design should be validated, not user-tested into validity.
- Pima's score remains visible (de-emphasised, explicitly "not a grade"); a clinician may prefer it hidden — decision for clinical review, not this pass.
- Toolbar/harness-only notes: none. No known console errors.

## 11. Readiness for human verification

**Ready for human verification** (not validated): the first screen now answers the 10-second test — *what is this* (symptom-check + story + next-step space), *is it for me* (period pain affecting school/work/sleep/relationships), *what can I do* (three plain buttons), *is it diagnosing me* (explicitly No) — and the "woman alone at night" test passes at the level of design: she is not judged, frightened, or dismissed; she understands the tool doesn't diagnose; she can reach her story and her next step; privacy is honestly stated.
**What remains is exactly what this pass cannot do:** real women (pain levels, literacy, language, privacy needs) and clinicians (safety thresholds, wording, scoring, feasibility) must now be the source of truth.

## 12. Deliberately refused changes

- **No video** — questions are answered; a video would add weight and bandwidth without a proven need.
- **No new statistic or "wow" number** added to the first screen — provenance first.
- **No removal of technical/future material** (Observatory, research, AI, financing, partnerships) — it stays, clearly secondary, per the brief.
- **No new features, AI, backend, registry, payments, or hospital integration** — feature development stops here.
- **No more design polish loops** — hierarchy and emotional clarity achieved; further iteration would be making changes without human feedback.

## 13. Verification record for this pass

- Runtime harness (jsdom): **41/41 checks green** (init; hero copy + 3 CTAs; stat attributions ×2; banner honesty; no dramatic labels; SW switch incl. all new keys; first-screen hierarchy; ecosystem-below-personal; result render + "not a diagnosis" + no HIGH RISK/DANGER; urgent branch first; Thibiti nav-before-path; Pasipoti chip order + 2 handoff lines; Fanya 4-step sequence; Jamii note + image; Observatory labels; wipe keeps others; 5 images; no video).
- HTML integrity: tags balanced, no duplicate IDs, 480 EN keys / 490 SW keys, **zero missing Swahili entries**.
- JS: `node --check` clean.
- File: single `index.html`, 352 KB, 5 embedded illustrations, zero network requests for visuals.

---

*Next: human verification. This prototype is a demonstration — it educates, screens, and prepares, and never diagnoses.*
