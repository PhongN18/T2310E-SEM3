const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const playerId = parseInt(req.query.playerId);
    if (!playerId) {
        context.res = { status: 400, body: 'Please provide playerId.' };
        return;
    }

    try {
        const rows = await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, err => {
                if (err) return reject(err);
            });
            db.all(
                `SELECT
                p.PlayerName,
                p.CurrentLevel AS Level,
                p.Age,
                a.AssetName
                FROM Player p
                JOIN PlayerAsset pa ON pa.PlayerId = p.PlayerId
                JOIN Asset a         ON a.AssetId   = pa.AssetId
                WHERE p.PlayerId = ?`,
                [playerId],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        context.res = { status: 200, body: rows };
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
