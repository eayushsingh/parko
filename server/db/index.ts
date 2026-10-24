import fs from 'fs';
import path from 'path';
import { DatabaseSchema, ParkingSpace, Booking, UserProfile } from '../types.js';
import { config } from '../config.js';
import { getInitialDatabase } from './seed.js';

class JsonDatabase {
  private data: DatabaseSchema;
  private filePath: string;
  private isInitialized = false;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.data = getInitialDatabase();
  }

  public init(): void {
    if (this.isInitialized) return;

    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        try {
          const raw = fs.readFileSync(this.filePath, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed.spaces && Array.isArray(parsed.spaces) && parsed.bookings && Array.isArray(parsed.bookings)) {
            this.data = parsed;
            console.log(`[DB] Loaded existing database with ${this.data.spaces.length} spaces and ${this.data.bookings.length} bookings.`);
          } else {
            console.warn('[DB] Existing DB file format invalid. Re-seeding database.');
            this.saveAtomic();
          }
        } catch (err) {
          console.error('[DB] Failed to read database file, re-initializing with seed data:', err);
          this.saveAtomic();
        }
      } else {
        console.log('[DB] No database file found. Seeding new database at:', this.filePath);
        this.saveAtomic();
      }
    } catch (err) {
      console.warn('[DB] Non-critical filesystem init error, using in-memory dataset:', err);
    }

    this.isInitialized = true;
  }

  private saveAtomic(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      const payload = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(tempPath, payload, 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.warn('[DB] Non-critical filesystem write warning (running in serverless or read-only mode):', err);
    }
  }

  public getSnapshot(): DatabaseSchema {
    this.init();
    return this.data;
  }

  public update(updater: (db: DatabaseSchema) => void): DatabaseSchema {
    this.init();
    updater(this.data);
    this.saveAtomic();
    return this.data;
  }

  // Spaces repository helpers
  public readonly spaces = {
    getAll: (): ParkingSpace[] => {
      return this.getSnapshot().spaces;
    },
    getById: (id: string): ParkingSpace | undefined => {
      return this.getSnapshot().spaces.find((s) => s.id === id);
    },
    create: (space: ParkingSpace): ParkingSpace => {
      this.update((db) => {
        db.spaces.unshift(space);
      });
      return space;
    },
    update: (id: string, patch: Partial<ParkingSpace>): ParkingSpace | null => {
      let updated: ParkingSpace | null = null;
      this.update((db) => {
        const index = db.spaces.findIndex((s) => s.id === id);
        if (index !== -1) {
          db.spaces[index] = {
            ...db.spaces[index],
            ...patch,
            updatedAt: new Date().toISOString()
          };
          updated = db.spaces[index];
        }
      });
      return updated;
    },
    delete: (id: string): boolean => {
      let deleted = false;
      this.update((db) => {
        const initialLen = db.spaces.length;
        db.spaces = db.spaces.filter((s) => s.id !== id);
        deleted = db.spaces.length < initialLen;
      });
      return deleted;
    }
  };

  // Bookings repository helpers
  public readonly bookings = {
    getAll: (): Booking[] => {
      return this.getSnapshot().bookings;
    },
    getById: (id: string): Booking | undefined => {
      return this.getSnapshot().bookings.find((b) => b.id === id);
    },
    getByReference: (ref: string): Booking | undefined => {
      return this.getSnapshot().bookings.find((b) => b.bookingReference.toLowerCase() === ref.toLowerCase());
    },
    create: (booking: Booking): Booking => {
      this.update((db) => {
        db.bookings.unshift(booking);
        // Increment occupied spots on space if active
        const space = db.spaces.find((s) => s.id === booking.spaceId);
        if (space && space.occupiedSpots < space.totalSpots) {
          space.occupiedSpots += 1;
        }
      });
      return booking;
    },
    updateStatus: (id: string, status: Booking['status']): Booking | null => {
      let updated: Booking | null = null;
      this.update((db) => {
        const b = db.bookings.find((item) => item.id === id);
        if (b) {
          const oldStatus = b.status;
          b.status = status;
          updated = b;

          // If cancelled, decrement occupied spots
          if (status === 'cancelled' && (oldStatus === 'confirmed' || oldStatus === 'active')) {
            const space = db.spaces.find((s) => s.id === b.spaceId);
            if (space && space.occupiedSpots > 0) {
              space.occupiedSpots -= 1;
            }
          }
        }
      });
      return updated;
    }
  };

  // Users repository helpers
  public readonly users = {
    getAll: (): UserProfile[] => {
      return this.getSnapshot().users;
    },
    getById: (id: string): UserProfile | undefined => {
      return this.getSnapshot().users.find((u) => u.id === id);
    },
    getByEmail: (email: string): UserProfile | undefined => {
      return this.getSnapshot().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    create: (user: UserProfile): UserProfile => {
      this.update((db) => {
        db.users.push(user);
      });
      return user;
    },
    update: (id: string, patch: Partial<UserProfile>): UserProfile | null => {
      let updated: UserProfile | null = null;
      this.update((db) => {
        const u = db.users.find((item) => item.id === id);
        if (u) {
          Object.assign(u, patch);
          updated = u;
        }
      });
      return updated;
    }
  };

  // Gate barrier logs helpers
  public readonly gateLogs = {
    add: (log: DatabaseSchema['gateLogs'][0]): void => {
      this.update((db) => {
        db.gateLogs.unshift(log);
        if (db.gateLogs.length > 100) {
          db.gateLogs.pop();
        }
      });
    },
    getAll: () => this.getSnapshot().gateLogs
  };
}

export const db = new JsonDatabase(config.dbPath);
