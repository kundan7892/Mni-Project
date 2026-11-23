import React, { useState, useEffect, useMemo } from 'react'
import { Bell, CheckCircle2, Trash2, Sparkles, Plus, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  clearAllNotifications, 
  addNotification 
} from '../../utils/notificationUtils'
import NotificationItem from '../../components/notifications/NotificationItem'
import NotificationFilters from '../../components/notifications/NotificationFilters'
import NotificationEmptyState from '../../components/notifications/NotificationEmptyState'
import alertService from '../../services/alertService'

/*
  DATA SECURITY & MULTI-TENANT RULE:
  Shop Owner notifications must be filtered by shopId === currentUser.shopId.
  Shop Owner must NEVER see another shop's notifications.
*/

function OwnerNotifications() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showClearModal, setShowClearModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const loadData = async () => {
    const list = getNotifications('shop-owner', 2, shopId)
    try {
      const res = await alertService.getAlerts()
      const apiAlerts = res.data?.alerts || res.alerts || []
      if (apiAlerts && apiAlerts.length > 0) {
        const mappedAlerts = apiAlerts.map((a) => ({
          id: a._id || a.id,
          title: `${a.alertType?.toUpperCase() || 'FLEET'} Notification`,
          message: a.message,
          time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          status: a.isRead ? 'read' : 'unread',
          type: a.alertType === 'emergency' ? 'emergency' : 'alert',
          role: 'shop-owner',
          shopId
        }))
        const existingIds = new Set(list.map((n) => String(n.id)))
        const newOnes = mappedAlerts.filter((m) => !existingIds.has(String(m.id)))
        setNotifications([...newOnes, ...list])
        return
      }
    } catch (e) {
      console.warn('Alerts notifications sync note:', e.message)
    }
    setNotifications(list)
  }

  useEffect(() => {
    loadData()
  }, [shopId])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || n.status === statusFilter
      const matchesType = typeFilter === 'All' || n.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [notifications, searchTerm, statusFilter, typeFilter])

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
    loadData()
    showToast('Notification marked as read.')
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead('shop-owner', 2, shopId)
    loadData()
    showToast('All shop notifications marked as read.')
  }

  const handleDelete = (id) => {
    deleteNotification(id)
    loadData()
    showToast('Notification deleted.')
  }

  const handleClearAll = () => {
    clearAllNotifications('shop-owner', 2, shopId)
    loadData()
    setShowClearModal(false)
    showToast('All shop notifications cleared.')
  }

  const handleSimulateNewNotification = () => {
    addNotification({
      userId: 2,
      shopId,
      role: 'shop-owner',
      type: 'booking',
      title: 'New Customer Booking Notification ',
      message: 'A new reservation was placed for your DJI Inspire 3 Cinema 8K.',
      priority: 'important'
    })
    loadData()
    showToast('Simulated shop notification pushed!')
  }

  const unreadCount = notifications.filter((n) => n.status === 'unread').length

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-surface text-white px-4 py-2.5 rounded-2xl border border-accent shadow-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-accent-ink" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Shop Notifications
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            New customer bookings, payments received, drone return reminders, and tracking alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSimulateNewNotification}
            className="inline-flex items-center gap-1 bg-accent/10 hover:bg-accent/10 text-accent-ink text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Push</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-rose-500/10 text-fg-muted hover:text-rose-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <NotificationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* LIST */}
      {filteredNotifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* CLEAR MODAL */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-line shadow-lg space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-fg">Clear all shop notifications?</h3>
            <p className="text-xs text-muted">
              This action cannot be undone. All notification logs for your storefront will be cleared.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-600 transition-all shadow-md cursor-pointer"
              >
                Clear Notifications
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default OwnerNotifications
