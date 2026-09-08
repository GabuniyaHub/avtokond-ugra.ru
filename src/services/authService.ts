import { Database, verifyPassword, hashPassword } from '../database/initDB.js';
import jwt from 'jsonwebtoken';

interface AdminUser {
    id: number;
    username: string;
    password_hash: string;
    created_at: string;
}

export class AuthService {
    private readonly db = Database;
    private readonly jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    }

    public authenticate(username: string, password: string): { token: string; user: any } | null {
        try {
            const user = this.db.prepare(
                'SELECT id, username, password_hash, created_at FROM admins WHERE username = ?'
            ).get(username) as AdminUser | undefined;

            if (!user || !verifyPassword(password, user.password_hash)) {
                return null;
            }

            const token = this.generateToken(user.id, user.username);
            
            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    createdAt: user.created_at
                }
            };
        } catch (error) {
            console.error('Authentication error:', error);
            return null;
        }
    }

    public verifyToken(token: string): { id: number; username: string } | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { id: number; username: string };
            return decoded;
        } catch (error) {
            return null;
        }
    }

    private generateToken(userId: number, username: string): string {
        return jwt.sign(
            { id: userId, username },
            this.jwtSecret,
            { expiresIn: '24h' }
        );
    }

    public changePassword(username: string, oldPassword: string, newPassword: string): boolean {
        try {
            const user = this.db.prepare(
                'SELECT id, password_hash FROM admins WHERE username = ?'
            ).get(username) as AdminUser | undefined;

            if (!user || !verifyPassword(oldPassword, user.password_hash)) {
                return false;
            }

            const newHash = hashPassword(newPassword);
            this.db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
                .run(newHash, user.id);
            
            return true;
        } catch (error) {
            console.error('Change password error:', error);
            return false;
        }
    }
}

export const authService = new AuthService();