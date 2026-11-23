import React from 'react'
import { X } from 'lucide-react'
import FilterSidebar from './FilterSidebar'

// FilterDrawer Component: Mobile slide-over drawer modal for filters
function FilterDrawer({ isOpen, onClose, filters, setFilters, onResetFilters, totalResults }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      
      {/* Dark Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Slide-out Panel */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-surface h-full shadow-lg flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-line flex items-center justify-between bg-surface-2 sticky top-0 z-10">
          <h3 className="font-bold text-fg text-base">Filter Drones</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-fg hover:bg-surface-3 transition-colors"
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
        <div className="p-4 border-t border-line bg-surface sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl shadow-md transition-colors"
          >
            Apply Filters ({totalResults})
          </button>
        </div>

      </div>

    </div>
  )
}

export default FilterDrawer
