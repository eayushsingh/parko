import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Car,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Building,
} from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-subtle pb-20">
      
      {/* Hero Header */}
      <section className="bg-navy-950 text-white pt-16 pb-20 relative overflow-hidden border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Parko Trust & Safety Framework
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Safety, verification, and peace of mind on every block.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you are parking your vehicle in a new neighborhood or welcoming guests onto your private driveway, Parko is engineered with trust at its core.
          </p>
        </div>
      </section>

      {/* 4 Pillars of Safety */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-navy-950">Property Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every host must verify ownership or legitimate parking lease rights before any space is approved on the marketplace.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-navy-950">Driver ID & License</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drivers verify their government-issued driver's license and vehicle license plate to eliminate anonymous parking.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-navy-950">Automated Smart Access</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Time-bound digital QR passes and dynamic keypad codes ensure only booked drivers enter during valid windows.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-navy-950">₹10 Lakhs Host Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hosts are shielded by comprehensive property damage and third-party liability coverage for total peace of mind.
            </p>
          </div>

        </div>
      </section>

      {/* In-Depth Verification Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft-sm space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              End-to-End Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              How Parko protects both sides of the marketplace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* For Drivers */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                <Car className="w-5 h-5 text-brand-600" />
                <span>Driver Guarantees</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Guaranteed Stall:</strong> If a space is inaccessible upon arrival, our 24/7 team immediately books you into an upgraded alternative and credits your account.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Cancellations:</strong> Cancel without penalty up to 1 hour before scheduled reservation start time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Space Amenities:</strong> CCTV, EV charging speed, and clearance heights are pre-audited.</span>
                </li>
              </ul>
            </div>

            {/* For Space Owners */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                <Building className="w-5 h-5 text-brand-600" />
                <span>Property Host Safeguards</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>No Strangers:</strong> Only drivers who complete license verification and provide matching license plates can reserve.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Overstay Protection:</strong> Automatic overstay billing penalty (2x rate) protects against lingering vehicles.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>₹10,00,000 Host Shield:</strong> Covers accidental damage to driveways, gates, walls, and third-party claims.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Prototype Disclosure Banner */}
          <div className="p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">Transparency & Prototype Distinction: </span>
                In this interactive frontend demonstration, driver license uploads, biometric verifications, and gate actuator controls are simulated locally in the browser. In production, these integrate with Stripe Identity, Twilio, and Brivo/Latch hardware APIs.
              </div>
            </div>
            <Link
              to="/explore"
              className="shrink-0 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-navy-950 font-bold text-xs"
            >
              Test Marketplace Now
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
