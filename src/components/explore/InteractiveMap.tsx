import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParkingSpace } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Star,
  ArrowRight,
  Search,
  X,
  Loader2,
  LocateFixed,
  Radio,
  AlertTriangle,
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

interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
}

/**
 * Escapes unsafe characters for safe HTML injection into Leaflet popups
 */
const escapeHtml = (unsafe: string): string => {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Markers Refs for independent coexistence
  const parkingMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const searchedMarkerRef = useRef<L.Marker | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const gpsCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const hasCenteredGpsRef = useRef<boolean>(false);

  // UI State
  const [activeCity, setActiveCity] = useState<string>('All India');
  const [activePreviewSpace, setActivePreviewSpace] = useState<ParkingSpace | null>(null);

  // Nominatim Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<NominatimPlace[]>([]);
  const [showResultsDropdown, setShowResultsDropdown] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<NominatimPlace | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Live GPS Tracking State
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Sync active preview space with selectedSpaceId prop
  useEffect(() => {
    if (selectedSpaceId) {
      const found = spaces.find((s) => s.id === selectedSpaceId);
      if (found) {
        setActivePreviewSpace(found);
      }
    }
  }, [selectedSpaceId, spaces]);

  // 1. Initialize Leaflet Map with OpenStreetMap Tiles (No Google Maps / Zero API Key)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.7679, 78.8718], // Center of India
        zoom: 5,
        zoomControl: false,
        attributionControl: true,
        maxBounds: [
          [5.0, 65.0], // Southwest bounds of Indian subcontinent
          [38.5, 98.5], // Northeast bounds of Indian subcontinent
        ],
        minZoom: 3,
        maxZoom: 19,
      });

      // Standard OpenStreetMap Tiles with required OSM attribution
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const currentMap = mapInstanceRef.current;

    return () => {
      // Cleanup geolocation watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (currentMap) {
        currentMap.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render & Update Parking Space Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing parking space markers only
    Object.values(parkingMarkersRef.current).forEach((marker) => marker.remove());
    parkingMarkersRef.current = {};

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

      parkingMarkersRef.current[space.id] = marker;
      bounds.extend([space.coordinates.lat, space.coordinates.lng]);
    });

    // Auto-fit bounds if spaces filtered and no active place search or GPS lock
    if (spaces.length > 0 && !selectedPlace && !hasCenteredGpsRef.current) {
      if (spaces.length === 1) {
        map.flyTo([spaces[0].coordinates.lat, spaces[0].coordinates.lng], 14, { duration: 1.0 });
      } else {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
        });
      }
    }
  }, [spaces, selectedSpaceId, activePreviewSpace?.id, onSelectSpace, selectedPlace]);

  // 3. Remote Place Search via OpenStreetMap Nominatim
  const handleRemoteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q || q.length < 2) return;

    setIsSearching(true);
    setSearchError(null);
    setShowResultsDropdown(false);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'ParkoApp/1.0 (https://parko.app; contact@parko.app)',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: NominatimPlace[] = await res.json();

      if (!data || data.length === 0) {
        setSearchError(`No locations found matching "${q}". Try searching for a city, landmark, or PIN code.`);
        setSearchResults([]);
        return;
      }

      setSearchResults(data);

      if (data.length === 1) {
        handleSelectRemotePlace(data[0]);
      } else {
        setShowResultsDropdown(true);
      }
    } catch (err) {
      console.warn('[Nominatim] Search failed:', err);
      setSearchError('Unable to connect to OpenStreetMap Nominatim. Please check your internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Select Remote Place from Search Results & Display Separate Marker
  const handleSelectRemotePlace = (place: NominatimPlace) => {
    setSelectedPlace(place);
    setShowResultsDropdown(false);
    setSearchError(null);

    const map = mapInstanceRef.current;
    if (!map) return;

    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    if (isNaN(lat) || isNaN(lng)) return;

    // Remove previous searched marker if exists
    if (searchedMarkerRef.current) {
      searchedMarkerRef.current.remove();
      searchedMarkerRef.current = null;
    }

    const safeTitle = escapeHtml(place.name || place.display_name.split(',')[0]);
    const safeFullName = escapeHtml(place.display_name);

    // Create Distinct Violet Searched Location Marker
    const searchedIcon = L.divIcon({
      className: 'parko-searched-marker',
      html: `
        <div style="cursor: pointer; transform: translate(-50%, -100%);" class="group">
          <div style="display: flex; items-center; gap: 6px; padding: 6px 12px; border-radius: 9999px; font-weight: 700; font-size: 11px; background: #7c3aed; color: #ffffff; border: 2px solid #ffffff; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.5);">
            <svg style="width: 13px; height: 13px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${safeTitle}</span>
          </div>
          <div style="width: 10px; height: 10px; margin: -5px auto 0 auto; transform: rotate(45deg); background: #7c3aed; border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;"></div>
        </div>
      `,
      iconSize: [160, 42],
      iconAnchor: [80, 42],
    });

    const marker = L.marker([lat, lng], {
      icon: searchedIcon,
      zIndexOffset: 1500,
    }).addTo(map);

    const popupHtml = `
      <div style="padding: 10px; font-family: inherit; font-size: 12px; max-width: 250px;">
        <div style="color: #7c3aed; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
          <span>📍 Searched Place</span>
        </div>
        <div style="font-weight: 700; color: #0f172a; font-size: 12px; line-height: 1.35;">
          ${safeFullName}
        </div>
        <div style="color: #64748b; font-size: 10px; margin-top: 5px;">
          Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml).openPopup();
    searchedMarkerRef.current = marker;

    // Fly to searched location
    map.flyTo([lat, lng], 15, { duration: 1.2 });
  };

  // Clear Searched Place Marker
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResultsDropdown(false);
    setSelectedPlace(null);
    setSearchError(null);
    if (searchedMarkerRef.current) {
      searchedMarkerRef.current.remove();
      searchedMarkerRef.current = null;
    }
  };

  // 5. Update Live GPS Marker & Accuracy Circle on Map
  const updateGpsOnMap = useCallback((lat: number, lng: number, accuracy: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const roundedAccuracy = Math.round(accuracy);

    // Update or create Live GPS Marker (Distinct Blue Radar Dot)
    if (gpsMarkerRef.current) {
      gpsMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const gpsIcon = L.divIcon({
        className: 'parko-gps-marker',
        html: `
          <div style="position: relative; width: 22px; height: 22px; transform: translate(-50%, -50%);">
            <div class="gps-pulse-outer"></div>
            <div style="position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background-color: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(37,99,235,0.45);"></div>
            <div style="position: absolute; top: 7px; left: 7px; width: 8px; height: 8px; border-radius: 50%; background-color: #ffffff;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([lat, lng], {
        icon: gpsIcon,
        zIndexOffset: 2000,
      }).addTo(map);

      gpsMarkerRef.current = marker;
    }

    // Safe escaped popup
    const popupHtml = `
      <div style="padding: 10px; font-family: inherit; font-size: 12px; min-width: 175px;">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: #1d4ed8; margin-bottom: 4px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></span>
          Your Live GPS Location
        </div>
        <div style="color: #334155; font-size: 11px;">
          Accuracy: <strong>±${roundedAccuracy} meters</strong>
        </div>
        <div style="color: #64748b; font-size: 10px; margin-top: 2px;">
          ${lat.toFixed(5)}, ${lng.toFixed(5)}
        </div>
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; color: #059669; font-size: 10px; font-weight: 600;">
          ● Continuously Updating Live
        </div>
      </div>
    `;
    gpsMarkerRef.current.bindPopup(popupHtml);

    // Update or create Approximate Accuracy Circle
    if (gpsCircleRef.current) {
      gpsCircleRef.current.setLatLng([lat, lng]);
      gpsCircleRef.current.setRadius(accuracy);
    } else {
      gpsCircleRef.current = L.circle([lat, lng], {
        radius: accuracy,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
    }
  }, []);

  // 6. Start Live GPS Tracking using watchPosition
  const startLiveGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsError(null);
    setIsLocating(true);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setIsLocating(false);
        setIsTracking(true);
        const { latitude, longitude, accuracy } = position.coords;
        setGpsLocation({ lat: latitude, lng: longitude, accuracy });
        setGpsError(null);

        // Update GPS Marker & Accuracy Circle
        updateGpsOnMap(latitude, longitude, accuracy);

        // Auto-center on first GPS fix
        if (!hasCenteredGpsRef.current && mapInstanceRef.current) {
          hasCenteredGpsRef.current = true;
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        setIsTracking(false);
        let message = 'Unable to determine your location.';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location access denied. Please allow location permissions in your browser address bar.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Location unavailable. GPS signal could not be acquired.';
        } else if (err.code === err.TIMEOUT) {
          message = 'Location request timed out. Please check your network and GPS connection.';
        }
        setGpsError(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    watchIdRef.current = id;
  };

  // Stop Live GPS Tracking
  const stopLiveGps = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsLocating(false);
  };

  // Center on User's Current Location ("My Location" button)
  const handleMyLocationClick = () => {
    if (gpsLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([gpsLocation.lat, gpsLocation.lng], 16, { duration: 1.0 });
    } else {
      hasCenteredGpsRef.current = false;
      startLiveGps();
    }
  };

  // City Quick-Jump
  const handleCityJump = (city: (typeof INDIAN_CITIES)[0]) => {
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
    <div className="relative w-full h-[580px] lg:h-[720px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-200/90 shadow-soft-xl select-none">
      {/* Real OpenStreetMap Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-4 z-[400] flex flex-col gap-2 pointer-events-none">
        {/* Top Header Row: Nominatim Search Bar & Indian City Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Nominatim Remote Place Search Bar (Zero Keystroke Spam - Triggered on Submit) */}
          <div className="relative pointer-events-auto max-w-md w-full">
            <form
              onSubmit={handleRemoteSearch}
              className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-soft-lg border border-slate-200/90 transition-all focus-within:ring-2 focus-within:ring-purple-400"
            >
              <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search place, city, or landmark (e.g. Connaught Place)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 bg-transparent outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 mr-1"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Searching...</span>
                  </>
                ) : (
                  <span>Search</span>
                )}
              </button>
            </form>

            {/* Nominatim Search Results Dropdown */}
            {searchResults.length > 1 && showResultsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-[500] max-h-56 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                  <span>Select matching place</span>
                  <button
                    onClick={() => setShowResultsDropdown(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.place_id}
                    onClick={() => handleSelectRemotePlace(res)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 text-slate-800 hover:text-purple-900 transition-colors flex items-start gap-2.5 text-xs font-medium"
                  >
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {res.name || res.display_name.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{res.display_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live GPS Tracking Control & Status Badge */}
          <div className="flex items-center gap-2 pointer-events-auto self-end sm:self-auto">
            {isTracking ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-md text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="font-bold text-blue-400">GPS Active</span>
                {gpsLocation && (
                  <span className="text-[11px] text-slate-300 font-medium">
                    (±{Math.round(gpsLocation.accuracy)}m)
                  </span>
                )}
                <button
                  onClick={stopLiveGps}
                  className="ml-1.5 px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-[10px] font-bold text-white transition-colors"
                >
                  Stop
                </button>
              </div>
            ) : (
              <button
                onClick={startLiveGps}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white shadow-md transition-all active:scale-95"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                ) : (
                  <Radio className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{isLocating ? 'Acquiring GPS...' : 'Start Live GPS'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Messages & City Chips Row */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Active Searched Place Pill */}
          {selectedPlace && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold shadow-md animate-fade-in-up">
              <span>📍 {selectedPlace.name || selectedPlace.display_name.split(',')[0]}</span>
              <button
                onClick={handleClearSearch}
                className="hover:text-purple-200 ml-1 text-sm leading-none"
                title="Remove marker"
              >
                ✕
              </button>
            </div>
          )}

          {/* Metro City Quick-Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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

        {/* Error Notification Banners */}
        {gpsError && (
          <div className="pointer-events-auto max-w-md inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-rose-900/90 backdrop-blur-md border border-rose-700 text-rose-100 text-xs shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>{gpsError}</span>
            </div>
            <button
              onClick={() => setGpsError(null)}
              className="text-rose-300 hover:text-white shrink-0 ml-1 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {searchError && (
          <div className="pointer-events-auto max-w-md inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-900/90 backdrop-blur-md border border-amber-700 text-amber-100 text-xs shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{searchError}</span>
            </div>
            <button
              onClick={() => setSearchError(null)}
              className="text-amber-300 hover:text-white shrink-0 ml-1 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Controls on Right Side (Zoom, Recenter, My Location) */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-2">
        {/* "My Location" Button */}
        <button
          onClick={handleMyLocationClick}
          aria-label="My Location"
          title={isTracking ? 'Center on My GPS Location' : 'Locate My Position'}
          className={`p-2.5 rounded-2xl shadow-soft-md transition-all border active:scale-95 ${
            isTracking
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/30'
              : 'bg-white/95 backdrop-blur-md text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <LocateFixed className={`w-4 h-4 ${isTracking ? 'text-white' : 'text-blue-600'}`} />
        </button>

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
                <span className="truncate">
                  {activePreviewSpace.neighborhood}, {activePreviewSpace.city}
                </span>
              </div>

              <h4
                className="text-xs font-bold text-slate-900 truncate"
                title={activePreviewSpace.title}
              >
                {activePreviewSpace.title}
              </h4>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-900">{activePreviewSpace.rating}</span>
                  <span className="text-slate-400">({activePreviewSpace.reviewCount})</span>
                </div>

                <button
                  onClick={() => navigate(`/space/${activePreviewSpace.id}`)}
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
      {spaces.length === 0 && !selectedPlace && !isTracking && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center pointer-events-none p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700 text-center max-w-sm pointer-events-auto space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white">No parking spots in this filter query</p>
            <p className="text-[11px] text-slate-400">
              Try searching for &quot;Bengaluru&quot;, &quot;Mumbai&quot;, &quot;Delhi&quot;, or using the search bar above.
            </p>
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
