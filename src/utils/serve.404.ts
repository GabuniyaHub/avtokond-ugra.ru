import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises'

export async function send404(res: http.ServerResponse, pagesDir: string ): Promise<void> {
    try {
        const errorPage = path.join(pagesDir, '404.html');
        const content = await fs.readFile(errorPage, 'utf-8');
        res
            .writeHead(404, {'Content-Type': 'text/html'})
            .end(content); 
    } catch ( error ) {
        console.error('Ошибка загрузки страницы 404.');
        res
            .writeHead(404, {'Content-Type': 'text/html'})
            .end(`
                <!DOCTYPE html>
                <html>
                <head>
                <title>404 - Страница не найдена</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { font-size: 48px; color: #333; }
                    a { color: #1e293b; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
                </head>
                <body>
                    <h1>404</h1>
                    <p>Страница не найдена</p>
                    <a href="/">← Вернуться на главную</a>
                </body>
                </html>
        `);
    }
}