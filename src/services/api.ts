import { ParkingSpace, Booking, UserProfile, Review, OwnerMetrics, PlatformMetrics } from '../types';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[API] Failed to fetch ${endpoint}:`, errorMsg);
      throw err;
    }
  }

  public readonly spaces = {
    getAll: async (params?: {
      q?: string;
      type?: string;
      maxPrice?: number;
      vehicleSize?: string;
      amenities?: string[];
      sortBy?: string;
      featured?: boolean;
    }): Promise<ParkingSpace[]> => {
      const query = new URLSearchParams();
      if (params?.q) query.set('q', params.q);
      if (params?.type && params.type !== 'All Types') query.set('type', params.type);
      if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
      if (params?.vehicleSize && params.vehicleSize !== 'Any Size') query.set('vehicleSize', params.vehicleSize);
      if (params?.amenities && params.amenities.length > 0) query.set('amenities', params.amenities.join(','));
      if (params?.sortBy) query.set('sortBy', params.sortBy);
      if (params?.featured) query.set('featured', 'true');

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<{ success: boolean; data: ParkingSpace[] }>(`/spaces${qs}`);
      return res.data;
    },

    getById: async (id: string): Promise<ParkingSpace> => {
      const res = await this.request<{ success: boolean; data: ParkingSpace }>(`/spaces/${id}`);
      return res.data;
    },

    create: async (spaceData: Partial<ParkingSpace>): Promise<ParkingSpace> => {
      const res = await this.request<{ success: boolean; data: ParkingSpace }>('/spaces', {
        method: 'POST',
        body: JSON.stringify(spaceData),
      });
      return res.data;
    },

    updateRate: async (id: string, hourlyRate: number, dailyMaxRate?: number): Promise<ParkingSpace> => {
      const res = await this.request<{ success: boolean; data: ParkingSpace }>(`/spaces/${id}/rate`, {
        method: 'PATCH',
        body: JSON.stringify({ hourlyRate, dailyMaxRate }),
      });
      return res.data;
    },

    toggleStatus: async (id: string): Promise<ParkingSpace> => {
      const res = await this.request<{ success: boolean; data: ParkingSpace }>(`/spaces/${id}/toggle`, {
        method: 'PATCH',
      });
      return res.data;
    },

    addReview: async (id: string, review: {
      authorName: string;
      rating: number;
      comment: string;
      vehicleModel?: string;
    }): Promise<{ space: ParkingSpace; review: Review }> => {
      const res = await this.request<{ success: boolean; data: { space: ParkingSpace; review: Review } }>(`/spaces/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
      });
      return res.data;
    },
  };

  public readonly bookings = {
    getAll: async (params?: { driverEmail?: string; spaceId?: string; status?: string }): Promise<Booking[]> => {
      const query = new URLSearchParams();
      if (params?.driverEmail) query.set('driverEmail', params.driverEmail);
      if (params?.spaceId) query.set('spaceId', params.spaceId);
      if (params?.status) query.set('status', params.status);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<{ success: boolean; data: Booking[] }>(`/bookings${qs}`);
      return res.data;
    },

    getById: async (id: string): Promise<Booking> => {
      const res = await this.request<{ success: boolean; data: Booking }>(`/bookings/${id}`);
      return res.data;
    },

    create: async (bookingData: Partial<Booking>): Promise<Booking> => {
      const res = await this.request<{ success: boolean; data: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      return res.data;
    },

    cancel: async (id: string): Promise<Booking> => {
      const res = await this.request<{ success: boolean; data: Booking }>(`/bookings/${id}/cancel`, {
        method: 'POST',
      });
      return res.data;
    },

    triggerGate: async (id: string): Promise<{ gateStatus: string; vehiclePlate: string; message: string }> => {
      const res = await this.request<{ success: boolean; gateStatus: string; vehiclePlate: string; message: string }>(`/bookings/${id}/trigger-gate`, {
        method: 'POST',
      });
      return res;
    },
  };

  public readonly auth = {
    login: async (email: string, role?: string): Promise<{ user: UserProfile; token: string }> => {
      const res = await this.request<{ success: boolean; user: UserProfile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
      return res;
    },

    register: async (userData: {
      name: string;
      email: string;
      role: 'driver' | 'owner';
      phone?: string;
      vehicleMake?: string;
      vehiclePlate?: string;
    }): Promise<{ user: UserProfile; token: string }> => {
      const res = await this.request<{ success: boolean; user: UserProfile; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return res;
    },

    getMe: async (): Promise<UserProfile | null> => {
      const res = await this.request<{ success: boolean; user: UserProfile | null }>('/auth/me');
      return res.user;
    },

    updateVehicle: async (data: { userId?: string; makeModel: string; licensePlate: string; state?: string }): Promise<UserProfile> => {
      const res = await this.request<{ success: boolean; user: UserProfile }>('/auth/vehicle', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return res.user;
    },
  };

  public readonly metrics = {
    getOwner: async (ownerId?: string): Promise<OwnerMetrics> => {
      const qs = ownerId ? `?ownerId=${ownerId}` : '';
      const res = await this.request<{ success: boolean; data: OwnerMetrics }>(`/metrics/owner${qs}`);
      return res.data;
    },

    getPlatform: async (): Promise<PlatformMetrics> => {
      const res = await this.request<{ success: boolean; data: PlatformMetrics }>('/metrics/platform');
      return res.data;
    },
  };

  public readonly health = {
    check: async (): Promise<boolean> => {
      try {
        const res = await this.request<{ success: boolean; status: string }>('/health');
        return res.status === 'HEALTHY';
      } catch {
        return false;
      }
    },
  };
}

export const api = new ApiClient();
