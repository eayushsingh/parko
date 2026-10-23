import React, { useState } from 'react';
import { ParkingSpace } from '../../types';
import { Star, Navigation, Eye, ZoomIn, ZoomOut, RotateCcw, X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveMapProps {
  spaces: ParkingSpace[];
  selectedSpaceId?: string | null;
  onSelectSpace?: (space: ParkingSpace) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}) => {
  const navigate = useNavigate();
  const [hoveredSpace, setHoveredSpace] = useState<ParkingSpace | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeSpace = spaces.find((s) => s.id === selectedSpaceId) || hoveredSpace;

  return (
    <div className="relative w-full h-[520px] lg:h-[680px] bg-navy-950 rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft-md select-none">
      
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-soft-sm border border-slate-200 flex items-center gap-2 text-xs font-semibold text-navy-900">
          <Navigation className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />
          <span>San Francisco Metro Area</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl bg-navy-900/90 text-[11px] text-slate-300 border border-navy-700/80 backdrop-blur-md">
          {spaces.length} active parking zones
        </span>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
          aria-label="Zoom in"
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-navy-900 shadow-soft-sm hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
          aria-label="Zoom out"
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-navy-900 shadow-soft-sm hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          aria-label="Reset zoom"
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-navy-900 shadow-soft-sm hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Stylized SVG Map Graphics Canvas */}
      <div
        className="w-full h-full transition-transform duration-300 ease-out origin-center relative"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background landmass */}
          <rect width="1000" height="700" fill="#0f172a" />
          
          {/* Bay Waterfront Water body */}
          <path
            d="M 680 0 Q 720 150 780 280 T 890 520 T 1000 620 L 1000 0 Z"
            fill="#091E3A"
            opacity="0.8"
          />

          {/* Grid lines (streets) */}
          <g stroke="#1e293b" strokeWidth="1.5" strokeOpacity="0.7">
            {/* Horizontal transit avenues */}
            <line x1="50" y1="120" x2="850" y2="120" />
            <line x1="50" y1="220" x2="880" y2="220" />
            <line x1="50" y1="320" x2="920" y2="320" stroke="#334155" strokeWidth="2.5" />
            <line x1="50" y1="420" x2="940" y2="420" />
            <line x1="50" y1="520" x2="960" y2="520" />
            <line x1="50" y1="620" x2="980" y2="620" stroke="#334155" strokeWidth="2.5" />

            {/* Vertical cross streets */}
            <line x1="150" y1="50" x2="150" y2="650" />
            <line x1="280" y1="50" x2="280" y2="650" />
            <line x1="420" y1="50" x2="420" y2="650" />
            <line x1="560" y1="50" x2="560" y2="650" stroke="#334155" strokeWidth="2.5" />
            <line x1="700" y1="50" x2="700" y2="650" />
            <line x1="840" y1="50" x2="840" y2="650" />

            {/* Diagonal Market Street Spine */}
            <line x1="100" y1="580" x2="820" y2="140" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
          </g>

          {/* District Zones Labels */}
          <text x="610" y="220" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">FINANCIAL DISTRICT</text>
          <text x="500" y="380" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">UNION SQUARE</text>
          <text x="640" y="520" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">SOMA TECH CORRIDOR</text>
          <text x="240" y="540" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">MISSION DISTRICT</text>
          <text x="760" y="160" fill="#38bdf8" fontSize="13" fontWeight="700" letterSpacing="1.5">THE EMBARCADERO</text>
          <text x="440" y="120" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">NORTH BEACH</text>
          <text x="760" y="620" fill="#64748b" fontSize="13" fontWeight="700" letterSpacing="1.5">MISSION BAY</text>
        </svg>

        {/* Space Pins */}
        {spaces.map((space) => {
          const isSelected = selectedSpaceId === space.id;
          const isHovered = hoveredSpace?.id === space.id;

          return (
            <div
              key={space.id}
              style={{
                left: `${space.coordinates.xPercent}%`,
                top: `${space.coordinates.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-200"
              onMouseEnter={() => setHoveredSpace(space)}
              onMouseLeave={() => setHoveredSpace(null)}
              onClick={() => {
                if (onSelectSpace) onSelectSpace(space);
              }}
            >
              {/* Pulse ripple if selected or hovered */}
              {(isSelected || isHovered) && (
                <span className="absolute -inset-2 rounded-full bg-brand-500/30 animate-ping pointer-events-none" />
              )}

              {/* Price Tag Pin */}
              <button
                type="button"
                aria-label={`Parking space at ${space.title}, ₹${space.hourlyRate} per hour`}
                className={`relative px-3 py-1.5 rounded-full font-bold text-xs shadow-soft-lg flex items-center gap-1 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                  isSelected || isHovered
                    ? 'bg-brand-500 text-navy-950 scale-110 ring-4 ring-brand-400/30'
                    : 'bg-white text-navy-900 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <span>₹{space.hourlyRate}</span>
                <span className="text-[10px] font-normal opacity-80">/hr</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Space Detail Preview on Hover/Select */}
      {activeSpace && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl shadow-soft-xl border border-slate-200 p-3 z-30 animate-in fade-in slide-in-from-bottom-2">
          {/* Close button for touch / dismiss */}
          <button
            onClick={() => setHoveredSpace(null)}
            aria-label="Dismiss spot preview"
            className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-3">
            <img
              src={activeSpace.images[0]}
              alt={activeSpace.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700 uppercase tracking-wider text-[10px]">
                  {activeSpace.neighborhood}
                </span>
                <span className="flex items-center gap-0.5 font-bold text-navy-900 text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {activeSpace.rating}
                </span>
              </div>
              <h4 className="font-bold text-xs text-navy-900 truncate mt-0.5">
                {activeSpace.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {activeSpace.address}
              </p>
              <div className="mt-2 flex items-center justify-between gap-1.5">
                <span className="text-sm font-extrabold text-navy-900">
                  ₹{activeSpace.hourlyRate}/hr
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/space/${activeSpace.id}`)}
                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => navigate(`/book/${activeSpace.id}`)}
                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-1 shadow-soft-xs"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 z-10 hidden md:block">
        <span className="text-[11px] text-slate-400 bg-navy-900/80 px-2.5 py-1 rounded-md border border-navy-800">
          Tip: Click any price pin to inspect availability or open spot details
        </span>
      </div>

    </div>
  );
};
