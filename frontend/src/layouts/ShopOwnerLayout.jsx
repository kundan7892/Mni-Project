import React from 'react'
import {
  LayoutDashboard, Inbox, ClipboardList, Package, Users, BarChart2, Radio, CreditCard, FileText, Star, Bell, Files, Store
} from 'lucide-react'
import DashboardShell from '../components/dashboard/DashboardShell'

const NAV = [
  {
    items: [{ label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard }]
  },
  {
    title: 'Rentals',
    items: [
      { label: 'Requests', path: '/owner/requests', icon: Inbox, badgeKey: 'pending' },
      { label: 'Orders', path: '/owner/orders', icon: ClipboardList },
      { label: 'Live tracking', path: '/owner/tracking', icon: Radio }
    ]
  },
  {
    title: 'Shop',
    items: [
      { label: 'Catalogue', path: '/owner/catalogue', icon: Package },
      { label: 'Customers', path: '/owner/customers', icon: Users },
      { label: 'Analytics', path: '/owner/analytics', icon: BarChart2 },
      { label: 'Shop profile', path: '/owner/shop-profile', icon: Store }
    ]
  },
  {
    title: 'More',
    items: [
      { label: 'Payments', path: '/owner/payments', icon: CreditCard },
      { label: 'Reviews', path: '/owner/reviews', icon: Star },
      { label: 'Reports', path: '/owner/reports', icon: FileText },
      { label: 'Documents', path: '/owner/documents', icon: Files },
      { label: 'Notifications', path: '/owner/notifications', icon: Bell }
    ]
  }
]

function ShopOwnerLayout({ children }) {
  return (
    <DashboardShell
      nav={NAV}
      roleLabel="Shop owner"
      basePath="/owner"
      notificationRole="shop-owner"
      notificationsPath="/owner/notifications"
      showPendingBadge
    >
      {children}
    </DashboardShell>
  )
}

export default ShopOwnerLayout
