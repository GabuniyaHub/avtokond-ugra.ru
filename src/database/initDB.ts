import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

export const Database = new DatabaseSync(dbPath);

export async function inicializationDB(): Promise<void> {
    try {
        Database.exec(` 
            CREATE TABLE IF NOT EXISTS buses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model VARCHAR(100) NOT NULL,
            category VARCHAR(10) NOT NULL,
            datetime DATETIME NOT NULL,
            owner VARCHAR(200) NOT NULL,
            reg_number VARCHAR(20) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_buses_datetime ON buses(datetime);
        CREATE INDEX IF NOT EXISTS idx_buses_reg_number ON buses(reg_number);
        CREATE INDEX IF NOT EXISTS idx_buses_owner ON buses(owner);
        `);
        console.log('Database initialized successfully.');
    } catch ( error ) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}