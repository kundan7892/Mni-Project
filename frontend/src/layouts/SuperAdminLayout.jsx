import React from 'react'
import {
  LayoutDashboard, Inbox, ClipboardList, Package, Users, BarChart2, Radio, Store, UserCheck,
  CreditCard, FileText, Star, AlertCircle, Bell, Files
} from 'lucide-react'
import DashboardShell from '../components/dashboard/DashboardShell'

const NAV = [
  {
    items: [{ label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard }]
  },
  {
    title: 'Rentals',
    items: [
      { label: 'Requests', path: '/admin/requests', icon: Inbox, badgeKey: 'pending' },
      { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
      { label: 'Live tracking', path: '/admin/tracking', icon: Radio }
    ]
  },
  {
    title: 'Store',
    items: [
      { label: 'Catalogue', path: '/admin/catalogue', icon: Package },
      { label: 'Customers', path: '/admin/customers', icon: Users },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 }
    ]
  },
  {
    title: 'Marketplace',
    items: [
      { label: 'Shops', path: '/admin/shops', icon: Store },
      { label: 'Shop owners', path: '/admin/shop-owners', icon: UserCheck },
      { label: 'Payments', path: '/admin/payments', icon: CreditCard },
      { label: 'Reviews', path: '/admin/reviews', icon: Star },
      { label: 'Complaints', path: '/admin/complaints', icon: AlertCircle }
    ]
  },
  {
    title: 'More',
    items: [
      { label: 'Reports', path: '/admin/reports', icon: FileText },
      { label: 'Documents', path: '/admin/documents', icon: Files },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell }
    ]
  }
]

function SuperAdminLayout({ children }) {
  return (
    <DashboardShell
      nav={NAV}
      roleLabel="Admin"
      basePath="/admin"
      notificationRole="super-admin"
      notificationsPath="/admin/notifications"
      showPendingBadge
    >
      {children}
    </DashboardShell>
  )
}

export default SuperAdminLayout
