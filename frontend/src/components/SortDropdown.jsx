import React from 'react'
import { ArrowUpDown } from 'lucide-react'

// SortDropdown Component: Dropdown selector for ordering drone listings (Dark AeroPulse theme)
function SortDropdown({ sortOption, setSortOption }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-[#0d1117] border border-white/10 text-white/90 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl shadow-lg focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 cursor-pointer"
        >
          <option value="recommended" className="bg-[#0d1117] text-white">Sort by: Recommended</option>
          <option value="price-asc" className="bg-[#0d1117] text-white">Price: Low to High</option>
          <option value="price-desc" className="bg-[#0d1117] text-white">Price: High to Low</option>
          <option value="rating-desc" className="bg-[#0d1117] text-white">Highest Rated</option>
          <option value="popular-desc" className="bg-[#0d1117] text-white">Most Popular</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}

export default SortDropdown
