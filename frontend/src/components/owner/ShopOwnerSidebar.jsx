import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Navigation, Calendar, Radio, Users, FileText, 
  CreditCard, Star, Store, Settings, LogOut, X, ShieldCheck, BarChart2, Bell 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { shopProfiles } from '../../data/shops'

function ShopOwnerSidebar({ isOpen, onClose }) {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const shopId = currentUser?.shopId || 101
  const shop = shopProfiles.find((s) => s.shopId === shopId) || shopProfiles[0]

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/')
  }

  const menuGroups = [
    {
      groupTitle: "OVERVIEW",
      items: [
        { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: "OPERATIONS",
      items: [
        { label: "My Drones", path: "/owner/drones", icon: Navigation },
        { label: "Bookings", path: "/owner/bookings", icon: Calendar },
        { label: "Rentals", path: "/owner/rentals", icon: Store },
        { label: "Customers", path: "/owner/customers", icon: Users },
        { label: "Drone Tracking", path: "/owner/tracking", icon: Radio }
      ]
    },
    {
      groupTitle: "ANALYTICS & REPORTS",
      items: [
        { label: "Analytics", path: "/owner/analytics", icon: BarChart2 },
        { label: "Reports", path: "/owner/reports", icon: FileText }
      ]
    },
    {
      groupTitle: "BUSINESS",
      items: [
        { label: "Documents", path: "/owner/documents", icon: FileText },
        { label: "Payments", path: "/owner/payments", icon: CreditCard },
        { label: "Notifications", path: "/owner/notifications", icon: Bell },
        { label: "Reviews", path: "/owner/reviews", icon: Star }
      ]
    },
    {
      groupTitle: "SHOP",
      items: [
        { label: "Shop Profile", path: "/owner/shop-profile", icon: Store },
        { label: "Settings", path: "/owner/settings", icon: Settings }
      ]
    }
  ]

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-surface text-fg-muted w-64 select-none">
      
      {/* Brand Header */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pt-2 px-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-md transition-transform">
              <Navigation className="w-5 h-5 transform rotate-45" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              DRONE<span className="text-accent-ink">HUB</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-subtle hover:text-white hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shop Info Pill */}
        <div className="bg-surface-2/90 p-3 rounded-2xl border border-line flex items-center gap-3">
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-9 h-9 rounded-xl object-cover border border-line shrink-0"
          />
          <div className="space-y-0.5 truncate">
            <div className="text-xs font-bold text-white truncate">{shop.name}</div>
            <div className="text-[10px] text-accent-ink font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent-ink" />
              <span>Shop Host</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu Groups */}
        <nav className="space-y-4 pt-1">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-muted uppercase tracking-wide">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-accent text-white shadow-md '
                            : 'text-subtle hover:text-white hover:bg-surface-2/80'
                        }`
                      }
                    >
                      <ItemIcon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="pt-4 border-t border-line">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  )

  return (
    <>
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default ShopOwnerSidebar
