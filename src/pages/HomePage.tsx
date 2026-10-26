import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { SpaceCard } from '../components/explore/SpaceCard';
import { HeroBackground } from '../components/home/HeroBackground';
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
  IndianRupee,
  Lock,
  Sparkles,
  ChevronDown,
  Navigation,
  QrCode,
  KeyRound,
  MapPin,
  SlidersHorizontal,
  Radio,
  Activity,
  Wifi,
  RefreshCw,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { spaces } = useParking();

  // Search Bar State
  const [searchLocation, setSearchLocation] = useState('Bengaluru');
  const [searchDate, setSearchDate] = useState('Today');
  const [arrivalTime, setArrivalTime] = useState('09:00');
  const [departureTime, setDepartureTime] = useState('17:00');

  // How It Works Interactive State
  const [howItWorksTab, setHowItWorksTab] = useState<'driver' | 'owner'>('driver');
  const [simulatedGateState, setSimulatedGateState] = useState<'idle' | 'scanning' | 'opened'>('idle');

  const handleTestGateSimulation = () => {
    if (simulatedGateState !== 'idle') return;
    setSimulatedGateState('scanning');
    setTimeout(() => {
      setSimulatedGateState('opened');
      setTimeout(() => {
        setSimulatedGateState('idle');
      }, 4500);
    }, 1200);
  };

  // Space Owner Earnings Calculator State
  const [calcSpots, setCalcSpots] = useState(1);
  const [calcHours, setCalcHours] = useState(6);
  const [calcRate, setCalcRate] = useState(60);

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
      a: 'Yes. Every booking through Parko includes our ₹10,00,000 Host Liability and Property Damage Guarantee, along with driver identity and vehicle verification checks.',
    },
    {
      q: 'Can I cancel my reservation if my plans change?',
      a: 'Most spaces offer free cancellation up to 1 hour before scheduled arrival time with 100% refund processed automatically.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-subtle">
      
      {/* HERO SECTION WITH PRODUCTION-GRADE CINEMATIC MOBILITY BACKGROUND */}
      <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-center pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-200/60">
        
        {/* Production-Grade Architectural Hero Background */}
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Pill tag with subtle entrance */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-soft-xs animate-fade-in-up animation-delay-75">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              The On-Demand Parking Marketplace
            </div>

            {/* Headline with guaranteed clean line wrapping and high contrast */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14] max-w-2xl mx-auto animate-fade-in-up animation-delay-150 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              Your parking spot.
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
                Just a tap away.
              </span>
            </h1>

            {/* Subtitle with refined contrast */}
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-225">
              Reserve guaranteed, hourly parking spots in downtown corridors and event districts. Or turn your unused driveway and garage into reliable passive income.
            </p>
          </div>

          {/* Interactive Hero Search Card with clean art-directed border and shadow */}
          <div className="relative mt-10 max-w-4xl mx-auto animate-fade-in-up animation-delay-300">
            <form
              onSubmit={handleHeroSearch}
              className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/10 border border-slate-200/90 p-3 sm:p-4 md:p-5 transition-all duration-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Location */}
                <div className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/70 transition-all border border-slate-200/70 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:bg-white">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Where to?
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="City, landmark, or street..."
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/70 transition-all border border-slate-200/70 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:bg-white">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Parking Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Today">Today, Oct 23</option>
                      <option value="Tomorrow">Tomorrow, Oct 24</option>
                      <option value="This Weekend">This Weekend</option>
                    </select>
                  </div>
                </div>

                {/* Times (Arrival / Departure) */}
                <div className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/70 transition-all border border-slate-200/70 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:bg-white">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Duration
                  </label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer"
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
                      className="bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer"
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
                    className="w-full h-full min-h-[48px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Find Parking</span>
                  </button>
                </div>

              </div>

              {/* Quick filter chips below search */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Popular hubs:</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('Indiranagar'); navigate('/explore?q=Indiranagar'); }}
                    className="hover:text-emerald-600 font-medium hover:underline text-slate-600 transition-colors"
                  >
                    Indiranagar
                  </button>
                  <span className="text-slate-300">&bull;</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('BKC'); navigate('/explore?q=BKC'); }}
                    className="hover:text-emerald-600 font-medium hover:underline text-slate-600 transition-colors"
                  >
                    BKC Mumbai
                  </button>
                  <span className="text-slate-300">&bull;</span>
                  <button
                    type="button"
                    onClick={() => { setSearchLocation('Connaught Place'); navigate('/explore?q=Connaught'); }}
                    className="hover:text-emerald-600 font-medium hover:underline text-slate-600 transition-colors"
                  >
                    Connaught Place
                  </button>
                </div>
                <div className="flex items-center gap-4 font-semibold text-emerald-800 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Guaranteed Spot
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Cancellation
                  </span>
                </div>
              </div>

            </form>
          </div>

          {/* Key Product Value Metrics with refined depth and stagger entrance */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg shadow-slate-950/5 hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-slate-900">
                <span>4.94</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Average spot rating</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg shadow-slate-950/5 hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-slate-900">
                <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <span>&lt; 30s</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Instant QR gate check-in</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg shadow-slate-950/5 hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span>Up to 45%</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Savings vs commercial lots</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg shadow-slate-950/5 hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>₹10,00,000</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Host property protection</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PARKING SPACES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Verified & Ready Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular parking spots in prime hubs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Clean, gated, and covered spaces monitored 24/7 by smart access and verified hosts.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4"
          >
            <span>Explore all {spaces.length} spaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* HOW PARKO WORKS (Comprehensive Dual Driver & Owner Guide) */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              How Parko Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              The smart parking marketplace explained
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              Whether you need a guaranteed parking spot in prime downtown traffic or want to turn an empty driveway into passive income, here is the complete step-by-step lifecycle.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="inline-flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner mt-4">
              <button
                type="button"
                onClick={() => setHowItWorksTab('driver')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  howItWorksTab === 'driver'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>For Drivers (Reserve a Bay)</span>
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('owner')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  howItWorksTab === 'owner'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>For Space Hosts (List & Monetize)</span>
              </button>
            </div>
          </div>

          {/* Workflow Steps Grid */}
          {howItWorksTab === 'driver' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      01
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Search & Map
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Find on Live Map
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Search any Indian city, landmark, or enable live GPS on our OpenStreetMap interface. Filter by EV charging, covered security, and vehicle size.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-time bay availability counters</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      02
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Instant Lock
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Reserve & UPI Hold
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Select your exact arrival & departure window. Confirm with 1-tap UPI or card. Your stall is immediately locked and guaranteed with zero surge fees.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free cancellation policy</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      03
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Smart Access
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Scan & Park
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Navigate straight to your reserved stall. Scan your digital QR pass at the barrier scanner or type your 4-digit keypad PIN for automated gate opening.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>&lt; 30s contactless entry barrier</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      04
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Flexible Exit
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Extend Remotely
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Need more time? Extend your parking duration with a single tap on your Driver Dashboard. No rush, no ticket queues, and zero surprise fines.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Tap window extensions</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Host Step 1 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      01
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      List in 3 Min
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Publish Your Listing
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Use our 6-step guided wizard to register your residential driveway, commercial lot, or basement stall. Set supported vehicle sizes and security features.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automatic OpenStreetMap geocoding</span>
                </div>
              </div>

              {/* Host Step 2 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      02
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Full Control
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Set Rates & Schedule
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Set your own hourly rate and daily maximum. Use our weekly stall matrix to block hours when you need the spot yourself and monetize downtime automatically.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom weekly availability matrix</span>
                </div>
              </div>

              {/* Host Step 3 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      03
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Zero Friction
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Automated Smart Access
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Parko creates time-restricted keypad codes and digital passes for verified drivers. Track incoming arrivals live or trigger barrier gates remotely.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live arrival feed & IoT actuator</span>
                </div>
              </div>

              {/* Host Step 4 */}
              <div className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-900/10">
                      04
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Direct Deposit
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Weekly Payouts & Shield
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Earnings are credited directly to your bank account or UPI every Friday. Every single booking is protected by our ₹10,00,000 Host Protection Shield.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>₹10,00,000 Host property guarantee</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Smart Gate Simulator Box */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Interactive Demonstration: Smart IoT Access</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  See how automated gate access works in real life
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  When a driver arrives at the parking gate, Parko validates their digital pass against our server IoT actuator. Click the button to test live barrier actuation.
                </p>
              </div>

              {/* Gate Simulator Visual Card */}
              <div className="w-full lg:w-auto shrink-0 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col items-center gap-4 text-center min-w-[280px]">
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" /> IOT-BARRIER-01
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">ONLINE</span>
                </div>

                {/* Gate Barrier Animation Display */}
                <div className="h-16 flex flex-col items-center justify-center">
                  {simulatedGateState === 'idle' && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-36 h-2 bg-amber-500 rounded-full" />
                      <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                        BARRIER DOWN • AWAITING PASS
                      </span>
                    </div>
                  )}

                  {simulatedGateState === 'scanning' && (
                    <div className="flex flex-col items-center gap-1.5 animate-pulse">
                      <QrCode className="w-6 h-6 text-emerald-400 animate-spin" />
                      <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                        VALIDATING DIGITAL TOKEN...
                      </span>
                    </div>
                  )}

                  {simulatedGateState === 'opened' && (
                    <div className="flex flex-col items-center gap-1 animate-bounce">
                      <div className="w-36 h-2 bg-emerald-400 rounded-full rotate-45 transform -translate-y-2 origin-left transition-transform duration-500" />
                      <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                        GATE OPENED • ACCESS GRANTED
                      </span>
                    </div>
                  )}
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={handleTestGateSimulation}
                  disabled={simulatedGateState !== 'idle'}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    simulatedGateState === 'idle'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {simulatedGateState === 'idle'
                      ? 'Simulate Gate Check-in'
                      : simulatedGateState === 'scanning'
                      ? 'Authorizing...'
                      : 'Barrier Open (4s)'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Explore & Reserve a Spot</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/list-space"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-200 transition-all active:scale-[0.98]"
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>List Your Empty Space Free</span>
            </Link>
          </div>

        </div>
      </section>

      {/* TWO-SIDED VALUE PROPOSITION: DRIVERS VS OWNERS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            A Two-Sided Mobility Ecosystem
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Built for drivers. Rewarding for property owners.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Driver Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card flex flex-col justify-between hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Car className="w-4 h-4 text-emerald-600" />
                For Drivers
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                Never circle the block again.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether attending a concert, commuting downtown, or visiting clients, Parko takes the anxiety out of urban mobility.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Guaranteed Bay Assurance</h4>
                    <p className="text-xs text-slate-500">Your spot is reserved exclusively for you. 100% money-back and rebooking guarantee.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Substantial Cost Savings</h4>
                    <p className="text-xs text-slate-500">Hourly rates average 40% below predatory commercial multi-story lots.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dedicated EV Bays</h4>
                    <p className="text-xs text-slate-500">Book Level 2 and Level 3 chargers directly with real-time status.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/explore"
                className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Find Your Next Parking Spot</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-8 shadow-card flex flex-col justify-between hover:shadow-2xl hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <Building className="w-4 h-4 text-emerald-400" />
                For Space Owners
              </div>

              <h3 className="text-2xl font-black text-white">
                Turn unused parking into recurring revenue.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Homeowners, condo associations, and commercial facilities earn thousands each year by monetizing vacant driveways and parking stalls.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Hands-Free Monetization</h4>
                    <p className="text-xs text-slate-400">Drivers scan in and out autonomously. Set your own pricing and calendar rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">₹10,00,000 Property & Liability Protection</h4>
                    <p className="text-xs text-slate-400">Every reservation is backed by full host guarantee coverage and verified drivers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Weekly Direct Deposits</h4>
                    <p className="text-xs text-slate-400">Track earnings in real time with automated payouts directly to your account.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                to="/list-space"
                className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Host Revenue Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              See what your parking space could earn
            </h2>
            <p className="text-sm text-slate-400">
              Calculate projected earnings based on your location, number of stalls, and hours available.
            </p>
          </div>

          <div className="bg-slate-950/80 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Number of spots */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Available Parking Stalls</span>
                  <span className="text-emerald-400 font-bold">{calcSpots} {calcSpots === 1 ? 'stall' : 'stalls'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={calcSpots}
                  onChange={(e) => setCalcSpots(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
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
                  <span className="text-emerald-400 font-bold">{calcHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
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
                  <span className="text-emerald-400 font-bold">₹{calcRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="5"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹30/hr (Suburban)</span>
                  <span>₹150+/hr (Prime Commercial)</span>
                </div>
              </div>

            </div>

            {/* Projected Output Card */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-700/80 p-6 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estimated Monthly Revenue
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-400 block mt-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on typical 24 days active occupancy per month. No setup fees, no long-term contracts.
              </p>
              <Link
                to="/list-space"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm block transition-colors shadow-sm"
              >
                Start Monetizing My Space
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* SAFETY & TRUST TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified & Safe
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Safety and transparency at every step
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We vet every parking space, verify driver identification, and protect property owners with comprehensive liability coverage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Verified Property Ownership</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Encrypted Digital Pass Access</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Star className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Two-Way Community Reviews</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <IndianRupee className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>₹10 Lakhs Property Damage Shield</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/safety"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline"
              >
                <span>Learn more about our Safety Framework</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Trust Metrics
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Active Monitoring</span>
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
                <span className="font-bold text-slate-900">&lt; 90 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
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
                    className="w-full flex items-center justify-between text-left gap-4 py-2 text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-1 pb-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BOTTOM CTA CALLOUT */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-inner">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready for stress-free parking?
          </h2>
          <p className="text-emerald-50 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of urban drivers reserving guaranteed parking in seconds. Or monetize your empty stall today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 shadow-sm transition-all active:scale-95"
            >
              Explore Parking Spots
            </Link>
            <Link
              to="/list-space"
              className="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 border border-slate-700 shadow-sm transition-all active:scale-95"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
