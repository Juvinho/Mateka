-- Hand-written: pg_trgm + a GIN trigram index on users.display_name, so the
-- friend-search ILIKE '%q%' query (backend/src/routes/social.ts, /users/search)
-- stays fast as the table grows — Postgres' trigram opclass accelerates
-- ILIKE/LIKE substring matches, including leading-wildcard ones, which a
-- plain btree index can't do. No query changes needed on the app side: the
-- planner picks this index up automatically once it exists.
--
-- Plain CREATE INDEX (not CONCURRENTLY) is fine here — this runs inside the
-- migration's transaction, and the table is small enough in this project's
-- stage that a brief write lock is a non-issue.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "idx_users_display_name_trgm" ON "users" USING GIN ("display_name" gin_trgm_ops);
