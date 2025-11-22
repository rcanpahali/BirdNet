import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_PATH = path.join(__dirname, '..', '..', 'data', 'birdnet.db');
const DEFAULT_SCHEMA_PATH = path.join(__dirname, '..', '..', 'schema.sql');

export const databaseFilePath = path.resolve(process.env.DATABASE_PATH ?? DEFAULT_DB_PATH);

const databaseDir = path.dirname(databaseFilePath);
fs.mkdirSync(databaseDir, { recursive: true });

const schemaPath = path.resolve(process.env.DATABASE_SCHEMA_PATH ?? DEFAULT_SCHEMA_PATH);
const schemaFile = fs.readFileSync(schemaPath, 'utf8');

const db = new Database(databaseFilePath);
db.exec(schemaFile);

export default db;
