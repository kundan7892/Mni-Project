import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Store, Navigation, ShieldCheck, MapPin, Radio, Calendar, Users, 
  CreditCard, TrendingUp, AlertTriangle, ArrowRight, Eye, Sparkles, Loader2 
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

import { useAuth } from '../../context/AuthContext'
import OwnerStatCard from '../../components/owner/OwnerStatCard'
import BookingDetailsModal from '../../components/owner/BookingDetailsModal'
import { shopProfiles } from '../../data/shops'
import { initialOwnerBookings, initialOwnerDrones } from '../../data/ownerData'
import analyticsService from '../../services/analyticsService'
import droneService from '../../services/droneService'
import bookingService from '../../services/bookingService'

function ShopOwnerOverview() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const shopId = currentUser?.shopId || 101
  const shop = useMemo(() => shopProfiles.find((s) => s.shopId === shopId) || shopProfiles[0], [shopId])

  const [dbStats, setDbStats] = useState(null)
  const [liveBookings, setLiveBookings] = useState([])
  const [liveDrones, setLiveDrones] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    Promise.allSettled([
      analyticsService.getDashboardAnalytics(),
      droneService.getDrones(),
      bookingService.getBookings()
    ]).then(([analyticsRes, dronesRes, bookingsRes]) => {
      if (!isMounted) return

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
        setDbStats(analyticsRes.value.data || analyticsRes.value)
      }
      if (dronesRes.status === 'fulfilled' && dronesRes.value) {
        const dList = dronesRes.value.data?.drones || dronesRes.value.drones || []
        if (dList.length > 0) setLiveDrones(dList)
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value) {
        const bList = bookingsRes.value.data?.bookings || bookingsRes.value.bookings || []
        if (bList.length > 0) setLiveBookings(bList)
      }
    }).finally(() => {
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Filter bookings and drones by shopId
  const shopBookings = useMemo(() => {
    if (liveBookings.length > 0) return liveBookings
    return initialOwnerBookings.filter((b) => b.shopId === shopId)
  }, [liveBookings, shopId])

  const shopDrones = useMemo(() => {
    if (liveDrones.length > 0) return liveDrones
    return initialOwnerDrones.filter((d) => d.shopId === shopId)
  }, [liveDrones, shopId])

  const [selectedBookingModal, setSelectedBookingModal] = useState(null)

  // Real Database Metrics Computation
  const statTotalDrones = dbStats?.totalDrones ?? shopDrones.length
  const statAvailableDrones = dbStats?.availableDrones ?? (shopDrones.filter(d => d.status === 'available').length || shop.stats.availableDrones)
  const statActiveRentals = dbStats?.activeRentals ?? (shopBookings.filter(b => b.bookingStatus === 'active' || b.status === 'Active').length || shop.stats.activeRentals)
  const statTotalRentals = dbStats?.completedRentals !== undefined ? (dbStats.completedRentals + statActiveRentals) : (shopBookings.length || shop.stats.totalRentals)
  const statRevenue = dbStats?.totalRevenue !== undefined ? `₹${(dbStats.totalRevenue / 1000).toFixed(0)}k` : `₹${(shop.stats.monthlyRevenue / 1000).toFixed(0)}k`

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
    <div className="space-y-8">
      
      {/* 1. SHOP HEADER CARD */}
      <div className="bg-surface rounded-2xl border border-line p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-20 h-20 rounded-2xl object-cover border border-line shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold text-fg">{shop.name}</h1>
              {shop.verified && (
                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent-ink text-xs font-bold px-2.5 py-0.5 rounded-full border border-accent/25">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-ink" />
                  Verified Storefront
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-subtle" />
                <span>{shop.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-400">Status: {shop.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/owner/shop-profile"
            className="flex-1 sm:flex-initial text-center bg-accent/10 hover:bg-accent/10 text-accent-ink font-bold px-5 py-2.5 rounded-xl text-xs border border-accent/25 transition-colors"
          >
            Edit Shop
          </Link>
          <Link
            to={`/drones`}
            className="flex-1 sm:flex-initial text-center bg-accent hover:bg-accent-hover text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            View Marketplace
          </Link>
        </div>
      </div>

      {/* 2. SIX STATISTIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <OwnerStatCard
          title="Total Drones"
          value={statTotalDrones}
          label="Fleet size"
          icon={Navigation}
          color="purple"
        />
        <OwnerStatCard
          title="Available Drones"
          value={statAvailableDrones}
          label="Ready to rent"
          icon={Radio}
          color="emerald"
        />
        <OwnerStatCard
          title="Active Rentals"
          value={statActiveRentals}
          label="In flight / rented"
          icon={Calendar}
          color="blue"
        />
        <OwnerStatCard
          title="Total Rentals"
          value={statTotalRentals}
          label="Processed reservations"
          icon={Users}
          color="amber"
        />
        <OwnerStatCard
          title="Fleet Revenue"
          value={statRevenue}
          label="Earned revenue"
          icon={CreditCard}
          color="indigo"
        />
        <OwnerStatCard
          title="Avg Rating"
          value={shop.stats.rating}
          label="Shop score"
          icon={TrendingUp}
          color="rose"
        />
      </div>

      {/* 3. REVENUE CHART & LOW STOCK ALERT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* REVENUE CHART (8 Cols) */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-fg">
                Monthly Revenue Performance
              </h3>
              <p className="text-xs text-muted">6-month rental earnings for {shop.name}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-ink" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shop.monthlyRevenueChart}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#26262b" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} formatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #26262b', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOW AVAILABILITY ALERT CARD (4 Cols) */}
        <div className="lg:col-span-4 bg-amber-500/10 rounded-2xl border border-amber-500/25 p-6 space-y-4 text-amber-400 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-fg">Low Availability Alert</h3>
              <span className="text-[11px] text-amber-400 font-medium">Inventory Stock Warning</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-fg-muted">
            Some high-demand camera drones have limited available stock in your shop:
          </p>

          <div className="bg-surface p-3.5 rounded-2xl border border-amber-500/25 text-xs font-bold text-fg space-y-1">
            <div className="flex justify-between items-center">
              <span>DJI Mavic 3 Pro</span>
              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/25">1 Available</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-line text-muted font-normal">
              <span>Avata 2 FPV Kit</span>
              <span className="text-rose-400 font-bold">0 Available (Rented)</span>
            </div>
          </div>

          <Link
            to="/owner/drones"
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs shadow-xs transition-colors"
          >
            <span>Manage Fleet Drones</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 4. RECENT BOOKING OVERVIEW TABLE */}
      <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-fg">
            Recent Booking Requests ({shopBookings.length})
          </h3>
          <Link to="/owner/bookings" className="text-xs font-bold text-accent-ink hover:underline">
            View All Bookings
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Drone</th>
                <th className="py-3 px-4">Rental Schedule</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {shopBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent-ink">{b.bookingId}</td>
                  <td className="py-3 px-4 font-bold text-fg">{b.customerName}</td>
                  <td className="py-3 px-4 text-fg">{b.droneName}</td>
                  <td className="py-3 px-4 text-muted">{b.startDate} to {b.endDate}</td>
                  <td className="py-3 px-4 font-bold text-fg">₹{b.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedBookingModal(b)}
                      className="p-1.5 text-muted hover:text-accent-ink bg-surface-2 hover:bg-accent/10 rounded-xl transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedBookingModal && (
        <BookingDetailsModal
          booking={selectedBookingModal}
          onClose={() => setSelectedBookingModal(null)}
          onUpdateStatus={(bookingId, newStatus) => {
            alert(`Booking ${bookingId} status updated to ${newStatus}`);
          }}
        />
      )}

    </div>
  )
}

export default ShopOwnerOverview
