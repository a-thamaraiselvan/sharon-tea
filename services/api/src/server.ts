import { createApp } from './app.js';
import { env } from './config/env.js';
import { connect, close } from './database/connection.js';
import { runMigrations } from './database/migrations.js';
import { seedDatabase } from './seed/index.js';

const startServer = async () => {
  try {
    console.log('--- Initializing Sharon Tea Stall API Server ---');

    // 1. Connect to PostgreSQL
    console.log('Connecting to PostgreSQL database...');
    await connect();

    // 2. Run Database Migrations
    console.log('Running database migrations...');
    await runMigrations();

    // 3. Seed Database
    console.log('Checking and running database seeds...');
    await seedDatabase();

    // 4. Create Express App & Listen
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      console.log('====================================================');
      console.log(` Sharon Tea Stall API Server running on port ${env.PORT}`);
      console.log(` Health check: http://localhost:${env.PORT}/health`);
      console.log(` API base URL: http://localhost:${env.PORT}/api/v1`);
      console.log(` Environment:  ${env.NODE_ENV}`);
      console.log('====================================================');
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await close();
          console.log('Database connections closed.');
          process.exit(0);
        } catch (dbError) {
          console.error('Error during database shutdown:', dbError);
          process.exit(1);
        }
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.error('Graceful shutdown timed out. Forcefully terminating.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
