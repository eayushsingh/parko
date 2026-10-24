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
  const { login, loginAsDriver, loginAsOwner, loginWithGoogle } = useAuth();
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

    setError(null);
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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      const googleUser = await loginWithGoogle(selectedRole);
      addToast({
        title: 'Google Sign-In Successful!',
        description: `Welcome, ${googleUser.name}! Signed in as ${selectedRole === 'driver' ? 'Driver' : 'Space Owner'}.`,
        type: 'success',
      });
      if (selectedRole === 'driver') {
        navigate('/dashboard/driver');
      } else {
        navigate('/dashboard/owner');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in was interrupted. Please try again.';
      console.error('Google Sign-In error:', err);
      if (errorMsg.includes('unauthorized-domain')) {
        setError('This domain is not yet authorized in Firebase. In Firebase Console → Authentication → Settings → Authorized Domains, add your Vercel domain.');
        addToast({
          title: 'Vercel Domain Not Authorized in Firebase',
          description: 'Please add your Vercel deployment URL to Firebase Console > Authentication > Settings > Authorized Domains.',
          type: 'error',
        });
      } else if (!errorMsg.includes('popup-closed-by-user')) {
        setError('Google sign-in failed. Please verify popup permissions and try again.');
        addToast({
          title: 'Sign-In Interrupted',
          description: 'Google popup was closed or authentication failed.',
          type: 'error',
        });
      }
    } finally {
      setIsGoogleLoading(false);
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

        {/* Main Auth Card */}
        <div className="bg-white py-8 px-4 sm:rounded-3xl sm:px-10 border border-slate-200/90 shadow-soft-md space-y-6">
          
          {/* Sign In vs Sign Up Tabs */}
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

          {/* Real Google Sign-In Button */}
          <div>
            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs shadow-soft-xs transition-all hover:shadow-soft-sm active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                or with email
              </span>
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
                    placeholder="e.g. Arjun Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none font-medium"
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
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none font-medium"
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

          <div className="pt-2 text-center text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Secured with Firebase Google OAuth & 256-bit TLS encryption.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
