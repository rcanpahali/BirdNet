import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_PATH = path.resolve(__dirname, '..', '..', 'data', 'birdnet.db');
const configuredPath = process.env.DATABASE_PATH;
export const databaseFilePath = configuredPath ? path.resolve(configuredPath) : DEFAULT_DB_PATH;

const databaseDir = path.dirname(databaseFilePath);
fs.mkdirSync(databaseDir, { recursive: true });

const db = new Database(databaseFilePath);

const schemaPath = process.env.DATABASE_SCHEMA_PATH
  ? path.resolve(process.env.DATABASE_SCHEMA_PATH)
  : path.resolve(__dirname, '..', '..', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

db.exec(schemaSql);

export default db;
