PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  mimetype TEXT,
  file_size INTEGER,
  lat REAL,
  lon REAL,
  min_conf REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  analysis_id INTEGER NOT NULL,
  common_name TEXT,
  scientific_name TEXT,
  confidence REAL,
  start_time REAL,
  end_time REAL,
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);
