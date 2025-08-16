const Database = require('better-sqlite3');

function checkLogsTable() {
  let db;
  try {
    db = new Database('sqlite.db', { readonly: true });
    console.log("Successfully connected to sqlite.db");

    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='logs';").get();

    if (tableExists) {
      console.log("Table 'logs' exists.");
      const count = db.prepare("SELECT COUNT(*) as count FROM logs;").get().count;
      console.log(`Number of entries in 'logs' table: ${count}`);

      if (count > 0) {
        const sampleLogs = db.prepare("SELECT * FROM logs LIMIT 5;").all();
        console.log("Sample data from 'logs' table:", sampleLogs);
      }
    } else {
      console.log("Table 'logs' does NOT exist.");
    }
  } catch (error) {
    console.error("Error checking database:", error.message);
  } finally {
    if (db) {
      db.close();
      console.log("Database connection closed.");
    }
  }
}

checkLogsTable();