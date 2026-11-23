import React from 'react'
import { Filter, Calendar, Building2, Radio, Tag, Layers, Search } from 'lucide-react'

/**
 * AnalyticsFilters Component
 * Filter dropdown bar for filtering analytics charts and data tables.
 */
function AnalyticsFilters({
  searchTerm = '',
  onSearchChange,
  dateRange = 'This Month',
  onDateRangeChange,
  statusFilter = 'All',
  onStatusChange,
  categoryFilter = 'All',
  onCategoryChange,
  shopFilter = 'All',
  onShopChange,
  showShopFilter = false,
  shopsList = [],
  categoriesList = ['Camera Drone', 'Survey & Mapping', 'Agricultural Spraying', 'FPV & Cinematic', 'Industrial Heavy Lift']
}) {
  return (
    <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
      
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter records by name, ID, or specs..."
            className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-line focus:border-accent focus:bg-surface rounded-xl text-xs font-semibold text-fg placeholder-subtle transition-all outline-hidden"
          />
        </div>
      )}

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
        
        {/* Date Range Dropdown */}
        {onDateRangeChange && (
          <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-subtle shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-fg-muted focus:outline-hidden cursor-pointer w-full"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        )}

        {/* Status Dropdown */}
        {onStatusChange && (
          <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-xl px-2.5 py-1.5">
            <Radio className="w-3.5 h-3.5 text-subtle shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-fg-muted focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {/* Category Dropdown */}
        {onCategoryChange && (
          <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-xl px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-subtle shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-fg-muted focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Admin Shop Dropdown */}
        {showShopFilter && onShopChange && (
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/25 rounded-xl px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-accent-ink shrink-0" />
            <select
              value={shopFilter}
              onChange={(e) => onShopChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-accent-ink focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Partner Shops</option>
              {shopsList.map((shop) => (
                <option key={shop} value={shop}>{shop}</option>
              ))}
            </select>
          </div>
        )}

      </div>
    </div>
  )
}

export default AnalyticsFilters
