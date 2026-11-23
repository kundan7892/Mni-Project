// DroneHub Mock Analytics & Reporting Dataset (Phase 10)
// Provides comprehensive data arrays for Customer, Shop Owner, and Super Admin analytics dashboards

export const monthlyRevenue = [
  { month: "Jan", revenue: 145000, previousRevenue: 132000, bookings: 32, growth: "+9.8%" },
  { month: "Feb", revenue: 168000, previousRevenue: 145000, bookings: 38, growth: "+15.8%" },
  { month: "Mar", revenue: 192000, previousRevenue: 168000, bookings: 44, growth: "+14.2%" },
  { month: "Apr", revenue: 215000, previousRevenue: 192000, bookings: 51, growth: "+11.9%" },
  { month: "May", revenue: 248000, previousRevenue: 215000, bookings: 59, growth: "+15.3%" },
  { month: "Jun", revenue: 275000, previousRevenue: 248000, bookings: 64, growth: "+10.8%" },
  { month: "Jul", revenue: 298000, previousRevenue: 275000, bookings: 72, growth: "+8.3%" },
  { month: "Aug", revenue: 325000, previousRevenue: 298000, bookings: 79, growth: "+9.0%" },
  { month: "Sep", revenue: 350000, previousRevenue: 325000, bookings: 86, growth: "+7.6%" },
  { month: "Oct", revenue: 385000, previousRevenue: 350000, bookings: 94, growth: "+10.0%" },
  { month: "Nov", revenue: 412000, previousRevenue: 385000, bookings: 102, growth: "+7.0%" },
  { month: "Dec", revenue: 450000, previousRevenue: 412000, bookings: 115, growth: "+9.2%" }
]

export const categoryPerformance = [
  { category: "Camera Drone", revenue: 845000, rentals: 240, utilization: 88, color: "#5b5bd6" },
  { category: "Survey & Mapping", revenue: 680000, rentals: 142, utilization: 82, color: "#34d399" },
  { category: "Agricultural Spraying", revenue: 520000, rentals: 98, utilization: 75, color: "#8b8ce8" },
  { category: "FPV & Cinematic", revenue: 410000, rentals: 186, utilization: 91, color: "#fbbf24" },
  { category: "Industrial Heavy Lift", revenue: 395000, rentals: 64, utilization: 68, color: "#c4c5f7" }
]

export const shopPerformance = [
  { rank: 1, shopId: 101, shopName: "SkyRent Bengaluru", totalDrones: 24, customers: 142, bookings: 184, rentals: 168, revenue: 1845000, growth: "+18.4%", rating: 4.9, status: "Active" },
  { rank: 2, shopId: 102, shopName: "AeroTech Mumbai", totalDrones: 18, customers: 118, bookings: 142, rentals: 130, revenue: 1420000, growth: "+15.2%", rating: 4.8, status: "Active" },
  { rank: 3, shopId: 103, shopName: "GeoSpatial Fleet Delhi", totalDrones: 15, customers: 94, bookings: 98, rentals: 88, revenue: 980000, growth: "+12.6%", rating: 4.6, status: "Active" },
  { rank: 4, shopId: 104, shopName: "SkyFleet Hyderabad", totalDrones: 12, customers: 76, bookings: 82, rentals: 74, revenue: 780000, growth: "+9.8%", rating: 4.5, status: "Active" },
  { rank: 5, shopId: 105, shopName: "Pune Aero Rentals", totalDrones: 10, customers: 58, bookings: 65, rentals: 59, revenue: 650000, growth: "+8.4%", rating: 4.2, status: "Active" }
]

export const topDronesData = [
  { rank: 1, droneId: 101, droneName: "DJI Mavic 3 Pro", shopId: 101, shopName: "SkyRent Bengaluru", category: "Camera Drone", totalRentals: 68, rentalHours: 410, revenue: 680000, utilization: 94, rating: 4.9, status: "Available" },
  { rank: 2, droneId: 103, droneName: "DJI Inspire 3 Cinema 8K", shopId: 102, shopName: "AeroTech Mumbai", category: "FPV & Cinematic", totalRentals: 42, rentalHours: 320, revenue: 1050000, utilization: 89, rating: 4.9, status: "Rented" },
  { rank: 3, droneId: 104, droneName: "DJI Mini 4 Pro Fly More", shopId: 101, shopName: "SkyRent Bengaluru", category: "Camera Drone", totalRentals: 54, rentalHours: 290, revenue: 540000, utilization: 91, rating: 4.8, status: "Available" },
  { rank: 4, droneId: 106, droneName: "DJI Phantom 4 RTK", shopId: 103, shopName: "GeoSpatial Fleet Delhi", category: "Survey & Mapping", totalRentals: 32, rentalHours: 240, revenue: 480000, utilization: 82, rating: 4.7, status: "Rented" },
  { rank: 5, droneId: 108, droneName: "DJI Agras T40 Heavy", shopId: 104, shopName: "SkyFleet Hyderabad", category: "Agricultural Spraying", totalRentals: 28, rentalHours: 210, revenue: 620000, utilization: 78, rating: 4.6, status: "Available" }
]

export const customerGrowthData = [
  { month: "Jan", customers: 120, activeUsers: 85 },
  { month: "Feb", customers: 165, activeUsers: 110 },
  { month: "Mar", customers: 210, activeUsers: 145 },
  { month: "Apr", customers: 280, activeUsers: 190 },
  { month: "May", customers: 360, activeUsers: 240 },
  { month: "Jun", customers: 450, activeUsers: 310 },
  { month: "Jul", customers: 580, activeUsers: 390 },
  { month: "Aug", customers: 720, activeUsers: 480 },
  { month: "Sep", customers: 890, activeUsers: 590 },
  { month: "Oct", customers: 1100, activeUsers: 720 },
  { month: "Nov", customers: 1350, activeUsers: 880 },
  { month: "Dec", customers: 1620, activeUsers: 1050 }
]

export const bookingStatusData = [
  { status: "Completed", count: 4120, percentage: 64, color: "#34d399" },
  { status: "Active", count: 184, percentage: 3, color: "#5b5bd6" },
  { status: "Confirmed", count: 1240, percentage: 19, color: "#8b8ce8" },
  { status: "Pending", count: 560, percentage: 9, color: "#fbbf24" },
  { status: "Cancelled", count: 316, percentage: 5, color: "#fb7185" }
]

export const paymentStatsData = {
  totalRevenue: 2485000,
  successfulPayments: 6104,
  pendingPayments: 182,
  refundedPayments: 134,
  methods: [
    { name: "UPI / QR", percentage: 48, amount: 1192800 },
    { name: "Credit / Debit Card", percentage: 32, amount: 795200 },
    { name: "Net Banking", percentage: 14, amount: 347900 },
    { name: "Wallet", percentage: 6, amount: 149100 }
  ]
}

// CUSTOMER SPECIFIC ANALYTICS DATA (For Customer ID 3 / Demo Customer)
export const customerAnalyticsData = {
  totalSpent: 48500,
  totalBookings: 12,
  completedRentals: 8,
  totalRentalDays: 24,
  monthlySpending: [
    { month: "Jan", amount: 4500, rentals: 1 },
    { month: "Feb", amount: 0, rentals: 0 },
    { month: "Mar", amount: 6200, rentals: 2 },
    { month: "Apr", amount: 3800, rentals: 1 },
    { month: "May", amount: 8400, rentals: 2 },
    { month: "Jun", amount: 5200, rentals: 1 },
    { month: "Jul", amount: 0, rentals: 0 },
    { month: "Aug", amount: 7600, rentals: 2 },
    { month: "Sep", amount: 4800, rentals: 1 },
    { month: "Oct", amount: 8000, rentals: 2 }
  ],
  durationDistribution: [
    { duration: "1-2 Days", count: 5, color: "#5b5bd6" },
    { duration: "3-5 Days", count: 4, color: "#34d399" },
    { duration: "1 Week", count: 2, color: "#8b8ce8" },
    { duration: "2+ Weeks", count: 1, color: "#fbbf24" }
  ],
  categoryDistribution: [
    { category: "Camera Drone", count: 6, percentage: 50, color: "#5b5bd6" },
    { category: "FPV & Cinematic", count: 4, percentage: 33, color: "#fbbf24" },
    { category: "Survey Drone", count: 2, percentage: 17, color: "#34d399" }
  ],
  rentalPerformance: [
    { id: "RNT-101", drone: "DJI Mavic 3 Pro", category: "Camera Drone", date: "15 Oct 2026", duration: "3 Days", amount: 7500, status: "Active" },
    { id: "RNT-102", drone: "DJI Avata 2 FPV", category: "FPV & Cinematic", date: "28 Sep 2026", duration: "2 Days", amount: 4800, status: "Completed" },
    { id: "RNT-103", drone: "DJI Phantom 4 RTK", category: "Survey Drone", date: "12 Aug 2026", duration: "5 Days", amount: 12500, status: "Completed" },
    { id: "RNT-104", drone: "DJI Mini 4 Pro", category: "Camera Drone", date: "04 Aug 2026", duration: "1 Day", amount: 1800, status: "Completed" },
    { id: "RNT-105", drone: "Autel EVO II Dual", category: "Survey Drone", date: "18 Jun 2026", duration: "2 Days", amount: 5200, status: "Completed" },
    { id: "RNT-106", drone: "DJI Inspire 3", category: "FPV & Cinematic", date: "22 May 2026", duration: "3 Days", amount: 16700, status: "Completed" }
  ]
}

// SHOP OWNER SPECIFIC ANALYTICS DATA (For Shop ID 101 / SkyRent Bengaluru)
export const ownerAnalyticsData = {
  totalRevenue: 385000,
  totalBookings: 186,
  activeRentals: 14,
  totalCustomers: 92,
  totalDrones: 24,
  avgRentalValue: 4250,
  monthlyRevenue: [
    { month: "May", revenue: 28000, previousRevenue: 24000, bookings: 12 },
    { month: "Jun", revenue: 32000, previousRevenue: 28000, bookings: 14 },
    { month: "Jul", revenue: 36000, previousRevenue: 32000, bookings: 16 },
    { month: "Aug", revenue: 42000, previousRevenue: 36000, bookings: 19 },
    { month: "Sep", revenue: 48000, previousRevenue: 42000, bookings: 22 },
    { month: "Oct", revenue: 54000, previousRevenue: 48000, bookings: 25 }
  ],
  droneUtilization: [
    { name: "Mavic 3 Pro", rentals: 68, hours: 410, utilization: 94 },
    { name: "Inspire 3 8K", rentals: 42, hours: 320, utilization: 89 },
    { name: "Mini 4 Pro", rentals: 54, hours: 290, utilization: 91 },
    { name: "Avata 2 FPV", rentals: 38, hours: 210, utilization: 85 },
    { name: "Matrice 300 RTK", rentals: 22, hours: 180, utilization: 72 }
  ],
  categoryRevenue: [
    { category: "Camera Drone", revenue: 165000, percentage: 43, color: "#5b5bd6" },
    { category: "FPV & Cinematic", revenue: 110000, percentage: 28, color: "#fbbf24" },
    { category: "Survey & Mapping", revenue: 70000, percentage: 18, color: "#34d399" },
    { category: "Agricultural Spraying", revenue: 40000, percentage: 11, color: "#8b8ce8" }
  ],
  dronePerformanceTable: [
    { id: "DRN-101", drone: "DJI Mavic 3 Pro", category: "Camera Drone", totalRentals: 68, rentalHours: 410, revenue: 170000, utilization: 94, rating: 4.9, status: "Active" },
    { id: "DRN-102", drone: "DJI Inspire 3 Cinema 8K", category: "FPV & Cinematic", totalRentals: 42, rentalHours: 320, revenue: 126000, utilization: 89, rating: 4.9, status: "Active" },
    { id: "DRN-103", drone: "DJI Mini 4 Pro Fly More", category: "Camera Drone", totalRentals: 54, rentalHours: 290, revenue: 64800, utilization: 91, rating: 4.8, status: "Active" },
    { id: "DRN-104", drone: "DJI Avata 2 FPV Kit", category: "FPV & Cinematic", totalRentals: 38, rentalHours: 210, revenue: 53200, utilization: 85, rating: 4.7, status: "Active" },
    { id: "DRN-105", drone: "DJI Matrice 300 RTK", category: "Survey & Mapping", totalRentals: 22, rentalHours: 180, revenue: 77000, utilization: 72, rating: 4.6, status: "Active" }
  ]
}

export default {
  monthlyRevenue,
  categoryPerformance,
  shopPerformance,
  topDronesData,
  customerGrowthData,
  bookingStatusData,
  paymentStatsData,
  customerAnalyticsData,
  ownerAnalyticsData
}
