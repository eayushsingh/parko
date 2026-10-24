import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useToast } from '../context/ToastContext';
import { ParkingSpace } from '../types';
import {
  Building,
  PlusCircle,
  TrendingUp,
  IndianRupee,
  Calendar,
  Eye,
  Trash2,
  Edit,
  Pause,
  Play,
  CheckCircle2,
  Car,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { spaces, bookings, deleteSpace, updateSpace } = useParking();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'listings' | 'arrivals' | 'calendar' | 'payouts'>('listings');
  
  // Rate Edit Modal
  const [editingSpace, setEditingSpace] = useState<ParkingSpace | null>(null);
  const [newRate, setNewRate] = useState<number>(80);

  // Listing Delete Confirm
  const [deletingSpaceId, setDeletingSpaceId] = useState<string | null>(null);

  // Filter listings belonging to owner (or default to mock owner's spaces)
  const ownerSpaces = spaces.filter((s) => s.ownerId === user.id || s.ownerId === 'own-01');

  // Stats
  const totalStalls = ownerSpaces.reduce((acc, s) => acc + s.totalSpots, 0);
  const totalOccupied = ownerSpaces.reduce((acc, s) => acc + s.occupiedSpots, 0);
  const occupancyRate = totalStalls > 0 ? Math.round((totalOccupied / totalStalls) * 100) : 0;
  const estimatedMonthlyDemoEarnings = ownerSpaces.reduce((acc, s) => acc + s.hourlyRate * 6 * 24, 0);

  const handleToggleListingStatus = (space: ParkingSpace) => {
    updateSpace(space.id, { availableNow: !space.availableNow });
    addToast({
      title: space.availableNow ? 'Listing Paused' : 'Listing Activated',
      description: `"${space.title}" is now ${space.availableNow ? 'hidden from' : 'visible on'} search results.`,
      type: 'info',
    });
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpace) {
      updateSpace(editingSpace.id, { hourlyRate: newRate });
      setEditingSpace(null);
    }
  };

  const handleSimulateGateTrigger = (driverName: string) => {
    addToast({
      title: 'Gate Barrier Opened!',
      description: `Gate barrier triggered for ${driverName}'s vehicle.`,
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
                    {user.name}'s Host Studio
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Verified Property Host
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Managing {ownerSpaces.length} parking spaces across the Metro &bull; ₹10 Lakhs Host Shield Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/list-space"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List New Space</span>
              </Link>
            </div>

          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Estimated Monthly Revenue
              </span>
              <span className="text-2xl font-extrabold text-brand-600 mt-1 block">
                ₹{estimatedMonthlyDemoEarnings.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">Projected sample revenue</span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Occupancy Rate
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-1 block">
                {occupancyRate}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">{totalOccupied} of {totalStalls} stalls in use</span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Listings
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-1 block">
                {ownerSpaces.length}
              </span>
              <span className="text-[10px] text-slate-400">All spaces verified</span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Next Payout
              </span>
              <span className="text-2xl font-extrabold text-navy-900 mt-1 block">
                ₹4,250.00
              </span>
              <span className="text-[10px] text-slate-400">Friday direct deposit</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'listings'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>My Parking Listings ({ownerSpaces.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'arrivals'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Today's Arrivals & Bookings</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'calendar'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Occupancy Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'payouts'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Earnings & Payout Statement</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LISTINGS MANAGEMENT TAB */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-navy-900">Active Parking Spaces</h2>
                <p className="text-xs text-slate-500">Manage rates, availability status, and spot capacity</p>
              </div>
              <Link
                to="/list-space"
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Space
              </Link>
            </div>

            {ownerSpaces.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
                <Building className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-navy-900">You don't have any parking listings yet</h3>
                <p className="text-xs text-slate-500">
                  List your driveway, indoor garage, or carport to start earning weekly passive income.
                </p>
                <Link
                  to="/list-space"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {ownerSpaces.map((space) => (
                  <div
                    key={space.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
                  >
                    {/* Space Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <img
                        src={space.images[0]}
                        alt={space.title}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-navy-700">
                            {space.type}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            space.availableNow
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${space.availableNow ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {space.availableNow ? 'Live & Bookable' : 'Paused'}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-navy-900 truncate mt-1">{space.title}</h3>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{space.address} &bull; {space.neighborhood}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Rate: <strong className="text-navy-900">₹{space.hourlyRate}/hr</strong></span>
                          <span>&bull;</span>
                          <span>Stalls: <strong className="text-navy-900">{space.occupiedSpots} / {space.totalSpots} occupied</strong></span>
                          <span>&bull;</span>
                          <span>Rating: <strong className="text-navy-900">{space.rating}★</strong> ({space.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <button
                        onClick={() => navigate(`/space/${space.id}`)}
                        className="p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors border border-slate-200"
                        title="Preview Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingSpace(space);
                          setNewRate(space.hourlyRate);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Rate</span>
                      </button>

                      <button
                        onClick={() => handleToggleListingStatus(space)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          space.availableNow
                            ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {space.availableNow ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeletingSpaceId(space.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TODAY'S ARRIVALS TAB */}
        {activeTab === 'arrivals' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-navy-900">Today's Scheduled Parkings & Arrivals</h2>
              <p className="text-xs text-slate-500">Live vehicle check-in log and automated barrier controls</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xs overflow-hidden divide-y divide-slate-100">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-sm shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy-900">{b.driverName}</span>
                        <span className="font-mono text-xs font-bold text-slate-400">({b.vehiclePlate})</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Vehicle: {b.vehicleModel} &bull; Time: <strong>{b.startTime} - {b.endTime}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Space: {b.spaceTitle} &bull; Ref: {b.bookingReference}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateGateTrigger(b.driverName)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-soft-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Trigger Gate Open</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEEKLY CALENDAR SCHEDULE TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-navy-900">Weekly Stall Availability Matrix</h2>
              <p className="text-xs text-slate-500">Visual schedule of occupied vs bookable hours across your listings</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-xs overflow-x-auto">
              <div className="min-w-[600px] space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                  <div key={day} className="flex items-center gap-4 text-xs">
                    <span className="w-24 font-bold text-navy-900">{day}</span>
                    <div className="flex-1 grid grid-cols-12 gap-1 h-8 bg-slate-50 rounded-xl p-1 border border-slate-200">
                      {[...Array(12)].map((_, hourIdx) => {
                        const isOccupied = (idx + hourIdx) % 3 === 0;
                        return (
                          <div
                            key={hourIdx}
                            title={`${hourIdx * 2}:00 — ${isOccupied ? 'Reserved' : 'Available'}`}
                            className={`rounded-lg h-full transition-colors ${
                              isOccupied ? 'bg-brand-500' : 'bg-slate-200/80 hover:bg-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="w-16 text-right font-medium text-slate-400 text-[11px]">
                      {idx % 2 === 0 ? '8 hrs filled' : '5 hrs filled'}
                    </span>
                  </div>
                ))}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-brand-500"></span>
                    <span className="text-slate-600">Reserved & Paid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-slate-200"></span>
                    <span className="text-slate-600">Open for Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EARNINGS & PAYOUTS TAB */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-navy-900">Earnings & Payout Statement</h2>
              <p className="text-xs text-slate-500">Weekly automated payouts processed directly to your linked bank account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-soft-xs">
                <span className="text-xs text-slate-500 font-bold uppercase">This Week's Net</span>
                <p className="text-3xl font-black text-navy-950">₹4,250.00</p>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18% vs last week
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-soft-xs">
                <span className="text-xs text-slate-500 font-bold uppercase">All-Time Earnings</span>
                <p className="text-3xl font-black text-brand-600">₹48,920.00</p>
                <p className="text-xs text-slate-400">Total 318 completed bookings</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-soft-xs">
                <span className="text-xs text-slate-500 font-bold uppercase">Deposit Account</span>
                <p className="text-sm font-bold text-navy-900">HDFC Bank &bull;&bull;&bull;&bull; 8921</p>
                <p className="text-xs text-slate-400">Next deposit arrives this Friday</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-xs">
              <h3 className="font-extrabold text-sm text-navy-900 mb-4">Sample Recent Payouts</h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-navy-900">Direct Deposit #TX-98421</p>
                    <p className="text-slate-400">Oct 17, 2026 &bull; 48 reservation hours</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+₹3,840.00 (Paid)</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-navy-900">Direct Deposit #TX-98012</p>
                    <p className="text-slate-400">Oct 10, 2026 &bull; 54 reservation hours</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+₹4,320.00 (Paid)</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-navy-900">Direct Deposit #TX-97814</p>
                    <p className="text-slate-400">Oct 3, 2026 &bull; 41 reservation hours</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+₹3,280.00 (Paid)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EDIT HOURLY RATE MODAL */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveRate} className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base text-navy-900">Adjust Hourly Rate</h3>
            <p className="text-xs text-slate-500">
              Update rate for "{editingSpace.title}". Changes will reflect immediately on search.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Price (₹/hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="20"
                  max="300"
                  required
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold text-navy-900 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Save Rate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingSpaceId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-navy-900">Delete Parking Listing?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will remove the parking space from the search marketplace and cancel all active availability.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingSpaceId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-navy-800"
              >
                Keep Listing
              </button>
              <button
                onClick={() => {
                  deleteSpace(deletingSpaceId);
                  setDeletingSpaceId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete Space
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
