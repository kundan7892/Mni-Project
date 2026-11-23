// Super Admin Platform-Wide Mock Data (Phase 8)

/*
  DEVELOPER NOTE:
  This Super Admin dashboard is a frontend prototype.
  Real authorization must be enforced by the backend.
  Frontend role checks and mock data filtering do not provide real security.
  When the backend is connected, every admin action must be validated server-side.
*/

// All Platform Shops
export const initialAdminShops = [
  {
    shopId: 101,
    name: "SkyRent Bengaluru",
    ownerName: "SkyRent Owner",
    ownerEmail: "owner@dronehub.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    address: "42 Indiranagar 100ft Road, Bengaluru",
    city: "Bengaluru",
    dronesCount: 24,
    activeRentalsCount: 5,
    customersCount: 142,
    revenue: 1845000,
    status: "Active", // Active, Suspended, Pending, Inactive
    verification: "Verified", // Verified, Pending, Rejected
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    joinedDate: "2025-01-10"
  },
  {
    shopId: 102,
    name: "AeroTech Mumbai",
    ownerName: "AeroRent Owner",
    ownerEmail: "owner2@dronehub.com",
    phone: "+91 98123 45678",
    location: "Mumbai, Maharashtra",
    address: "18 Bandra Kurla Complex, Mumbai",
    city: "Mumbai",
    dronesCount: 18,
    activeRentalsCount: 4,
    customersCount: 98,
    revenue: 1420000,
    status: "Active",
    verification: "Verified",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    joinedDate: "2025-02-01"
  },
  {
    shopId: 103,
    name: "GeoSpatial Fleet Delhi",
    ownerName: "Amitabh Sen",
    ownerEmail: "amitabh@geodelhi.com",
    phone: "+91 98999 12345",
    location: "New Delhi, Delhi",
    address: "10 Connaught Place, New Delhi",
    city: "New Delhi",
    dronesCount: 14,
    activeRentalsCount: 2,
    customersCount: 64,
    revenue: 980000,
    status: "Pending",
    verification: "Pending",
    logo: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80",
    rating: 4.6,
    joinedDate: "2026-08-20"
  },
  {
    shopId: 104,
    name: "Pune Aero Rentals",
    ownerName: "Rajesh Kulkarni",
    ownerEmail: "rajesh@puneaero.com",
    phone: "+91 97654 32109",
    location: "Pune, Maharashtra",
    address: "24 FC Road, Deccan Gymkhana, Pune",
    city: "Pune",
    dronesCount: 12,
    activeRentalsCount: 0,
    customersCount: 45,
    revenue: 650000,
    status: "Suspended",
    verification: "Verified",
    logo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=200&q=80",
    rating: 4.2,
    joinedDate: "2025-05-15"
  }
]

// All Platform Shop Owners
export const initialAdminShopOwners = [
  {
    id: 2,
    name: "SkyRent Owner",
    email: "owner@dronehub.com",
    phone: "+91 98765 43210",
    shopId: 101,
    shopName: "SkyRent Bengaluru",
    joinedDate: "2025-01-10",
    status: "Active",
    verification: "Verified",
    totalRevenue: 1845000
  },
  {
    id: 4,
    name: "AeroRent Owner",
    email: "owner2@dronehub.com",
    phone: "+91 98123 45678",
    shopId: 102,
    shopName: "AeroTech Mumbai",
    joinedDate: "2025-02-01",
    status: "Active",
    verification: "Verified",
    totalRevenue: 1420000
  },
  {
    id: 5,
    name: "Amitabh Sen",
    email: "amitabh@geodelhi.com",
    phone: "+91 98999 12345",
    shopId: 103,
    shopName: "GeoSpatial Fleet Delhi",
    joinedDate: "2026-08-20",
    status: "Pending",
    verification: "Pending",
    totalRevenue: 980000
  },
  {
    id: 6,
    name: "Rajesh Kulkarni",
    email: "rajesh@puneaero.com",
    phone: "+91 97654 32109",
    shopId: 104,
    shopName: "Pune Aero Rentals",
    joinedDate: "2025-05-15",
    status: "Suspended",
    verification: "Verified",
    totalRevenue: 650000
  }
]

// All Platform Customers
export const initialAdminCustomers = [
  {
    id: "CUST-001",
    name: "Kartikey Sharma",
    email: "user@dronehub.com",
    phone: "+91 98765 43210",
    totalRentals: 8,
    totalSpent: 77200,
    joinedDate: "2025-08-15",
    status: "Active",
    city: "Bengaluru"
  },
  {
    id: "CUST-101",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 11111",
    totalRentals: 6,
    totalSpent: 48500,
    joinedDate: "2025-09-01",
    status: "Active",
    city: "Bengaluru"
  },
  {
    id: "CUST-102",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 98765 22222",
    totalRentals: 4,
    totalSpent: 32000,
    joinedDate: "2025-10-12",
    status: "Active",
    city: "Bengaluru"
  },
  {
    id: "CUST-201",
    name: "Karan Verma",
    email: "karan@example.com",
    phone: "+91 98123 11111",
    totalRentals: 5,
    totalSpent: 74000,
    joinedDate: "2025-11-05",
    status: "Active",
    city: "Mumbai"
  },
  {
    id: "CUST-301",
    name: "Siddharth Mehta",
    email: "sid@example.com",
    phone: "+91 98222 99999",
    totalRentals: 1,
    totalSpent: 4500,
    joinedDate: "2026-08-01",
    status: "Suspended",
    city: "Delhi"
  }
]

// All Platform Complaints
export const initialAdminComplaints = [
  {
    id: "CMP-801",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@example.com",
    shopName: "SkyRent Bengaluru",
    bookingId: "DRN-10452",
    subject: "Battery Charge Depleted Faster than Spec",
    date: "2026-08-29",
    priority: "High", // Low, Medium, High, Critical
    status: "In Progress", // Open, In Progress, Resolved, Closed
    assignedTo: "Admin Support Team",
    description: "Battery dropped from 100% to 15% in 12 minutes during flight mission."
  },
  {
    id: "CMP-802",
    customerName: "Siddharth Mehta",
    customerEmail: "sid@example.com",
    shopName: "Pune Aero Rentals",
    bookingId: "DRN-30101",
    subject: "Security Deposit Refund Delay",
    date: "2026-08-25",
    priority: "Critical",
    status: "Open",
    assignedTo: "Unassigned",
    description: "Equipment returned 5 days ago, but security deposit refund has not been credited to bank account."
  },
  {
    id: "CMP-803",
    customerName: "Priya Patel",
    customerEmail: "priya@example.com",
    shopName: "AeroTech Mumbai",
    bookingId: "DRN-10453",
    subject: "FPV Goggles HDMI Port Signal Flaky",
    date: "2026-08-20",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Technical Operations",
    description: "Video downlink cable was tight. Shop provided replacement cable free of charge."
  }
]

// Platform Revenue Chart Data (6 Months)
export const platformRevenueData = [
  { month: "Jan", revenue: 1850000, shopPayouts: 1665000, commission: 185000 },
  { month: "Feb", revenue: 2040000, shopPayouts: 1836000, commission: 204000 },
  { month: "Mar", revenue: 2280000, shopPayouts: 2052000, commission: 228000 },
  { month: "Apr", revenue: 2420000, shopPayouts: 2178000, commission: 242000 },
  { month: "May", revenue: 2670000, shopPayouts: 2403000, commission: 267000 },
  { month: "Jun", revenue: 2845000, shopPayouts: 2560500, commission: 284500 }
]

// User Growth Chart Data (6 Months)
export const userGrowthData = [
  { month: "Jan", customers: 1200, shopOwners: 28 },
  { month: "Feb", customers: 1550, shopOwners: 32 },
  { month: "Mar", customers: 1900, shopOwners: 36 },
  { month: "Apr", customers: 2250, shopOwners: 40 },
  { month: "May", customers: 2580, shopOwners: 44 },
  { month: "Jun", customers: 2846, shopOwners: 48 }
]

// Booking Status Pie Data
export const bookingStatusDistribution = [
  { name: "Completed", value: 65, color: "#34d399" },
  { name: "Active", value: 18, color: "#5b5bd6" },
  { name: "Pending", value: 12, color: "#fbbf24" },
  { name: "Cancelled", value: 5, color: "#fb7185" }
]

// Admin Platform Timeline Activities
export const adminActivities = [
  { id: 1, title: "New Shop Registered", desc: "GeoSpatial Fleet Delhi requested storefront verification.", time: "15 mins ago", type: "shop" },
  { id: 2, title: "Shop Verification Approved", desc: "SkyRent Bengaluru store clearance renewed.", time: "2 hours ago", type: "approval" },
  { id: 3, title: "Platform Commission Settlement", desc: "₹2,84,500 monthly platform fee credited to admin account.", time: "1 day ago", type: "finance" },
  { id: 4, title: "Customer Suspended", desc: "Siddharth Mehta account suspended for late return violation.", time: "2 days ago", type: "alert" },
  { id: 5, title: "Shop Suspended", desc: "Pune Aero Rentals suspended due to pending compliance documents.", time: "3 days ago", type: "alert" }
]
