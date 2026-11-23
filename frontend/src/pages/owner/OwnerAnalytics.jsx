import React, { useState, useMemo } from 'react'
import { Building2, CreditCard, Calendar, Navigation, Users, ShieldAlert, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ownerAnalyticsData } from '../../data/analytics'
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import RevenueChart from '../../components/analytics/RevenueChart'
import BookingAnalyticsChart from '../../components/analytics/BookingAnalyticsChart'
import DroneUtilizationChart from '../../components/analytics/DroneUtilizationChart'
import RevenueDistributionChart from '../../components/analytics/RevenueDistributionChart'
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters'
import PopularDronesTable from '../../components/analytics/PopularDronesTable'
import { exportToCSV } from '../../utils/exportCsv'

/*
  DATA SECURITY & MULTI-TENANT RULE:
  Shop Owner analytics must filter strictly for shopId === currentUser.shopId.
  Shop Owner must NEVER see other shops' revenue, analytics, or drone performance.
*/

function OwnerAnalytics() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101 // SkyRent Bengaluru

  const [dateRange, setDateRange] = useState('This Month')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // MULTI-TENANT ISOLATED DATA:
  // In real backend API: GET /api/owner/analytics?shop_id=${currentUser.shopId}
  const analytics = ownerAnalyticsData

  // Filtered drone performance records
  const filteredDrones = useMemo(() => {
    return analytics.dronePerformanceTable.filter((item) => {
      const matchesSearch =
        item.drone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [analytics, searchTerm, statusFilter, categoryFilter])

  // Calculate gross revenue sum using Array.reduce()
  const grossRevenue = useMemo(() => {
    return analytics.dronePerformanceTable.reduce((sum, item) => sum + item.revenue, 0)
  }, [analytics])

  const handleExportCSV = () => {
    exportToCSV(filteredDrones, `shop-${shopId}-drone-performance.csv`)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER */}
      <AnalyticsHeader
        title="Shop Analytics"
        subtitle={`Monitor your shop's rental performance, fleet utilization, and gross revenue.`}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* SHOP OWNER KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsStatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          change="+18.4%"
          isPositive={true}
          icon={CreditCard}
          colorScheme="emerald"
          subtitle="Monthly gross billing"
        />

        <AnalyticsStatCard
          title="Total Bookings"
          value={analytics.totalBookings}
          change="+15.2%"
          isPositive={true}
          icon={Calendar}
          colorScheme="purple"
          subtitle="Customer reservations"
        />

        <AnalyticsStatCard
          title="Active Rentals"
          value={analytics.activeRentals}
          change="Currently dispatched"
          isPositive={true}
          icon={Navigation}
          colorScheme="blue"
          subtitle="In flight / deployed"
        />

        <AnalyticsStatCard
          title="Total Customers"
          value={analytics.totalCustomers}
          change="+12 new"
          isPositive={true}
          icon={Users}
          colorScheme="amber"
          subtitle="Repeat & new renters"
        />

        <AnalyticsStatCard
          title="Fleet Drones"
          value={analytics.totalDrones}
          change="92% active"
          isPositive={true}
          icon={Building2}
          colorScheme="rose"
          subtitle="Catalog inventory"
        />

        <AnalyticsStatCard
          title="Average Rental Value"
          value={`₹${analytics.avgRentalValue.toLocaleString()}`}
          change="+6.8%"
          isPositive={true}
          icon={Award}
          colorScheme="emerald"
          subtitle="Per booking ticket"
        />
      </div>

      {/* CHARTS GRID 1: REVENUE & BOOKING TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Overview (7 cols) */}
        <div className="lg:col-span-7">
          <RevenueChart
            data={analytics.monthlyRevenue}
            title="Shop Revenue Overview"
            subtitle="Monthly gross billing revenue trajectory vs prior period"
          />
        </div>

        {/* Revenue by Category (5 cols) */}
        <div className="lg:col-span-5">
          <RevenueDistributionChart
            data={analytics.categoryRevenue}
            title="Revenue by Drone Category"
            subtitle="Billing share across camera, survey, and FPV drones"
          />
        </div>

      </div>

      {/* CHARTS GRID 2: FLEET UTILIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6">
          <DroneUtilizationChart
            data={analytics.droneUtilization}
            title="Shop Drone Utilization Rate"
            subtitle="Flight hours and deployment percentage across top fleet models"
          />
        </div>

        <div className="lg:col-span-6">
          <BookingAnalyticsChart
            data={analytics.monthlyRevenue.map(m => ({ ...m, bookings: m.bookings }))}
            title="Shop Booking Trends"
            subtitle="Monthly completed vs active booking volume"
          />
        </div>

      </div>

      {/* PERFORMANCE TABLE & FILTERS */}
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

        <PopularDronesTable
          data={filteredDrones.map((d, idx) => ({
            droneId: d.id,
            droneName: d.drone,
            category: d.category,
            totalRentals: d.totalRentals,
            rentalHours: d.rentalHours,
            revenue: d.revenue,
            utilization: d.utilization,
            status: d.status
          }))}
          title="Shop Drone Fleet Performance"
          subtitle="Detailed catalog utilization, flight hours, and revenue metrics"
        />
      </div>

    </div>
  )
}

export default OwnerAnalytics
