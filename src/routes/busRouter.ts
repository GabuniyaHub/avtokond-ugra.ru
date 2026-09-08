import http from 'node:http';
import { 
    getBusData, 
    postBusData, 
    updateBusData, 
    deleteBusData, 
    deleteAllBusData,
    loginAdmin 
} from '../controllers/busController.js';

export async function router(req: http.IncomingMessage, res: http.ServerResponse) {
    const method: string | undefined = req.method;
    const url: string | undefined = req.url;

    // Авторизация
    if (method === 'POST' && url === '/api/v1/auth/login') {
        return await loginAdmin(req, res);
    }

    // Получение всех записей (публичный)
    if (method === 'GET' && url === '/api/v1/bus-data') {
        return await getBusData(req, res);
    }

    // Создание записи (только админ)
    if (method === 'POST' && url === '/api/v1/bus-data') {
        return await postBusData(req, res);
    }

    // Удаление всех записей (только админ)
    if (method === 'DELETE' && url === '/api/v1/bus-data/all') {
        return await deleteAllBusData(req, res);
    }

    // Операции с конкретной записью
    const busMatch = url?.match(/^\/api\/v1\/bus-data\/(\d+)$/);
    if (busMatch) {
        const id = parseInt(busMatch[1], 10);

        // Обновление записи (только админ)
        if (method === 'PUT') {
            return await updateBusData(req, res, id);
        }

        // Удаление записи (только админ)
        if (method === 'DELETE') {
            return await deleteBusData(req, res, id);
        }
    }

    return false;
}