import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-navy-950 font-extrabold text-xl shadow-soft-sm">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight">parko</span>
                <span className="text-[10px] font-semibold tracking-wider text-brand-400 uppercase -mt-1">
                  Parking on Demand
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The modern two-sided parking marketplace connecting drivers with guaranteed, on-demand parking spots and empowering property owners to monetize unused spaces.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-navy-800 text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                Mobility-Tech Prototype
              </span>
              <span>San Francisco, CA</span>
            </div>
          </div>

          {/* Drivers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Drivers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Explore Parking
                </Link>
              </li>
              <li>
                <Link to="/explore?type=EV Charging Bay" className="hover:text-white transition-colors">
                  EV Charging Bays
                </Link>
              </li>
              <li>
                <Link to="/explore?type=Garage" className="hover:text-white transition-colors">
                  Downtown Garages
                </Link>
              </li>
              <li>
                <Link to="/dashboard/driver" className="hover:text-white transition-colors">
                  Driver Hub & Passes
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  Driver Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Space Owners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Space Owners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/list-space" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  List Your Space <ArrowUpRight className="w-3.5 h-3.5 text-brand-400" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard/owner" className="hover:text-white transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/safety#host-guarantee" className="hover:text-white transition-colors">
                  $1M Host Protection
                </Link>
              </li>
              <li>
                <Link to="/#owner-earnings" className="hover:text-white transition-colors">
                  Earnings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust & Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  Verification Standards
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">
                  How Parko Works
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  Demo Authentication
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Prototype Transparency Notice */}
        <div className="mt-12 pt-8 border-t border-navy-800/80">
          <div className="rounded-2xl bg-navy-900/80 border border-navy-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-200">Interactive Mobility Prototype: </span>
                This web application demonstrates the full user experience of the Parko marketplace. Identity verification, payments, and smart-gate triggers are simulated locally in the browser with persistent state. No real monetary transactions occur.
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-navy-800 text-slate-300 text-xs font-mono">
                v1.0-preview
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Parko Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/safety" className="hover:text-slate-400 transition-colors">Safety Guidelines</Link>
            <Link to="/safety" className="hover:text-slate-400 transition-colors">Privacy Transparency</Link>
            <Link to="/safety" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
