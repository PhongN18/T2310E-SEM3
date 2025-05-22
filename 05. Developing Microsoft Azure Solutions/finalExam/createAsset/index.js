const sqlite3 = require('sqlite3').verbose();
const path     = require('path');
const dbPath   = path.join(__dirname, '../data/battlegame.db');

module.exports = async function (context, req) {
    const { assetName, description } = req.body;
    if (!assetName) {
        context.res = { status: 400, body: 'Missing assetName.' };
        return;
    }

    try {
        const assetId = await new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, err => {
                if (err) return reject(err);
            });
            db.run(
                `INSERT INTO Asset (AssetName, Description)
                VALUES (?, ?)`,
                [assetName, description],
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

        context.res = { status: 201, body: { assetId } };
    } catch (err) {
        context.res = { status: 500, body: err.message };
    }
};
