import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { role, switchRole, user } = useAuth();

  return (
    <aside aria-label="Interactive Prototype Notice" className="bg-slate-950 text-slate-300 border-b border-slate-800/80 text-xs py-2 px-4 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Prototype Status */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Interactive Prototype
          </span>
          <span className="text-slate-400 hidden sm:inline text-xs">
            Viewing as <strong className="text-slate-100 font-semibold">{user.name.split(' ')[0]}</strong> ({role === 'driver' ? 'Driver' : 'Space Owner'})
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-400 text-[11px] border-l border-slate-800 pl-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Client-Side Simulation
          </span>
        </div>

        {/* Right: Quick Role Switch & Hub Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole(role === 'driver' ? 'owner' : 'driver')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all font-medium text-xs active:scale-95"
            title="Switch persona to test both sides of the marketplace"
          >
            <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
            <span>Switch to {role === 'driver' ? 'Owner Portal' : 'Driver Portal'}</span>
          </button>

          <Link
            to={role === 'driver' ? '/dashboard/driver' : '/dashboard/owner'}
            className="inline-flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 font-semibold text-xs ml-1 hover:underline underline-offset-2"
          >
            <span>{role === 'driver' ? 'Driver Hub' : 'Owner Studio'}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
