// src/functions/getPlayer/index.js
const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const playerId = parseInt(req.query.playerId);
    if (!playerId) {
        context.res = { status: 400, body: "Please pass playerId on the query string" };
        return;
    }

    // Wrap sqlite3 in a Promise
    const getPlayer = () => new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, err => {
            if (err) return reject(err);
            db.get(
                `SELECT * FROM Player WHERE PlayerId = ?`,
                [playerId],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    });

    try {
        const player = await getPlayer();
        if (!player) {
            context.res = { status: 404, body: "Player not found" };
        } else {
            context.res = { status: 200, body: player };
        }
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
