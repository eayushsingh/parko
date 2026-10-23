import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useToast } from '../context/ToastContext';
import { ParkingType, VehicleSize } from '../types';
import {
  MapPin,
  Building,
  ShieldCheck,
  DollarSign,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UploadCloud,
  Eye,
  Zap,
  Car,
} from 'lucide-react';

const PRESET_PARKING_PHOTOS = [
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
];

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSpace } = useParking();
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  // Step 1: Location
  const [address, setAddress] = useState('550 Howard St');
  const [city, setCity] = useState('San Francisco');
  const [neighborhood, setNeighborhood] = useState('SoMa');
  const [nearbyLandmark, setNearbyLandmark] = useState('1 min walk to Salesforce Tower');

  // Step 2: Space Details
  const [title, setTitle] = useState('Modern Transbay Garage Stall w/ Level 2 EV');
  const [description, setDescription] = useState('Clean, secure underground parking bay with 24/7 video monitoring and high clearance suitable for SUVs.');
  const [type, setType] = useState<ParkingType>('Garage');
  const [totalSpots, setTotalSpots] = useState(2);
  const [vehicleCompatibility, setVehicleCompatibility] = useState<VehicleSize[]>(['Compact', 'Sedan', 'SUV']);

  // Step 3: Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'CCTV 24/7',
    'Covered Parking',
    'EV Charging Bay',
    '24/7 Access',
    'Well Lit',
  ]);

  // Step 4: Pricing & Access Instructions
  const [hourlyRate, setHourlyRate] = useState(7);
  const [dailyMaxRate, setDailyMaxRate] = useState(38);
  const [accessInstructions, setAccessInstructions] = useState('Enter garage entrance on Howard St. Scan Parko QR code at the automated barrier or use gate code 5501#.');
  const [cancellationPolicy, setCancellationPolicy] = useState('Free cancellation up to 1 hour before arrival time.');

  // Step 5: Images
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PARKING_PHOTOS[0]);
  const [customPhotoName, setCustomPhotoName] = useState<string | null>(null);

  const allAmenities = [
    'CCTV 24/7',
    'Covered Parking',
    'EV Charging Bay',
    'Security Guard',
    '24/7 Access',
    'Well Lit',
    'Gated Access',
    'Easy In/Out',
  ];

  const allVehicleSizes: VehicleSize[] = ['Compact', 'Sedan', 'SUV', 'Van / Truck'];

  const handleToggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleToggleVehicle = (size: VehicleSize) => {
    setVehicleCompatibility((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoName(file.name);
      addToast({
        title: 'Photo Uploaded (Demo)',
        description: `Attached "${file.name}" to your listing gallery.`,
        type: 'info',
      });
    }
  };

  const handlePublishListing = () => {
    const newSpace = addSpace({
      title,
      description,
      address,
      city,
      neighborhood,
      nearbyLandmark,
      type,
      hourlyRate,
      dailyMaxRate: dailyMaxRate || undefined,
      images: [selectedPhoto, ...PRESET_PARKING_PHOTOS.slice(1, 3)],
      vehicleCompatibility,
      amenities,
      ownerId: user.id,
      ownerName: user.name,
      ownerAvatar: user.avatar,
      ownerResponseTime: '< 10 minutes',
      ownerVerified: true,
      accessInstructions,
      cancellationPolicy,
      availableNow: true,
      coordinates: {
        lat: 37.789,
        lng: -122.399,
        xPercent: 70,
        yPercent: 45,
      },
      totalSpots,
      featured: true,
    });

    navigate(`/space/${newSpace.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-subtle pb-20">
      
      {/* Top Header & Wizard Progress */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard/owner"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel & Return to Studio</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="text-brand-600">Step {step} of 6</span>
              <span className="text-slate-300">&bull;</span>
              <span className="hidden sm:inline">
                {step === 1 && 'Location'}
                {step === 2 && 'Space Details'}
                {step === 3 && 'Amenities'}
                {step === 4 && 'Pricing'}
                {step === 5 && 'Photos'}
                {step === 6 && 'Review & Publish'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-xl p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Step 1: Location & Neighborhood
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  Where is your parking space located?
                </h2>
                <p className="text-xs text-slate-500">
                  Drivers will use this address for navigation and nearby walking estimates.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 550 Howard St"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Neighborhood
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="e.g. SoMa / Financial District"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearby Landmark (Walking distance)
                  </label>
                  <input
                    type="text"
                    required
                    value={nearbyLandmark}
                    onChange={(e) => setNearbyLandmark(e.target.value)}
                    placeholder="e.g. 2 min walk to BART & Salesforce Tower"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPACE DETAILS */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  Step 2: Parking Space Details
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  Describe your parking space
                </h2>
                <p className="text-xs text-slate-500">
                  Select your space type and compatible vehicle sizes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Listing Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-navy-900 outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Space Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ParkingType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none"
                    >
                      <option value="Garage">Indoor Garage</option>
                      <option value="Driveway">Private Driveway</option>
                      <option value="Covered Lot">Covered Lot / Carport</option>
                      <option value="EV Charging Bay">EV Charging Bay</option>
                      <option value="Dedicated Commercial">Commercial Parking Stall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Stalls Available
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={totalSpots}
                      onChange={(e) => setTotalSpots(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Vehicle Size Compatibility
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allVehicleSizes.map((size) => {
                      const active = vehicleCompatibility.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleToggleVehicle(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                            active
                              ? 'bg-brand-50 border-brand-300 text-brand-700'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                          <span>{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AMENITIES */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Step 3: Amenities & Safety Features
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  What features does your space include?
                </h2>
                <p className="text-xs text-slate-500">
                  Spaces with EV charging and 24/7 CCTV earn on average 35% higher booking rates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {allAmenities.map((amenity) => {
                  const isChecked = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50/50 shadow-soft-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold text-navy-900">{amenity}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PRICING & INSTRUCTIONS */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Step 4: Pricing & Access Instructions
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  Set your rates and arrival guide
                </h2>
                <p className="text-xs text-slate-500">
                  Recommended rate for {neighborhood || 'Downtown'}: $6 – $10/hour.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hourly Rate ($/hr)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        min="2"
                        max="35"
                        required
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-bold text-navy-900 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Daily Cap / Max ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={dailyMaxRate}
                        onChange={(e) => setDailyMaxRate(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-bold text-navy-900 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Arrival & Access Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                    placeholder="Provide gate codes, stall markings, or sensor details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-navy-900 outline-none focus:border-brand-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p className="font-semibold text-navy-900">Cancellation Policy:</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cancellationPolicy}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PHOTOS */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  Step 5: Photos & Cover Image
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  Select high-res photos for your spot
                </h2>
                <p className="text-xs text-slate-500">
                  Choose from our curated mobility photography presets or upload your own.
                </p>
              </div>

              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Cover Photo Preset
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_PARKING_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(url)}
                      className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedPhoto === url
                          ? 'border-brand-500 ring-4 ring-brand-400/30'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      {selectedPhoto === url && (
                        <span className="absolute top-2 right-2 p-1 rounded-full bg-brand-600 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:border-brand-500 transition-colors">
                <input
                  type="file"
                  id="owner-photo-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="owner-photo-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-7 h-7 text-brand-600 mb-1" />
                  <span className="text-xs font-bold text-navy-900">Upload custom parking photo</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
                </label>
                {customPhotoName && (
                  <p className="text-xs font-bold text-emerald-600 mt-2">
                    Attached: {customPhotoName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW & PUBLISH */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Step 6: Review & Publish
                </span>
                <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                  Review your listing before publishing
                </h2>
                <p className="text-xs text-slate-500">
                  This is how drivers will discover and book your parking stall.
                </p>
              </div>

              {/* Preview Card */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-soft-md bg-white">
                <img
                  src={selectedPhoto}
                  alt={title}
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-700 uppercase tracking-wider text-[11px]">{neighborhood}</span>
                    <span className="font-extrabold text-navy-950 text-base">${hourlyRate}/hr</span>
                  </div>
                  <h3 className="font-bold text-base text-navy-900">{title}</h3>
                  <p className="text-xs text-slate-500">{address}, {city} &bull; {nearbyLandmark}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {amenities.slice(0, 4).map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">$1,000,000 Host Shield Protection Activated</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your property is covered for third-party liability and property damage during all active reservations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublishListing}
                className="py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-extrabold shadow-soft-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Listing to Marketplace</span>
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
