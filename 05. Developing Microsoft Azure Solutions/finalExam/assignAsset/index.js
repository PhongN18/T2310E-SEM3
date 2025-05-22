const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const { playerId, assetId } = req.body;
    if (!playerId || !assetId) {
        context.res = { status: 400, body: 'Require playerId and assetId.' };
        return;
    }

    try {
        await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, err => {
                if (err) return reject(err);
            });
            db.run(
                `INSERT INTO PlayerAsset (PlayerId, AssetId)
                VALUES (?, ?)`,
                [playerId, assetId],
                function (err) {
                    db.close();
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        context.res = { status: 201 };
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
