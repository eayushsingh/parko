import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { ParkingSpace, VehicleSize, ParkingType, Review } from '../types.js';

const router = Router();

// GET /api/spaces - Search and list spaces with multi-parameter filtering
router.get('/', (req: Request, res: Response) => {
  try {
    let spaces = db.spaces.getAll();

    const {
      q,
      type,
      maxPrice,
      vehicleSize,
      amenities,
      sortBy,
      featured
    } = req.query;

    // Search query
    if (typeof q === 'string' && q.trim()) {
      const queryLower = q.trim().toLowerCase();
      spaces = spaces.filter(
        (s) =>
          s.title.toLowerCase().includes(queryLower) ||
          s.address.toLowerCase().includes(queryLower) ||
          s.neighborhood.toLowerCase().includes(queryLower) ||
          s.nearbyLandmark.toLowerCase().includes(queryLower) ||
          s.description.toLowerCase().includes(queryLower)
      );
    }

    // Parking Type filter
    if (typeof type === 'string' && type !== 'All Types' && type.trim()) {
      spaces = spaces.filter((s) => s.type.toLowerCase() === type.trim().toLowerCase());
    }

    // Max Hourly Rate filter
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      const max = Number(maxPrice);
      spaces = spaces.filter((s) => s.hourlyRate <= max);
    }

    // Vehicle Size filter
    if (typeof vehicleSize === 'string' && vehicleSize !== 'Any Size' && vehicleSize.trim()) {
      spaces = spaces.filter((s) =>
        s.vehicleCompatibility.some((size) => size.toLowerCase() === vehicleSize.trim().toLowerCase())
      );
    }

    // Amenities filter (comma-separated list)
    if (typeof amenities === 'string' && amenities.trim()) {
      const requestedAmenities = amenities.split(',').map((a) => a.trim().toLowerCase());
      spaces = spaces.filter((s) =>
        requestedAmenities.every((reqAmenity) =>
          s.amenities.some((a) => a.toLowerCase().includes(reqAmenity))
        )
      );
    }

    // Featured filter
    if (featured === 'true') {
      spaces = spaces.filter((s) => s.featured);
    }

    // Sort
    if (sortBy === 'price-asc') {
      spaces.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === 'price-desc') {
      spaces.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === 'rating') {
      spaces.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'availability') {
      spaces.sort((a, b) => (b.totalSpots - b.occupiedSpots) - (a.totalSpots - a.occupiedSpots));
    }

    res.json({
      success: true,
      count: spaces.length,
      data: spaces
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search spaces';
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/spaces/:id - Get space details by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const space = db.spaces.getById(id);
    if (!space) {
      return res.status(404).json({
        success: false,
        error: `Parking space with id '${id}' not found.`
      });
    }

    res.json({
      success: true,
      data: space
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve space';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/spaces - Create a new space listing
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      address,
      city,
      neighborhood,
      nearbyLandmark,
      type,
      hourlyRate,
      dailyMaxRate,
      images,
      vehicleCompatibility,
      amenities,
      ownerId,
      ownerName,
      ownerAvatar,
      accessInstructions,
      cancellationPolicy,
      totalSpots
    } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'A valid space title (min 3 chars) is required.' });
    }
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid street address is required.' });
    }
    if (hourlyRate === undefined || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
      return res.status(400).json({ success: false, error: 'Hourly rate must be a positive number.' });
    }

    const newSpace: ParkingSpace = {
      id: `prk-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      description: (description || 'Convenient, secure parking bay managed via Parko.').trim(),
      address: address.trim(),
      city: (city || 'Bengaluru').trim(),
      neighborhood: (neighborhood || 'Downtown Metro').trim(),
      nearbyLandmark: (nearbyLandmark || 'Near city center & transit').trim(),
      type: (type as ParkingType) || 'Driveway',
      hourlyRate: Number(hourlyRate),
      dailyMaxRate: dailyMaxRate ? Number(dailyMaxRate) : Math.round(Number(hourlyRate) * 6),
      rating: 5.0,
      reviewCount: 0,
      images: Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80'],
      vehicleCompatibility: Array.isArray(vehicleCompatibility) && vehicleCompatibility.length > 0
        ? (vehicleCompatibility as VehicleSize[])
        : ['Compact', 'Sedan', 'SUV'],
      amenities: Array.isArray(amenities) && amenities.length > 0
        ? amenities
        : ['CCTV 24/7', 'Covered Parking', '24/7 Access'],
      ownerId: ownerId || 'own-01',
      ownerName: ownerName || 'Arjun Sharma',
      ownerAvatar: ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      ownerResponseTime: '< 10 minutes',
      ownerVerified: true,
      accessInstructions: (accessInstructions || 'Pull in directly. Scan Parko QR pass at gate.').trim(),
      cancellationPolicy: (cancellationPolicy || 'Free cancellation up to 1 hour before scheduled arrival time.').trim(),
      availableNow: true,
      coordinates: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.05,
        lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        xPercent: Math.floor(25 + Math.random() * 50),
        yPercent: Math.floor(25 + Math.random() * 50)
      },
      totalSpots: totalSpots ? Math.max(1, Number(totalSpots)) : 1,
      occupiedSpots: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.spaces.create(newSpace);
    res.status(201).json({
      success: true,
      message: 'Parking space listed successfully',
      data: created
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create listing';
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH /api/spaces/:id/rate - Update hourly rate
router.patch('/:id/rate', (req: Request, res: Response) => {
  try {
    const { hourlyRate, dailyMaxRate } = req.body;
    if (hourlyRate === undefined || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive hourlyRate is required.' });
    }

    const patch: Partial<ParkingSpace> = {
      hourlyRate: Number(hourlyRate)
    };
    if (dailyMaxRate !== undefined && !isNaN(Number(dailyMaxRate))) {
      patch.dailyMaxRate = Number(dailyMaxRate);
    }

    const id = String(req.params.id);
    const updated = db.spaces.update(id, patch);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Parking space not found.' });
    }

    res.json({
      success: true,
      message: `Hourly rate updated to ₹${hourlyRate}/hr`,
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update hourly rate';
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH /api/spaces/:id/toggle - Toggle availableNow
router.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const space = db.spaces.getById(id);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Parking space not found.' });
    }

    const updated = db.spaces.update(id, {
      availableNow: !space.availableNow
    });

    res.json({
      success: true,
      message: `Space is now ${updated?.availableNow ? 'live and bookable' : 'temporarily paused'}.`,
      data: updated
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to toggle availability';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/spaces/:id/reviews - Submit review and rating
router.post('/:id/reviews', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const space = db.spaces.getById(id);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Parking space not found.' });
    }

    const { authorName, rating, comment, vehicleModel } = req.body;
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5.' });
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Review comment must be at least 5 characters.' });
    }

    // Calculate new average rating
    const currentTotal = space.rating * space.reviewCount;
    const newCount = space.reviewCount + 1;
    const newRating = Number(((currentTotal + Number(rating)) / newCount).toFixed(2));

    const updated = db.spaces.update(id, {
      rating: newRating,
      reviewCount: newCount
    });

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorName: authorName || 'Verified Driver',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: Number(rating),
      date: 'Just now',
      comment: comment.trim(),
      vehicleModel: vehicleModel || 'Sedan'
    };

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        space: updated,
        review: newReview
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit review';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
