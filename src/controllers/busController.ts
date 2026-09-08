import http from 'node:http';
import { busService } from '../services/busService.js';
import { authService } from '../services/authService.js';
import { authenticateRequest } from '../middleware/auth.js';

export async function getBusData(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
        const data = busService.getAllBus();
        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify(data));
        return true;
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Error", error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({
               error: 'Error loading data',
               details: error.message
           }));
        return false;
    }
}

export async function postBusData(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
        // Проверка авторизации
        if (!await authenticateRequest(req, res)) {
            return true;
        }

        const body = await getRequestBody(req);
        
        // Валидация
        const validationError = validateBusData(body);
        if (validationError) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: validationError }));
            return true;
        }

        const newBus = busService.createBus(body);
        
        if (newBus) {
            res.writeHead(201, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({
                   message: 'Запись создана',
                   data: newBus
               }));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Ошибка при создании записи' }));
        }
        return true;
    } catch (error) {
        console.error('Error creating bus:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Internal server error' }));
        return false;
    }
}

export async function updateBusData(req: http.IncomingMessage, res: http.ServerResponse, id: number) {
    try {
        // Проверка авторизации
        if (!await authenticateRequest(req, res)) {
            return true;
        }

        const body = await getRequestBody(req);
        
        // Проверка существования записи
        const existingBus = busService.getBusById(id);
        if (!existingBus) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Запись не найдена' }));
            return true;
        }

        const updatedBus = busService.updateBus(id, body);
        
        if (updatedBus) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({
                   message: 'Запись обновлена',
                   data: updatedBus
               }));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Ошибка при обновлении записи' }));
        }
        return true;
    } catch (error) {
        console.error('Error updating bus:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Internal server error' }));
        return false;
    }
}

export async function deleteBusData(req: http.IncomingMessage, res: http.ServerResponse, id: number) {
    try {
        // Проверка авторизации
        if (!await authenticateRequest(req, res)) {
            return true;
        }

        const deleted = busService.deleteBus(id);
        
        if (deleted) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ message: 'Запись удалена' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Запись не найдена' }));
        }
        return true;
    } catch (error) {
        console.error('Error deleting bus:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Internal server error' }));
        return false;
    }
}

export async function deleteAllBusData(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
        // Проверка авторизации
        if (!await authenticateRequest(req, res)) {
            return true;
        }

        const deletedCount = busService.deleteAllBuses();
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({
               message: `Удалено записей: ${deletedCount}`,
               deletedCount
           }));
        return true;
    } catch (error) {
        console.error('Error deleting all buses:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Internal server error' }));
        return false;
    }
}

export async function loginAdmin(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
        const body = await getRequestBody(req);
        
        if (!body.username || !body.password) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Требуется логин и пароль' }));
            return true;
        }

        const authResult = authService.authenticate(body.username, body.password);
        
        if (authResult) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({
                   message: 'Авторизация успешна',
                   token: authResult.token,
                   user: authResult.user
               }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ error: 'Неверный логин или пароль' }));
        }
        return true;
    } catch (error) {
        console.error('Login error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Internal server error' }));
        return false;
    }
}

function getRequestBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

function validateBusData(data: any): string | null {
    if (!data.model || !data.category || !data.datetime || !data.owner || !data.regNumber) {
        return 'Все поля обязательны для заполнения';
    }
    return null;
}