import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const snapshot = db.getSnapshot();
  res.json({
    success: true,
    status: 'HEALTHY',
    service: 'Parko On-Demand Parking API',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    stats: {
      spacesCount: snapshot.spaces.length,
      bookingsCount: snapshot.bookings.length,
      usersCount: snapshot.users.length,
      gateLogsCount: snapshot.gateLogs.length
    }
  });
});

export default router;
