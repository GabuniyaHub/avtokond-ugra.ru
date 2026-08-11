import http from 'node:http';
import { busService } from '../services/busService.js'
export async function getBusData(req: http.IncomingMessage, res: http.ServerResponse) {
     try {
            const data = await busService.getAllBus();
            res
            .writeHead(200, { 'Content-Type': 'application/json'})
            .end(JSON.stringify(data));
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error("Error", error);
            res
                .writeHead(500, {
                    'Content-Type': 'application/json',
                })
                .end(JSON.stringify({
                    error: 'error upload data',
                    details: error.message
                }));
            return false;
        }
}