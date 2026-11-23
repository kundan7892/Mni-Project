import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, User, Radio, Store, Loader2 } from 'lucide-react'
import { initialOwnerBookings } from '../../data/ownerData'
import bookingService from '../../services/bookingService'

function SuperAdminRentals() {
  const [activeTab, setActiveTab] = useState('All')
  const [liveRentals, setLiveRentals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    bookingService
      .getBookings()
      .then((res) => {
        if (!isMounted) return
        const list = res.data?.bookings || res.bookings || []
        if (list && list.length > 0) {
          const mapped = list.map((b) => ({
            id: b._id || b.id,
            bookingId: b.bookingNumber || b.bookingId || `DRN-${b._id?.slice(-4)}`,
            customerName: b.customerName || b.customerId?.name || b.customerInfo?.fullName || 'Platform Renter',
            droneName: b.droneName || b.droneId?.name || 'Commercial Drone',
            shopName: b.shopName || (b.ownerId?.name ? `${b.ownerId.name}'s Shop` : 'SkyRent Bengaluru'),
            startDate: typeof b.startDate === 'string' ? b.startDate.split('T')[0] : new Date(b.startDate).toISOString().split('T')[0],
            endDate: typeof b.endDate === 'string' ? b.endDate.split('T')[0] : new Date(b.endDate).toISOString().split('T')[0],
            amount: b.totalPrice || b.amount || 0,
            status:
              b.bookingStatus === 'active'
                ? 'Active'
                : b.bookingStatus === 'completed'
                ? 'Completed'
                : b.bookingStatus === 'approved' || b.bookingStatus === 'pending'
                ? 'Upcoming'
                : 'Cancelled',
            bookingStatus: b.bookingStatus || 'pending'
          }))
          setLiveRentals(mapped)
        }
      })
      .catch((err) => {
        console.warn('Super Admin rentals API note:', err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const allRentals = useMemo(() => {
    if (liveRentals.length > 0) {
      const liveIds = new Set(liveRentals.map((r) => r.bookingId))
      const extraDemo = initialOwnerBookings.filter((b) => !liveIds.has(b.bookingId))
      return [...liveRentals, ...extraDemo]
    }
    return initialOwnerBookings
  }, [liveRentals])

  const filteredRentals = useMemo(() => {
    if (activeTab === 'All') return allRentals
    return allRentals.filter((r) => r.status.toLowerCase() === activeTab.toLowerCase())
  }, [activeTab, allRentals])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 text-white'
      case 'Confirmed': return 'bg-accent text-white'
      case 'Pending': return 'bg-amber-500 text-white'
      case 'Completed': return 'bg-surface-3 text-white'
      default: return 'bg-rose-500 text-white'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Platform Rentals Master Log ({filteredRentals.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Overview of field rentals, Active GPS telemetry dispatches, and returned equipment checks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-bold overflow-x-auto">
        {['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-surface text-muted hover:bg-surface-2 border border-line'
            }`}
          >
            {tab} Rentals
          </button>
        ))}
      </div>

      {/* RENTALS LIST */}
      <div className="space-y-4">
        {filteredRentals.map((rental) => (
          <div key={rental.bookingId} className="bg-surface rounded-2xl border border-line p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(rental.status)}`}>
                  {rental.status}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">ID: #{rental.bookingId}</span>
                <span className="text-xs font-bold text-accent-ink bg-accent/10 px-2 py-0.5 rounded-md">Shop: {rental.shopName || 'SkyRent Bengaluru'}</span>
              </div>

              <h3 className="text-base font-bold text-fg">
                {rental.droneName}
              </h3>

              <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                <div className="flex items-center gap-1 text-fg-muted font-semibold">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer: {rental.customerName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-subtle" />
                  <span>{rental.startDate} to {rental.endDate} ({rental.durationDays}d)</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-subtle font-medium">Rental Subtotal</div>
              <div className="text-base font-semibold text-fg">₹{rental.amount?.toLocaleString('en-IN')}</div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default SuperAdminRentals
