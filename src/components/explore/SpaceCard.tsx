import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ParkingSpace } from '../../types';
import { useParking } from '../../context/ParkingContext';
import { Star, Heart, MapPin, Zap, Shield, Warehouse, CheckCircle2 } from 'lucide-react';

interface SpaceCardProps {
  space: ParkingSpace;
  compact?: boolean;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({ space, compact = false }) => {
  const { isSpaceSaved, toggleSaveSpace } = useParking();
  const navigate = useNavigate();
  const isSaved = isSpaceSaved(space.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveSpace(space.id);
  };

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/book/${space.id}`);
  };

  return (
    <div
      onClick={() => navigate(`/space/${space.id}`)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-0.5"
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={space.images[0]}
          alt={space.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-soft-sm'
              : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Space Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 backdrop-blur-md text-navy-900 shadow-soft-xs border border-white/50">
            {space.type}
          </span>
          {space.amenities.includes('EV Charging Bay') && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white shadow-soft-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              EV
            </span>
          )}
        </div>

        {/* Availability indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-navy-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {space.totalSpots - space.occupiedSpots} spots open
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Neighborhood & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-brand-700 uppercase tracking-wider text-[11px]">
              {space.neighborhood}
            </span>
            <div className="flex items-center gap-1 text-navy-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{space.rating}</span>
              <span className="text-slate-400 font-normal">({space.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1 leading-snug">
            {space.title}
          </h3>

          {/* Address & Landmark */}
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{space.address} &bull; {space.nearbyLandmark}</span>
          </p>

          {/* Amenities Pills */}
          {!compact && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {space.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  {amenity}
                </span>
              ))}
              {space.amenities.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[11px]">
                  +{space.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer row: Pricing & Quick Reserve CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-navy-900">${space.hourlyRate}</span>
              <span className="text-xs font-medium text-slate-500">/ hour</span>
            </div>
            {space.dailyMaxRate && (
              <p className="text-[11px] text-slate-400 font-medium">
                ${space.dailyMaxRate} daily max
              </p>
            )}
          </div>

          <button
            onClick={handleBookNowClick}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 hover:border-brand-600 transition-all active:scale-95"
          >
            Reserve Spot
          </button>
        </div>
      </div>
    </div>
  );
};
