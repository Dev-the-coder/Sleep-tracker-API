const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

// setting up the database - sqlite
async function createDbConnection() {
  try{
    const db = await open({
      filename: "./tmp/database.db",
      driver: sqlite3.Database,
    });
    await createTable(db);
    console.log("Connection with SQLite has been established");
    return db;
  } catch(err){
    console.log("Error connecting to the database", err);
  }
}

async function createTable(db) {
  await db.exec(`CREATE TABLE IF NOT EXISTS sleep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    hours REAL,
    timestamp TEXT
  )`);
}

module.exports = createDbConnection();
