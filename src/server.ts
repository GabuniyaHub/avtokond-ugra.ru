import http from 'node:http';

import { Database, inicializationDB } from './database/initDB.js';
import { router } from './routes/busRouter.js';


await inicializationDB();

const server = http.createServer( async (req: http.IncomingMessage, res: http.ServerResponse) => {
   
    const isBusRouter = await router(req, res);
    if (isBusRouter) return ;
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
}); 

server.listen(4080, 'localhost', () => {
    console.log("The server start listening on port 4080. http://localhost:4080/");
});