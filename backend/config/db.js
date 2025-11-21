const sqlite3 = require('sqlite3');
const path = require('path');
const dbFile = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) return console.error('DB open error', err);
  console.log('Connected to SQLite DB');
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      createdBy INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
