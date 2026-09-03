-- ============================================================================
-- EndoPima — Supabase schema (Postgres) for the prototype's conceptual models
-- ----------------------------------------------------------------------------
-- STATUS: Drop-in schema for a FUTURE deployment. Nothing here is connected
-- to the running prototype until you (1) create a Supabase project,
-- (2) run this schema, and (3) paste the URL + anon key into index.html
-- (const SUPABASE_CONFIG at the top of the application script).
--
-- DESIGN NOTES
--   * Every table is keyed by device_id (the prototype's local identity).
--     In production, replace device_id with auth.uid() from Supabase Auth
--     (anonymous sign-in on first launch) and bind RLS policies to the user.
--   * RLS is ENABLED on every table. The policies below are deliberately
--     "your own rows only" placeholders that assume auth.uid() == device_id.
--   * The prototype stores JSONB snapshots (timeline, answers, cost plan)
--     so schema migrations never break older app versions.
-- ============================================================================

-- ---------- 1. Users / devices --------------------------------------------
create table if not exists public.devices (
  id          uuid primary key default gen_random_uuid(),
  device_id   text unique not null,            -- stable anonymous id from the app
  lang        text not null default 'en',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- 2. Consent ------------------------------------------------------
create table if not exists public.consents (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  navigation  boolean not null default true,   -- required for the service
  research    boolean not null default false,  -- OPTIONAL, off by default
  followup    boolean not null default false,  -- OPTIONAL
  research_opt boolean,                        -- Yes/No on the research prompt
  updated_at  timestamptz not null default now()
);
create index if not exists idx_consents_device on public.consents(device_id);

-- ---------- 3. Screenings ---------------------------------------------------
create table if not exists public.screenings (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  context     text not null default 'self',    -- self | chp | village
  answers     jsonb not null default '{}',     -- question key -> option index
  score       int not null,
  band        text not null,                   -- low | mod | high | urgent
  red_flags   text,                            -- human-readable safety flags
  contrib     jsonb not null default '[]',     -- major contributors
  created_at  timestamptz not null default now()
);
create index if not exists idx_screenings_device on public.screenings(device_id);
create index if not exists idx_screenings_band on public.screenings(band);

-- ---------- 4. Endo Passport ------------------------------------------------
create table if not exists public.passports (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  timeline    jsonb not null default '[]',     -- [{age, text}]
  syms        jsonb not null default '{}',     -- {symKey: bool}
  imps        jsonb not null default '{}',     -- {impactKey: bool}
  care        jsonb not null default '[]',     -- [{facility, date, referral, treatment, response}]
  invs        jsonb not null default '[]',     -- [{type, date, note}]
  updated_at  timestamptz not null default now()
);
create index if not exists idx_passports_device on public.passports(device_id);

-- ---------- 5. Care journey (appointments / referrals / follow-ups) ---------
create table if not exists public.journeys (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  stage       text not null default 'pima',    -- pima | thibiti | fanya | followup
  appts       jsonb not null default '[]',     -- [{date, type, place, status}]
  reffs       jsonb not null default '[]',     -- [{to, why, date, status}]
  fus         jsonb not null default '[]',     -- [{date, ans:{}}]
  updated_at  timestamptz not null default now()
);
create index if not exists idx_journeys_device on public.journeys(device_id);

-- ---------- 6. Cost plans ---------------------------------------------------
create table if not exists public.cost_plans (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  selected    jsonb not null default '[]',     -- cost category ids
  goal        int not null default 0,
  current     int not null default 0,
  monthly     int not null default 0,
  updated_at  timestamptz not null default now()
);
create index if not exists idx_costplans_device on public.cost_plans(device_id);

-- ---------- 7. Research contribution flag ----------------------------------
create table if not exists public.research_contributions (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null references public.devices(device_id) on delete cascade,
  opted       boolean not null,
  withdrew_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists idx_research_device on public.research_contributions(device_id);

-- ---------- 8. Aggregated registry (used by the Observatory) ---------------
-- NOTE: In the prototype this is fictional demo data. In production this would
-- be a materialised view over consented rows only, de-identified: no device_id.
create table if not exists public.aggregated_registry (
  id            uuid primary key default gen_random_uuid(),
  county        text not null,
  age_group     text not null,
  band          text not null,
  referral_status text,
  care_stage    text,
  followup_status text,
  reported_symptom_duration_years numeric,
  school_work_impact_days int,
  aggregated_at date not null default current_date
);

-- ============================================================================
-- Row Level Security (every table) — production placeholder policies.
-- Replace device_id comparisons with auth.uid() once anonymous Auth is wired.
-- ============================================================================
alter table public.devices enable row level security;
alter table public.consents enable row level security;
alter table public.screenings enable row level security;
alter table public.passports enable row level security;
alter table public.journeys enable row level security;
alter table public.cost_plans enable row level security;
alter table public.research_contributions enable row level security;
alter table public.aggregated_registry enable row level security;

-- Owner-only access (applied via Supabase Auth in production):
-- create policy "own rows" on public.screenings
--   for all using (device_id = (select device_id from public.devices limit 1)) ... 
--
-- The adapter ships with these policies DISABLED and relies on the anon key
-- being project-only for this prototype. Before any real deployment:
--   1. enable Supabase Auth (anonymous users)
--   2. replace device_id with auth.uid() in all policies
--   3. enforce quarterly audit reviews of anon access
-- ============================================================================
