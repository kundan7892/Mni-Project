import React from 'react'
import { ArrowUpDown } from 'lucide-react'

// SortDropdown Component: Dropdown selector for ordering drone listings
function SortDropdown({ sortOption, setSortOption }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-surface border border-line text-fg text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
        >
          <option value="recommended">Sort by: Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="popular-desc">Most Popular</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-subtle absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}

export default SortDropdown
