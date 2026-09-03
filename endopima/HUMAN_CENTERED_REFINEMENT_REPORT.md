# EndoPima v1.1 — Human-Centered UI & Emotional Experience Refinement

**Date:** 3 September 2026 · **Scope:** interface & content refinement only — no new features, no architecture change, no new integrations. App remains one self-contained file (323 KB, still a single request: images are embedded as base64).
**Live:** https://endopima-kenya.surge.sh

---

## 1. UI changes made

- **Homepage rebuilt as an emotional entry point** (see §2 for copy): validation message first, statistics moved below the fold into a small "bigger picture, for context" strip. The hero no longer leads with disease statistics.
- **Navigation simplified** to the five things a woman needs: **Home · Check symptoms · My Story · Find care · Learn** + a `☰ More` toggle (Costs, Observatory, Community, My journey, About & privacy). Branded names (PIMA, PASIPOTI, THIBITI) are now paired with plain-language labels instead of being the primary label. Toggle is keyboard/screen-reader accessible (`aria-expanded`).
- **New homepage blocks:** "You are not overreacting" card; a 6-step **emotional journey strip** (something doesn't feel right → … → I want appropriate care); an experience section; a patient-voices placeholder; a **visible privacy card** with a one-tap "clear everything on this device" (double-tap confirm) — privacy is no longer buried in the footer.
- **Symptom check result redesigned:** the big gauge/number is gone. Result now says **"What your answers tell you"** → plain-words explanation per band → **"What you can do next"** (save summary / prepare story / find care / urgent-care note). The "indication score" remains only as a small, de-emphasised line framed as *"a way to notice changes over time, not a grade and not a diagnosis"* — kept for clinical traceability (a clinician will want it in validation).
- **"Before you go" card** added to Pasipoti: the five preparation questions (what bothers you most / when it began / how it affects life / what you tried / questions to ask) with: *"You don't have to remember everything when you're in the room."*
- **Typography/spacing:** generous card padding, large buttons (min 44px), `:focus-visible` outline added, reduced-motion rules unchanged and verified, severity is never colour-only (icons + text everywhere).
- **Tone discipline:** no new pink/flowers added; palette remains plum/lavender/sage/cream with the existing kanga stripe — warm and credible rather than "cute women's wellness".

## 2. Emotional/content changes made

- **Hero:** "**Your pain is real.** Severe period pain is not something you simply have to endure. If your periods are affecting your work, school, relationships, sleep or everyday life…" → three actions (Check my symptoms / Prepare my story / Find care) → quiet reassurance: **Private. Nonjudgmental. Not a diagnosis.**
- **Core human message,** now near the top: *"Pain that disrupts your life deserves attention."* *"You do not have to prove that your pain is 'bad enough' before asking for help."* — explicitly framed as validation, not diagnosis.
- **Experience section "It can be more than period pain":** 10 relatable experiences as chips (missing school/work; unable to stand/walk/sleep; pain every month; heavy bleeding; pain during sex; bowel/urinary pain; fatigue; bloating; repeated visits without answers; feeling nobody believes you) — closed with: *"These symptoms can have different causes. A healthcare professional can help assess what is happening. This list describes experiences — not a diagnosis."*
- **PIMA reframed:** "Let's make sense of what you're experiencing… This isn't a diagnosis. It is a guided symptom check…"
- **Pasipoti reframed:** "Your story, in one place" + *"You may have had to explain the same symptoms again and again."*
- **Find care:** explicitly honest — *"Real, verified facility information is not available yet… demonstration content… A real directory will be built with county health teams."*
- **Fanya (costs):** *"Worried about the cost of care? We know healthcare costs affect when and where someone seeks help"* — with explicit "not a payment service; no verified pricing; no money moves through this app."
- **Kiswahili:** all ~70 new strings written in natural Kiswahili (meaning-first, not literal translation — e.g. "Wewe si unazidisha", "si lazima uthibitishe…"). Full-switch re-rendering verified for every new block.

## 3. Images added — and why

Four **illustrations** (not photographs, not AI-generated people presented as real patients — clearly decorative, `alt=""`/`aria-hidden`): hero (woman at rest with tea & notebook), experience (student at desk, tired but dignified), story (woman with a female health worker), find-care (two women walking to a clinic). Authentic Kenyan representation is the priority, in the app's own palette. Total cost: **45 KB** (embedded base64; no extra requests — deliberate for low-bandwidth Android use).

## 4. Videos added — and why (none)

Deliberately **no videos**. Reason: videos require either real, ethically-sourced footage (not available) or fabricated content (forbidden), and they conflict with the low-bandwidth requirement. Instead: a clearly-labelled "Short videos — planned, not faked" card in Learn, listing the three planned videos (what is endometriosis / when pain deserves attention / preparing for your appointment) with the **text version** pointing to existing lessons — so no woman ever needs a video to get an important message. When real captioned videos are made, this card upgrades.

## 5. Sections deliberately left unchanged

- **PIMA engine**: 24 questions, weights, score formula, bands, safety-check precedence — untouched (that is the clinical review's job, not this pass's).
- **Village Mode, CHP Mode, Dada Navigator, Observatory filler logic, Fanya calculator/planner, Safari follow-up, consent centre/demo, cloud-sync wiring** — untouched and re-validated.
- **Breathing pause, resume-where-you-left-off, typewriter, petals, kanga shimmer** — kept (they serve the calm/lively balance from earlier passes).
- **Truth-and-labelling architecture** (LIVE/DEMO/CONCEPT/RESEARCH/PROTOTYPE badges, on-device privacy, optional research) — kept intact.

## 6. Any statistics removed

- **Removed from the hero** (the emotional entry no longer opens with numbers): 190M (WHO), 7–10 yrs delay, 107,000+ CHPs, 94% awareness gap → moved to a small "bigger picture, for context" strip lower on the homepage, still labelled (WHO estimate / demonstration-informed).
- No statistics were deleted from the Observatory (unchanged, all DEMO-labelled).

## 7. Any claims that require verification

- **Kiswahili quality**: written carefully by me; **needs native-speaker verification in the human round** (flagged item in review kit).
- **Band thresholds and wording** (30/60, "may be worth discussing…"): prototype opinion — **clinical review required** before any real use.
- **Illustrations**: decorative; no claim they depict real people or real Kenyan patients.
- **"A real directory will be built with county health teams"** — a plan/statement of intent, not a commitment; verified-false-until-true, and the app says it is not available yet.
- No new numbers, partnerships, integrations, or medical claims were added.

## 8. Remaining usability problems (honest, for the human round)

1. The five-primary + More navigation hides five sections one tap away — some users may miss Community/Safari; watch this in testing (cheap to promote later).
2. Homepage is now long (emotional blocks + idea detail); verify above-the-fold clarity on a 5" screen.
3. "More about the idea" section still uses the 4-stage pipeline + flywheel — technical content lower down; acceptable per "dashboard last", but confirm non-overwhelming.
4. Inputs for ages/options are tap-based (no type-ahead) — fine for the question set; verify thumb reach.
5. The wipe button's double-tap confirm may confuse; fallback message included but test with users.

## 9. Medical-safety concerns

- Safety-check override retained: any safety flag → URGENT, shown first, plain words — **this is the most important safety feature and it is unchanged and re-tested.**
- Result copy softened but no ambiguity removed: urgent language is present, complete, and comes before everything else.
- Non-fear principles confirmed in new copy: no alarming imagery, no "you could have endometriosis" phrasing anywhere, no countdowns, no shocking stats.
- **Standing concern (unchanged):** prototype logic is not clinically validated. This pass changed no logic. Human verification must include a clinician review of the final wording.

## 10. Ready for human verification?

**Yes — for usability and content testing with real women and healthcare professionals.** The interface now matches the intended emotional arc (seen → understood → organised → next step → prepared → continuing), all claims are honest, and nothing in the app requires clinical validation to be *shown* to people for feedback. **Not** ready for any real-world advice role until the clinical review in the archived kit is completed — and we will say so on every screen that matters.

---

*Verification achieved so far: HTML structure clean, no duplicate IDs, JS syntax clean, 460 i18n keys with full Swahili coverage, 12 runtime scenarios green (breath flow, resume, safety resume, human result both branches, wipe, nav toggle, Village live-language, Dada, all sections). No claim is made that women will like the interface — only human verification can establish that.*
