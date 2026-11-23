import React from 'react'

/**
 * NotificationBadge Component
 * Displays unread notification count badge pill.
 */
function NotificationBadge({ count = 0, size = "md" }) {
  if (count <= 0) return null

  const displayCount = count > 99 ? '99+' : count

  return (
    <span className="inline-flex items-center justify-center bg-rose-600 text-white font-mono font-semibold text-[10px] min-w-5 h-5 px-1.5 rounded-full ring-2 ring-white shadow-xs animate-pulse">
      {displayCount}
    </span>
  )
}

export default NotificationBadge
