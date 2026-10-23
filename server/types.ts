export type ParkingType = 'Driveway' | 'Garage' | 'Covered Lot' | 'Dedicated Commercial' | 'EV Charging Bay';

export type VehicleSize = 'Compact' | 'Sedan' | 'SUV' | 'Van / Truck';

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  vehicleModel?: string;
}

export interface ParkingSpace {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  neighborhood: string;
  nearbyLandmark: string;
  type: ParkingType;
  hourlyRate: number;
  dailyMaxRate?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  vehicleCompatibility: VehicleSize[];
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerResponseTime: string;
  ownerVerified: boolean;
  accessInstructions: string;
  cancellationPolicy: string;
  availableNow: boolean;
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number;
    yPercent: number;
  };
  totalSpots: number;
  occupiedSpots: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  spaceId: string;
  spaceTitle: string;
  spaceAddress: string;
  spaceImage: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  licenseFileDemoName?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Google Pay';
  status: BookingStatus;
  createdAt: string;
  qrCodeSeed: string;
  gateCode?: string;
}

export type UserRole = 'driver' | 'owner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  memberSince: string;
  isVerified: boolean;
  defaultVehicle?: {
    makeModel: string;
    licensePlate: string;
    state: string;
  };
}

export interface DatabaseSchema {
  spaces: ParkingSpace[];
  bookings: Booking[];
  users: UserProfile[];
  gateLogs: Array<{
    id: string;
    bookingId: string;
    vehiclePlate: string;
    action: 'GATE_OPENED' | 'GATE_CLOSED';
    timestamp: string;
    success: boolean;
  }>;
}
