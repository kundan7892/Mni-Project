// DroneHub Mock Notifications Dataset (Phase 11)
// Contains 25+ realistic notifications covering Customer, Shop Owner, and Super Admin roles

/*
  DATA SECURITY & MULTI-TENANT RULE:
  Notifications must be filtered by role, userId, and shopId.
  A customer must NEVER see another customer's notifications.
  A shop owner must NEVER see another shop's notifications.
  Super Admin can monitor platform-level notifications.
*/

export const initialNotifications = [
  // --- CUSTOMER NOTIFICATIONS (userId: 3) ---
  {
    id: "NOTIF-101",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your DJI Mavic 3 Pro booking (DRN-10452) has been confirmed by SkyRent Bengaluru.",
    status: "unread",
    priority: "important",
    createdAt: "2026-09-03T10:30:00",
    relatedId: "DRN-10452",
    link: "/user/bookings"
  },
  {
    id: "NOTIF-102",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "payment",
    title: "Payment Successful",
    message: "Payment of ₹7,500 received for rental booking DRN-10452 via UPI / QR.",
    status: "unread",
    priority: "normal",
    createdAt: "2026-09-03T10:32:00",
    relatedId: "PAY-90412",
    link: "/user/payments"
  },
  {
    id: "NOTIF-103",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "tracking",
    title: "Low Battery Warning",
    message: "Drone battery for DJI Mavic 3 Pro has dropped below 20%. Return-to-Home advised.",
    status: "unread",
    priority: "critical",
    createdAt: "2026-09-03T11:15:00",
    relatedId: "DRN-10452",
    link: "/user/tracking"
  },
  {
    id: "NOTIF-104",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "document",
    title: "Government ID Verified",
    message: "Your Aadhaar / Driving License KYC document has been approved by platform compliance.",
    status: "read",
    priority: "normal",
    createdAt: "2026-09-02T14:20:00",
    relatedId: "DOC-501",
    link: "/user/documents"
  },
  {
    id: "NOTIF-105",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "rental",
    title: "Rental Mission Started",
    message: "Your rented DJI Avata 2 FPV drone is now in flight.",
    status: "read",
    priority: "normal",
    createdAt: "2026-09-01T09:00:00",
    relatedId: "RNT-102",
    link: "/user/rentals"
  },
  {
    id: "NOTIF-106",
    userId: 3,
    shopId: 101,
    role: "customer",
    type: "promotion",
    title: "Weekend Festive Offer ",
    message: "Get 20% flat discount on 4K Cinema Drones this weekend. Use code FLYHIGH20.",
    status: "read",
    priority: "normal",
    createdAt: "2026-08-30T12:00:00",
    relatedId: "PROMO-20",
    link: "/drones"
  },

  // --- SHOP OWNER NOTIFICATIONS (shopId: 101) ---
  {
    id: "NOTIF-201",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "booking",
    title: "New Booking Received",
    message: "Rahul Sharma placed a new booking (DRN-10452) for DJI Mavic 3 Pro.",
    status: "unread",
    priority: "important",
    createdAt: "2026-09-03T10:29:00",
    relatedId: "DRN-10452",
    link: "/owner/bookings"
  },
  {
    id: "NOTIF-202",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "payment",
    title: "Payment Credited",
    message: "₹7,500 payment credited to your shop account for booking DRN-10452.",
    status: "unread",
    priority: "normal",
    createdAt: "2026-09-03T10:32:00",
    relatedId: "PAY-90412",
    link: "/owner/payments"
  },
  {
    id: "NOTIF-203",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "tracking",
    title: "Geofence Alert Triggered",
    message: "Dispatched drone DJI Phantom 4 RTK approached restricted airspace buffer.",
    status: "unread",
    priority: "critical",
    createdAt: "2026-09-03T11:05:00",
    relatedId: "DRN-10454",
    link: "/owner/tracking"
  },
  {
    id: "NOTIF-204",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "review",
    title: "New 5-Star Review ",
    message: "Ananya Deshmukh gave SkyRent Bengaluru a 5-star review for Inspire 3 rental.",
    status: "read",
    priority: "normal",
    createdAt: "2026-09-02T16:45:00",
    relatedId: "REV-301",
    link: "/owner/reviews"
  },
  {
    id: "NOTIF-205",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "drone",
    title: "Maintenance Reminder",
    message: "DJI Matrice 300 RTK has completed 180 flight hours and is due for motor inspection.",
    status: "read",
    priority: "important",
    createdAt: "2026-09-01T15:00:00",
    relatedId: "DRN-105",
    link: "/owner/drones"
  },
  {
    id: "NOTIF-206",
    userId: 2,
    shopId: 101,
    role: "shop-owner",
    type: "complaint",
    title: "Customer Support Inquiry",
    message: "Customer Vikram Malhotra requested assistance regarding gimbal calibration.",
    status: "read",
    priority: "normal",
    createdAt: "2026-08-31T11:20:00",
    relatedId: "CMP-108",
    link: "/owner/bookings"
  },

  // --- SUPER ADMIN NOTIFICATIONS (super-admin) ---
  {
    id: "NOTIF-301",
    userId: 1,
    shopId: null,
    role: "super-admin",
    type: "system",
    title: "New Storefront Approval Request",
    message: "Pune Aero Rentals submitted verification documents for shop onboarding.",
    status: "unread",
    priority: "important",
    createdAt: "2026-09-03T09:15:00",
    relatedId: "SHOP-105",
    link: "/admin/shops"
  },
  {
    id: "NOTIF-302",
    userId: 1,
    shopId: null,
    role: "super-admin",
    type: "tracking",
    title: "Critical Telemetry Offline",
    message: "Drone DRN-30188 (Noida Sector 62) lost telemetry signal for over 8 minutes.",
    status: "unread",
    priority: "critical",
    createdAt: "2026-09-03T10:45:00",
    relatedId: "DRN-30188",
    link: "/admin/tracking"
  },
  {
    id: "NOTIF-303",
    userId: 1,
    shopId: null,
    role: "super-admin",
    type: "payment",
    title: "Platform Milestone Reached ",
    message: "Gross platform billing exceeded ₹24,85,000 across 24 partner shops.",
    status: "unread",
    priority: "normal",
    createdAt: "2026-09-03T08:00:00",
    relatedId: "MILE-10",
    link: "/admin/analytics"
  },
  {
    id: "NOTIF-304",
    userId: 1,
    shopId: null,
    role: "super-admin",
    type: "complaint",
    title: "High Priority Complaint Escalate",
    message: "Complaint #CMP-402 regarding billing dispute escalated to Admin compliance.",
    status: "read",
    priority: "important",
    createdAt: "2026-09-02T13:10:00",
    relatedId: "CMP-402",
    link: "/admin/complaints"
  },
  {
    id: "NOTIF-305",
    userId: 1,
    shopId: null,
    role: "super-admin",
    type: "security",
    title: "Admin Security Check Passed",
    message: "Automated monthly security scan completed with 0 vulnerability flags.",
    status: "read",
    priority: "normal",
    createdAt: "2026-09-01T00:00:00",
    relatedId: "SEC-101",
    link: "/admin/settings"
  }
];

export default initialNotifications;
