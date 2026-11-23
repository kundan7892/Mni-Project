import React from 'react'
import { RotateCcw, Filter, Star } from 'lucide-react'
import { 
  categoriesList, brandsList, cameraResolutions, 
  flightTimeRanges, availabilityStatuses 
} from '../data/drones'

// FilterSidebar Component: Dark AeroPulse theme filter panel
function FilterSidebar({ filters, setFilters, onResetFilters, totalResults }) {

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      style={{
        background: 'linear-gradient(160deg, #0d1117 0%, #07090e 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Decorative subtle top glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Filter Drones
            </h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Fleet Catalog
            </span>
          </div>
        </div>

        <button
          onClick={onResetFilters}
          className="text-[11px] text-[#00f0ff] hover:text-[#00f0ff]/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-white/[0.04]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Category
        </label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-white/[0.04] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all cursor-pointer"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0d1117] text-white">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Brand Filter */}
      <div className="space-y-2">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Brand
        </label>
        <div className="grid grid-cols-2 gap-2">
          {brandsList.map((brand) => (
            <button
              key={brand}
              onClick={() => handleFilterChange('brand', brand)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                filters.brand === brand
                  ? 'text-[#001a2e] font-bold shadow-lg'
                  : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
              }`}
              style={
                filters.brand === brand
                  ? {
                      background: 'linear-gradient(90deg, #00f0ff, #0066ff)',
                      borderColor: '#00f0ff',
                      boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                    }
                  : {}
              }
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Price Range Filter */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wider text-white/70">
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Max Price / Day</span>
          <span
            className="text-[#00f0ff] font-bold text-sm"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-[#00f0ff] cursor-pointer"
        />
        <div
          className="flex justify-between text-[10px] text-white/40"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span>₹1,000</span>
          <span>₹15,000+</span>
        </div>
      </div>

      {/* 4. Camera Resolution */}
      <div className="space-y-2 pt-3 border-t border-white/[0.08]">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Camera Specs
        </label>
        <select
          value={filters.camera}
          onChange={(e) => handleFilterChange('camera', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-white/[0.04] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all cursor-pointer"
        >
          {cameraResolutions.map((res) => (
            <option key={res} value={res} className="bg-[#0d1117] text-white">{res}</option>
          ))}
        </select>
      </div>

      {/* 5. Flight Time */}
      <div className="space-y-2 pt-3 border-t border-white/[0.08]">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Flight Duration
        </label>
        <select
          value={filters.flightTime}
          onChange={(e) => handleFilterChange('flightTime', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-white/[0.04] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all cursor-pointer"
        >
          {flightTimeRanges.map((range) => (
            <option key={range} value={range} className="bg-[#0d1117] text-white">{range}</option>
          ))}
        </select>
      </div>

      {/* 6. Availability Status */}
      <div className="space-y-2 pt-3 border-t border-white/[0.08]">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Availability
        </label>
        <select
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-white/[0.04] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all cursor-pointer"
        >
          {availabilityStatuses.map((status) => (
            <option key={status} value={status} className="bg-[#0d1117] text-white">{status}</option>
          ))}
        </select>
      </div>

      {/* 7. Minimum Rating */}
      <div className="space-y-2 pt-3 border-t border-white/[0.08]">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider text-white/70"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[0, 4.5, 4.8].map((ratingVal) => (
            <button
              key={ratingVal}
              onClick={() => handleFilterChange('minRating', ratingVal)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                filters.minRating === ratingVal
                  ? 'text-[#001a2e] font-bold shadow-md'
                  : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
              }`}
              style={
                filters.minRating === ratingVal
                  ? {
                      background: 'linear-gradient(90deg, #00f0ff, #0066ff)',
                      borderColor: '#00f0ff',
                    }
                  : {}
              }
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
      <div
        className="pt-3 border-t border-white/[0.08] text-center text-[11px] text-white/40 font-medium"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="text-[#00f0ff] font-semibold">{totalResults}</span> matching drones
      </div>

    </div>
  )
}

export default FilterSidebar
