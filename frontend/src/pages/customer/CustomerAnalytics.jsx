import React, { useState, useMemo } from 'react'
import { Calendar, CreditCard, Clock, CheckCircle2, Search, Filter } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { customerAnalyticsData } from '../../data/analytics'
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import RevenueChart from '../../components/analytics/RevenueChart'
import BookingAnalyticsChart from '../../components/analytics/BookingAnalyticsChart'
import RevenueDistributionChart from '../../components/analytics/RevenueDistributionChart'
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters'
import { exportToCSV } from '../../utils/exportCsv'

/*
  DATA SECURITY & MULTI-TENANT RULE:
  Customer analytics must filter strictly for customerId === currentUser.id.
  Customer must NEVER see other customers' analytics, payments, or shop revenue.
*/

function CustomerAnalytics() {
  const { currentUser } = useAuth()
  const [dateRange, setDateRange] = useState('This Month')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // MULTI-TENANT DATA ISOLATION:
  // In real backend API: GET /api/customer/analytics?user_id=${currentUser.id}
  const analyticsData = customerAnalyticsData

  // Filtered Rental Performance records
  const filteredRentals = useMemo(() => {
    return analyticsData.rentalPerformance.filter((item) => {
      const matchesSearch =
        item.drone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [analyticsData, searchTerm, statusFilter, categoryFilter])

  // Calculate totals using JavaScript Array.reduce()
  const totalSpent = useMemo(() => {
    return analyticsData.rentalPerformance.reduce((total, r) => total + r.amount, 0)
  }, [analyticsData])

  const handleExportCSV = () => {
    exportToCSV(filteredRentals, 'my-rental-performance.csv')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER */}
      <AnalyticsHeader
        title="My Analytics"
        subtitle="Track your drone rental activity, spending history, and category usage."
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* CUSTOMER KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          change="+12.4%"
          isPositive={true}
          icon={CreditCard}
          colorScheme="emerald"
          subtitle="Lifetime spend"
        />

        <AnalyticsStatCard
          title="Total Bookings"
          value={analyticsData.totalBookings}
          change="+2 this mo"
          isPositive={true}
          icon={Calendar}
          colorScheme="blue"
          subtitle="All bookings"
        />

        <AnalyticsStatCard
          title="Completed Rentals"
          value={analyticsData.completedRentals}
          change="100% success"
          isPositive={true}
          icon={CheckCircle2}
          colorScheme="purple"
          subtitle="Returned safe"
        />

        <AnalyticsStatCard
          title="Total Rental Days"
          value={`${analyticsData.totalRentalDays} Days`}
          change="+6 days"
          isPositive={true}
          icon={Clock}
          colorScheme="amber"
          subtitle="Flight duration"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Spending Over Time Chart (7 cols) */}
        <div className="lg:col-span-7">
          <RevenueChart
            data={analyticsData.monthlySpending.map(m => ({ ...m, revenue: m.amount }))}
            title="Spending Over Time"
            subtitle="Monthly rental expenditure trajectory (₹ INR)"
          />
        </div>

        {/* Category Breakdown Pie Chart (5 cols) */}
        <div className="lg:col-span-5">
          <RevenueDistributionChart
            data={analyticsData.categoryDistribution.map(c => ({ ...c, revenue: c.count }))}
            title="Rented Drone Categories"
            subtitle="Distribution of rented drone types"
            dataKey="revenue"
            nameKey="category"
          />
        </div>

      </div>

      {/* FILTERS & RENTAL PERFORMANCE TABLE */}
      <div className="space-y-4">
        <AnalyticsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          showShopFilter={false}
        />

        {/* PERFORMANCE TABLE */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">My Rental Performance</h3>
            <span className="text-xs font-bold text-subtle">
              Showing {filteredRentals.length} Rentals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Drone Model</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rental Date</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium text-fg-muted">
                {filteredRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent-ink">{r.id}</td>
                    <td className="py-3.5 px-4 font-bold text-fg">{r.drone}</td>
                    <td className="py-3.5 px-4 text-muted">{r.category}</td>
                    <td className="py-3.5 px-4 text-muted">{r.date}</td>
                    <td className="py-3.5 px-4 font-bold text-fg">{r.duration}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-fg">₹{r.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        r.status === 'Active'
                          ? 'bg-accent/10 text-accent-ink border-accent/25'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerAnalytics
