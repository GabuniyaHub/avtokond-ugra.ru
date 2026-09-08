import { Database } from '../database/initDB.js';
import { Buses } from '../types/types.js'

export interface BusInput {
    model: string;
    category: string;
    datetime: string;
    owner: string;
    regNumber: string;
}

export class BusService {
    private readonly db = Database;

    public getAllBus(): Buses[] {
        const result = this.db
            .prepare(`
                SELECT 
                    id, 
                    model, 
                    category, 
                    datetime, 
                    owner, 
                    reg_number as regNumber,
                    created_at as createdAt,
                    updated_at as updatedAt
                FROM buses 
                ORDER BY datetime DESC    
            `)
            .all();
        return result as unknown as Buses[];
    }

    public getBusById(id: number): Buses | undefined {
        const result = this.db
            .prepare(`
                SELECT 
                    id, 
                    model, 
                    category, 
                    datetime, 
                    owner, 
                    reg_number as regNumber,
                    created_at as createdAt,
                    updated_at as updatedAt
                FROM buses 
                WHERE id = ?
            `)
            .get(id);
        return result as unknown as Buses | undefined;
    }

    public createBus(data: BusInput): Buses | null {
        try {
            const result = this.db
                .prepare(`
                    INSERT INTO buses (model, category, datetime, owner, reg_number)
                    VALUES (?, ?, ?, ?, ?)
                `)
                .run(
                    data.model,
                    data.category,
                    data.datetime,
                    data.owner,
                    data.regNumber
                );

            const insertId = Number(result.lastInsertRowid);
            return this.getBusById(insertId) || null;
        } catch (error) {
            console.error('Error creating bus:', error);
            return null;
        }
    }

    public updateBus(id: number, data: Partial<BusInput>): Buses | null {
        try {
            const currentBus = this.getBusById(id);
            if (!currentBus) {
                return null;
            }

            const updates: string[] = [];
            const params: any[] = [];

            if (data.model !== undefined) {
                updates.push('model = ?');
                params.push(data.model);
            }
            if (data.category !== undefined) {
                updates.push('category = ?');
                params.push(data.category);
            }
            if (data.datetime !== undefined) {
                updates.push('datetime = ?');
                params.push(data.datetime);
            }
            if (data.owner !== undefined) {
                updates.push('owner = ?');
                params.push(data.owner);
            }
            if (data.regNumber !== undefined) {
                updates.push('reg_number = ?');
                params.push(data.regNumber);
            }

            if (updates.length === 0) {
                return currentBus;
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);

            const query = `UPDATE buses SET ${updates.join(', ')} WHERE id = ?`;
            this.db.prepare(query).run(...params);

            return this.getBusById(id) || null;
        } catch (error) {
            console.error('Error updating bus:', error);
            return null;
        }
    }

    public deleteBus(id: number): boolean {
        try {
            const result = this.db.prepare('DELETE FROM buses WHERE id = ?').run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting bus:', error);
            return false;
        }
    }

    public deleteAllBuses(): number {
        try {
            const result = this.db.prepare('DELETE FROM buses').run();
            return Number(result.changes);
        } catch (error) {
            console.error('Error deleting all buses:', error);
            return 0;
        }
    }
}

export const busService = new BusService();