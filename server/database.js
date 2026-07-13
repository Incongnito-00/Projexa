const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "projexa.db");

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.error("❌ Database Connection Failed");
        console.error(err.message);
        return;
    }

    console.log("✅ SQLite Connected");

    // ===========================
    // USERS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fullname TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

    // ===========================
    // PROJECTS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS projects (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,

            description TEXT NOT NULL,

            category TEXT NOT NULL,

            budget TEXT,

            deadline TEXT,

            owner INTEGER,

            status TEXT DEFAULT 'Open',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(owner) REFERENCES users(id)

        )
    `);

    // ===========================
    // APPLICATIONS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS applications (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            project_id INTEGER NOT NULL,

            applicant_id INTEGER NOT NULL,

            proposal TEXT NOT NULL,

            status TEXT DEFAULT 'Pending',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(project_id) REFERENCES projects(id),

            FOREIGN KEY(applicant_id) REFERENCES users(id)

        )
    `);

});

module.exports = db;