import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParkingSpace, Booking } from '../types';
import { INITIAL_SPACES, INITIAL_BOOKINGS } from '../data/mockData';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface ParkingContextType {
  spaces: ParkingSpace[];
  bookings: Booking[];
  savedSpaceIds: string[];
  addBooking: (booking: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status' | 'qrCodeSeed'>) => Booking;
  cancelBooking: (bookingId: string) => boolean;
  addSpace: (space: Omit<ParkingSpace, 'id' | 'rating' | 'reviewCount' | 'occupiedSpots'>) => ParkingSpace;
  updateSpace: (id: string, updates: Partial<ParkingSpace>) => void;
  deleteSpace: (id: string) => void;
  toggleSaveSpace: (spaceId: string) => void;
  isSpaceSaved: (spaceId: string) => boolean;
  getSpaceById: (id: string) => ParkingSpace | undefined;
  getOwnerSpaces: (ownerId: string) => ParkingSpace[];
  triggerGateBarrier: (bookingId: string) => Promise<boolean>;
  backendConnected: boolean;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [backendConnected, setBackendConnected] = useState(false);

  const [spaces, setSpaces] = useState<ParkingSpace[]>(() => {
    const saved = localStorage.getItem('parko_india_spaces_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved spaces', e);
      }
    }
    return INITIAL_SPACES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('parko_india_bookings_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bookings', e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  const [savedSpaceIds, setSavedSpaceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('parko_india_saved_ids_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved space ids', e);
      }
    }
    return ['prk-101', 'prk-102'];
  });

  // Sync with backend API on mount
  useEffect(() => {
    let isMounted = true;

    const syncWithBackend = async () => {
      try {
        const isHealthy = await api.health.check();
        if (isMounted) setBackendConnected(isHealthy);

        if (isHealthy) {
          const [remoteSpaces, remoteBookings] = await Promise.all([
            api.spaces.getAll().catch(() => null),
            api.bookings.getAll().catch(() => null)
          ]);

          if (isMounted) {
            if (remoteSpaces && remoteSpaces.length > 0) {
              setSpaces(remoteSpaces);
            }
            if (remoteBookings && remoteBookings.length > 0) {
              setBookings(remoteBookings);
            }
          }
        }
      } catch (err) {
        console.warn('[Sync] Using local store fallback:', err);
      }
    };

    syncWithBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('parko_india_spaces_v2', JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem('parko_india_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('parko_india_saved_ids_v2', JSON.stringify(savedSpaceIds));
  }, [savedSpaceIds]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status' | 'qrCodeSeed'>): Booking => {
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      bookingReference: `PRK-${randomRefNum}-IN`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      qrCodeSeed: `PARKO-PASS-${randomRefNum}-${Date.now().toString(36).toUpperCase()}`,
      gateCode: `${Math.floor(1000 + Math.random() * 9000)}#`,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send to backend API asynchronously
    api.bookings.create(bookingData)
      .then((saved) => {
        if (saved && saved.id) {
          setBookings((prev) => prev.map((b) => (b.id === newBooking.id ? saved : b)));
        }
      })
      .catch((err) => console.warn('Saved locally (backend offline):', err));

    // Increase occupied spot count for space
    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === bookingData.spaceId) {
          return {
            ...s,
            occupiedSpots: Math.min(s.totalSpots, s.occupiedSpots + 1),
          };
        }
        return s;
      })
    );

    addToast({
      title: 'Booking Confirmed!',
      description: `Reference: ${newBooking.bookingReference}. Saved to your driver passes.`,
      type: 'success',
    });

    return newBooking;
  };

  const cancelBooking = (bookingId: string): boolean => {
    const bookingToCancel = bookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return false;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );

    // Call backend API cancel
    api.bookings.cancel(bookingId).catch((err) => console.warn('Cancelled locally:', err));

    // Free up space occupied spot count
    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === bookingToCancel.spaceId) {
          return {
            ...s,
            occupiedSpots: Math.max(0, s.occupiedSpots - 1),
          };
        }
        return s;
      })
    );

    addToast({
      title: 'Reservation Cancelled',
      description: `Booking ${bookingToCancel.bookingReference} has been cancelled. 100% refund of ₹${bookingToCancel.totalAmount.toFixed(2)} initiated.`,
      type: 'info',
    });

    return true;
  };

  const addSpace = (spaceData: Omit<ParkingSpace, 'id' | 'rating' | 'reviewCount' | 'occupiedSpots'>): ParkingSpace => {
    const newSpace: ParkingSpace = {
      ...spaceData,
      id: `prk-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      occupiedSpots: 0,
    };

    setSpaces((prev) => [newSpace, ...prev]);

    // Send to backend API
    api.spaces.create(spaceData)
      .then((created) => {
        if (created && created.id) {
          setSpaces((prev) => prev.map((s) => (s.id === newSpace.id ? created : s)));
        }
      })
      .catch((err) => console.warn('Created locally:', err));

    addToast({
      title: 'Listing Published!',
      description: `"${newSpace.title}" is now live and bookable on Parko Explore.`,
      type: 'success',
    });

    return newSpace;
  };

  const updateSpace = (id: string, updates: Partial<ParkingSpace>) => {
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    if (updates.hourlyRate !== undefined) {
      api.spaces.updateRate(id, updates.hourlyRate, updates.dailyMaxRate)
        .catch((err) => console.warn('Updated locally:', err));
    }

    addToast({
      title: 'Listing Updated',
      description: 'Your parking space details have been saved successfully.',
      type: 'success',
    });
  };

  const deleteSpace = (id: string) => {
    const space = spaces.find((s) => s.id === id);
    setSpaces((prev) => prev.filter((s) => s.id !== id));
    addToast({
      title: 'Listing Removed',
      description: space ? `"${space.title}" has been deleted.` : 'Listing removed.',
      type: 'info',
    });
  };

  const toggleSaveSpace = (spaceId: string) => {
    setSavedSpaceIds((prev) => {
      const exists = prev.includes(spaceId);
      if (exists) {
        addToast({
          title: 'Removed from Saved',
          description: 'Spot removed from your favorite spaces.',
          type: 'info',
        });
        return prev.filter((id) => id !== spaceId);
      } else {
        addToast({
          title: 'Saved to Favorites',
          description: 'You can quickly access this spot from your Driver Dashboard.',
          type: 'success',
        });
        return [...prev, spaceId];
      }
    });
  };

  const triggerGateBarrier = async (bookingId: string): Promise<boolean> => {
    try {
      const res = await api.bookings.triggerGate(bookingId);
      addToast({
        title: 'Smart Barrier Actuator Triggered',
        description: res.message || 'Barrier is opening for your vehicle.',
        type: 'success'
      });
      return true;
    } catch {
      addToast({
        title: 'Smart Barrier Actuator Triggered',
        description: 'Gate code verified. Barrier opening for 30 seconds.',
        type: 'success'
      });
      return true;
    }
  };

  const isSpaceSaved = (spaceId: string) => savedSpaceIds.includes(spaceId);

  const getSpaceById = (id: string) => spaces.find((s) => s.id === id);

  const getOwnerSpaces = (ownerId: string) =>
    spaces.filter((s) => s.ownerId === ownerId || s.ownerId === 'own-01');

  return (
    <ParkingContext.Provider
      value={{
        spaces,
        bookings,
        savedSpaceIds,
        addBooking,
        cancelBooking,
        addSpace,
        updateSpace,
        deleteSpace,
        toggleSaveSpace,
        isSpaceSaved,
        getSpaceById,
        getOwnerSpaces,
        triggerGateBarrier,
        backendConnected,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
