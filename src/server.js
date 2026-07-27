import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';

import { Database, initDB } from './database/initDB.js';


initDB();

const server = http.createServer( async (request, response) => {

    if ( request.method === "GET" && request.url === '/api/v1/bus-data') {
        try {
            const stmt = Database.prepare('SELECT * FROM buses ORDER BY datetime DESC');
            const data =stmt.all();

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

// [
//     {
//         "model": "МАЗ-206",
//         "category": "M3",
//         "datetime": "2026-07-27T14:30",
//         "owner": "ООО «Автоконд»",
//         "regNumber": "А123ВС 86"
//     },
//     {
//         "model": "ПАЗ-3205",
//         "category": "M2",
//         "datetime": "2026-07-27T15:00",
//         "owner": "ИП Иванов",
//         "regNumber": "В789ХР 86"
//     }
// ]