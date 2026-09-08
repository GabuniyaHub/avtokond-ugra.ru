import http from 'node:http';
import { authService } from '../services/authService.js';

export interface AuthenticatedRequest extends http.IncomingMessage {
    user?: {
        id: number;
        username: string;
    };
}

export async function authenticateRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<boolean> {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendUnauthorized(res);
            return false;
        }

        const token = authHeader.substring(7);
        const user = authService.verifyToken(token);

        if (!user) {
            sendUnauthorized(res);
            return false;
        }

        (req as AuthenticatedRequest).user = user;
        return true;
    } catch (error) {
        console.error('Authentication middleware error:', error);
        sendUnauthorized(res);
        return false;
    }
}

function sendUnauthorized(res: http.ServerResponse) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        error: 'Unauthorized',
        message: 'Требуется авторизация'
    }));
}