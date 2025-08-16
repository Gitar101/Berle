import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { logsTable } from './src/db/schema.js'; // Ensure correct path and .js extension for import

async function checkDatabase() {
  try {
    const sqlite = new Database('sqlite.db');
    const db = drizzle(sqlite, { schema: { logsTable } });

    console.log("Checking if logsTable exists and has data...");

    // Attempt to select a limited number of rows to check for data
    const logs = await db.select().from(logsTable).limit(5).all();

    if (logs.length > 0) {
      console.log(`Found ${logs.length} entries in logsTable. Sample data:`, logs);
    } else {
      console.log("logsTable exists but is empty.");
    }
  } catch (error) {
    console.error("Error accessing database or logsTable:", error);
    if (error instanceof Error && error.message.includes("no such table: logs")) {
      console.error("The 'logs' table does not exist. This indicates a migration issue.");
    }
  }
}

checkDatabase();