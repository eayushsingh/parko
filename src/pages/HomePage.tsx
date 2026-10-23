import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { SpaceCard } from '../components/explore/SpaceCard';
import {
  Search,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Car,
  Building,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Star,
  DollarSign,
  Lock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Navigation,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { spaces } = useParking();

  // Search Bar State
  const [searchLocation, setSearchLocation] = useState('San Francisco, CA');
  const [searchDate, setSearchDate] = useState('Today');
  const [arrivalTime, setArrivalTime] = useState('09:00');
  const [departureTime, setDepartureTime] = useState('17:00');

  // Space Owner Earnings Calculator State
  const [calcSpots, setCalcSpots] = useState(1);
  const [calcHours, setCalcHours] = useState(6);
  const [calcRate, setCalcRate] = useState(8);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const estimatedMonthlyEarnings = calcSpots * calcHours * calcRate * 24;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchLocation)}&in=${arrivalTime}&out=${departureTime}`);
  };

  const featuredSpaces = spaces.filter((s) => s.featured).slice(0, 4);

  const faqs = [
    {
      q: 'How does parking reservation work on Parko?',
      a: 'Search your destination, choose your arrival and departure times, and reserve instantly. Upon booking, you receive a digital Parko pass with a QR code and gate code. Simply drive up, scan, and park in your dedicated bay.',
    },
    {
      q: 'How do property owners get paid for their unused spaces?',
      a: 'Owners list their driveway, carport, or commercial stall in under 5 minutes. When drivers reserve your spot, payments are automatically processed and transferred directly to your bank account weekly.',
    },
    {
      q: 'What happens if another vehicle is parked in my reserved spot?',
      a: 'Parko guarantees every reservation with our 100% Spot Assurance. If your spot is occupied upon arrival, our 24/7 concierge team will re-route you to an equivalent or upgraded nearby spot immediately and cover any difference.',
    },
    {
      q: 'Is my property protected if I list my driveway or garage?',
      a: 'Yes. Every booking through Parko includes our $1,000,000 Host Liability and Property Damage Guarantee, along with driver identity and vehicle verification checks.',
    },
    {
      q: 'Can I cancel my reservation if my plans change?',
      a: 'Most spaces offer free cancellation up to 1 hour before scheduled arrival time with 100% refund processed automatically.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-subtle">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-surface-subtle border-b border-slate-200/60">
        
        {/* Subtle background mobility tech pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold shadow-soft-xs">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              The On-Demand Parking Marketplace
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
              Your parking spot.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                Just a tap away.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Reserve guaranteed, hourly parking spots in downtown corridors and event districts. Or turn your unused driveway and garage into reliable passive income.
            </p>
          </div>

          {/* Interactive Hero Search Card */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-soft-xl border border-slate-200/90 p-3 sm:p-4 md:p-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Location */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors border border-slate-200/60">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Where to?
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Navigation className="w-4 h-4 text-brand-600 shrink-0" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="City, landmark, or street..."
                      className="w-full bg-transparent text-sm font-semibold text-navy-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors border border-slate-200/60">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Parking Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-navy-900 outline-none cursor-pointer"
                    >
                      <option value="Today">Today, Oct 23</option>
                      <option value="Tomorrow">Tomorrow, Oct 24</option>
                      <option value="This Weekend">This Weekend</option>
                    </select>
                  </div>
                </div>

                {/* Times (Arrival / Departure) */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors border border-slate-200/60">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Duration
                  </label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-navy-900 outline-none cursor-pointer"
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                    </select>
                    <span className="text-slate-400 text-xs">&rarr;</span>
                    <select
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-navy-900 outline-none cursor-pointer"
                    >
                      <option value="13:00">1:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="23:00">11:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[46px] py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Parking</span>
                  </button>
                </div>

              </div>

              {/* Quick filter chips below search */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-400">Popular hubs:</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('Financial District'); navigate('/explore?q=Financial'); }}
                    className="hover:text-brand-600 font-medium hover:underline"
                  >
                    Financial District
                  </button>
                  <span>&bull;</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('SoMa'); navigate('/explore?q=SoMa'); }}
                    className="hover:text-brand-600 font-medium hover:underline"
                  >
                    SoMa
                  </button>
                  <span>&bull;</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('Union Square'); navigate('/explore?q=Union'); }}
                    className="hover:text-brand-600 font-medium hover:underline"
                  >
                    Union Square
                  </button>
                </div>
                <div className="flex items-center gap-3 font-semibold text-brand-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Guaranteed Spot
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Free Cancellation
                  </span>
                </div>
              </div>

            </form>
          </div>

          {/* Key Product Value Metrics */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">4.94<span className="text-brand-500">★</span></p>
              <p className="text-xs text-slate-500 font-medium mt-1">Average spot rating</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">&lt; 30s</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Instant QR gate check-in</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">Up to 45%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Savings vs commercial lots</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">$1,000,000</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Host property protection</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PARKING SPACES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Verified & Ready Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
              Popular parking spots in prime hubs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Clean, gated, and covered spaces monitored 24/7 by smart access and verified hosts.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline underline-offset-4"
          >
            Explore all {spaces.length} spaces &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* HOW PARKO WORKS (4-Step Flow) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Seamless 4-Step Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Parking designed for the modern driver
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              No circling the block for 25 minutes. No exorbitant $40 surprise flat fees. Just tap, navigate, and park with total confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-start bg-surface-subtle p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center shadow-soft-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-lg text-navy-900">Search & Select</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Enter your destination and parking window. Filter by EV charging, covered garages, or 24/7 security.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start bg-surface-subtle p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center shadow-soft-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-lg text-navy-900">Instant Reserve</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Lock in your spot with transparent hourly pricing. Your bay is guaranteed and held exclusively for your vehicle.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start bg-surface-subtle p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center shadow-soft-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-lg text-navy-900">Navigate & Scan</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Get turn-by-turn directions directly to your stall. Scan your Parko digital pass or keypad code for automatic entry.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-start bg-surface-subtle p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center shadow-soft-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-lg text-navy-900">Extend or Depart</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Need more time? Extend your parking window right from your phone without rushing back to a ticket machine.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-soft-md transition-all"
            >
              <Car className="w-4 h-4 text-brand-400" />
              <span>Try Reserving a Spot Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* TWO-SIDED VALUE PROPOSITION: DRIVERS VS OWNERS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            A Two-Sided Mobility Ecosystem
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Built for drivers. Rewarding for property owners.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Driver Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Car className="w-4 h-4 text-emerald-600" />
                For Drivers
              </div>

              <h3 className="text-2xl font-bold text-navy-900">
                Never circle the block again.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether attending a concert, commuting downtown, or visiting clients, Parko takes the anxiety out of urban mobility.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-navy-900">Guaranteed Bay Assurance</h4>
                    <p className="text-xs text-slate-500">Your spot is reserved exclusively for you. 100% money-back and rebooking guarantee.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-navy-900">Substantial Cost Savings</h4>
                    <p className="text-xs text-slate-500">Hourly rates average 40% below predatory commercial multi-story lots.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-navy-900">Dedicated EV Bays</h4>
                    <p className="text-xs text-slate-500">Book Level 2 and Level 3 chargers directly with real-time status.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/explore"
                className="w-full py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Find Your Next Parking Spot</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-navy-950 text-white rounded-3xl border border-navy-800 p-8 shadow-card flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                <Building className="w-4 h-4 text-brand-400" />
                For Space Owners
              </div>

              <h3 className="text-2xl font-bold text-white">
                Turn unused parking into recurring revenue.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Homeowners, condo associations, and commercial facilities earn thousands each year by monetizing vacant driveways and parking stalls.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Automated Hands-Free Monetization</h4>
                    <p className="text-xs text-slate-400">Drivers scan in and out autonomously. Set your own pricing and calendar rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">$1,000,000 Property & Liability Protection</h4>
                    <p className="text-xs text-slate-400">Every reservation is backed by full host guarantee coverage and verified drivers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Weekly Direct Deposits</h4>
                    <p className="text-xs text-slate-400">Track earnings in real time with automated payouts directly to your account.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-navy-800">
              <Link
                to="/list-space"
                className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-100 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>List Your Space in 5 Minutes</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE OWNER EARNINGS CALCULATOR */}
      <section id="owner-earnings" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glow circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Host Revenue Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              See what your parking space could earn
            </h2>
            <p className="text-sm text-slate-400">
              Calculate projected earnings based on your location, number of stalls, and hours available.
            </p>
          </div>

          <div className="bg-navy-950/80 rounded-3xl border border-navy-800 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Number of spots */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Available Parking Stalls</span>
                  <span className="text-brand-400 font-bold">{calcSpots} {calcSpots === 1 ? 'stall' : 'stalls'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={calcSpots}
                  onChange={(e) => setCalcSpots(Number(e.target.value))}
                  className="w-full accent-brand-500 h-2 bg-navy-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>1 spot (Driveway)</span>
                  <span>5 spots (Small lot)</span>
                </div>
              </div>

              {/* Hours per day */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Hours Available Per Day</span>
                  <span className="text-brand-400 font-bold">{calcHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  className="w-full accent-brand-500 h-2 bg-navy-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>2 hours</span>
                  <span>16 hours</span>
                </div>
              </div>

              {/* Hourly rate */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Estimated Hourly Rate</span>
                  <span className="text-brand-400 font-bold">${calcRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full accent-brand-500 h-2 bg-navy-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$4/hr (Suburban)</span>
                  <span>$15/hr (Prime Downtown)</span>
                </div>
              </div>

            </div>

            {/* Projected Output Card */}
            <div className="lg:col-span-5 bg-navy-900 rounded-2xl border border-navy-700 p-6 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estimated Monthly Revenue
              </span>
              <div className="text-4xl sm:text-5xl font-black text-brand-400 tracking-tight">
                ${estimatedMonthlyEarnings.toLocaleString()}
                <span className="text-sm font-normal text-slate-400 block mt-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on typical 24 days active occupancy per month. No setup fees, no long-term contracts.
              </p>
              <Link
                to="/list-space"
                className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-navy-950 font-bold text-sm block transition-colors"
              >
                Start Monetizing My Space
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* SAFETY & TRUST TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Verified & Safe
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Safety and transparency at every step
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We vet every parking space, verify driver identification, and protect property owners with comprehensive liability coverage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-navy-800">
                <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
                <span>Verified Property Ownership</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-navy-800">
                <Lock className="w-5 h-5 text-brand-600 shrink-0" />
                <span>Encrypted Digital Pass Access</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-navy-800">
                <Star className="w-5 h-5 text-brand-600 shrink-0" />
                <span>Two-Way Community Reviews</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-navy-800">
                <DollarSign className="w-5 h-5 text-brand-600 shrink-0" />
                <span>$1M Property Damage Shield</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/safety"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline"
              >
                Learn more about our Safety Framework &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Trust Metrics
              </span>
              <span className="text-xs text-brand-600 font-semibold">Active Monitoring</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600">Identity & License Verification</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Required
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600">CCTV & Gate Code Audit</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Automated
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600">Concierge Response Time</span>
                <span className="font-bold text-navy-900">&lt; 90 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div key={faq.q} className="py-4">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2 text-base font-bold text-navy-900 hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-2 pb-3 text-sm text-slate-600 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BOTTOM CTA CALLOUT */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready for stress-free parking?
          </h2>
          <p className="text-brand-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of urban drivers reserving guaranteed parking in seconds. Or monetize your empty stall today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-white text-navy-950 font-bold text-sm hover:bg-slate-100 shadow-soft-md transition-all active:scale-95"
            >
              Explore Parking Spots
            </Link>
            <Link
              to="/list-space"
              className="px-6 py-3.5 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 border border-brand-500 shadow-soft-md transition-all active:scale-95"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
