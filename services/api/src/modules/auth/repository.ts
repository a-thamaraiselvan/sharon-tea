import { query } from '../../database/connection.js';
import { UserRecord } from '../../types/index.js';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const res = await query<UserRecord>(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = true',
      [email]
    );
    return res.rows[0] || null;
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    const res = await query<UserRecord>(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return res.rows[0] || null;
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  }

  async findRefreshToken(
    token: string
  ): Promise<{ id: string; user_id: string; expires_at: Date } | null> {
    const res = await query<{ id: string; user_id: string; expires_at: Date }>(
      'SELECT id, user_id, expires_at FROM refresh_tokens WHERE token = $1',
      [token]
    );
    return res.rows[0] || null;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      passwordHash,
      userId,
    ]);
  }
}

export const authRepository = new AuthRepository();
