import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Car,
  CreditCard,
  UploadCloud,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  MapPin,
  Check,
  AlertCircle,
} from 'lucide-react';

export const BookingFlowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const { getSpaceById, addBooking } = useParking();
  const { user } = useAuth();

  const space = getSpaceById(id || '');

  // Step state: 1: Schedule & Driver Details, 2: Verification & Payment, 3: Success Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || 'Today, Oct 23');
  const [startTime, setStartTime] = useState(searchParams.get('in') || '09:00');
  const [endTime, setEndTime] = useState(searchParams.get('out') || '13:00');

  const [driverName, setDriverName] = useState(user.name || 'Arjun Sharma');
  const [driverEmail, setDriverEmail] = useState(user.email || 'arjun.sharma@gmail.com');
  const [driverPhone, setDriverPhone] = useState(user.phone || '+91 98765 43210');
  const [vehiclePlate, setVehiclePlate] = useState(user.defaultVehicle?.licensePlate || 'KA 01 MJ 4829');
  const [vehicleModel, setVehicleModel] = useState(user.defaultVehicle?.makeModel || 'Tata Nexon EV (Dark Edition)');

  // Simulated License Upload
  const [licenseFileName, setLicenseFileName] = useState<string | null>('ind_driver_license_demo.jpg');
  const [licenseFileSize, setLicenseFileSize] = useState<string | null>('1.8 MB');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Apple Pay' | 'Google Pay' | 'UPI'>('UPI');
  const [upiId, setUpiId] = useState('arjun.sharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('•••');

  // Completed Booking Reference
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  if (!space) {
    return (
      <div className="min-h-screen bg-surface-subtle flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md">
          <p className="text-sm font-bold text-navy-900">Space Not Found</p>
          <Link to="/explore" className="text-xs text-brand-600 font-semibold mt-2 inline-block">
            &larr; Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  // Duration & Pricing Math
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const durationHours = Math.max(1, endHour - startHour);
  const subtotal = durationHours * space.hourlyRate;
  const serviceFee = Number((subtotal * 0.1).toFixed(2));
  const totalAmount = Number((subtotal + serviceFee).toFixed(2));

  // Handle License File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    // Check allowed extension
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload JPG, PNG, or PDF.');
      return;
    }

    setUploadError(null);
    setLicenseFileName(file.name);
    setLicenseFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingResult = addBooking({
      spaceId: space.id,
      spaceTitle: space.title,
      spaceAddress: space.address,
      spaceImage: space.images[0],
      driverName,
      driverEmail,
      driverPhone,
      vehiclePlate,
      vehicleModel,
      licenseFileDemoName: licenseFileName || 'simulated_license.jpg',
      date: selectedDate,
      startTime,
      endTime,
      durationHours,
      hourlyRate: space.hourlyRate,
      subtotal,
      serviceFee,
      totalAmount,
      paymentMethod,
    });

    setCompletedBooking(bookingResult);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface-subtle pb-20">
      
      {/* Step Indicator Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/space/${space.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Spot Details</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>1</span>
                <span>Details</span>
              </span>
              <span className="text-slate-300">&rarr;</span>
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>2</span>
                <span>Payment</span>
              </span>
              <span className="text-slate-300">&rarr;</span>
              <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-brand-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>3</span>
                <span>Pass</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* STEP 1: SCHEDULE & VEHICLE DETAILS */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Form Fields (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Space Mini Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
                <img
                  src={space.images[0]}
                  alt={space.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {space.neighborhood}
                  </span>
                  <h3 className="font-bold text-sm text-navy-900 truncate">{space.title}</h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{space.address}</p>
                </div>
              </div>

              {/* Step 1.1: Date & Time Reservation */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
                <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Parking Window
                </h2>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-navy-900 outline-none"
                  >
                    <option value="Today, Oct 23">Today, Oct 23</option>
                    <option value="Tomorrow, Oct 24">Tomorrow, Oct 24</option>
                    <option value="Saturday, Oct 25">Saturday, Oct 25</option>
                    <option value="Sunday, Oct 26">Sunday, Oct 26</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Arrival Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900"
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Departure Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900"
                    >
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 1.2: Driver & Vehicle Info */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
                <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-600" />
                  Driver & Vehicle Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Driver Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={driverEmail}
                      onChange={(e) => setDriverEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Vehicle Make & Model
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tesla Model 3"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy-900 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      License Plate Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7XYZ892"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy-900 uppercase tracking-widest outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  License plate is verified by the automated parking gate / ALPR sensor for gate access.
                </p>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-soft-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Continue to Verification & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Price Summary Sidebar (5 cols) */}
            <div className="md:col-span-5 sticky top-28">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-soft-md">
                <h3 className="font-extrabold text-sm text-navy-900 border-b border-slate-100 pb-3">
                  Reservation Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Spot Rate</span>
                    <span className="font-semibold text-navy-900">₹{space.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Duration</span>
                    <span className="font-semibold text-navy-900">{durationHours} hours</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-navy-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform & Guarantee Fee (10%)</span>
                    <span className="font-semibold text-navy-900">₹{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-navy-950">
                    <span>Total Amount</span>
                    <span className="text-brand-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Parko Guarantee Included
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Free cancellation up to 1 hour prior. 100% money-back if spot is blocked.
                  </p>
                </div>
              </div>
            </div>

          </form>
        )}

        {/* STEP 2: SIMULATED IDENTITY UPLOAD & PAYMENT */}
        {step === 2 && (
          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-7 space-y-6">
              
              {/* Identity Verification Section */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    Driver License Verification
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Simulated Check
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Required by property hosts to ensure verified vehicle access. In this prototype, documents remain strictly local in your browser and are not uploaded to any remote server.
                </p>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-brand-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="license-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="license-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-brand-600 mb-2" />
                    <span className="text-xs font-bold text-navy-900 hover:text-brand-600">
                      Upload photo of Driver's License
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, PDF up to 5MB
                    </span>
                  </label>
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {uploadError}
                  </p>
                )}

                {/* Verified Document Preview Pill */}
                {licenseFileName && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-900">{licenseFileName}</p>
                        <p className="text-[10px] text-emerald-700">{licenseFileSize || 'Verified Demo File'} &bull; Ready</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-soft-xs">
                      Simulated Pass
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    Simulated Payment Method
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    No Real Charge
                  </span>
                </div>

                {/* Payment Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['UPI', 'Credit Card', 'Google Pay', 'Apple Pay'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                        paymentMethod === method
                          ? 'bg-navy-900 text-white border-navy-900 shadow-soft-sm'
                          : 'bg-white text-navy-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Virtual Payment Address / UPI ID (GPay / PhonePe / Paytm)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobile@upi or username@bank"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-navy-900 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-2">
                      ⚡ Instant UPI verification active. You will receive an authorization prompt on your UPI app.
                    </p>
                  </div>
                )}

                {paymentMethod === 'Credit Card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Card Number (Demo)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-navy-900 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-navy-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-navy-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <Lock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>256-bit TLS simulated checkout session. No financial data leaves your browser.</span>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-100 transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-soft-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Authorize & Complete Booking (₹{totalAmount.toFixed(2)})</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Sidebar Summary */}
            <div className="md:col-span-5 sticky top-28">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-soft-md">
                <h3 className="font-extrabold text-sm text-navy-900 border-b border-slate-100 pb-3">
                  Reservation Details
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Space:</span>
                    <span className="font-bold text-navy-900 text-right">{space.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver:</span>
                    <span className="font-semibold text-navy-900">{driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="font-semibold text-navy-900">{vehicleModel} ({vehiclePlate})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-semibold text-navy-900">{durationHours}h ({startTime} - {endTime})</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-navy-950">
                    <span>Total Due:</span>
                    <span className="text-brand-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}

        {/* STEP 3: BOOKING SUCCESS SCREEN WITH DIGITAL QR PASS */}
        {step === 3 && completedBooking && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Parking Spot Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Booking Reference: <strong className="text-brand-700 font-mono text-sm">{completedBooking.bookingReference}</strong>
              </p>
            </div>

            {/* Digital Parking Pass Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-xl overflow-hidden">
              
              {/* Pass Header */}
              <div className="bg-navy-950 text-white p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
                    Parko Access Pass
                  </span>
                  <h3 className="font-bold text-base text-white mt-0.5">{space.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{space.address}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-navy-950 font-black text-xl flex items-center justify-center shrink-0">
                  P
                </div>
              </div>

              {/* Pass Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Simulated QR Code Canvas */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  {/* Decorative QR Code grid */}
                  <div className="w-40 h-40 bg-white p-3 rounded-xl border border-slate-300 shadow-soft-xs flex flex-col justify-between">
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
                      <div className="text-[9px] font-mono text-slate-400 font-bold">SCAN AT GATE</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-navy-900 mt-2">
                    {completedBooking.bookingReference}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Scan on phone or show gate attendant
                  </span>
                </div>

                {/* Reservation Details */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Gate Keypad Code</span>
                    <span className="text-lg font-mono font-black text-brand-600 block">
                      {completedBooking.gateCode || '7482#'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Vehicle Assigned</span>
                    <span className="font-semibold text-navy-900 block">{vehicleModel} &bull; {vehiclePlate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Reserved Duration</span>
                    <span className="font-semibold text-navy-900 block">{selectedDate} &bull; {startTime} to {endTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Total Paid (Demo)</span>
                    <span className="font-bold text-navy-900 block">₹{totalAmount.toFixed(2)} via {paymentMethod}</span>
                  </div>
                </div>

              </div>

              {/* Instructions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  {space.accessInstructions}
                </span>
              </div>

            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard/driver"
                className="flex-1 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-soft-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span>View in Driver Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="py-3.5 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy-800 font-bold text-sm text-center transition-colors"
              >
                Book Another Spot
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
