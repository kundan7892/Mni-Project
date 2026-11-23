import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, ChevronDown, User, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'
import bookingService from '../../services/bookingService'
import { BOOKINGS_CHANGED_EVENT } from '../../lib/events'


function usePendingCount(enabled) {
  const [count, setCount] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled) return
    let alive = true
    const load = () =>
      bookingService
        .getBookings({ status: 'pending', limit: 1 })
        .then((res) => alive && setCount(res?.pagination?.total || 0))
        .catch(() => {})
    load()
    window.addEventListener(BOOKINGS_CHANGED_EVENT, load)
    return () => {
      alive = false
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, load)
    }
  }, [enabled, pathname])

  return count
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 px-2">
      <span className="w-7 h-7 rounded-md bg-fg text-canvas flex items-center justify-center text-[13px] font-bold">D</span>
      <span className="text-[15px] font-semibold tracking-tight text-fg">DroneHub</span>
    </Link>
  )
}

function SidebarNav({ groups, badges, onNavigate }) {
  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.title || group.items[0].path} className="space-y-0.5">
          {group.title && <div className="px-2 pb-1.5 text-[11px] font-medium text-subtle">{group.title}</div>}
          {group.items.map((item) => {
            const Icon = item.icon
            const badge = item.badgeKey ? badges[item.badgeKey] : 0
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                    isActive ? 'bg-surface-3 text-fg' : 'text-muted hover:text-fg hover:bg-surface-2'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span className="flex-1 truncate">{item.label}</span>
                {badge > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-medium flex items-center justify-center tabular-nums">
                    {badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function UserMenu({ basePath, roleLabel }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = (currentUser?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-surface-2 transition-colors cursor-pointer"
      >
        <span className="w-7 h-7 rounded-full bg-surface-3 ring-1 ring-line text-xs font-medium text-fg-muted flex items-center justify-center">
          {initials}
        </span>
        <span className="hidden sm:block text-left leading-tight">
          <span className="block text-sm text-fg max-w-[140px] truncate">{currentUser?.name}</span>
          <span className="block text-[11px] text-subtle">{roleLabel}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-subtle" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-line bg-surface shadow-2xl py-1 z-50 animate-fadeIn">
          <div className="px-3 py-2 border-b border-line">
            <div className="text-sm text-fg truncate">{currentUser?.name}</div>
            <div className="text-xs text-subtle truncate">{currentUser?.email}</div>
          </div>
          <Link to={`${basePath}/profile`} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-fg-muted hover:bg-surface-2">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link to={`${basePath}/settings`} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-fg-muted hover:bg-surface-2">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-300 hover:bg-surface-2 cursor-pointer border-t border-line mt-1">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Shared layout for the customer, shop owner and admin dashboards.
 * The sidebar is pinned (sticky, full viewport height) and scrolls on its own if it is long.
 */
function DashboardShell({ nav, roleLabel, basePath, notificationRole, notificationsPath, showPendingBadge = false, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { currentUser } = useAuth()
  const pending = usePendingCount(showPendingBadge)
  const badges = { pending }

  useEffect(() => setMobileOpen(false), [pathname])

  const currentTitle = useMemo(() => {
    for (const g of nav) {
      const hit = g.items.find((i) => pathname === i.path || pathname.startsWith(`${i.path}/`))
      if (hit) return hit.label
    }
    return ''
  }, [nav, pathname])

  const sidebar = (
    <div className="h-full w-60 flex flex-col bg-canvas border-r border-line">
      <div className="h-14 flex items-center justify-between px-3 shrink-0">
        <Brand />
        <button type="button" onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-md text-muted hover:text-fg hover:bg-surface-2 cursor-pointer" aria-label="Close menu">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3">
        <SidebarNav groups={nav} badges={badges} onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className="shrink-0 px-5 py-3 border-t border-line text-[11px] text-subtle">
        Signed in as {roleLabel.toLowerCase()}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas text-fg flex">
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen">{sidebar}</aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full animate-fadeIn">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-14 shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 border-b border-line bg-canvas/85 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 -ml-1.5 rounded-md text-muted hover:text-fg hover:bg-surface-2 cursor-pointer" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted truncate">{currentTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell role={notificationRole} userId={currentUser?.id} shopId={currentUser?.shopId} viewAllLink={notificationsPath} />
            <UserMenu basePath={basePath} roleLabel={roleLabel} />
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardShell
