import React, { useState } from 'react';
import { ParkingType, VehicleSize } from '../../types';
import {
  Search,
  Calendar,
  Clock,
  SlidersHorizontal,
  X,
  MapPin,
  Check,
  ChevronDown,
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  parkingType: string;
  maxPrice: number;
  selectedAmenities: string[];
  vehicleSize: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'availability';
  arrivalDate: string;
  arrivalTime: string;
  departureTime: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  resultCount: number;
  viewMode: 'list' | 'map' | 'split';
  onViewModeChange: (mode: 'list' | 'map' | 'split') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  resultCount,
  viewMode,
  onViewModeChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const parkingTypes = [
    'All Types',
    'Garage',
    'Driveway',
    'Covered Lot',
    'EV Charging Bay',
    'Dedicated Commercial',
  ];

  const availableAmenities = [
    'CCTV 24/7',
    'Covered Parking',
    'EV Charging Bay',
    'Security Guard',
    '24/7 Access',
    'Well Lit',
  ];

  const vehicleSizes = ['Any Size', 'Compact', 'Sedan', 'SUV', 'Van / Truck'];

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.selectedAmenities;
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onFilterChange({ ...filters, selectedAmenities: next });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.parkingType !== 'All Types' ||
    filters.maxPrice < 15 ||
    filters.selectedAmenities.length > 0 ||
    filters.vehicleSize !== 'Any Size';

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-soft-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* Main Search & Quick Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search input + date & time quick pills */}
          <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search neighborhood, street, or landmark (e.g., SoMa, Montgomery)..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 text-navy-900"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Time Pickers */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-slate-100/70 p-1 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-navy-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filters.arrivalTime}
                  onChange={(e) => onFilterChange({ ...filters, arrivalTime: e.target.value })}
                  className="bg-transparent font-medium text-navy-900 outline-none cursor-pointer"
                >
                  <option value="08:00">In: 8:00 AM</option>
                  <option value="09:00">In: 9:00 AM</option>
                  <option value="11:00">In: 11:00 AM</option>
                  <option value="14:00">In: 2:00 PM</option>
                  <option value="18:00">In: 6:00 PM</option>
                </select>
              </div>
              <span className="text-slate-300">&bull;</span>
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-navy-700">
                <select
                  value={filters.departureTime}
                  onChange={(e) => onFilterChange({ ...filters, departureTime: e.target.value })}
                  className="bg-transparent font-medium text-navy-900 outline-none cursor-pointer"
                >
                  <option value="11:00">Out: 11:00 AM</option>
                  <option value="13:00">Out: 1:00 PM</option>
                  <option value="17:00">Out: 5:00 PM</option>
                  <option value="19:00">Out: 7:00 PM</option>
                  <option value="22:00">Out: 10:00 PM</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Controls: Filter Toggle, Sort Dropdown, View Switcher */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5">
            
            {/* Filter Drawer Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                showAdvanced || hasActiveFilters
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : 'bg-white border-slate-200 text-navy-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                aria-label="Sort parking listings"
                className="appearance-none bg-white text-xs font-semibold text-navy-800 border border-slate-200 rounded-xl px-3 py-2 pr-7 outline-none hover:border-slate-300 cursor-pointer focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="availability">Most Spots Open</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Toggle (List / Map) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-navy-900 shadow-soft-xs'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-navy-900 shadow-soft-xs'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                Map
              </button>
            </div>

          </div>

        </div>

        {/* Quick Parking Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {parkingTypes.map((type) => {
            const isSelected = filters.parkingType === type;
            return (
              <button
                key={type}
                onClick={() => onFilterChange({ ...filters, parkingType: type })}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-navy-900'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showAdvanced && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2">
            
            {/* Price Max Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-navy-900 mb-1.5">
                <span>Maximum Hourly Rate</span>
                <span className="text-brand-600 font-bold">${filters.maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min="4"
                max="15"
                step="1"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>$4/hr</span>
                <span>$15+/hr</span>
              </div>
            </div>

            {/* Vehicle Size Filter */}
            <div>
              <span className="block text-xs font-semibold text-navy-900 mb-1.5">
                Vehicle Size Compatibility
              </span>
              <div className="flex flex-wrap gap-1">
                {vehicleSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onFilterChange({ ...filters, vehicleSize: size })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filters.vehicleSize === size
                        ? 'bg-brand-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenity Badges Multi-select */}
            <div>
              <span className="block text-xs font-semibold text-navy-900 mb-1.5">
                Included Amenities & Security
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableAmenities.map((amenity) => {
                  const active = filters.selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                        active
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-emerald-600" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset / Results Count Row */}
            <div className="md:col-span-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong className="text-navy-900">{resultCount}</strong> available parking spaces matching your criteria
              </span>
              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset all filters
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
