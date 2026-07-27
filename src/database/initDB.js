import { DatabaseSync } from 'node:sqlite';

const Database = new DatabaseSync('./database/database.sqlite');

function initDB() {
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
        console.log('The database is created.')
}

export { Database, initDB };