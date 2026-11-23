import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, User, Radio, Eye, Navigation, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import BookingDetailsModal from '../../components/owner/BookingDetailsModal'
import { initialOwnerBookings, initialOwnerDrones } from '../../data/ownerData'
import bookingService from '../../services/bookingService'

function ShopOwnerRentals() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const shopId = currentUser?.shopId || 101

  const [activeTab, setActiveTab] = useState('All') // All, Active, Upcoming, Completed
  const [selectedBookingModal, setSelectedBookingModal] = useState(null)
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
            customerName: b.customerName || b.customerId?.name || b.customerInfo?.fullName || 'Valued Renter',
            droneName: b.droneName || b.droneId?.name || 'Commercial Drone',
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
        console.warn('Owner rentals fetch fallback:', err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Filter rentals for THIS shop
  const shopRentals = useMemo(() => {
    if (liveRentals.length > 0) return liveRentals
    return initialOwnerBookings.filter((b) => b.shopId === shopId)
  }, [liveRentals, shopId])

  const filteredRentals = useMemo(() => {
    if (activeTab === 'All') return shopRentals
    if (activeTab === 'Active') return shopRentals.filter((r) => r.status === 'Active')
    if (activeTab === 'Upcoming') return shopRentals.filter((r) => r.status === 'Confirmed' || r.status === 'Pending')
    if (activeTab === 'Completed') return shopRentals.filter((r) => r.status === 'Completed')
    return shopRentals
  }, [shopRentals, activeTab])

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
          Shop Rentals Operations ({filteredRentals.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Track active field deployments, upcoming dispatches, and returned equipment inspections.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-bold overflow-x-auto">
        {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-accent text-white shadow-sm'
                : 'bg-surface text-muted hover:bg-surface-2 border border-line'
            }`}
          >
            {tab} Rentals
          </button>
        ))}
      </div>

      {/* Rentals Cards List */}
      <div className="space-y-4">
        {filteredRentals.length > 0 ? (
          filteredRentals.map((rental) => (
            <div key={rental.bookingId} className="bg-surface rounded-2xl border border-line p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(rental.status)}`}>
                    {rental.status}
                  </span>
                  <span className="font-mono text-xs font-bold text-accent-ink">ID: #{rental.bookingId}</span>
                </div>

                <h3 className="text-base font-bold text-fg">
                  {rental.droneName}
                </h3>

                <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                  <div className="flex items-center gap-1 text-fg-muted font-semibold">
                    <User className="w-3.5 h-3.5 text-accent-ink" />
                    <span>Customer: {rental.customerName}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-subtle" />
                    <span>{rental.startDate} to {rental.endDate} ({rental.durationDays}d)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-line">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-subtle font-medium">Rental Subtotal</div>
                  <div className="text-base font-semibold text-fg">₹{rental.amount?.toLocaleString('en-IN')}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingModal(rental)}
                    className="bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  {rental.status === 'Active' && (
                    <button
                      onClick={() => navigate('/owner/tracking')}
                      className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live GPS</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-surface rounded-2xl border border-line p-12 text-center text-subtle italic">
            No {activeTab.toLowerCase()} rentals found for your shop.
          </div>
        )}
      </div>

      {selectedBookingModal && (
        <BookingDetailsModal
          booking={selectedBookingModal}
          onClose={() => setSelectedBookingModal(null)}
          onUpdateStatus={(bookingId, newStatus) => {
            alert(`Rental ${bookingId} updated to ${newStatus}`);
          }}
        />
      )}

    </div>
  )
}

export default ShopOwnerRentals
