import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import NotificationBadge from './NotificationBadge'
import NotificationDropdown from './NotificationDropdown'
import { getNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead } from '../../utils/notificationUtils'

/**
 * NotificationBell Component
 * Header bell icon with live unread badge count and dropdown popover.
 */
function NotificationBell({ role = 'customer', userId = 3, shopId = 101, viewAllLink = '/user/notifications' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load and subscribe to notification updates
  const loadData = () => {
    const list = getNotifications(role, userId, shopId)
    const count = getUnreadCount(role, userId, shopId)
    setNotifications(list)
    setUnreadCount(count)
  }

  useEffect(() => {
    loadData()
    // Poll for dynamic simulated notifications every 2 seconds
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [role, userId, shopId])

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
    loadData()
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(role, userId, shopId)
    loadData()
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-fg-muted transition-colors cursor-pointer"
        aria-label="Open notifications menu"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1">
            <NotificationBadge count={unreadCount} />
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
          viewAllLink={viewAllLink}
        />
      )}
    </div>
  )
}

export default NotificationBell
