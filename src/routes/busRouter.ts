import http from 'node:http';
import {getBusData} from '../controllers/busController.js';
export async function router ( req: http.IncomingMessage, res: http.ServerResponse ) {
    const method: string | undefined = req.method;
    const url: string | undefined = req.url;

    if ( method === "GET" && url === '/api/v1/bus-data') {
        return await getBusData(req, res)
    }

    return false;
}