import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = async <T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development' && duration > 100) {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error });
    throw error;
  }
};

export const getClient = async (): Promise<pg.PoolClient> => {
  const client = await pool.connect();
  return client;
};

export const connect = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, current_database() as db');
    client.release();
    console.log(`Connected to PostgreSQL database "${res.rows[0].db}" at ${res.rows[0].current_time}`);
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
};

export const close = async (): Promise<void> => {
  await pool.end();
  console.log('PostgreSQL pool connection closed');
};

export default {
  pool,
  query,
  getClient,
  connect,
  close,
};
