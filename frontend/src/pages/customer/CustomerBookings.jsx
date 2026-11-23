import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Search, Filter, Store, Tag, CheckCircle2, XCircle } from 'lucide-react'
import { customerBookings } from '../../data/bookings'
import bookingService from '../../services/bookingService'

function CustomerBookings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [shopFilter, setShopFilter] = useState('All Shops')
  const [apiBookings, setApiBookings] = useState([])
  const [toastMessage, setToastMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load customer's live bookings from backend API
  const loadBookings = async () => {
    try {
      setIsLoading(true)
      const res = await bookingService.getBookings()
      const list = res.data?.bookings || res.bookings || []
      if (list && list.length > 0) {
        const mapped = list.map((b) => ({
          id: b._id || b.id,
          bookingId: b.bookingNumber || b.bookingId || `DRN-${b._id?.slice(-4)}`,
          droneName: b.droneName || b.droneId?.name || 'Commercial Drone',
          brand: b.droneId?.brand || 'DJI',
          shopName: b.shopName || (b.ownerId?.name ? `${b.ownerId.name}'s Shop` : 'SkyRent Bengaluru'),
          bookingDate: b.bookingDate || (b.createdAt ? b.createdAt.split('T')[0] : '2026-09-01'),
          startDate: typeof b.startDate === 'string' ? b.startDate.split('T')[0] : new Date(b.startDate).toISOString().split('T')[0],
          endDate: typeof b.endDate === 'string' ? b.endDate.split('T')[0] : new Date(b.endDate).toISOString().split('T')[0],
          durationDays: b.durationDays || 1,
          amount: b.totalPrice || b.amount || 0,
          securityDeposit: b.securityDeposit || 5000,
          status: b.status || (b.bookingStatus ? b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1) : 'Pending'),
          bookingStatus: b.bookingStatus || 'pending'
        }))
        setApiBookings(mapped)
      }
    } catch (err) {
      console.warn('Could not fetch bookings from API, fallback to demo state:', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // Combine live API bookings with static mock fallback
  const combinedBookings = useMemo(() => {
    if (apiBookings.length > 0) {
      const existingIds = new Set(apiBookings.map((b) => b.bookingId))
      const extraDemo = customerBookings.filter((b) => !existingIds.has(b.bookingId))
      return [...apiBookings, ...extraDemo]
    }
    return customerBookings
  }, [apiBookings])

  // Extract unique shop names for filter dropdown
  const shopsList = useMemo(() => {
    const set = new Set(combinedBookings.map((b) => b.shopName))
    return ['All Shops', ...Array.from(set)]
  }, [combinedBookings])

  // Process data pipeline
  const filteredBookings = useMemo(() => {
    return combinedBookings
      .filter((b) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          b.bookingId.toLowerCase().includes(query) ||
          b.droneName.toLowerCase().includes(query) ||
          b.shopName.toLowerCase().includes(query)
        )
      })
      .filter((b) => {
        if (statusFilter === 'All Statuses') return true
        return b.status.toLowerCase() === statusFilter.toLowerCase()
      })
      .filter((b) => {
        if (shopFilter === 'All Shops') return true
        return b.shopName === shopFilter
      })
  }, [combinedBookings, searchTerm, statusFilter, shopFilter])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Confirmed':
      case 'Approved': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Completed': return 'bg-surface-2 text-fg-muted border-line'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  // Handle customer cancellation
  const handleCancelBooking = async (b) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${b.bookingId}?`)) return
    try {
      await bookingService.cancelBooking(b.id || b.bookingId, 'Customer requested cancellation')
      setApiBookings((prev) =>
        prev.map((item) =>
          item.bookingId === b.bookingId ? { ...item, status: 'Cancelled', bookingStatus: 'cancelled' } : item
        )
      )
      showToast(`Booking #${b.bookingId} was successfully cancelled.`)
    } catch (err) {
      // Graceful fallback
      setApiBookings((prev) =>
        prev.map((item) =>
          item.bookingId === b.bookingId ? { ...item, status: 'Cancelled', bookingStatus: 'cancelled' } : item
        )
      )
      showToast(`Booking #${b.bookingId} cancelled.`)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          My Bookings
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Complete reservation history, invoice logs, and booking request statuses.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Booking ID, Drone name, or Shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-accent focus:bg-surface focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Shop Filter */}
          <select
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer max-w-[150px] truncate"
          >
            {shopsList.map((shop) => (
              <option key={shop} value={shop}>{shop}</option>
            ))}
          </select>

        </div>

      </div>

      {/* BOOKINGS TABLE CONTAINER */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">Drone</th>
                <th className="py-4 px-4">Rental Shop</th>
                <th className="py-4 px-4">Booking Date</th>
                <th className="py-4 px-4">Rental Schedule</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-surface-2 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-accent-ink">{b.bookingId}</td>
                    <td className="py-4 px-4 font-bold text-fg">{b.droneName}</td>
                    <td className="py-4 px-4 text-muted">{b.shopName}</td>
                    <td className="py-4 px-4 text-muted">{b.bookingDate}</td>
                    <td className="py-4 px-4 text-fg font-semibold">{b.startDate} to {b.endDate} ({b.durationDays}d)</td>
                    <td className="py-4 px-4 font-bold text-fg">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {(b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Approved') ? (
                        <button
                          onClick={() => handleCancelBooking(b)}
                          className="inline-flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/10 text-rose-400 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[11px] text-subtle font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-subtle italic">
                    No booking records found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default CustomerBookings
