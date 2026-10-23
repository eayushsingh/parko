import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { Booking } from '../types.js';

const router = Router();

// GET /api/bookings - List bookings with filters
router.get('/', (req: Request, res: Response) => {
  try {
    let bookings = db.bookings.getAll();
    const { driverEmail, spaceId, status } = req.query;

    if (typeof driverEmail === 'string' && driverEmail.trim()) {
      bookings = bookings.filter((b) => b.driverEmail.toLowerCase() === driverEmail.trim().toLowerCase());
    }

    if (typeof spaceId === 'string' && spaceId.trim()) {
      bookings = bookings.filter((b) => b.spaceId === spaceId.trim());
    }

    if (typeof status === 'string' && status.trim()) {
      bookings = bookings.filter((b) => b.status === status.trim());
    }

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve bookings';
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/bookings/:id - Get booking pass by ID or Reference
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const booking = db.bookings.getById(id) || db.bookings.getByReference(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking reservation not found.' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve booking';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/bookings - Create and confirm a reservation
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      spaceId,
      driverName,
      driverEmail,
      driverPhone,
      vehiclePlate,
      vehicleModel,
      date,
      startTime,
      endTime,
      durationHours,
      paymentMethod
    } = req.body;

    // Validation
    if (!spaceId) {
      return res.status(400).json({ success: false, error: 'Target spaceId is required.' });
    }

    const space = db.spaces.getById(spaceId);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Parking space does not exist.' });
    }

    if (!space.availableNow) {
      return res.status(400).json({ success: false, error: 'This parking space is temporarily unavailable.' });
    }

    if (!driverName || !vehiclePlate) {
      return res.status(400).json({ success: false, error: 'Driver name and vehicle license plate are required.' });
    }

    // Calculate hours
    let hours = durationHours ? Number(durationHours) : 2;
    if (startTime && endTime && !durationHours) {
      const [startH] = startTime.split(':').map(Number);
      const [endH] = endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(endH) && endH > startH) {
        hours = endH - startH;
      }
    }
    hours = Math.max(1, hours);

    const hourlyRate = space.hourlyRate;
    const subtotal = Math.round(hourlyRate * hours * 100) / 100;
    const serviceFee = Math.round(subtotal * 0.1 * 100) / 100; // 10% guarantee fee
    const totalAmount = Math.round((subtotal + serviceFee) * 100) / 100;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `PRK-${randomSuffix}-IN`;
    const gatePin = `${Math.floor(1000 + Math.random() * 9000)}#`;

    const newBooking: Booking = {
      id: `bkg-${Date.now().toString(36)}-${randomSuffix}`,
      bookingReference: bookingRef,
      spaceId: space.id,
      spaceTitle: space.title,
      spaceAddress: space.address,
      spaceImage: space.images[0] || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
      driverName: driverName.trim(),
      driverEmail: (driverEmail || 'driver@example.com').trim(),
      driverPhone: (driverPhone || '+91 98765 43210').trim(),
      vehiclePlate: vehiclePlate.trim().toUpperCase(),
      vehicleModel: (vehicleModel || 'Standard Vehicle').trim(),
      date: date || 'Today',
      startTime: startTime || '09:00',
      endTime: endTime || '17:00',
      durationHours: hours,
      hourlyRate,
      subtotal,
      serviceFee,
      totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      qrCodeSeed: `PARKO-PASS-${bookingRef}-${Date.now()}`,
      gateCode: gatePin
    };

    const created = db.bookings.create(newBooking);

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed! Digital pass activated.',
      data: created
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create reservation';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/bookings/:id/cancel - Cancel reservation with 100% refund policy
router.post('/:id/cancel', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const booking = db.bookings.getById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking reservation not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, error: 'Reservation has already been cancelled.' });
    }

    const updated = db.bookings.updateStatus(id, 'cancelled');

    res.json({
      success: true,
      message: `Reservation ${booking.bookingReference} cancelled. 100% refund of ₹${booking.totalAmount.toFixed(2)} initiated to original payment method.`,
      refundAmount: booking.totalAmount,
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to cancel reservation';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/bookings/:id/trigger-gate - IoT Smart Gate Actuator simulator
router.post('/:id/trigger-gate', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const booking = db.bookings.getById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(403).json({ success: false, error: 'Access denied: reservation is cancelled.' });
    }

    const logEntry = {
      id: `log-${Date.now()}`,
      bookingId: booking.id,
      vehiclePlate: booking.vehiclePlate,
      action: 'GATE_OPENED' as const,
      timestamp: new Date().toISOString(),
      success: true
    };
    db.gateLogs.add(logEntry);

    res.json({
      success: true,
      message: `Gate barrier opened for vehicle ${booking.vehiclePlate}. Barrier will auto-close in 30 seconds.`,
      gateStatus: 'OPEN',
      vehiclePlate: booking.vehiclePlate,
      gatePin: booking.gateCode || '7482#',
      timestamp: logEntry.timestamp
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to actuate gate';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
