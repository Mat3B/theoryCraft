const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Database opened successfully');

    // This will drop the existing table and recreate it with the necessary columns
    db.run(`DROP TABLE IF EXISTS UserData;`, (err) => {
        if (err) {
            console.error('Error dropping table', err);
            return;
        }
        db.run(`CREATE TABLE UserData (
            id TEXT PRIMARY KEY,
            tons REAL,
            carbonCredits REAL,
            money REAL
        )`, (err) => {
            if (err) {
                console.error('Error creating UserData table', err);
            } else {
                console.log('UserData table created successfully');
            }
        });
    });
});

function modifyTable() {
    db.run(`ALTER TABLE UserData ADD COLUMN tons REAL`, handleResult);
    db.run(`ALTER TABLE UserData ADD COLUMN carbonCredits REAL`, handleResult);
    db.run(`ALTER TABLE UserData ADD COLUMN money REAL`, handleResult);
}

function handleResult(err) {
    if (err && !err.message.includes('duplicate column name')) {
        console.error('Error altering UserData table', err);
    } else {
        console.log('UserData table altered successfully or column already exists');
    }
}

module.exports = db;