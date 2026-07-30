/**
 * Database schema migrations.
 * Each entry runs exactly once, in order, tracked by the user_version pragma.
 */
export const MIGRATIONS: string[] = [
  // ── 001 · Initial schema ────────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS migraine_log (
    id                TEXT PRIMARY KEY NOT NULL,
    date              TEXT NOT NULL,          -- YYYY-MM-DD, onset date
    start_time        TEXT NOT NULL,          -- ISO 8601 timestamp
    end_time          TEXT,                   -- NULL while ongoing
    duration_minutes  INTEGER,               -- computed on save
    severity          INTEGER NOT NULL,       -- 1–10
    head_location     TEXT NOT NULL,          -- enum: see HeadLocation
    migraine_type     TEXT NOT NULL,          -- enum: see MigraineType
    has_aura          INTEGER NOT NULL DEFAULT 0,  -- 0|1 boolean
    aura_symptoms     TEXT NOT NULL DEFAULT '[]',  -- JSON array
    prodrome_symptoms TEXT NOT NULL DEFAULT '[]',  -- JSON array
    notes             TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_migraine_date ON migraine_log(date);
  `,

  // ── 002 · Diet log ──────────────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS diet_log (
    id                TEXT PRIMARY KEY NOT NULL,
    date              TEXT NOT NULL,
    meal_time         TEXT NOT NULL,
    meal_label        TEXT NOT NULL,          -- breakfast|lunch|dinner|snack|drink
    foods             TEXT NOT NULL DEFAULT '[]',
    suspected_trigger INTEGER NOT NULL DEFAULT 0,
    notes             TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_diet_date ON diet_log(date);
  `,

  // ── 003 · Sleep diary ───────────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS sleep_diary (
    id                TEXT PRIMARY KEY NOT NULL,
    date              TEXT NOT NULL,          -- morning date (wake-up day)
    bedtime           TEXT NOT NULL,
    wake_time         TEXT NOT NULL,
    duration_minutes  INTEGER,
    quality           INTEGER NOT NULL,       -- 1–10
    interruptions     INTEGER NOT NULL DEFAULT 0,
    notes             TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sleep_date ON sleep_diary(date);
  `,

  // ── 004 · Focus tracker ─────────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS focus_tracker (
    id                TEXT PRIMARY KEY NOT NULL,
    date              TEXT NOT NULL,
    session_start     TEXT NOT NULL,
    session_end       TEXT,
    duration_minutes  INTEGER,
    focus_score       INTEGER NOT NULL,       -- 1–10
    activity_type     TEXT NOT NULL,          -- enum: see ActivityType
    notes             TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_focus_date ON focus_tracker(date);
  `,

  // ── 005 · Cross-link table ──────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS cross_links (
    id            TEXT PRIMARY KEY NOT NULL,
    migraine_id   TEXT NOT NULL REFERENCES migraine_log(id) ON DELETE CASCADE,
    linked_table  TEXT NOT NULL,   -- diet_log|sleep_diary|focus_tracker
    linked_id     TEXT NOT NULL,
    link_type     TEXT NOT NULL,   -- auto_date|manual
    created_at    TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_cross_migraine ON cross_links(migraine_id);
  `,
];
