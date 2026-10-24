import app from './app.js';
import { config } from './config.js';

// Start HTTP server for local standalone Node.js execution
const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 Parko Production-Grade Backend Server Running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🏥 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🚗 Spaces API: http://localhost:${config.port}/api/spaces`);
  console.log(`🎫 Bookings API: http://localhost:${config.port}/api/bookings`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  console.log(`\n[SHUTDOWN] Received ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed cleanly. Goodbye!');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
