const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const { assetId, assetName, description } = req.body;
    if (!assetId) {
        context.res = { status: 400, body: 'Missing assetId.' };
        return;
    }

    try {
        await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, err => {
                if (err) return reject(err);
            });
            db.run(
                `UPDATE Asset
                    SET AssetName   = ?,
                        Description = ?
                WHERE AssetId    = ?`,
                [assetName, description, assetId],
                function (err) {
                    db.close();
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        context.res = { status: 204 };
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
