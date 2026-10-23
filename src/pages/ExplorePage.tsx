import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { FilterBar, FilterState } from '../components/explore/FilterBar';
import { SpaceCard } from '../components/explore/SpaceCard';
import { InteractiveMap } from '../components/explore/InteractiveMap';
import { VehicleSize } from '../types';
import { SearchX } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { spaces } = useParking();

  const initialQuery = searchParams.get('q') || '';
  const initialIn = searchParams.get('in') || '09:00';
  const initialOut = searchParams.get('out') || '17:00';
  const initialType = searchParams.get('type') || 'All Types';

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    parkingType: initialType,
    maxPrice: 250,
    selectedAmenities: [],
    vehicleSize: 'Any Size',
    sortBy: 'rating',
    arrivalDate: 'Today',
    arrivalTime: initialIn,
    departureTime: initialOut,
  });

  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  // Sync with searchParams if changed
  useEffect(() => {
    if (searchParams.get('q')) {
      setFilters((prev) => ({ ...prev, searchQuery: searchParams.get('q') || '' }));
    }
    if (searchParams.get('type')) {
      setFilters((prev) => ({ ...prev, parkingType: searchParams.get('type') || 'All Types' }));
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      parkingType: 'All Types',
      maxPrice: 250,
      selectedAmenities: [],
      vehicleSize: 'Any Size',
      sortBy: 'rating',
      arrivalDate: 'Today',
      arrivalTime: '09:00',
      departureTime: '17:00',
    });
  };

  // Filtered and sorted spaces
  const filteredSpaces = useMemo(() => {
    return spaces
      .filter((space) => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = space.title.toLowerCase().includes(q);
          const matchAddress = space.address.toLowerCase().includes(q);
          const matchNeighborhood = space.neighborhood.toLowerCase().includes(q);
          const matchLandmark = space.nearbyLandmark.toLowerCase().includes(q);
          if (!matchTitle && !matchAddress && !matchNeighborhood && !matchLandmark) {
            return false;
          }
        }

        // Parking type
        if (filters.parkingType !== 'All Types' && space.type !== filters.parkingType) {
          return false;
        }

        // Max price
        if (space.hourlyRate > filters.maxPrice) {
          return false;
        }

        // Vehicle size
        if (
          filters.vehicleSize !== 'Any Size' &&
          !space.vehicleCompatibility.includes(filters.vehicleSize as VehicleSize)
        ) {
          return false;
        }

        // Amenities
        if (filters.selectedAmenities.length > 0) {
          const hasAllAmenities = filters.selectedAmenities.every((amenity) =>
            space.amenities.includes(amenity)
          );
          if (!hasAllAmenities) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.hourlyRate - b.hourlyRate;
        if (filters.sortBy === 'price-desc') return b.hourlyRate - a.hourlyRate;
        if (filters.sortBy === 'availability') {
          return (b.totalSpots - b.occupiedSpots) - (a.totalSpots - a.occupiedSpots);
        }
        return b.rating - a.rating;
      });
  }, [spaces, filters]);

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      
      {/* Sticky Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        resultCount={filteredSpaces.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
            {filters.searchQuery
              ? `Parking spots near "${filters.searchQuery}"`
              : 'Available parking spots in San Francisco'}
          </h1>
          <span className="text-xs text-slate-500 font-medium">
            {filteredSpaces.length} spots available
          </span>
        </div>

        {/* Empty State */}
        {filteredSpaces.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-soft-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <SearchX className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-navy-900">No parking spaces matched</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any parking stalls matching your selected filters and rate limits. Try expanding your search radius or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          /* View Mode Displays */
          <div>
            {/* Split View: List on left, Map on right */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Space Cards Grid (7 cols on desktop) */}
                <div className="lg:col-span-7 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredSpaces.map((space) => (
                    <div
                      key={space.id}
                      onMouseEnter={() => setSelectedSpaceId(space.id)}
                      onMouseLeave={() => setSelectedSpaceId(null)}
                    >
                      <SpaceCard space={space} compact={false} />
                    </div>
                  ))}
                </div>

                {/* Sticky Interactive Map (5 cols on desktop) */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-36">
                  <InteractiveMap
                    spaces={filteredSpaces}
                    selectedSpaceId={selectedSpaceId}
                    onSelectSpace={(space) => setSelectedSpaceId(space.id)}
                  />
                </div>

              </div>
            )}

            {/* List View Only */}
            {viewMode === 'list' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            )}

            {/* Map View Only */}
            {viewMode === 'map' && (
              <div className="w-full">
                <InteractiveMap
                  spaces={filteredSpaces}
                  selectedSpaceId={selectedSpaceId}
                  onSelectSpace={(space) => setSelectedSpaceId(space.id)}
                />
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
