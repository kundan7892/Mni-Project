import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Store, Users, Navigation, Calendar, Radio, CreditCard, TrendingUp, 
  AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Eye, Sparkles, PieChartIcon, Loader2 
} from 'lucide-react'
import { 
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts'

import { useAuth } from '../../context/AuthContext'
import AdminStatCard from '../../components/admin/AdminStatCard'
import analyticsService from '../../services/analyticsService'
import droneService from '../../services/droneService'
import bookingService from '../../services/bookingService'
import { 
  platformRevenueData, userGrowthData, bookingStatusDistribution, 
  adminActivities 
} from '../../data/adminData'

function SuperAdminOverview() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [dbStats, setDbStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    analyticsService
      .getDashboardAnalytics()
      .then((res) => {
        if (isMounted && res) {
          setDbStats(res.data || res)
        }
      })
      .catch((err) => {
        console.warn('Admin analytics fetch note:', err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Dynamic real DB statistics computation
  const statShops = dbStats?.totalOwners ? String(dbStats.totalOwners) : "48"
  const statActiveShops = dbStats?.totalOwners ? String(Math.max(1, Math.round(dbStats.totalOwners * 0.85))) : "42"
  const statCustomers = dbStats?.totalCustomers ? String(dbStats.totalCustomers) : "2,846"
  const statDrones = dbStats?.totalDrones ? String(dbStats.totalDrones) : "386"
  const statActiveRentals = dbStats?.activeRentalsCount !== undefined ? String(dbStats.activeRentalsCount) : "74"
  const statBookings = dbStats?.totalBookingsCount !== undefined ? String(dbStats.totalBookingsCount) : "126"
  const statRevenue = dbStats?.totalGMV ? `₹${(dbStats.totalGMV / 100000).toFixed(1)}L` : "₹28.45L"

  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative bg-surface text-white rounded-2xl p-6 sm:p-10 shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Platform Master Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            DroneHub Super Administration
          </h1>

          <p className="text-fg-muted text-xs sm:text-sm leading-relaxed">
            Monitor platform-wide revenue, multi-shop storefront clearance, customer growth, live drone dispatches, and unresolved complaints.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/admin/shops"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
            >
              <span>Manage Shops (48)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-5 py-3 rounded-xl text-xs border border-line transition-colors"
            >
              <span>View Analytics</span>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. EIGHT PLATFORM STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Total Shops"
          value={statShops}
          label="Registered partner stores"
          icon={Store}
          color="emerald"
          trend="+4 This Month"
        />
        <AdminStatCard
          title="Active Shops"
          value={statActiveShops}
          label="Operational storefronts"
          icon={CheckCircle2}
          color="blue"
          trend="87.5% Active"
        />
        <AdminStatCard
          title="Total Customers"
          value={statCustomers}
          label="Verified platform renters"
          icon={Users}
          color="indigo"
          trend="+18.4%"
        />
        <AdminStatCard
          title="Total Drones"
          value={statDrones}
          label="Fleet size across shops"
          icon={Navigation}
          color="purple"
          trend="Global"
        />
        <AdminStatCard
          title="Active Rentals"
          value={statActiveRentals}
          label="Currently in flight"
          icon={Radio}
          color="emerald"
          trend="Live GPS"
        />
        <AdminStatCard
          title="Today's Bookings"
          value={statBookings}
          label="Platform transactions"
          icon={Calendar}
          color="amber"
          trend="Real-Time"
        />
        <AdminStatCard
          title="Platform GMV"
          value={statRevenue}
          label="Gross transaction volume"
          icon={CreditCard}
          color="emerald"
          trend="+14% MoM"
        />
        <AdminStatCard
          title="Platform Growth"
          value="+18.4%"
          label="Overall metric expansion"
          icon={TrendingUp}
          color="blue"
          trend="Quarterly"
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PLATFORM REVENUE CHART (7 Cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-fg">Platform Gross Revenue</h3>
              <p className="text-xs text-muted">6-month total rental billing volume</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformRevenueData}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#26262b" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} formatter={(v) => `₹${v/100000}L`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #26262b', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Gross Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#adminRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKING STATUS DISTRIBUTION DONUT (5 Cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-fg">Booking Analytics</h3>
              <p className="text-xs text-muted">Platform status breakdown</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-accent-ink" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {bookingStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
            {bookingStatusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-fg-muted">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. USER GROWTH CHART */}
      <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-fg">User Growth Trends</h3>
            <p className="text-xs text-muted">Customer registrations vs Shop Owner onboarding</p>
          </div>
          <Users className="w-5 h-5 text-accent-ink" />
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#26262b" />
              <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#9898a2' }} />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#8b8ce8" strokeWidth={3} name="Customers" />
              <Line type="monotone" dataKey="shopOwners" stroke="#34d399" strokeWidth={3} name="Shop Owners" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. PENDING ADMIN ACTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ADMIN ACTION ALERTS (6 Cols) */}
        <div className="lg:col-span-6 bg-surface text-white rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Pending Action Desk</span>
            </h3>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Requires Review
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-surface-2/80 p-4 rounded-2xl border border-line flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white">Pending Shop Approvals</div>
                <div className="text-subtle">5 new drone shops waiting for storefront verification clearance.</div>
              </div>
              <Link to="/admin/shops" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl shrink-0">
                Review
              </Link>
            </div>

            <div className="bg-surface-2/80 p-4 rounded-2xl border border-line flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white">Pending Compliance Documents</div>
                <div className="text-subtle">12 trade licenses and pilot certificates require approval.</div>
              </div>
              <Link to="/admin/documents" className="bg-accent hover:bg-accent text-white font-bold px-3.5 py-2 rounded-xl shrink-0">
                Inspect
              </Link>
            </div>

            <div className="bg-surface-2/80 p-4 rounded-2xl border border-line flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white">Unresolved Customer Complaints</div>
                <div className="text-subtle">3 support tickets flagged for admin escalation.</div>
              </div>
              <Link to="/admin/complaints" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-2 rounded-xl shrink-0">
                Resolve
              </Link>
            </div>
          </div>
        </div>

        {/* PLATFORM ACTIVITY TIMELINE (6 Cols) */}
        <div className="lg:col-span-6 bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <h3 className="text-lg font-bold text-fg">
            Recent Platform Activity Audit Log
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-line ml-2">
            {adminActivities.map((act) => (
              <div key={act.id} className="relative pl-6 space-y-1">
                <span className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-fg text-sm">{act.title}</span>
                  <span className="text-subtle font-medium">{act.time}</span>
                </div>
                <p className="text-xs text-muted">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default SuperAdminOverview
