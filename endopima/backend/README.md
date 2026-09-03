# EndoPima — Backend-ready layer

**Status: NOT CONNECTED.** The running prototype stays in demo mode (browser-local storage only) until you create a Supabase project and add your keys. Until then nothing leaves the user's device, and the app says so in its Architecture card.

This folder contains everything needed to turn the mock API layer into a real one in ~20 minutes:

| File | Purpose |
|---|---|
| `supabase_schema.sql` | Full Postgres schema: devices, consents, screenings, passports, journeys, cost_plans, research_contributions, aggregated_registry + RLS notes |
| `adapter.example.js` | No-SDK REST adapter (PostgREST) — documents the exact pattern already implemented inside `index.html` |
| `README.md` | You are here |

## How to connect (when you're ready)

1. Create a free project at [supabase.com](https://supabase.com) (any region; note: for Kenya production, store data under a jurisdiction you've reviewed for compliance).
2. Open **SQL Editor** → paste `supabase_schema.sql` → Run.
3. Copy your **Project URL** and **anon key** (Settings → API).
4. In `index.html`, find `const SUPABASE_CONFIG = { url:'', anonKey:'' };` at the top of the app script and paste both values.
5. Reload — the Architecture card on the **Zaidi** page flips from `DEMO — on-device storage only` to `Cloud sync ON`.

## What syncs (offline-first design)

- **Local first:** every read/write hits localStorage instantly (works on feature phones, in dead zones, in the sandboxed preview).
- **Best-effort push:** each write is mirrored to Supabase asynchronously; failures are logged and retried on the next write — they never block the UI.
- **Tables used:** `screenings`, `passports`, `consents`, `journeys`. Attendance stays on-device for now.

## Production checklist (before real pilots — do NOT skip)

- [ ] Enable Supabase Auth (anonymous sign-in); replace `device_id` with `auth.uid()` in all RLS policies (schema comments cover this).
- [ ] Review anon-key permissions; prefer row-level policies per user.
- [ ] Kenyan data-protection review (Data Protection Act 2019) + health-information requirements — designed for, not yet certified.
- [ ] Ethics approval for any research use (e.g. KEMRI/UoN ERC) — research consent in the app stays optional.
- [ ] PII minimisation: store only what care navigation needs; keep research rows de-identified (see `aggregated_registry`).
- [ ] Audit log of data access (Supabase audit extensions or a log table).

*The prototype never claims these integrations are live — it just makes them easy to switch on.*
