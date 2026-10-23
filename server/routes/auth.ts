import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { UserProfile, UserRole } from '../types.js';

const router = Router();

// POST /api/auth/login - Sign in with email and role
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = db.users.getByEmail(cleanEmail);

    if (!user) {
      // Auto-create user for demo convenience
      const selectedRole: UserRole = role === 'owner' ? 'owner' : 'driver';
      const name = cleanEmail.split('@')[0].replace(/[._]/g, ' ') || 'Parko Member';
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      user = {
        id: `usr-${Date.now().toString(36)}`,
        name: capitalizedName,
        email: cleanEmail,
        role: selectedRole,
        avatar: selectedRole === 'owner'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        phone: '+91 98765 43210',
        memberSince: 'October 2026',
        isVerified: true,
        defaultVehicle: selectedRole === 'driver' ? {
          makeModel: 'Tesla Model 3 (Midnight Silver)',
          licensePlate: 'MH 02 CZ 8921',
          state: 'Maharashtra'
        } : undefined
      };
      db.users.create(user);
    }

    const token = `parko_token_${Buffer.from(cleanEmail).toString('base64')}_${Date.now()}`;

    res.json({
      success: true,
      message: `Signed in as ${user.role === 'owner' ? 'Space Owner' : 'Driver'}.`,
      token,
      user
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/auth/register - Register new user
router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, vehicleMake, vehiclePlate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.users.getByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists. Please log in.' });
    }

    const selectedRole: UserRole = role === 'owner' ? 'owner' : 'driver';

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: cleanEmail,
      role: selectedRole,
      avatar: selectedRole === 'owner'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      phone: (phone || '+91 98765 43210').trim(),
      memberSince: 'October 2026',
      isVerified: true,
      defaultVehicle: selectedRole === 'driver' && (vehicleMake || vehiclePlate) ? {
        makeModel: (vehicleMake || 'Sedan').trim(),
        licensePlate: (vehiclePlate || 'MH 02 CZ 8921').trim().toUpperCase(),
        state: 'Maharashtra'
      } : undefined
    };

    db.users.create(newUser);
    const token = `parko_token_${Buffer.from(cleanEmail).toString('base64')}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Parko.',
      token,
      user: newUser
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/auth/me - Current user
router.get('/me', (_req: Request, res: Response) => {
  try {
    const users = db.users.getAll();
    const user = users[0] || null;
    res.json({
      success: true,
      user
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve profile';
    res.status(500).json({ success: false, error: message });
  }
});

// PUT /api/auth/vehicle - Update vehicle information
router.put('/vehicle', (req: Request, res: Response) => {
  try {
    const { userId, makeModel, licensePlate, state } = req.body;
    const targetUserId = userId || 'usr-driver-01';

    const user = db.users.getById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    const updated = db.users.update(targetUserId, {
      defaultVehicle: {
        makeModel: (makeModel || user.defaultVehicle?.makeModel || 'Sedan').trim(),
        licensePlate: (licensePlate || user.defaultVehicle?.licensePlate || 'MH 02 CZ 8921').trim().toUpperCase(),
        state: (state || user.defaultVehicle?.state || 'Maharashtra').trim()
      }
    });

    res.json({
      success: true,
      message: 'Vehicle information saved successfully.',
      user: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update vehicle details';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
