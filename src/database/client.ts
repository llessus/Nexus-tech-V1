import Database from 'better-sqlite3';
import { resolve } from 'node:path';

const dbPath = resolve(process.cwd(), 'nexus.db');

export const db = new Database(dbPath);

// Habilita WAL mode para melhor performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
