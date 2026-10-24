import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { ParkoLogo } from '../components/common/ParkoLogo';
import {
  Car,
  Building,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginAsDriver, loginAsOwner } = useAuth();
  const { addToast } = useToast();

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please provide your full name.');
      return;
    }

    login(email, selectedRole, name || undefined);

    addToast({
      title: mode === 'signup' ? 'Account Created!' : 'Welcome Back!',
      description: `Signed in as ${selectedRole === 'driver' ? 'Driver' : 'Space Owner'}.`,
      type: 'success',
    });

    if (selectedRole === 'driver') {
      navigate('/dashboard/driver');
    } else {
      navigate('/dashboard/owner');
    }
  };

  const handleQuickDriver = () => {
    loginAsDriver();
    addToast({
      title: 'Demo Driver Active',
      description: 'Loaded Arjun Sharma profile with active bookings.',
      type: 'info',
    });
    navigate('/dashboard/driver');
  };

  const handleQuickOwner = () => {
    loginAsOwner();
    addToast({
      title: 'Demo Owner Active',
      description: 'Loaded Vikram Mehta profile with parking listings & earnings.',
      type: 'info',
    });
    navigate('/dashboard/owner');
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center justify-center mb-3 group" aria-label="Parko Home">
          <ParkoLogo size="lg" />
        </Link>
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your Parko account'}
        </h1>
        <p className="text-xs text-slate-500">
          The modern on-demand parking marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Quick Demo Switcher Card */}
        <div className="mb-4 bg-navy-950 text-white rounded-2xl p-4 border border-navy-800 shadow-soft-md space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Personas
            </span>
            <span className="text-[10px] text-slate-400">Instant Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDriver}
              className="py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-xs font-semibold text-left border border-navy-700 transition-colors flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-brand-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-white truncate">Demo Driver</p>
                <p className="text-[10px] text-slate-400">Arjun S.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={handleQuickOwner}
              className="py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-xs font-semibold text-left border border-navy-700 transition-colors flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-brand-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-white truncate">Demo Owner</p>
                <p className="text-[10px] text-slate-400">Vikram M.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Auth Form Container */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200/90 shadow-soft-xl space-y-6">
          
          {/* Sign In / Sign Up Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-navy-950 shadow-soft-xs'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-navy-950 shadow-soft-xs'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Account Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole('driver')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  selectedRole === 'driver'
                    ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Car className="w-4 h-4 text-brand-600 mb-1" />
                <p className="font-bold text-xs text-navy-900">Driver</p>
                <p className="text-[10px] text-slate-500">I want to book parking</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  selectedRole === 'owner'
                    ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Building className="w-4 h-4 text-brand-600 mb-1" />
                <p className="font-bold text-xs text-navy-900">Space Owner</p>
                <p className="text-[10px] text-slate-500">I want to monetize spaces</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-soft-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400 leading-relaxed border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600 inline mr-1" />
            Demo Authentication creates a client-side session stored locally in your browser.
          </div>

        </div>

      </div>

    </div>
  );
};
