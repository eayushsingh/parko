import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';
import { SpaceCard } from '../components/explore/SpaceCard';
import {
  Car,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShieldCheck,
  Edit2,
} from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { bookings, cancelBooking, savedSpaceIds, spaces } = useParking();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'saved' | 'vehicle'>('upcoming');
  
  // Selected Booking for Pass Modal
  const [activePassBooking, setActivePassBooking] = useState<Booking | null>(null);

  // Cancellation Confirmation Dialog
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Vehicle edit state
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [vehicleMake, setVehicleMake] = useState(user.defaultVehicle?.makeModel || 'Tesla Model 3');
  const [vehiclePlate, setVehiclePlate] = useState(user.defaultVehicle?.licensePlate || '7XYZ892');

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'active'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const savedSpacesList = spaces.filter((s) => savedSpaceIds.includes(s.id));

  const totalHoursParked = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.durationHours, 0);

  const handleConfirmCancel = () => {
    if (cancellingBookingId) {
      cancelBooking(cancellingBookingId);
      setCancellingBookingId(null);
    }
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      defaultVehicle: {
        makeModel: vehicleMake,
        licensePlate: vehiclePlate,
        state: 'CA',
      },
    });
    setIsEditingVehicle(false);
    addToast({
      title: 'Vehicle Updated',
      description: 'Your default vehicle plate was updated for automated gate entry.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-surface-subtle pb-20">
      
      {/* Top Welcome Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-soft-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                    Welcome back, {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Verified Driver
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{user.email}</span>
                  <span>&bull;</span>
                  <span>Default Vehicle: <strong className="text-navy-900">{user.defaultVehicle?.makeModel || 'Tesla Model 3'} ({user.defaultVehicle?.licensePlate || '7XYZ892'})</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/explore"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-sm transition-all"
              >
                Find & Reserve Parking
              </Link>
            </div>

          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Passes
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-0.5 block">
                {upcomingBookings.length}
              </span>
            </div>
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Bookings
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-0.5 block">
                {bookings.length}
              </span>
            </div>
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Hours Parked
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-0.5 block">
                {totalHoursParked} hrs
              </span>
            </div>
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Saved Spots
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-0.5 block">
                {savedSpaceIds.length}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'upcoming'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <span>Upcoming Passes</span>
              {upcomingBookings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-800 text-[10px]">
                  {upcomingBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'history'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <span>Booking History</span>
              <span className="text-[11px] text-slate-400">({pastBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'saved'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saved Spots ({savedSpacesList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'vehicle'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Vehicles & Verification</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* UPCOMING BOOKINGS TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-navy-900">Active & Confirmed Passes</h2>
              <span className="text-xs text-slate-500">Scan at parking barrier arm</span>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
                <Car className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-navy-900">No upcoming parking reservations</h3>
                <p className="text-xs text-slate-500">
                  Search downtown areas or airport corridors to lock in a guaranteed stall.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs"
                >
                  Explore Parking Spots
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-soft-md overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Top */}
                      <div className="p-5 flex items-start gap-4">
                        <img
                          src={b.spaceImage}
                          alt={b.spaceTitle}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                              {b.bookingReference}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active Pass
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-navy-900 mt-1.5 line-clamp-1">{b.spaceTitle}</h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {b.spaceAddress}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="px-5 py-3 bg-slate-50/80 border-y border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">When</span>
                          <span className="font-semibold text-navy-900 block">{b.date} &bull; {b.startTime} - {b.endTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Vehicle</span>
                          <span className="font-semibold text-navy-900 block">{b.vehicleModel} ({b.vehiclePlate})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Gate Code</span>
                          <span className="font-mono font-bold text-brand-600 block">{b.gateCode || '7482#'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Paid</span>
                          <span className="font-bold text-navy-900 block">₹{b.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-white flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActivePassBooking(b)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-brand-400" />
                        <span>View Digital Pass</span>
                      </button>

                      <button
                        onClick={() => setCancellingBookingId(b.id)}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKING HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-navy-900">Completed & Past Bookings</h2>
            
            {pastBookings.length === 0 ? (
              <p className="text-xs text-slate-500">No past bookings yet.</p>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xs overflow-hidden divide-y divide-slate-100">
                {pastBookings.map((b) => (
                  <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={b.spaceImage}
                        alt={b.spaceTitle}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{b.bookingReference}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            b.status === 'completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-navy-900 mt-0.5">{b.spaceTitle}</h4>
                        <p className="text-xs text-slate-400">{b.date} &bull; {b.durationHours} hrs &bull; ₹{b.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => navigate(`/space/${b.spaceId}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-navy-900 transition-colors"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED SPOTS TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-navy-900">Your Favorite Parking Spots</h2>
            {savedSpacesList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-sm text-navy-900">No saved parking spaces</h3>
                <p className="text-xs text-slate-500">
                  Click the heart icon on any parking spot card to quickly save it for later.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
                >
                  Browse Spots
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSpacesList.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VEHICLES & VERIFICATION TAB */}
        {activeTab === 'vehicle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Vehicle Details */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-navy-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-600" />
                  Primary Vehicle
                </h3>
                <button
                  onClick={() => setIsEditingVehicle(!isEditingVehicle)}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  {isEditingVehicle ? 'Cancel' : 'Edit Plate'}
                </button>
              </div>

              {!isEditingVehicle ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Make & Model</span>
                    <span className="font-bold text-navy-900">{user.defaultVehicle?.makeModel || 'Tesla Model 3'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">License Plate</span>
                    <span className="font-mono font-black text-brand-700 tracking-wider">
                      {user.defaultVehicle?.licensePlate || '7XYZ892'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration State</span>
                    <span className="font-semibold text-navy-900">California</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveVehicle} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Make & Model</label>
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">License Plate</label>
                    <input
                      type="text"
                      required
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                  >
                    Save Vehicle Plate
                  </button>
                </form>
              )}

              <p className="text-[11px] text-slate-400">
                Gate barrier cameras verify this plate automatically when you pull up to reserved spots.
              </p>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
              <h3 className="font-extrabold text-base text-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Driver Verification Status
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-900">Driver's License Verified</p>
                      <p className="text-[10px] text-emerald-700">Simulated ID Check &bull; Active until 2028</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <div>
                      <p className="font-bold text-navy-900">Phone & Email Confirmed</p>
                      <p className="text-[10px] text-slate-400">{user.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Verification status enables 1-tap bookings without re-uploading documents.
              </div>
            </div>

          </div>
        )}

      </main>

      {/* DIGITAL PASS MODAL */}
      {activePassBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                  Parko Access Pass
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-1">{activePassBooking.spaceTitle}</h3>
              </div>
              <button
                onClick={() => setActivePassBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              {/* QR Code graphic */}
              <div className="w-44 h-44 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mx-auto flex flex-col justify-between shadow-soft-xs">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-navy-900 rounded-sm p-1"><div className="w-full h-full bg-white rounded-[1px] p-1"><div className="w-full h-full bg-navy-900" /></div></div>
                  <div className="w-8 h-8 bg-navy-900 rounded-sm p-1"><div className="w-full h-full bg-white rounded-[1px] p-1"><div className="w-full h-full bg-navy-900" /></div></div>
                </div>
                <div className="grid grid-cols-6 gap-1 my-2">
                  <div className="h-2 bg-navy-900 rounded-[1px] col-span-3"></div>
                  <div className="h-2 bg-brand-500 rounded-[1px] col-span-2"></div>
                  <div className="h-2 bg-navy-900 rounded-[1px]"></div>
                  <div className="h-2 bg-navy-900 rounded-[1px] col-span-2"></div>
                  <div className="h-2 bg-brand-500 rounded-[1px] col-span-4"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 bg-navy-900 rounded-sm p-1"><div className="w-full h-full bg-white rounded-[1px] p-1"><div className="w-full h-full bg-navy-900" /></div></div>
                  <span className="text-[9px] font-mono font-bold text-slate-400">SCAN AT GATE</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block">Gate Keypad PIN</span>
                <span className="text-2xl font-mono font-black text-brand-600 block mt-0.5">
                  {activePassBooking.gateCode || '7482#'}
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl">
                <p><strong>Window:</strong> {activePassBooking.date} &bull; {activePassBooking.startTime} - {activePassBooking.endTime}</p>
                <p><strong>Vehicle:</strong> {activePassBooking.vehicleModel} ({activePassBooking.vehiclePlate})</p>
              </div>

              <button
                onClick={() => setActivePassBooking(null)}
                className="w-full py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
              >
                Close Pass
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-navy-900">Cancel Reservation?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free cancellation applies. A 100% simulated refund will be credited back to your original payment method immediately.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-50"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
