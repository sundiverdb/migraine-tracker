// ── Enums ────────────────────────────────────────────────────────────────────

export type HeadLocation =
  | 'left_side'
  | 'right_side'
  | 'bilateral'
  | 'forehead'
  | 'back'
  | 'neck'
  | 'full_head';

export type MigraineType =
  | 'migraine'
  | 'tension'
  | 'cluster'
  | 'ocular'
  | 'vestibular'
  | 'hemiplegic';

export type AuraSymptom =
  | 'visual_disturbance'
  | 'tingling'
  | 'speech'
  | 'motor'
  | 'other';

export type ProdromeSymptom =
  | 'fatigue'
  | 'mood_change'
  | 'food_craving'
  | 'neck_stiffness'
  | 'yawning';

export type MealLabel = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';

export type ActivityType =
  | 'deep_work'
  | 'reading'
  | 'meeting'
  | 'exercise'
  | 'other';

export type LinkedTable = 'diet_log' | 'sleep_diary' | 'focus_tracker';
export type LinkType = 'auto_date' | 'manual';

// ── Domain models ────────────────────────────────────────────────────────────

export interface MigraineEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO 8601
  endTime: string | null;
  durationMinutes: number | null;
  severity: number; // 1–10
  headLocation: HeadLocation;
  migraineType: MigraineType;
  hasAura: boolean;
  auraSymptoms: AuraSymptom[];
  prodromeSymptoms: ProdromeSymptom[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DietEntry {
  id: string;
  date: string;
  mealTime: string;
  mealLabel: MealLabel;
  foods: string[];
  suspectedTrigger: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationMinutes: number | null;
  quality: number; // 1–10
  interruptions: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FocusEntry {
  id: string;
  date: string;
  sessionStart: string;
  sessionEnd: string | null;
  durationMinutes: number | null;
  focusScore: number; // 1–10
  activityType: ActivityType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrossLink {
  id: string;
  migraineId: string;
  linkedTable: LinkedTable;
  linkedId: string;
  linkType: LinkType;
  createdAt: string;
}

// ── Input types (omit computed / auto fields) ────────────────────────────────

export type CreateMigraineInput = Omit<
  MigraineEntry,
  'id' | 'durationMinutes' | 'createdAt' | 'updatedAt'
>;

export type UpdateMigraineInput = Partial<
  Omit<MigraineEntry, 'id' | 'createdAt' | 'updatedAt'>
>;
