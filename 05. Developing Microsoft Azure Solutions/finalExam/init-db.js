// init-db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/battlegame.db');

db.serialize(() => {
    // 1. Create tables if they don't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS Player (
        PlayerId     INTEGER PRIMARY KEY AUTOINCREMENT,
        PlayerName   TEXT    NOT NULL,
        FullName     TEXT,
        Age          INTEGER,
        CurrentLevel INTEGER
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Asset (
        AssetId     INTEGER PRIMARY KEY AUTOINCREMENT,
        AssetName   TEXT    NOT NULL,
        Description TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS PlayerAsset (
        PlayerAssetId INTEGER PRIMARY KEY AUTOINCREMENT,
        PlayerId      INTEGER NOT NULL,
        AssetId       INTEGER NOT NULL,
        FOREIGN KEY(PlayerId) REFERENCES Player(PlayerId),
        FOREIGN KEY(AssetId)  REFERENCES Asset(AssetId)
        )
    `);

    // 2. (Optional) Clear existing data so you can re-run without duplicates
    db.run(`DELETE FROM PlayerAsset`);
    db.run(`DELETE FROM Player`);
    db.run(`DELETE FROM Asset`);

    // 3. Seed Players
    db.run(`
        INSERT INTO Player (PlayerName, FullName, Age, CurrentLevel) VALUES
        ('Player1', 'Alice Smith', 20, 10),
        ('Player2', 'Bob Jones',   19,  3),
        ('Player3', 'Carol Lee',   23, 10)
    `);

    // 4. Seed Assets
    db.run(`
        INSERT INTO Asset (AssetName, Description) VALUES
        ('Hero 1', 'Brave warrior'),
        ('Hero 2', 'Cunning archer')
    `);

    // 5. Link Players to Assets
    //    Player1 → Hero 1
    //    Player2 → Hero 2
    //    Player3 → Hero 1
    db.run(`
        INSERT INTO PlayerAsset (PlayerId, AssetId) VALUES
        (1, 1),
        (2, 2),
        (3, 1)
    `);

    console.log('Database initialized with sample data.');
});

db.close();
