import React from 'react'
import { Search, Filter, Building2, Battery, Radio } from 'lucide-react'

/**
 * TrackingFilters Component
 * Filter bar for search, status, battery level, and shop (Admin only).
 */
function TrackingFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  batteryFilter,
  onBatteryChange,
  shopFilter,
  onShopChange,
  showShopFilter = false,
  shopsList = []
}) {
  return (
    <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Drone, Booking ID, or Customer..."
          className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-line focus:border-accent focus:bg-surface rounded-xl text-xs font-semibold text-fg placeholder-subtle transition-all outline-hidden"
        />
      </div>

      {/* Filter Dropdowns Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
        
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-xl px-2.5 py-1.5">
          <Radio className="w-3.5 h-3.5 text-subtle shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-fg-muted focus:outline-hidden cursor-pointer w-full"
          >
            <option value="All">All Statuses</option>
            <option value="in-flight">In Flight</option>
            <option value="idle">Idle</option>
            <option value="offline">Offline</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* Battery Filter */}
        <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-xl px-2.5 py-1.5">
          <Battery className="w-3.5 h-3.5 text-subtle shrink-0" />
          <select
            value={batteryFilter}
            onChange={(e) => onBatteryChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-fg-muted focus:outline-hidden cursor-pointer w-full"
          >
            <option value="All">All Batteries</option>
            <option value="above50">Above 50%</option>
            <option value="20to50">20–50%</option>
            <option value="below20">Below 20%</option>
          </select>
        </div>

        {/* Admin Shop Filter (Only Super Admin) */}
        {showShopFilter && (
          <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={shopFilter}
              onChange={(e) => onShopChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Shops</option>
              {shopsList.map((shop) => (
                <option key={shop} value={shop}>
                  {shop}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>
    </div>
  )
}

export default TrackingFilters
