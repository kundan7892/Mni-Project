import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, CreditCard, Radio, FileText, Navigation, Star, 
  ShieldAlert, Settings, Sparkles, ShieldCheck, CheckCircle2, Trash2, Clock
} from 'lucide-react'

/**
 * NotificationItem Component
 * Renders individual notification card with icon, priority badge, and actions.
 */
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false
}) {
  if (!notification) return null

  const { id, type, title, message, status, priority, createdAt, link } = notification
  const isUnread = status === 'unread'

  // Icon mapping by notification type
  const getTypeIcon = () => {
    switch (type) {
      case 'booking': return { icon: Calendar, color: 'bg-accent/10 text-accent-ink border-accent/25' }
      case 'payment': return { icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' }
      case 'tracking': return { icon: Radio, color: 'bg-rose-500/10 text-rose-400 border-rose-500/25' }
      case 'document': return { icon: FileText, color: 'bg-accent/10 text-accent-ink border-accent/25' }
      case 'drone': return { icon: Navigation, color: 'bg-accent/10 text-accent-ink border-accent/25' }
      case 'review': return { icon: Star, color: 'bg-amber-500/10 text-amber-400 border-amber-500/25' }
      case 'complaint': return { icon: ShieldAlert, color: 'bg-rose-500/10 text-rose-400 border-rose-500/25' }
      case 'promotion': return { icon: Sparkles, color: 'bg-accent/10 text-accent-ink border-accent/25' }
      case 'security': return { icon: ShieldCheck, color: 'bg-surface-2 text-fg-muted border-line' }
      default: return { icon: Settings, color: 'bg-surface-2 text-muted border-line' }
    }
  }

  const { icon: TypeIcon, color: iconStyle } = getTypeIcon()

  // Priority formatting
  const getPriorityBadge = () => {
    if (priority === 'critical') {
      return <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 animate-pulse">Critical</span>
    }
    if (priority === 'important') {
      return <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">Important</span>
    }
    return null
  }

  // Format date / relative time
  const timeFormatted = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const ContentWrapper = link ? Link : 'div'

  return (
    <div
      className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
        isUnread
          ? 'bg-accent/10 border-accent/25 shadow-2xs'
          : 'bg-surface border-line hover:border-line'
      }`}
    >
      {/* Unread dot indicator bar */}
      {isUnread && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent" />
      )}

      <div className="flex items-start gap-3.5">
        
        {/* Type Icon */}
        <div className={`p-2.5 rounded-xl border shrink-0 ${iconStyle}`}>
          <TypeIcon className="w-4 h-4" />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <ContentWrapper to={link} className="flex items-center gap-2 min-w-0">
              <h4 className={`text-xs font-semibold truncate ${isUnread ? 'text-fg' : 'text-fg-muted'}`}>
                {title}
              </h4>
              {getPriorityBadge()}
            </ContentWrapper>

            <span className="text-[10px] text-subtle font-medium shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-subtle" />
              {timeFormatted}
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed font-medium">
            {message}
          </p>

          {/* Bottom Actions Row */}
          <div className="pt-2 flex items-center justify-between text-[11px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
              {type}
            </span>

            <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
              {isUnread && onMarkAsRead && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(id)}
                  className="text-accent-ink hover:text-accent-ink text-[10px] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mark Read</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="text-subtle hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default NotificationItem
