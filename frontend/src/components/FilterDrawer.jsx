import React from 'react'
import { X } from 'lucide-react'
import FilterSidebar from './FilterSidebar'

// FilterDrawer Component: Mobile slide-over drawer modal for filters (Dark AeroPulse theme)
function FilterDrawer({ isOpen, onClose, filters, setFilters, onResetFilters, totalResults }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      
      {/* Dark Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Slide-out Panel */}
      <div
        className="relative z-10 w-full max-w-xs sm:max-w-sm h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300"
        style={{ background: '#090c12', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        
        {/* Modal Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0d1117] sticky top-0 z-10">
          <h3 className="font-bold text-white text-base tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Filter Drones
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Render Filter Sidebar */}
        <div className="p-4 flex-1">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={onResetFilters}
            totalResults={totalResults}
          />
        </div>

        {/* Modal Footer: Apply Button */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0d1117] sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="w-full text-[#001a2e] font-bold py-3 rounded-xl transition-all shadow-lg hover:opacity-90 active:scale-98"
            style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)' }}
          >
            Apply Filters ({totalResults})
          </button>
        </div>

      </div>

    </div>
  )
}

export default FilterDrawer
