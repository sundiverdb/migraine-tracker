import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('migraine_tracker.db');

  // Enable WAL mode for better concurrent read performance
  await _db.execAsync('PRAGMA journal_mode = WAL;');
  // Enable foreign key enforcement
  await _db.execAsync('PRAGMA foreign_keys = ON;');

  await runMigrations(_db);
  return _db;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  for (let i = currentVersion; i < MIGRATIONS.length; i++) {
    await db.execAsync(MIGRATIONS[i]);
    await db.execAsync(`PRAGMA user_version = ${i + 1}`);
    console.log(`[DB] Migration ${i + 1} applied`);
  }
}
