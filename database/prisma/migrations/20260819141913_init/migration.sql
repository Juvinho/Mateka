-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Postgres 15 already ships gen_random_uuid() in core, but we keep this
-- extension for parity with the spec and in case this migration ever runs
-- against an older Postgres.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT,
    "auth_provider" TEXT NOT NULL DEFAULT 'email',
    "display_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "failed_login_attempts" SMALLINT NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "ip_address" INET,
    "user_agent" TEXT,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon_symbol" TEXT,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject_id" UUID NOT NULL,
    "number" SMALLINT NOT NULL,
    "title" TEXT NOT NULL,
    "locked_by_default" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unit_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration_min" SMALLINT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "content_body" TEXT,
    "widget_type" TEXT,
    "widget_config" JSONB,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_tags" (
    "lesson_id" UUID NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "lesson_tags_pkey" PRIMARY KEY ("lesson_id","tag")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unit_id" UUID NOT NULL,
    "icon_symbol" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration_min" SMALLINT NOT NULL,
    "question_count" SMALLINT NOT NULL,
    "points" SMALLINT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exercise_id" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "formula_display" TEXT,
    "correct_answer" JSONB NOT NULL,
    "options" JSONB,
    "explanation" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "exercise_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "question_id" UUID,
    "submitted_answer" JSONB NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "attempted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "accuracy" SMALLINT,
    "completed_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("user_id","lesson_id")
);

-- CreateTable
CREATE TABLE "unit_unlocks" (
    "user_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "unlocked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unit_unlocks_pkey" PRIMARY KEY ("user_id","unit_id")
);

-- CreateTable
CREATE TABLE "streak_log" (
    "user_id" UUID NOT NULL,
    "activity_date" DATE NOT NULL,

    CONSTRAINT "streak_log_pkey" PRIMARY KEY ("user_id","activity_date")
);

-- CreateTable
CREATE TABLE "emy_appearance_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "context" TEXT NOT NULL,
    "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emy_appearance_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_sessions_expiry" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_hash_key" ON "verification_tokens"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "units_subject_id_number_key" ON "units"("subject_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_unit_id_slug_key" ON "lessons"("unit_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_unit_id_order_index_key" ON "lessons"("unit_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_questions_exercise_id_order_index_key" ON "exercise_questions"("exercise_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_attempts_user_time" ON "exercise_attempts"("user_id", "attempted_at");

-- CreateIndex
CREATE INDEX "idx_attempts_exercise" ON "exercise_attempts"("exercise_id");

-- CreateIndex
CREATE INDEX "idx_streak_user_date" ON "streak_log"("user_id", "activity_date" DESC);

-- CreateIndex
CREATE INDEX "idx_emy_log_user" ON "emy_appearance_log"("user_id", "occurred_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_tags" ADD CONSTRAINT "lesson_tags_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_questions" ADD CONSTRAINT "exercise_questions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exercise_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_unlocks" ADD CONSTRAINT "unit_unlocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_unlocks" ADD CONSTRAINT "unit_unlocks_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_log" ADD CONSTRAINT "streak_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emy_appearance_log" ADD CONSTRAINT "emy_appearance_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- Hand-written SQL below this line.
--
-- Everything above this point was generated by `prisma migrate diff` from
-- prisma/schema.prisma. CHECK constraints, triggers, and REVOKE statements
-- have no representation in the Prisma Schema Language, so they're added
-- here by hand. Because schema.prisma never expresses them, future
-- `prisma migrate dev` runs won't try to remove them — see the comment at
-- the top of schema.prisma for the full explanation.
-- ============================================================================

-- ---------- CHECK constraints ----------

ALTER TABLE "users" ADD CONSTRAINT "email_format" CHECK (
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
ALTER TABLE "users" ADD CONSTRAINT "password_or_oauth" CHECK (
  (auth_provider = 'email' AND password_hash IS NOT NULL) OR
  (auth_provider != 'email' AND password_hash IS NULL)
);
ALTER TABLE "users" ADD CONSTRAINT "role_valid" CHECK (role IN ('student', 'admin'));

ALTER TABLE "sessions" ADD CONSTRAINT "expires_in_future" CHECK (expires_at > created_at);

ALTER TABLE "verification_tokens" ADD CONSTRAINT "purpose_valid" CHECK (
  purpose IN ('email_verify', 'password_reset')
);

ALTER TABLE "subjects" ADD CONSTRAINT "level_valid" CHECK (
  level IN ('ensino_medio', 'universitario')
);

ALTER TABLE "lesson_tags" ADD CONSTRAINT "tag_valid" CHECK (
  tag IN ('video', 'interactive', 'exercise')
);

ALTER TABLE "exercises" ADD CONSTRAINT "difficulty_valid" CHECK (
  difficulty IN ('easy', 'medium', 'hard')
);
ALTER TABLE "exercises" ADD CONSTRAINT "points_by_difficulty" CHECK (
  (difficulty = 'easy'   AND points BETWEEN 30  AND 50)  OR
  (difficulty = 'medium' AND points BETWEEN 60  AND 90)  OR
  (difficulty = 'hard'   AND points BETWEEN 120 AND 150)
);

ALTER TABLE "lesson_progress" ADD CONSTRAINT "status_valid" CHECK (
  status IN ('not_started', 'in-progress', 'done')
);
ALTER TABLE "lesson_progress" ADD CONSTRAINT "completed_consistency" CHECK (
  (status = 'done' AND completed_at IS NOT NULL) OR
  (status != 'done' AND completed_at IS NULL)
);
ALTER TABLE "lesson_progress" ADD CONSTRAINT "accuracy_range" CHECK (
  accuracy IS NULL OR accuracy BETWEEN 0 AND 100
);

ALTER TABLE "emy_appearance_log" ADD CONSTRAINT "context_valid" CHECK (context IN (
  'onboarding', 'callout', 'error_streak_3',
  'celebration_unit', 'celebration_module', 'streak_7'
));

-- ---------- updated_at trigger ----------

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER lesson_progress_updated_at BEFORE UPDATE ON "lesson_progress"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- Append-only enforcement (exercise_attempts, streak_log) ----------
--
-- Both tables record events (attempts, daily practice) that must never be
-- edited after the fact — only INSERT and SELECT are legitimate. REVOKE
-- UPDATE alone is not sufficient here: in Postgres, a table's OWNER always
-- retains implicit full privileges on it regardless of REVOKE, and in this
-- dev setup the app connects as the same role that owns the tables (the
-- migration user). So the real enforcement is the BEFORE UPDATE trigger
-- below, which fires unconditionally for every role, including the owner.
-- The REVOKE is kept anyway as defense-in-depth for a future least-privilege
-- "app_user" role that is NOT the table owner.

COMMENT ON TABLE "exercise_attempts" IS
  'APPEND-ONLY: records of exercise attempts. Never UPDATE — only INSERT and SELECT. Enforced by trigger exercise_attempts_no_update.';

COMMENT ON TABLE "streak_log" IS
  'APPEND-ONLY: one row per (user, day) practiced. Never UPDATE — only INSERT and SELECT. Enforced by trigger streak_log_no_update.';

REVOKE UPDATE ON "exercise_attempts" FROM PUBLIC;
REVOKE UPDATE ON "streak_log" FROM PUBLIC;

CREATE OR REPLACE FUNCTION forbid_update() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'append-only table: UPDATE is not allowed on %', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER exercise_attempts_no_update
  BEFORE UPDATE ON "exercise_attempts"
  FOR EACH ROW EXECUTE FUNCTION forbid_update();

CREATE TRIGGER streak_log_no_update
  BEFORE UPDATE ON "streak_log"
  FOR EACH ROW EXECUTE FUNCTION forbid_update();

