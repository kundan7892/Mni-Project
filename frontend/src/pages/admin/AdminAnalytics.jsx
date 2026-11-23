import React, { useState, useMemo } from 'react'
import { Building2, CreditCard, Calendar, Navigation, Users, ShieldAlert, TrendingUp, Award, Layers } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { 
  monthlyRevenue, 
  categoryPerformance, 
  shopPerformance, 
  topDronesData, 
  customerGrowthData, 
  bookingStatusData 
} from '../../data/analytics'
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import RevenueChart from '../../components/analytics/RevenueChart'
import BookingAnalyticsChart from '../../components/analytics/BookingAnalyticsChart'
import DroneUtilizationChart from '../../components/analytics/DroneUtilizationChart'
import RevenueDistributionChart from '../../components/analytics/RevenueDistributionChart'
import CustomerGrowthChart from '../../components/analytics/CustomerGrowthChart'
import BookingStatusChart from '../../components/analytics/BookingStatusChart'
import ShopPerformanceTable from '../../components/analytics/ShopPerformanceTable'
import PopularDronesTable from '../../components/analytics/PopularDronesTable'
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters'
import { exportToCSV } from '../../utils/exportCsv'

/*
  SUPER ADMIN PLATFORM COMMAND STREAM:
  Super Admin can monitor platform-wide analytics across all partner shops,
  all customer registrations, and all drone inventory.
*/

function AdminAnalytics() {
  const { currentUser } = useAuth()

  const [dateRange, setDateRange] = useState('This Month')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [shopFilter, setShopFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Extract unique shop names list for Admin Filter dropdown
  const shopsList = useMemo(() => {
    return shopPerformance.map(s => s.shopName)
  }, [])

  // Filtered Shop Performance Table
  const filteredShops = useMemo(() => {
    return shopPerformance.filter((s) => {
      const matchesSearch = s.shopName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesShop = shopFilter === 'All' || s.shopName === shopFilter
      return matchesSearch && matchesShop
    })
  }, [searchTerm, shopFilter])

  // Filtered Top Drones Table
  const filteredDrones = useMemo(() => {
    return topDronesData.filter((d) => {
      const matchesSearch = d.droneName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter
      const matchesShop = shopFilter === 'All' || d.shopName === shopFilter
      return matchesSearch && matchesCategory && matchesShop
    })
  }, [searchTerm, categoryFilter, shopFilter])

  // Calculate platform totals using Array.reduce()
  const platformRevenueTotal = useMemo(() => {
    return monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0)
  }, [])

  const handleExportCSV = () => {
    exportToCSV(shopPerformance, 'dronehub-platform-shop-performance.csv')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER */}
      <AnalyticsHeader
        title="Platform Analytics"
        subtitle="Monitor DroneHub's complete platform performance, revenue growth, and multi-tenant metrics."
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* SUPER ADMIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          title="Platform Revenue"
          value="₹24,85,000"
          change="+18.6%"
          isPositive={true}
          icon={CreditCard}
          colorScheme="emerald"
          subtitle="Gross 12-month billing"
        />

        <AnalyticsStatCard
          title="Partner Shops"
          value="24 Stores"
          change="+4 this qtr"
          isPositive={true}
          icon={Building2}
          colorScheme="purple"
          subtitle="Multi-tenant storefronts"
        />

        <AnalyticsStatCard
          title="Total Customers"
          value="2,840"
          change="+240 this mo"
          isPositive={true}
          icon={Users}
          colorScheme="blue"
          subtitle="Registered accounts"
        />

        <AnalyticsStatCard
          title="Drone Inventory"
          value="580 Units"
          change="88% utilization"
          isPositive={true}
          icon={Navigation}
          colorScheme="amber"
          subtitle="Active fleet models"
        />

        <AnalyticsStatCard
          title="Total Bookings"
          value="6,420"
          change="+14.2%"
          isPositive={true}
          icon={Calendar}
          colorScheme="blue"
          subtitle="Completed missions"
        />

        <AnalyticsStatCard
          title="Active Rentals"
          value="184 Units"
          change="Currently deployed"
          isPositive={true}
          icon={TrendingUp}
          colorScheme="emerald"
          subtitle="In flight nationwide"
        />

        <AnalyticsStatCard
          title="Monthly Growth"
          value="+18.6%"
          change="Ahead of target"
          isPositive={true}
          icon={Award}
          colorScheme="purple"
          subtitle="Platform expansion"
        />

        <AnalyticsStatCard
          title="Avg Booking Value"
          value="₹4,120"
          change="+5.4%"
          isPositive={true}
          icon={CreditCard}
          colorScheme="amber"
          subtitle="Per reservation ticket"
        />
      </div>

      {/* CHARTS GRID 1: PLATFORM REVENUE & BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Platform Revenue Chart (7 cols) */}
        <div className="lg:col-span-7">
          <RevenueChart
            data={monthlyRevenue}
            title="Nationwide Platform Revenue"
            subtitle="12-month platform gross revenue (₹ INR) trajectory"
          />
        </div>

        {/* Revenue by Category (5 cols) */}
        <div className="lg:col-span-5">
          <RevenueDistributionChart
            data={categoryPerformance}
            title="Revenue by Category"
            subtitle="Billing share across camera, survey, and agricultural drones"
          />
        </div>

      </div>

      {/* CHARTS GRID 2: CUSTOMER GROWTH & BOOKING STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6">
          <CustomerGrowthChart
            data={customerGrowthData}
            title="Customer Base Growth"
            subtitle="Monthly registered user accounts and active renters"
          />
        </div>

        <div className="lg:col-span-6">
          <BookingStatusChart
            data={bookingStatusData}
            title="Platform Booking Status"
            subtitle="Status distribution (Completed, Confirmed, Active, Cancelled)"
          />
        </div>

      </div>

      {/* FILTERS FOR TABLES */}
      <AnalyticsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        shopFilter={shopFilter}
        onShopChange={setShopFilter}
        showShopFilter={true}
        shopsList={shopsList}
      />

      {/* TOP PERFORMING SHOPS RANKING TABLE */}
      <ShopPerformanceTable
        data={filteredShops}
        title="Top Performing Partner Shops"
        subtitle="Ranked storefronts by gross billing, total drones, and customer volume"
      />

      {/* TOP PERFORMING DRONES TABLE */}
      <PopularDronesTable
        data={filteredDrones}
        title="Top Performing Platform Drones"
        subtitle="Nationwide most rented drone models by flight hours and gross revenue"
      />

    </div>
  )
}

export default AdminAnalytics
