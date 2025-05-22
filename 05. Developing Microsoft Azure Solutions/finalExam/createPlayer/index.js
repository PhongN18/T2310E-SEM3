const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const { playerName, fullName, age, currentLevel } = req.body;
    if (!playerName || age == null || currentLevel == null) {
        context.res = { status: 400, body: 'Missing required player fields.' };
        return;
    }

    try {
        const playerId = await new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, err => {
            if (err) return reject(err);
        });
        db.run(
            `INSERT INTO Player (PlayerName, FullName, Age, CurrentLevel)
            VALUES (?, ?, ?, ?)`,
            [playerName, fullName, age, currentLevel],
            function (err) {
                if (err) {
                    db.close();
                    return reject(err);
                }
                const id = this.lastID;
                db.close();
                resolve(id);
            }
        );
        });

        context.res = { status: 201, body: { playerId } };
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
