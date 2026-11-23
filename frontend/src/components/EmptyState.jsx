import React from 'react'
import { Navigation, RotateCcw } from 'lucide-react'

// EmptyState Component: Clean fallback view shown when no drones match filters
function EmptyState({ onResetFilters }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-12 text-center space-y-5 shadow-2xs max-w-lg mx-auto">
      
      <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent-ink mx-auto flex items-center justify-center border border-accent/25">
        <Navigation className="w-8 h-8 transform rotate-45" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-fg">No Drones Found</h3>
        <p className="text-sm text-muted leading-relaxed">
          Try changing your search or filters to discover more drones in our rental fleet.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      </div>

    </div>
  )
}

export default EmptyState
