import React from 'react'
import { LayoutGrid, List } from 'lucide-react'

// ViewToggle Component: Toggle switch between Grid layout and List layout (Dark AeroPulse theme)
function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="bg-white/[0.04] p-1 rounded-xl flex items-center gap-1 border border-white/10">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-md font-bold'
            : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
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
            ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-md font-bold'
            : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
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
