import React from 'react'
import { LayoutGrid, List } from 'lucide-react'

// ViewToggle Component: Toggle switch between Grid layout and List layout
function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="bg-surface-2 p-1 rounded-xl flex items-center gap-1 border border-line">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-surface text-accent-ink shadow-2xs font-bold'
            : 'text-muted hover:text-fg'
        }`}
        aria-label="Grid View"
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          viewMode === 'list'
            ? 'bg-surface text-accent-ink shadow-2xs font-bold'
            : 'text-muted hover:text-fg'
        }`}
        aria-label="List View"
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ViewToggle
