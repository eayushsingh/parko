import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { MOCK_REVIEWS } from '../data/mockData';
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Car,
  Zap,
  Info,
  Calendar,
  ChevronLeft,
  Warehouse,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpaceById, isSpaceSaved, toggleSaveSpace } = useParking();
  const { addToast } = useToast();

  const space = getSpaceById(id || '');

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!space) {
    return (
      <div className="min-h-screen bg-surface-subtle flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md shadow-soft-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-navy-900">Parking Spot Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The requested parking space does not exist or may have been removed.
          </p>
          <Link
            to="/explore"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs"
          >
            Back to Explore Spots
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isSpaceSaved(space.id);

  // Calculate duration and price
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const durationHours = Math.max(1, endHour - startHour);
  const isInvalidTime = endHour <= startHour;

  const subtotal = durationHours * space.hourlyRate;
  const serviceFee = Number((subtotal * 0.1).toFixed(2));
  const totalAmount = Number((subtotal + serviceFee).toFixed(2));

  const handleReserveClick = () => {
    if (isInvalidTime) {
      setValidationError('Departure time must be after arrival time.');
      return;
    }
    setValidationError(null);
    navigate(`/book/${space.id}?date=${selectedDate}&in=${startTime}&out=${endTime}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: 'Link Copied!',
      description: 'Parking spot link copied to clipboard.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-surface-subtle pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to search results</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Share spot"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveSpace(space.id)}
              className={`p-2 rounded-xl transition-colors border ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100 border-slate-200'
              }`}
              aria-label={isSaved ? 'Saved to favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Title and Location Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              {space.type}
            </span>
            <span className="text-xs text-slate-500">&bull;</span>
            <span className="text-xs font-semibold text-slate-600">{space.neighborhood}</span>
            <span className="text-xs text-slate-500">&bull;</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-navy-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {space.rating} ({space.reviewCount} verified reviews)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {space.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <span>{space.address}, {space.city} &bull; {space.nearbyLandmark}</span>
          </p>
        </div>

        {/* High-Resolution Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-3xl overflow-hidden mb-10 border border-slate-200/80 shadow-soft-sm bg-white p-2">
          {/* Main Large Image */}
          <div className="md:col-span-8 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={space.images[activeImageIndex] || space.images[0]}
              alt={space.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails Column */}
          <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {space.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] flex-1 md:flex-none w-28 md:w-full rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-brand-500 ring-2 ring-brand-400/30'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Booking Sticky Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Details, Amenities, Host, Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Space Type</span>
                <span className="text-sm font-bold text-navy-900 mt-1 block">{space.type}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Available Now</span>
                <span className="text-sm font-bold text-emerald-600 mt-1 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {space.totalSpots - space.occupiedSpots} of {space.totalSpots} stalls open
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Cancellation</span>
                <span className="text-xs font-bold text-navy-900 mt-1 block leading-tight">Free up to 1hr prior</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-extrabold text-navy-900">About this parking space</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {space.description}
              </p>
            </div>

            {/* Vehicle Compatibility */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-navy-900">Supported vehicle sizes</h2>
              <div className="flex flex-wrap gap-2.5">
                {space.vehicleCompatibility.map((veh) => (
                  <span
                    key={veh}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-navy-900 text-xs font-semibold"
                  >
                    <Car className="w-4 h-4 text-brand-600" />
                    <span>{veh}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Clearance height is suitable for all passenger cars and compact to mid-size SUVs.
              </p>
            </div>

            {/* Amenities & Security Badges */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-navy-900">Amenities & security features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {space.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-navy-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Profile */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-navy-900">Hosted by verified property owner</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={space.ownerAvatar}
                    alt={space.ownerName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
                      <span>{space.ownerName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200">
                        Verified Host
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Response time: <strong className="text-navy-900">{space.ownerResponseTime}</strong>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-navy-900 flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.96 Host Rating</span>
                  </div>
                  <span className="text-[11px] text-slate-400">100% Response Rate</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-navy-900 mb-1">Access Instructions:</p>
                {space.accessInstructions}
              </div>
            </div>

            {/* Demo Reviews Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">Driver Reviews</h2>
                  <p className="text-xs text-slate-400">Simulated feedback from verified drivers</p>
                </div>
                <span className="text-sm font-bold text-navy-900 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {space.rating} / 5.0
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {MOCK_REVIEWS.map((rev) => (
                  <div key={rev.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-navy-900">{rev.authorName}</p>
                          <p className="text-[10px] text-slate-400">{rev.vehicleModel} &bull; {rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Reservation Calculator Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-xl p-6 sm:p-8 space-y-6">
              
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-3xl font-black text-navy-950">${space.hourlyRate}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1">/ hour</span>
                </div>
                {space.dailyMaxRate && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ${space.dailyMaxRate} daily cap
                  </span>
                )}
              </div>

              {/* Time Selectors */}
              <div className="space-y-4">
                
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Select Date
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Today">Today, Oct 23</option>
                      <option value="Tomorrow">Tomorrow, Oct 24</option>
                      <option value="Saturday">Saturday, Oct 25</option>
                      <option value="Sunday">Sunday, Oct 26</option>
                    </select>
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Arrival & Departure Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Arrival Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Departure Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Validation Error Alert */}
                {validationError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>${space.hourlyRate} &times; {durationHours} {durationHours === 1 ? 'hour' : 'hours'}</span>
                  <span className="font-semibold text-navy-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    Parko Service & Guarantee Fee
                    <Info className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="font-semibold text-navy-900">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-navy-950">
                  <span>Total Due</span>
                  <span className="text-brand-600 text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserveClick}
                disabled={isInvalidTime}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-soft-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Reserve Parking Spot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  No payment charged until final confirmation step
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Spot Guarantee & Free Cancellation
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
