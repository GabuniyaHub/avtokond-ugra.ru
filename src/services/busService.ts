import { Database } from '../database/initDB.js';
import { Buses } from '../types/types.js'

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
}

export const busService = new BusService();