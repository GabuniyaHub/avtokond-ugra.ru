import http from 'node:http';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { inicializationDB } from './database/initDB.js';
import { router } from './routes/busRouter.js';
import { logRequest } from './utils/serve.logger.js';
import { serveStatic } from './utils/serve.static.js';
import { send404 } from './utils/serve.404.js';

const __Filename: string = fileURLToPath(import.meta.url); 
const __dirname: string = path.dirname(__Filename);
const publicDir: string = path.join(__dirname, '..', 'public');
const pagesDir: string = path.join(publicDir, 'pages');
await inicializationDB();

const env = dotenv.config();
if ( env.error ) {
    console.warn('.env file not found');
}

const PORT: number = Number(process.env.PORT);
const HOST: string | undefined = process.env.HOST;

const server = http.createServer( 
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
        logRequest(req, 'API');

        const isBusRouter = await router(req, res);
        if (isBusRouter) return ;

        const isServeStatic = await serveStatic(req,res, publicDir);
        if (isServeStatic) return;
        
        await send404(res, pagesDir);
    }
); 

server.listen(PORT, HOST, () => {
    console.log("The server start listening on port 4080. http://localhost:4080/");
});