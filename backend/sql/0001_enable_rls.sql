-- Enable Row Level Security on all Wryte tables.
--
-- Context: this project has no Alembic migrations yet (see the TEMP comment
-- in app/main.py), and RLS/grants live outside SQLAlchemy's metadata, so
-- this file is the only record of the change. Applied directly against the
-- Supabase Postgres instance on 2026-08-05.
--
-- Why: Supabase auto-exposes every public-schema table through its
-- PostgREST Data API. With RLS off, the anon key already shipped in the
-- web-app bundle (NEXT_PUBLIC_SUPABASE_ANON_KEY) had full SELECT / INSERT /
-- UPDATE / DELETE on every table below, completely bypassing the FastAPI
-- backend. Confirmed before this change: `GET {SUPABASE_URL}/rest/v1/books`
-- with only the anon key returned 200 with real rows.
--
-- What this does NOT change: the FastAPI backend connects via the
-- `postgres` role, which has rolbypassrls = true (same as `service_role`),
-- so it is completely unaffected by RLS or by the absence of policies here.
--
-- No anon/authenticated policies are added. With RLS enabled and zero
-- policies, PostgREST access for those roles is denied entirely (SELECT
-- returns an empty set, writes return 42501). All reads/writes go through
-- the FastAPI backend until real per-writer policies are added.
--
-- Follow-up (not done here, needs product/design input): the backend has
-- no JWT verification and `writers` has no `user_id` column linking to
-- `auth.users`, so a real "a writer can only see their own books" policy
-- isn't enforceable end-to-end yet. That requires:
--   1. `writers.user_id uuid references auth.users(id)`
--   2. FastAPI middleware that verifies the Supabase JWT and resolves the
--      current writer
--   3. Policies such as:
--      USING (writer_id IN (SELECT id FROM writers WHERE user_id = auth.uid()))

ALTER TABLE writers ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
