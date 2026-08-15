import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function serveStatic(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    publicDir: string | undefined
): Promise<boolean> {
    try {
        if (!publicDir) {
            console.error('PublicDir не определён.');
            res
                .writeHead(500, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ error: 'Internal server error. Please try later.' }));
            return true;
        }

        const url: string = req.url || '/';
        const filePath: string = path.join(publicDir, url);

        await fs.access(filePath);

        const ext: string = path.extname(filePath);
        const mimeTypes: Record<string, string> = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        const fileContent = await fs.readFile(filePath);
        res
            .writeHead(200, { 'Content-Type': contentType }) 
            .end(fileContent);
        return true;

    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return false;
        } else {
            console.error(`Ошибка статики: ${error}`);
            res
                .writeHead(500, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ error: 'Internal server error' }));
            return true;
        }
    }
}