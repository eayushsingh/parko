import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';
import {
  Compass,
  PlusCircle,
  Shield,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Car,
  Building2,
  CheckCircle2,
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Explore Parking', href: '/explore', icon: Compass },
    { label: 'List Your Space', href: '/list-space', icon: PlusCircle },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Safety & Trust', href: '/safety', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-brand-500 shadow-soft-sm group-hover:scale-105 transition-transform duration-200 border border-navy-800">
              <span className="font-extrabold text-2xl tracking-tighter text-brand-500 flex items-center justify-center">
                P
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 -mr-0.5 ml-0.5"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-navy-900 group-hover:text-brand-600 transition-colors">
                parko
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-1">
                Parking on Demand
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/80 font-semibold'
                      : 'text-navy-700 hover:text-navy-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side CTA & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {activeBookingsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-xl border border-slate-200 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <span className="text-xs text-brand-600 font-medium">Demo Feed</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-semibold text-navy-900">{b.spaceTitle}</p>
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
                      className="block text-center text-xs font-semibold text-brand-600 hover:text-brand-700 py-1"
                    >
                      View all in Dashboard &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role-specific Action Button */}
            {role === 'driver' ? (
              <Link
                to="/dashboard/driver"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-navy-800 border border-slate-200 transition-colors"
              >
                <Car className="w-4 h-4 text-brand-600" />
                Driver Hub
                {activeBookingsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-500 text-white text-[10px]">
                    {activeBookingsCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/dashboard/owner"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-navy-800 border border-slate-200 transition-colors"
              >
                <Building2 className="w-4 h-4 text-brand-600" />
                Owner Studio
              </Link>
            )}

            {/* List Your Space CTA */}
            <Link
              to="/list-space"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm hover:shadow-soft-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Space</span>
            </Link>

            {/* Profile Avatar / Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                aria-label="User profile menu"
              >
                <span className="text-xs font-semibold text-navy-800 hidden xl:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-navy-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                        {role === 'driver' ? 'Driver Account' : 'Space Owner Account'}
                      </span>
                      <span className="text-[10px] text-slate-400">Verified</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-slate-50 hover:text-navy-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {role === 'driver' ? 'Driver Dashboard' : 'Owner Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        switchRole(role === 'driver' ? 'owner' : 'driver');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-slate-50 hover:text-navy-900 transition-colors text-left"
                    >
                      <Building2 className="w-4 h-4 text-brand-600" />
                      Switch to {role === 'driver' ? 'Owner Mode' : 'Driver Mode'}
                    </button>
                    <Link
                      to="/safety"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-slate-50 hover:text-navy-900 transition-colors"
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
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Switch Account / Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {/* Persona Card */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold text-navy-900">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{role} Account</p>
              </div>
            </div>
            <button
              onClick={() => switchRole(role === 'driver' ? 'owner' : 'driver')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-brand-600"
            >
              Switch Role
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-navy-800 hover:bg-slate-50 hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-600 hover:bg-brand-50"
            >
              {role === 'driver' ? 'Driver Dashboard' : 'Owner Dashboard'}
            </Link>
            <Link
              to="/auth"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              Sign In / Switch Demo Account
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/list-space"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-soft-md"
            >
              <PlusCircle className="w-5 h-5" />
              List Your Space
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
