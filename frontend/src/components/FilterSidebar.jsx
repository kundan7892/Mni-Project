import React from 'react'
import { RotateCcw, Filter, Star } from 'lucide-react'
import { 
  categoriesList, brandsList, cameraResolutions, 
  flightTimeRanges, availabilityStatuses 
} from '../data/drones'

// FilterSidebar Component: Comprehensive desktop & mobile filter settings panel
function FilterSidebar({ filters, setFilters, onResetFilters, totalResults }) {

  // Helper to handle filter state updates
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-6 space-y-6 shadow-2xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent-ink" />
          <h3 className="font-bold text-fg text-base">Filter Drones</h3>
        </div>

        <button
          onClick={onResetFilters}
          className="text-xs text-accent-ink hover:text-accent-ink font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-line text-xs text-fg bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 2. Brand Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Brand
        </label>
        <div className="grid grid-cols-2 gap-2">
          {brandsList.map((brand) => (
            <button
              key={brand}
              onClick={() => handleFilterChange('brand', brand)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                filters.brand === brand
                  ? 'bg-accent text-white border-accent shadow-2xs'
                  : 'bg-surface-2 text-fg-muted border-line hover:bg-surface-2'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Price Range Filter (in ₹) */}
      <div className="space-y-3 pt-2 border-t border-line">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-fg-muted">
          <span>Max Price / Day</span>
          <span className="text-accent-ink font-semibold text-sm">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-subtle">
          <span>₹1,000</span>
          <span>₹15,000+</span>
        </div>
      </div>

      {/* 4. Camera Resolution */}
      <div className="space-y-2 pt-2 border-t border-line">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Camera Specs
        </label>
        <select
          value={filters.camera}
          onChange={(e) => handleFilterChange('camera', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-line text-xs text-fg bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {cameraResolutions.map((res) => (
            <option key={res} value={res}>{res}</option>
          ))}
        </select>
      </div>

      {/* 5. Flight Time */}
      <div className="space-y-2 pt-2 border-t border-line">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Flight Time Duration
        </label>
        <select
          value={filters.flightTime}
          onChange={(e) => handleFilterChange('flightTime', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-line text-xs text-fg bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {flightTimeRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      {/* 6. Availability Status */}
      <div className="space-y-2 pt-2 border-t border-line">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Availability Status
        </label>
        <select
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-line text-xs text-fg bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {availabilityStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* 7. Minimum Rating */}
      <div className="space-y-2 pt-2 border-t border-line">
        <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[0, 4.5, 4.8].map((ratingVal) => (
            <button
              key={ratingVal}
              onClick={() => handleFilterChange('minRating', ratingVal)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border cursor-pointer ${
                filters.minRating === ratingVal
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface-2 text-fg-muted border-line hover:bg-surface-2'
              }`}
            >
              {ratingVal === 0 ? (
                'All'
              ) : (
                <>
                  <span>{ratingVal}+</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Total Filter Matches Count Banner */}
      <div className="pt-3 border-t border-line text-center text-xs text-muted font-medium">
        {totalResults} matching drone{totalResults === 1 ? '' : 's'} available
      </div>

    </div>
  )
}

export default FilterSidebar
