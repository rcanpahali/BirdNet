import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { Detection } from './types';

dotenv.config();

const DEFAULT_DB_PATH = path.resolve(__dirname, '..', 'data', 'birdnet.db');
const configuredPath = process.env.DATABASE_PATH;
const databasePath = configuredPath ? path.resolve(configuredPath) : DEFAULT_DB_PATH;

const databaseDir = path.dirname(databasePath);
fs.mkdirSync(databaseDir, { recursive: true });

const db = new Database(databasePath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    mimetype TEXT,
    file_size INTEGER,
    lat REAL,
    lon REAL,
    min_conf REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    common_name TEXT,
    scientific_name TEXT,
    confidence REAL,
    start_time REAL,
    end_time REAL,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
  )
`);

type AnalysisInsert = {
  filename: string;
  mimetype: string;
  fileSize: number;
  lat?: number;
  lon?: number;
  minConf?: number;
  detections: Detection[];
};

type AnalysisRowParams = {
  filename: string;
  mimetype: string;
  fileSize: number;
  lat: number | null;
  lon: number | null;
  minConf: number | null;
};

const insertAnalysisStatement = db.prepare<AnalysisRowParams>(
  `INSERT INTO analyses (filename, mimetype, file_size, lat, lon, min_conf)
   VALUES (@filename, @mimetype, @fileSize, @lat, @lon, @minConf)`
);

const insertDetectionStatement = db.prepare<Detection & { analysisId: number }>(
  `INSERT INTO detections (analysis_id, common_name, scientific_name, confidence, start_time, end_time)
   VALUES (@analysisId, @common_name, @scientific_name, @confidence, @start_time, @end_time)`
);

const insertTransaction = db.transaction((payload: AnalysisInsert) => {
  const analysisResult = insertAnalysisStatement.run({
    filename: payload.filename,
    mimetype: payload.mimetype,
    fileSize: payload.fileSize,
    lat: typeof payload.lat === 'number' && Number.isFinite(payload.lat) ? payload.lat : null,
    lon: typeof payload.lon === 'number' && Number.isFinite(payload.lon) ? payload.lon : null,
    minConf:
      typeof payload.minConf === 'number' && Number.isFinite(payload.minConf)
        ? payload.minConf
        : null,
  });

  const analysisId = Number(analysisResult.lastInsertRowid);

  for (const detection of payload.detections) {
    insertDetectionStatement.run({
      analysisId,
      ...detection,
    });
  }

  return analysisId;
});

export function recordAnalysis(payload: AnalysisInsert): number {
  return insertTransaction(payload);
}

export const databaseFilePath = databasePath;
