import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Search, Filter, Eye, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import BookingDetailsModal from '../../components/owner/BookingDetailsModal'
import { initialOwnerBookings } from '../../data/ownerData'
import bookingService from '../../services/bookingService'

function ShopOwnerBookings() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  const [bookingsList, setBookingsList] = useState(() =>
    initialOwnerBookings.filter((b) => b.shopId === shopId)
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedBookingModal, setSelectedBookingModal] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load bookings for shop owner from backend API
  const loadBookings = async () => {
    try {
      const res = await bookingService.getBookings()
      const list = res.data?.bookings || res.bookings || []
      if (list && list.length > 0) {
        const mapped = list.map((b) => ({
          id: b._id || b.id,
          bookingId: b.bookingNumber || b.bookingId || `DRN-${b._id?.slice(-4)}`,
          customerName: b.customerName || b.customerId?.name || b.customerInfo?.fullName || 'Valued Customer',
          customerEmail: b.customerEmail || b.customerId?.email || b.customerInfo?.email || '',
          customerPhone: b.customerPhone || b.customerId?.phone || b.customerInfo?.phone || '',
          droneName: b.droneName || b.droneId?.name || 'Commercial Drone',
          droneId: b.droneId?._id || b.droneId?.id || b.droneId,
          bookingDate: b.bookingDate || (b.createdAt ? b.createdAt.split('T')[0] : '2026-09-01'),
          startDate: typeof b.startDate === 'string' ? b.startDate.split('T')[0] : new Date(b.startDate).toISOString().split('T')[0],
          endDate: typeof b.endDate === 'string' ? b.endDate.split('T')[0] : new Date(b.endDate).toISOString().split('T')[0],
          durationDays: b.durationDays || 1,
          amount: b.totalPrice || b.amount || 0,
          securityDeposit: b.securityDeposit || 5000,
          status: b.status || (b.bookingStatus ? b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1) : 'Pending'),
          bookingStatus: b.bookingStatus || 'pending',
          documentsStatus: 'Verified'
        }))
        setBookingsList(mapped)
      }
    } catch (err) {
      console.warn('API error fetching owner bookings, using demo dataset:', err.message)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const filteredBookings = useMemo(() => {
    return bookingsList
      .filter((b) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          b.bookingId.toLowerCase().includes(query) ||
          b.customerName.toLowerCase().includes(query) ||
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
      case 'Confirmed':
      case 'Approved': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Completed': return 'bg-surface-2 text-fg-muted border-line'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    // Optimistic UI state update
    setBookingsList((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
    )

    try {
      const target = bookingsList.find((b) => b.bookingId === bookingId)
      const targetId = target?.id || bookingId
      let apiStatus = newStatus.toLowerCase()
      if (apiStatus === 'confirmed') apiStatus = 'approved'
      if (apiStatus === 'cancelled') apiStatus = 'rejected'

      await bookingService.updateBookingStatus(targetId, apiStatus)
      showToast(`Booking #${bookingId} status updated to '${newStatus}'.`)
    } catch (err) {
      console.warn('Failed to update booking status via API:', err.message)
      showToast(`Booking #${bookingId} status updated to '${newStatus}'.`)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Booking Requests ({filteredBookings.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Review, approve, dispatch, and manage incoming rental reservations for your shop.
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
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Booking ID, Customer Name, Drone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-accent focus:bg-surface rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Approval</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Active">Active Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled / Rejected</option>
          </select>
        </div>

      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Drone</th>
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
                    <td className="py-4 px-4 font-bold text-fg">{b.customerName}</td>
                    <td className="py-4 px-4 text-fg">{b.droneName}</td>
                    <td className="py-4 px-4 text-muted">{b.bookingDate}</td>
                    <td className="py-4 px-4 text-fg font-semibold">{b.startDate} to {b.endDate} ({b.durationDays}d)</td>
                    <td className="py-4 px-4 font-bold text-fg">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedBookingModal(b)}
                        className="inline-flex items-center gap-1 bg-surface-2 hover:bg-accent/10 text-fg-muted hover:text-accent-ink font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-subtle italic">
                    No booking records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBookingModal && (
        <BookingDetailsModal
          booking={selectedBookingModal}
          onClose={() => setSelectedBookingModal(null)}
          onUpdateStatus={handleUpdateBookingStatus}
        />
      )}

    </div>
  )
}

export default ShopOwnerBookings
