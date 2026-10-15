import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log('Checking database migrations...');

    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch applied migrations
    const appliedResult = await client.query<{ version: string }>(
      'SELECT version FROM schema_migrations ORDER BY version ASC;'
    );
    const appliedVersions = new Set(appliedResult.rows.map((row) => row.version));

    // 3. Resolve migrations directory path
    const candidatePaths = [
      path.resolve(__dirname, '../../migrations'),
      path.resolve(process.cwd(), 'migrations'),
      path.resolve(process.cwd(), 'services/api/migrations'),
    ];

    const migrationsDir = candidatePaths.find((p) => fs.existsSync(p));

    if (!migrationsDir) {
      console.warn('Migrations directory not found in candidate paths:', candidatePaths);
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (!appliedVersions.has(file)) {
        console.log(`Applying migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (version) VALUES ($1);',
            [file]
          );
          await client.query('COMMIT');
          console.log(`Migration applied successfully: ${file}`);
        } catch (migrationError) {
          await client.query('ROLLBACK');
          console.error(`Migration failed for ${file}:`, migrationError);
          throw migrationError;
        }
      } else {
        // already applied
      }
    }

    console.log('All migrations are up to date.');
  } finally {
    client.release();
  }
};
