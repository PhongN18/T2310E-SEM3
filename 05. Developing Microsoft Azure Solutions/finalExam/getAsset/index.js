const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const assetId = parseInt(req.query.assetId);
    if (!assetId) {
        context.res = { status: 400, body: 'Please provide assetId.' };
        return;
    }

    try {
        const asset = await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, err => {
                if (err) return reject(err);
            });
            db.get(
                `SELECT * FROM Asset WHERE AssetId = ?`,
                [assetId],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!asset) {
            context.res = { status: 404, body: 'Asset not found.' };
        } else {
            context.res = { status: 200, body: asset };
        }
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
