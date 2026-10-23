import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { role, switchRole, user } = useAuth();

  return (
    <div className="bg-navy-950 text-white text-xs py-2 px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-semibold text-[11px] border border-brand-500/30">
            <Sparkles className="w-3 h-3 text-brand-400" />
            Interactive Prototype
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active persona: <strong className="text-white">{user.name}</strong> ({role === 'driver' ? 'Driver / Booker' : 'Space Owner / Host'})
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-brand-400" />
            Verified Demo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden md:inline">Quick role switch:</span>
          <button
            onClick={() => switchRole(role === 'driver' ? 'owner' : 'driver')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white border border-navy-700 transition-colors font-medium text-xs"
          >
            <ArrowRightLeft className="w-3 h-3 text-brand-400" />
            Switch to {role === 'driver' ? 'Space Owner Portal' : 'Driver Portal'}
          </button>
          <Link
            to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
            className="text-brand-400 hover:text-brand-300 font-medium underline-offset-4 hover:underline ml-1"
          >
            Go to {role === 'driver' ? 'Driver Hub' : 'Owner Studio'} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
