import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';
import { ParkoLogo } from './ParkoLogo';
import {
  Compass,
  PlusCircle,
  Shield,
  Bell,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Car,
  Building2,
  CheckCircle2,
  ArrowRightLeft,
  HelpCircle,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { bookings } = useParking();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'active').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Explore Parking', href: '/explore', icon: Compass },
    { label: 'List Your Space', href: '/list-space', icon: PlusCircle },
    { label: 'How It Works', href: '/#how-it-works', icon: HelpCircle },
    { label: 'Safety & Trust', href: '/safety', icon: Shield },
  ];

  // User display name (first name to prevent awkward ellipsis truncation)
  const firstName = user.name.split(' ')[0] || user.name;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group shrink-0" aria-label="Parko Home">
            <ParkoLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side CTA & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Notification Popover */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <Bell className="w-4 h-4" />
                {activeBookingsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-xl border border-slate-200 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">Live Simulated Feed</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="text-xs min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 truncate">{b.spaceTitle}</p>
                            <p className="text-slate-500 mt-0.5">
                              Status: <span className="capitalize font-medium text-emerald-600">{b.status}</span> &bull; {b.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pt-2 border-t border-slate-100">
                    <Link
                      to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
                      onClick={() => setNotificationsOpen(false)}
                      className="block text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1"
                    >
                      View all reservations in Dashboard &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role-specific Action Button */}
            {role === 'driver' ? (
              <Link
                to="/dashboard/driver"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span>Driver Hub</span>
                {activeBookingsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    {activeBookingsCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/dashboard/owner"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Owner Studio</span>
              </Link>
            )}

            {/* List Your Space CTA */}
            <Link
              to="/list-space"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Space</span>
            </Link>

            {/* Profile Avatar / Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                aria-label="User profile menu"
              >
                <span className="text-xs font-semibold text-slate-800 hidden xl:inline">
                  {firstName}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {role === 'driver' ? 'Driver Account' : 'Space Owner Account'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {role === 'driver' ? 'Driver Dashboard' : 'Owner Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        switchRole(role === 'driver' ? 'owner' : 'driver');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                      Switch to {role === 'driver' ? 'Owner Mode' : 'Driver Mode'}
                    </button>
                    <Link
                      to="/safety"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Trust & Safety Center
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/auth');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Switch Account / Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Right Controls: Notification Bell + Hamburger Menu */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {activeBookingsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-slate-950/30 backdrop-blur-sm z-30 sm:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden relative z-40 border-b border-slate-200/90 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-soft-xl animate-in slide-in-from-top-2 duration-200">
          {/* Persona Card */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{role} Account &bull; Verified</p>
              </div>
            </div>
            <button
              onClick={() => switchRole(role === 'driver' ? 'owner' : 'driver')}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0 flex items-center gap-1 shadow-soft-xs"
            >
              <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
              <span>Switch</span>
            </button>
          </div>

          {/* Navigation Links with Icons & Active Indicators */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>{role === 'driver' ? 'Driver Dashboard' : 'Owner Studio'}</span>
              </div>
              {activeBookingsCount > 0 && role === 'driver' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                  {activeBookingsCount} active
                </span>
              )}
            </Link>

            <Link
              to="/auth"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Sign In / Switch Demo Account</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/list-space"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-soft-md active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Space &bull; Earn ₹₹₹</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
