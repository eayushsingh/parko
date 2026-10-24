import React, { useEffect, useRef, useState } from 'react';
import { ParkingSpace } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  spaces: ParkingSpace[];
  selectedSpaceId?: string | null;
  onSelectSpace?: (space: ParkingSpace) => void;
}

// Major Indian Metro City Coordinates
const INDIAN_CITIES = [
  { name: 'All India', lat: 21.7679, lng: 78.8718, zoom: 5 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.6046, zoom: 12 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: 'Delhi NCR', lat: 28.5800, lng: 77.1800, zoom: 11 },
  { name: 'Hyderabad', lat: 17.4300, lng: 78.3900, zoom: 12 },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeCity, setActiveCity] = useState<string>('All India');
  const [activePreviewSpace, setActivePreviewSpace] = useState<ParkingSpace | null>(null);

  // Sync active preview space with selectedSpaceId prop
  useEffect(() => {
    if (selectedSpaceId) {
      const found = spaces.find((s) => s.id === selectedSpaceId);
      if (found) {
        setActivePreviewSpace(found);
      }
    }
  }, [selectedSpaceId, spaces]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.7679, 78.8718], // Center of India
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [
          [5.0, 65.0], // Southwest bounds of Indian subcontinent
          [38.5, 98.5], // Northeast bounds of Indian subcontinent
        ],
        minZoom: 4,
        maxZoom: 18,
      });

      // High-res, modern CartoDB Voyager tiles for Indian streets & landmarks
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const currentMap = mapInstanceRef.current;

    return () => {
      // In dev hot-reload, map cleanup
      if (currentMap) {
        currentMap.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render and Update Custom Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (spaces.length === 0) return;

    const bounds = L.latLngBounds([]);

    spaces.forEach((space) => {
      const isSelected = space.id === (activePreviewSpace?.id || selectedSpaceId);
      const isEv = space.type === 'EV Charging Bay' || space.amenities.includes('EV Charging Bay');

      // Create Custom Emerald Pill HTML marker
      const customIcon = L.divIcon({
        className: 'parko-custom-pin',
        html: `
          <div style="cursor: pointer; transform: translate(-50%, -100%);" class="group transition-transform duration-200">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs tracking-tight shadow-lg transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40 scale-110 shadow-emerald-900/30'
                : 'bg-slate-900/95 text-emerald-400 hover:bg-slate-900 hover:text-white border border-slate-700/80 hover:border-emerald-500 hover:scale-105'
            }">
              ${isEv ? '<span class="text-amber-400 font-black text-[11px]">⚡</span>' : ''}
              <span class="font-extrabold">₹${space.hourlyRate}</span>
              <span class="text-[10px] font-normal opacity-80">/hr</span>
            </div>
            <div class="w-2 h-2 mx-auto rotate-45 -mt-1 ${
              isSelected ? 'bg-emerald-600' : 'bg-slate-900 border-r border-b border-slate-700/80'
            }"></div>
          </div>
        `,
        iconSize: [80, 36],
        iconAnchor: [40, 36],
      });

      const marker = L.marker([space.coordinates.lat, space.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      }).addTo(map);

      marker.on('click', () => {
        setActivePreviewSpace(space);
        if (onSelectSpace) onSelectSpace(space);
        map.flyTo([space.coordinates.lat, space.coordinates.lng], Math.max(map.getZoom(), 13), {
          duration: 0.8,
        });
      });

      markersRef.current[space.id] = marker;
      bounds.extend([space.coordinates.lat, space.coordinates.lng]);
    });

    // Automatically fit map to matching spaces if searching/filtering
    if (spaces.length > 0) {
      if (spaces.length === 1) {
        map.flyTo([spaces[0].coordinates.lat, spaces[0].coordinates.lng], 14, { duration: 1.0 });
      } else {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
        });
      }
    }
  }, [spaces, selectedSpaceId, activePreviewSpace?.id, onSelectSpace]);

  // Handle City Quick-Jump
  const handleCityJump = (city: typeof INDIAN_CITIES[0]) => {
    setActiveCity(city.name);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (city.name === 'All India') {
      if (spaces.length > 0) {
        const bounds = L.latLngBounds(spaces.map((s) => [s.coordinates.lat, s.coordinates.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      } else {
        map.flyTo([city.lat, city.lng], city.zoom, { duration: 1.2 });
      }
    } else {
      map.flyTo([city.lat, city.lng], city.zoom, { duration: 1.2 });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    handleCityJump(INDIAN_CITIES[0]);
  };

  return (
    <div className="relative w-full h-[540px] lg:h-[700px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-200/90 shadow-soft-xl select-none">
      
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Indian Live Coverage Badge & City Filter Chips */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 max-w-[calc(100%-120px)]">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-soft-sm text-xs text-white font-medium w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-bold">Live India Map</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{spaces.length} verified parking spots</span>
        </div>

        {/* Indian Metro City Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {INDIAN_CITIES.map((city) => {
            const isSelected = activeCity === city.name;
            return (
              <button
                key={city.name}
                onClick={() => handleCityJump(city)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm backdrop-blur-md ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                    : 'bg-white/95 text-slate-800 hover:bg-white hover:text-emerald-700 border border-slate-200/80'
                }`}
              >
                {city.name === 'All India' ? '🇮🇳 All India' : city.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Right: Custom Zoom & Recenter Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom In"
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-soft-md hover:bg-slate-50 transition-all border border-slate-200 active:scale-95"
        >
          <ZoomIn className="w-4 h-4 text-slate-700" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom Out"
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-soft-md hover:bg-slate-50 transition-all border border-slate-200 active:scale-95"
        >
          <ZoomOut className="w-4 h-4 text-slate-700" />
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset view to all India"
          title="Reset to All India"
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-soft-md hover:bg-slate-50 transition-all border border-slate-200 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Bottom Floating Interactive Space Preview Card */}
      {activePreviewSpace && (
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:max-w-md z-[400] animate-fade-in-up">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-2xl flex items-center gap-3.5 relative">
            
            {/* Close card button */}
            <button
              onClick={() => setActivePreviewSpace(null)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-slate-800 shadow-md"
              title="Close preview"
            >
              ✕
            </button>

            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
              <img
                src={activePreviewSpace.images[0]}
                alt={activePreviewSpace.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[10px] text-white font-bold">
                ₹{activePreviewSpace.hourlyRate}/h
              </span>
            </div>

            {/* Content & Action */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{activePreviewSpace.neighborhood}, {activePreviewSpace.city}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 truncate" title={activePreviewSpace.title}>
                {activePreviewSpace.title}
              </h4>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-900">{activePreviewSpace.rating}</span>
                  <span className="text-slate-400">({activePreviewSpace.reviewCount})</span>
                </div>

                <button
                  onClick={() => navigate(`/spaces/${activePreviewSpace.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <span>Book Spot</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Zero Match Helper in Map View */}
      {spaces.length === 0 && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center pointer-events-none p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700 text-center max-w-sm pointer-events-auto space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white">No parking spots in this search query</p>
            <p className="text-[11px] text-slate-400">Try searching for &quot;Bengaluru&quot;, &quot;Mumbai&quot;, &quot;Delhi&quot;, or &quot;Indiranagar&quot;.</p>
            <button
              onClick={() => handleCityJump(INDIAN_CITIES[0])}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Reset to All India
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
