const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '..', 'data', 'battlegame.db');

let db;
module.exports = function getDb() {
    if (!db) {
        db = new sqlite3.Database(dbPath, err => {
            if (err) console.error('SQLite open error:', err);
        });
    }
    return db;
};
