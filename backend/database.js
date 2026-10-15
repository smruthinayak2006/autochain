import Database from "better-sqlite3";

const db = new Database("autochain.db");

db.exec(`
CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deviceId TEXT NOT NULL,
    battery INTEGER,
    wallet REAL,
    latitude REAL,
    longitude REAL,
    status TEXT,
    timestamp TEXT
);
`);

console.log("🗄️ SQLite database ready.");

export default db;