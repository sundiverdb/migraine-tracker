import { v4 as uuidv4 } from 'uuid';
import { differenceInMinutes, parseISO, format } from 'date-fns';
import { getDb } from '@/db/database';
import type {
  MigraineEntry,
  CreateMigraineInput,
  UpdateMigraineInput,
} from '@/db/types';

// ── Row ↔ Domain mappers ─────────────────────────────────────────────────────

interface MigraineRow {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  severity: number;
  head_location: string;
  migraine_type: string;
  has_aura: number;
  aura_symptoms: string;
  prodrome_symptoms: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToEntry(row: MigraineRow): MigraineEntry {
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMinutes: row.duration_minutes,
    severity: row.severity,
    headLocation: row.head_location as MigraineEntry['headLocation'],
    migraineType: row.migraine_type as MigraineEntry['migraineType'],
    hasAura: row.has_aura === 1,
    auraSymptoms: JSON.parse(row.aura_symptoms),
    prodromeSymptoms: JSON.parse(row.prodrome_symptoms),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function computeDuration(
  startTime: string,
  endTime: string | null
): number | null {
  if (!endTime) return null;
  return differenceInMinutes(parseISO(endTime), parseISO(startTime));
}

// ── Repository ───────────────────────────────────────────────────────────────

export const migraineRepository = {
  /** Insert a new migraine entry. Returns the saved entry with generated id. */
  async create(input: CreateMigraineInput): Promise<MigraineEntry> {
    const db = await getDb();
    const now = new Date().toISOString();
    const id = uuidv4();
    const duration = computeDuration(input.startTime, input.endTime);

    await db.runAsync(
      `INSERT INTO migraine_log (
        id, date, start_time, end_time, duration_minutes,
        severity, head_location, migraine_type,
        has_aura, aura_symptoms, prodrome_symptoms,
        notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.date,
        input.startTime,
        input.endTime ?? null,
        duration,
        input.severity,
        input.headLocation,
        input.migraineType,
        input.hasAura ? 1 : 0,
        JSON.stringify(input.auraSymptoms),
        JSON.stringify(input.prodromeSymptoms),
        input.notes ?? null,
        now,
        now,
      ]
    );

    const row = await db.getFirstAsync<MigraineRow>(
      'SELECT * FROM migraine_log WHERE id = ?',
      [id]
    );
    if (!row) throw new Error('Failed to fetch newly created migraine entry');
    return rowToEntry(row);
  },

  /** Fetch all entries, most recent first. */
  async findAll(): Promise<MigraineEntry[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<MigraineRow>(
      'SELECT * FROM migraine_log ORDER BY start_time DESC'
    );
    return rows.map(rowToEntry);
  },

  /** Fetch all entries for a specific YYYY-MM-DD date. */
  async findByDate(date: string): Promise<MigraineEntry[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<MigraineRow>(
      'SELECT * FROM migraine_log WHERE date = ? ORDER BY start_time DESC',
      [date]
    );
    return rows.map(rowToEntry);
  },

  /** Fetch a single entry by id. Returns null if not found. */
  async findById(id: string): Promise<MigraineEntry | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<MigraineRow>(
      'SELECT * FROM migraine_log WHERE id = ?',
      [id]
    );
    return row ? rowToEntry(row) : null;
  },

  /** Update an existing entry. Re-computes duration if times changed. */
  async update(
    id: string,
    input: UpdateMigraineInput
  ): Promise<MigraineEntry> {
    const db = await getDb();
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Migraine entry ${id} not found`);

    const merged = { ...existing, ...input };
    const duration = computeDuration(merged.startTime, merged.endTime);
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE migraine_log SET
        date = ?, start_time = ?, end_time = ?, duration_minutes = ?,
        severity = ?, head_location = ?, migraine_type = ?,
        has_aura = ?, aura_symptoms = ?, prodrome_symptoms = ?,
        notes = ?, updated_at = ?
      WHERE id = ?`,
      [
        merged.date,
        merged.startTime,
        merged.endTime ?? null,
        duration,
        merged.severity,
        merged.headLocation,
        merged.migraineType,
        merged.hasAura ? 1 : 0,
        JSON.stringify(merged.auraSymptoms),
        JSON.stringify(merged.prodromeSymptoms),
        merged.notes ?? null,
        now,
        id,
      ]
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Failed to fetch updated migraine entry');
    return updated;
  },

  /** Mark an ongoing migraine as ended right now. */
  async endNow(id: string): Promise<MigraineEntry> {
    return this.update(id, { endTime: new Date().toISOString() });
  },

  /** Delete an entry by id. */
  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM migraine_log WHERE id = ?', [id]);
  },

  /** Count entries in the last N days — useful for the Today dashboard stat. */
  async countInLastDays(days: number): Promise<number> {
    const db = await getDb();
    const since = format(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM migraine_log WHERE date >= ?',
      [since]
    );
    return result?.count ?? 0;
  },
};
