import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';

import { Database, initDB } from './database/initDB.js';


initDB();

const server = http.createServer( async (request, response) => {

    if ( request.method === "GET" && request.url === '/api/v1/bus-data') {
        try {
            const stmt = Database.prepare(`
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
            `);
            const data = stmt.all();

            response.writeHead(200, {
                'Content-Type': 'application/json',
            });
            response.end(JSON.stringify(data));
        } catch (error) {
            console.error("Error", error);
            response.writeHead(500, {
                'Content-Type': 'application/json',
            });
            response.end(JSON.stringify({
                error: 'error upload data',
                details: error.message
            }));
        }
        return;
    }
    
    response.writeHead(404, {
        'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({
        error: 'Route not found.'
    }))
}); 

server.listen(4080, 'localhost', () => {
    console.log("The server start listening on port 4080.");
});