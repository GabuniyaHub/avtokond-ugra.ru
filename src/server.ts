import http from 'node:http';

import { Database, inicializationDB } from './database/initDB.js';
import { router } from './routes/busRouter.js';


inicializationDB();

const server = http.createServer( async (req: http.IncomingMessage, res: http.ServerResponse) => {
   
    const isBusRouter = await router(req, res);
    if (isBusRouter) return ;
    
    
}); 

server.listen(4080, 'localhost', () => {
    console.log("The server start listening on port 4080. http://localhost:4080/");
});