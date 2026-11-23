import React from 'react'
import { LayoutDashboard, Compass, CalendarRange, Radio, Heart, FileText, CreditCard, Bell, BarChart2 } from 'lucide-react'
import DashboardShell from '../components/dashboard/DashboardShell'

const NAV = [
  {
    items: [
      { label: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
      { label: 'Browse drones', path: '/drones', icon: Compass }
    ]
  },
  {
    title: 'Rentals',
    items: [
      { label: 'My rentals', path: '/user/rentals', icon: CalendarRange },
      { label: 'Live tracking', path: '/user/tracking', icon: Radio },
      { label: 'Wishlist', path: '/user/wishlist', icon: Heart }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Documents', path: '/user/documents', icon: FileText },
      { label: 'Payments', path: '/user/payments', icon: CreditCard },
      { label: 'Spending', path: '/user/analytics', icon: BarChart2 },
      { label: 'Notifications', path: '/user/notifications', icon: Bell }
    ]
  }
]

function CustomerLayout({ children }) {
  return (
    <DashboardShell nav={NAV} roleLabel="Customer" basePath="/user" notificationRole="customer" notificationsPath="/user/notifications">
      {children}
    </DashboardShell>
  )
}

export default CustomerLayout
