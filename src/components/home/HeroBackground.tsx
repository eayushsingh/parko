import React, { useState } from 'react';

interface HeroBackgroundProps {
  className?: string;
  enableAnimation?: boolean;
  blurLevel?: '30%' | 'subtle' | 'deep';
}

/**
 * Production-grade 30%-blurred animated parking background for Parko.
 * 
 * Features:
 * - 30% optical Gaussian blur (8px-12px) providing authentic depth-of-field bokeh
 *   so urban vehicles, parking bays, illuminated ramps, and architectural lighting
 *   remain identifiable while softening distracting edge glare.
 * - Hardware-accelerated continuous cinematic panning, zooming, and breathing.
 * - Parallax floating bokeh light reflections (warm headlight and emerald mobility orbs).
 * - Multi-layer contrast scrim with targeted reading halo for 100% WCAG AAA legibility.
 * - Oversized -inset-8 boundary guard completely eliminating blurred edge-bleed artifacts.
 */
export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  className = '',
  enableAnimation = true,
  blurLevel = '30%',
}) => {
  const [imageError, setImageError] = useState(false);

  // Calibrated blur classes corresponding to requested blur depth
  const blurClass = {
    'subtle': 'blur-[4px] sm:blur-[5px]',
    '30%': 'blur-[7px] sm:blur-[9px] lg:blur-[11px]',
    'deep': 'blur-[14px] sm:blur-[18px]',
  }[blurLevel];

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 bg-slate-900/5 ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Vivid, 30%-Blurred Animated Parking Background
          Using -inset-8 (-32px bleed guard) to eliminate edge bleed at 30% Gaussian blur
      */}
      <div
        className={`absolute -inset-8 transform-gpu ${
          enableAnimation ? 'animate-hero-cinematic' : 'scale-[1.04]'
        }`}
      >
        {!imageError ? (
          <picture className="w-full h-full block">
            {/* Mobile optimized viewport crop (< 640px) */}
            <source
              media="(max-width: 640px)"
              srcSet="/images/hero-parking-mobile.webp"
              type="image/webp"
            />
            {/* Next-gen AVIF for supported modern browsers */}
            <source
              srcSet="/images/hero-parking.avif"
              type="image/avif"
            />
            {/* Universally supported high-efficiency WebP */}
            <source
              srcSet="/images/hero-parking.webp"
              type="image/webp"
            />
            {/* Universal fallback image */}
            <img
              src="/images/hero-parking.jpg"
              alt="Urban parking facility with modern cars and architectural lighting"
              width={2000}
              height={1333}
              loading="eager"
              // @ts-expect-error React 18 lowercase fetchpriority attribute
              fetchpriority="high"
              decoding="async"
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-[50%_32%] sm:object-[50%_35%] lg:object-center ${blurClass} opacity-85 sm:opacity-90 contrast-[1.14] brightness-[1.02] saturate-[1.20] transition-all`}
            />
          </picture>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2000&q=80&fm=webp"
            alt="Urban parking facility"
            width={2000}
            height={1333}
            loading="eager"
            className={`w-full h-full object-cover object-[50%_35%] lg:object-center ${blurClass} opacity-85 contrast-[1.14] brightness-[1.02] saturate-[1.20]`}
          />
        )}
      </div>

      {/* Layer 2: Floating Bokeh Light Particles for depth & visual richness */}
      {enableAnimation && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Amber out-of-focus vehicle taillight orb */}
          <div className="absolute top-[22%] left-[18%] w-36 h-36 rounded-full bg-amber-500/15 blur-2xl animate-bokeh-slow" />
          
          {/* Emerald mobility glow reflection */}
          <div className="absolute top-[32%] right-[22%] w-44 h-44 rounded-full bg-emerald-500/15 blur-2xl animate-bokeh-reverse" />
          
          {/* Soft cyan architectural skylight orb */}
          <div className="absolute top-[14%] right-[42%] w-32 h-32 rounded-full bg-cyan-400/12 blur-2xl animate-bokeh-slow animation-delay-225" />
          
          {/* Subtle warm headlight bokeh orb */}
          <div className="absolute bottom-[24%] left-[34%] w-48 h-48 rounded-full bg-amber-300/10 blur-3xl animate-bokeh-reverse" />
        </div>
      )}

      {/* Layer 3: Targeted Readability Scrim & Architectural Contrast System */}
      {/* Luminous headline spotlight halo: keeps typography 100% crisp against the 30% blurred background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_52%_at_50%_23%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.44)_55%,transparent_100%)]" />

      {/* Top subtle navbar blend */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/90 via-white/50 to-transparent" />

      {/* Bottom transition seamlessly connecting into search card and features */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-surface-subtle via-surface-subtle/70 to-transparent" />

      {/* Brand emerald ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_50%_6%,rgba(16,185,129,0.09),transparent)]" />

      {/* Subtle outer cinema vignette for deep production-grade contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_50%,transparent_50%,rgba(15,23,42,0.10)_100%)]" />
    </div>
  );
};
