import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCircle2, ArrowRight, X } from 'lucide-react'
import NotificationItem from './NotificationItem'

/**
 * NotificationDropdown Component
 * Popover menu attached to NotificationBell showing recent unread items.
 */
function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  onMarkAllAsRead,
  onMarkAsRead,
  onClose,
  viewAllLink = '/user/notifications'
}) {
  const recentNotifications = notifications.slice(0, 4)

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl border border-line shadow-lg py-3 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
      
      {/* Dropdown Header */}
      <div className="px-4 pb-2 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-fg text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-rose-600 text-white font-mono font-semibold text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>

        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-bold text-accent-ink hover:text-accent-ink flex items-center gap-1 hover:underline cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List Body */}
      <div className="px-3 max-h-80 overflow-y-auto space-y-2">
        {recentNotifications.length === 0 ? (
          <div className="py-8 text-center text-subtle space-y-1">
            <Bell className="w-6 h-6 mx-auto text-fg-muted" />
            <p className="font-bold text-xs text-muted">No new notifications</p>
            <p className="text-[10px] text-subtle">You are completely up to date!</p>
          </div>
        ) : (
          recentNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={onMarkAsRead}
              compact={true}
            />
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="px-3 pt-2 border-t border-line">
        <Link
          to={viewAllLink}
          onClick={onClose}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-2 text-accent-ink font-semibold text-xs transition-colors"
        >
          <span>View All Notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}

export default NotificationDropdown
