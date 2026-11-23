import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Search, Filter, Eye } from 'lucide-react'
import { initialOwnerBookings } from '../../data/ownerData'
import bookingService from '../../services/bookingService'

function SuperAdminBookings() {
  const [bookingsList, setBookingsList] = useState(initialOwnerBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Load platform-wide bookings from backend API
  const loadAllBookings = async () => {
    try {
      const res = await bookingService.getBookings()
      const list = res.data?.bookings || res.bookings || []
      if (list && list.length > 0) {
        const mapped = list.map((b) => ({
          id: b._id || b.id,
          bookingId: b.bookingNumber || b.bookingId || `DRN-${b._id?.slice(-4)}`,
          customerName: b.customerName || b.customerId?.name || b.customerInfo?.fullName || 'Registered Customer',
          shopName: b.shopName || (b.ownerId?.name ? `${b.ownerId.name}'s Shop` : 'SkyRent Bengaluru'),
          droneName: b.droneName || b.droneId?.name || 'Enterprise Drone',
          startDate: typeof b.startDate === 'string' ? b.startDate.split('T')[0] : new Date(b.startDate).toISOString().split('T')[0],
          endDate: typeof b.endDate === 'string' ? b.endDate.split('T')[0] : new Date(b.endDate).toISOString().split('T')[0],
          amount: b.totalPrice || b.amount || 0,
          status: b.status || (b.bookingStatus ? b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1) : 'Pending')
        }))
        // Merge API bookings with existing mock data
        const apiIds = new Set(mapped.map((m) => m.bookingId))
        const unseeded = initialOwnerBookings.filter((b) => !apiIds.has(b.bookingId))
        setBookingsList([...mapped, ...unseeded])
      }
    } catch (err) {
      console.warn('API error fetching super admin bookings, using demo dataset:', err.message)
    }
  }

  useEffect(() => {
    loadAllBookings()
  }, [])

  const filteredBookings = useMemo(() => {
    return bookingsList
      .filter((b) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          b.bookingId.toLowerCase().includes(query) ||
          b.customerName.toLowerCase().includes(query) ||
          b.shopName?.toLowerCase().includes(query) ||
          b.droneName.toLowerCase().includes(query)
        )
      })
      .filter((b) => {
        if (statusFilter === 'All') return true
        return b.status.toLowerCase() === statusFilter.toLowerCase()
      })
  }, [bookingsList, searchTerm, statusFilter])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Confirmed': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Completed': return 'bg-surface-2 text-fg-muted border-line'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Platform-Wide Bookings ({filteredBookings.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Complete reservation logs across all partner shops and registered customers.
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Booking ID, Customer, Shop, Drone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Fulfilling Shop</th>
                <th className="py-4 px-4">Drone</th>
                <th className="py-4 px-4">Rental Schedule</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-surface-2 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400">{b.bookingId}</td>
                  <td className="py-4 px-4 font-bold text-fg">{b.customerName}</td>
                  <td className="py-4 px-4 font-bold text-accent-ink">{b.shopName || "SkyRent Bengaluru"}</td>
                  <td className="py-4 px-4 text-fg">{b.droneName}</td>
                  <td className="py-4 px-4 text-muted">{b.startDate} to {b.endDate}</td>
                  <td className="py-4 px-4 font-semibold text-fg">₹{b.amount.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default SuperAdminBookings
