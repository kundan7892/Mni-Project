import React, { useState, useMemo, useEffect } from 'react'
import { Filter, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react'

// Data & Components
import { dronesData } from '../data/drones'
import droneService from '../services/droneService'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import FilterDrawer from '../components/FilterDrawer'
import SortDropdown from '../components/SortDropdown'
import ViewToggle from '../components/ViewToggle'
import DroneCard from '../components/DroneCard'
import DroneListItem from '../components/DroneListItem'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'

// Initial Filter State object
const initialFilters = {
  category: 'All Categories',
  brand: 'All Brands',
  maxPrice: 15000,
  camera: 'All Resolutions',
  flightTime: 'All Flight Times',
  availability: 'All Statuses',
  minRating: 0
}

// DroneMarketplace Component: Complete drone catalog page
function DroneMarketplace() {
  // Live Drone Data State (initialized with mock drones for immediate display)
  const [dronesList, setDronesList] = useState(dronesData)
  const [isLoadingApi, setIsLoadingApi] = useState(false)

  // Fetch live drones from backend API on mount
  useEffect(() => {
    let isMounted = true
    setIsLoadingApi(true)

    droneService
      .getDrones({ limit: 100 })
      .then((data) => {
        if (isMounted && data?.drones && data.drones.length > 0) {
          const formatted = data.drones.map((d) => ({
            id: d._id || d.id,
            name: d.name,
            brand: d.brand,
            model: d.model,
            category: d.category || 'Photography',
            pricePerDay: d.pricePerDay || (d.pricePerHour ? d.pricePerHour * 8 : 2500),
            pricePerHour: d.pricePerHour,
            securityDeposit: d.securityDeposit || 5000,
            rating: d.rating || 4.8,
            reviews: d.reviews || 0,
            camera: d.specifications?.camera || d.camera || '4K',
            flightTime: Number(d.specifications?.flightTime || d.flightTime || 35),
            gps: d.specifications?.gps ?? d.gps ?? true,
            availability:
              d.availability ||
              (d.status
                ? d.status.charAt(0).toUpperCase() + d.status.slice(1)
                : 'Available'),
            status: d.status || 'available',
            shopName: d.shopName || 'SkyRent Bengaluru',
            location: d.location || 'Bengaluru',
            image: d.image,
            popular: d.popular ?? true,
            recommended: d.recommended ?? true
          }))
          setDronesList(formatted)
        }
      })
      .catch((err) => {
        console.warn('Live API fetch unavailable, displaying marketplace inventory:', err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoadingApi(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // State 1: Search Query string
  const [searchTerm, setSearchTerm] = useState('')

  // State 2: Active Filters object
  const [filters, setFilters] = useState(initialFilters)

  // State 3: Active Sorting Option
  const [sortOption, setSortOption] = useState('recommended')

  // State 4: Layout View Mode ('grid' or 'list')
  const [viewMode, setViewMode] = useState('grid')

  // State 5: Wishlist Drone IDs Array
  const [wishlist, setWishlist] = useState([1, 8])

  // State 6: Mobile Filter Drawer Open/Close toggle
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // State 7: Pagination Visible Items Count
  const [visibleCount, setVisibleCount] = useState(9)

  // State 8: Notification Toast Message
  const [toastMessage, setToastMessage] = useState(null)

  // Wishlist Toggle Handler
  const handleToggleWishlist = (drone) => {
    const isCurrentlyWishlisted = wishlist.includes(drone.id)
    if (isCurrentlyWishlisted) {
      setWishlist((prev) => prev.filter((id) => id !== drone.id))
      setToastMessage({ text: `${drone.name} removed from wishlist`, type: 'info' })
    } else {
      setWishlist((prev) => [...prev, drone.id])
      setToastMessage({ text: `${drone.name} added to your wishlist!`, type: 'wishlist' })
    }

    // Auto-hide toast notification after 4 seconds
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Reset all filters and search query
  const handleResetFilters = () => {
    setSearchTerm('')
    setFilters(initialFilters)
    setSortOption('recommended')
    setVisibleCount(9)
  }

  // Count how many non-default filters are active
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'All Categories') count++
    if (filters.brand !== 'All Brands') count++
    if (filters.maxPrice < 15000) count++
    if (filters.camera !== 'All Resolutions') count++
    if (filters.flightTime !== 'All Flight Times') count++
    if (filters.availability !== 'All Statuses') count++
    if (filters.minRating > 0) count++
    return count
  }, [filters])

  // Process data pipeline: Original -> Search -> Filters -> Sorting
  const filteredAndSortedDrones = useMemo(() => {
    return dronesList
      // 1. Search Query Filter
      .filter((drone) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          drone.name.toLowerCase().includes(query) ||
          drone.brand.toLowerCase().includes(query) ||
          drone.model.toLowerCase().includes(query) ||
          drone.category.toLowerCase().includes(query)
        )
      })
      // 2. Category Filter
      .filter((drone) => {
        if (filters.category === 'All Categories') return true
        return drone.category === filters.category
      })
      // 3. Brand Filter
      .filter((drone) => {
        if (filters.brand === 'All Brands') return true
        return drone.brand === filters.brand
      })
      // 4. Maximum Price Filter (in ₹)
      .filter((drone) => drone.pricePerDay <= filters.maxPrice)
      // 5. Camera Spec Filter
      .filter((drone) => {
        if (filters.camera === 'All Resolutions') return true
        return drone.camera === filters.camera
      })
      // 6. Flight Time Filter
      .filter((drone) => {
        if (filters.flightTime === 'All Flight Times') return true
        if (filters.flightTime === 'Under 30 mins') return drone.flightTime < 30
        if (filters.flightTime === '30–40 mins') return drone.flightTime >= 30 && drone.flightTime <= 40
        if (filters.flightTime === 'Above 40 mins') return drone.flightTime > 40
        return true
      })
      // 7. Availability Filter
      .filter((drone) => {
        if (filters.availability === 'All Statuses') return true
        return drone.availability === filters.availability
      })
      // 8. Minimum Rating Filter
      .filter((drone) => drone.rating >= filters.minRating)
      // 9. Sorting Logic
      .sort((a, b) => {
        if (sortOption === 'price-asc') return a.pricePerDay - b.pricePerDay
        if (sortOption === 'price-desc') return b.pricePerDay - a.pricePerDay
        if (sortOption === 'rating-desc') return b.rating - a.rating
        if (sortOption === 'popular-desc') return b.reviews - a.reviews
        // Default 'recommended': sort recommended first then by rating
        if (a.recommended && !b.recommended) return -1
        if (!a.recommended && b.recommended) return 1
        return b.rating - a.rating
      })
  }, [searchTerm, filters, sortOption])

  // Paginated visible list slice
  const visibleDrones = useMemo(() => {
    return filteredAndSortedDrones.slice(0, visibleCount)
  }, [filteredAndSortedDrones, visibleCount])

  return (
    <div className="space-y-10 pb-24 bg-[#050508]">

      {/* 1. PAGE HEADER */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d18] to-[#050508]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.15) 0%, rgba(100,0,255,0.08) 50%, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span
              className="inline-flex items-center gap-2 border border-white/10 text-white/50 px-4 py-1.5 rounded-full text-[11px] font-semibold"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <Sparkles className="w-3 h-3 text-[#00f0ff]" />
              Drone Fleet Marketplace
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Explore{' '}
              <span style={{ color: '#00f0ff', textShadow: '0 0 40px rgba(0,240,255,0.4)' }}>
                Drones
              </span>
            </h1>

            <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed">
              Find the perfect drone for photography, agriculture, surveying, filmmaking, and more.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
      </section>

      {/* 2. MAIN MARKETPLACE CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Desktop Filter Sidebar (Hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
              totalResults={filteredAndSortedDrones.length}
            />
          </aside>

          {/* Main Results Column */}
          <main className="lg:col-span-9 space-y-6">

            {/* Results Control Header Bar */}
            <div className="bg-black/60 border border-purple-500/20 backdrop-blur-sm p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">

              {/* Results Count & Mobile Filter Trigger */}
              <div className="flex items-center gap-3">

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 bg-purple-900/20 hover:bg-purple-900/40 text-slate-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-purple-500/20 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="text-sm font-extrabold text-white">
                  Showing <span className="text-cyan-400">{filteredAndSortedDrones.length}</span> drones
                </div>

              </div>

              {/* Controls: Sorting Dropdown & View Toggle */}
              <div className="flex items-center gap-3 ml-auto">
                <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>

            </div>

            {/* Drone Listings Display */}
            {visibleDrones.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  /* Grid View Layout */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleDrones.map((drone) => (
                      <DroneCard
                        key={drone.id}
                        drone={drone}
                        isWishlisted={wishlist.includes(drone.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                ) : (
                  /* List View Layout */
                  <div className="space-y-4">
                    {visibleDrones.map((drone) => (
                      <DroneListItem
                        key={drone.id}
                        drone={drone}
                        isWishlisted={wishlist.includes(drone.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}

                {/* Load More Pagination Button */}
                {visibleCount < filteredAndSortedDrones.length && (
                  <div className="pt-8 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="inline-flex items-center gap-2 bg-black/60 hover:bg-purple-900/20 text-slate-300 hover:text-purple-400 font-bold px-8 py-3.5 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer text-sm backdrop-blur-sm"
                    >
                      <RefreshCw className="w-4 h-4 text-cyan-400" />
                      <span>Load More Drones ({filteredAndSortedDrones.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State View */
              <EmptyState onResetFilters={handleResetFilters} />
            )}

          </main>

        </div>
      </section>

      {/* Mobile Filter Drawer Modal */}
      <FilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredAndSortedDrones.length}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  )
}

export default DroneMarketplace
