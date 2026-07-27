import sqlite from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаём папку, если её нет
const dbPath = join(__dirname, '../../database/database.sqlite');
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Подключаемся к БД (синхронно)
const db = new sqlite.DatabaseSync(dbPath);

// Создаём таблицу, если её нет
db.exec(`
    CREATE TABLE IF NOT EXISTS buses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model VARCHAR(100) NOT NULL,
        category VARCHAR(10) NOT NULL,
        datetime DATETIME NOT NULL,
        owner VARCHAR(200) NOT NULL,
        reg_number VARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const buses = [
    {
        model: 'МАЗ-206',
        category: 'M3',
        datetime: '2026-07-27 08:00:00',
        owner: 'ООО «Автоконд»',
        regNumber: 'А001ВС 86'
    },
    {
        model: 'ПАЗ-3205',
        category: 'M2',
        datetime: '2026-07-27 08:30:00',
        owner: 'ООО «Автоконд»',
        regNumber: 'В002ХР 86'
    }
];

const stmt = db.prepare(`
    INSERT INTO buses (model, category, datetime, owner, reg_number)
    VALUES (?, ?, ?, ?, ?)
`);

let count = 0;
for (const bus of buses) {
    stmt.run(
        bus.model,
        bus.category,
        bus.datetime,
        bus.owner,
        bus.regNumber
    );
    count++;
}

console.log(`✅ Добавлено ${count} записей`);

db.close();