import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Store, Users, UserCheck, Navigation, Calendar, 
  Radio, FileText, CreditCard, BarChart2, Star, AlertCircle, Bell, 
  Settings, User, LogOut, X, ShieldCheck 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function SuperAdminSidebar({ isOpen, onClose }) {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/')
  }

  const menuGroups = [
    {
      groupTitle: "OVERVIEW",
      items: [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: "MANAGEMENT",
      items: [
        { label: "Shops", path: "/admin/shops", icon: Store },
        { label: "Shop Owners", path: "/admin/shop-owners", icon: UserCheck },
        { label: "Customers", path: "/admin/customers", icon: Users },
        { label: "Drones", path: "/admin/drones", icon: Navigation }
      ]
    },
    {
      groupTitle: "OPERATIONS",
      items: [
        { label: "Bookings", path: "/admin/bookings", icon: Calendar },
        { label: "Rentals", path: "/admin/rentals", icon: Store },
        { label: "Drone Tracking", path: "/admin/tracking", icon: Radio },
        { label: "Documents", path: "/admin/documents", icon: FileText }
      ]
    },
    {
      groupTitle: "FINANCE & ANALYTICS",
      items: [
        { label: "Payments", path: "/admin/payments", icon: CreditCard },
        { label: "Analytics", path: "/admin/analytics", icon: BarChart2 },
        { label: "Reports", path: "/admin/reports", icon: FileText }
      ]
    },
    {
      groupTitle: "ENGAGEMENT",
      items: [
        { label: "Reviews", path: "/admin/reviews", icon: Star },
        { label: "Complaints", path: "/admin/complaints", icon: AlertCircle },
        { label: "Notifications", path: "/admin/notifications", icon: Bell }
      ]
    },
    {
      groupTitle: "SYSTEM",
      items: [
        { label: "Settings", path: "/admin/settings", icon: Settings },
        { label: "Profile", path: "/admin/profile", icon: User }
      ]
    }
  ]

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-canvas text-fg-muted w-64 select-none">
      
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pt-2 px-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md transition-transform">
              <Navigation className="w-5 h-5 transform rotate-45" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              DRONE<span className="text-emerald-400">HUB</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-subtle hover:text-white hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Super Admin Info Pill */}
        <div className="bg-black/90 p-3 rounded-2xl border border-line flex items-center gap-3">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-xl object-cover border border-line shrink-0"
          />
          <div className="space-y-0.5 truncate">
            <div className="text-xs font-bold text-white truncate">{currentUser?.name || "Platform Admin"}</div>
            <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Super Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4 pt-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
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
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md '
                            : 'text-subtle hover:text-white hover:bg-surface'
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

      {/* Logout */}
      <div className="pt-3 border-t border-line">
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

export default SuperAdminSidebar
