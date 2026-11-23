import React from 'react'

// Reusable Metric Stat Card Component
function StatCard({ title, value, label, icon: Icon, color = 'blue', trend }) {
  const getColorStyles = (c) => {
    switch (c) {
      case 'emerald':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25' }
      case 'amber':
        return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' }
      case 'purple':
        return { bg: 'bg-accent/10', text: 'text-accent-ink', border: 'border-accent/25' }
      case 'rose':
        return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/25' }
      default:
        return { bg: 'bg-accent/10', text: 'text-accent-ink', border: 'border-accent/25' }
    }
  }

  const styles = getColorStyles(color)

  return (
    <div className="bg-surface p-5 rounded-2xl border border-line shadow-2xs hover:shadow-md transition-shadow space-y-3">
      
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-[11px] font-bold text-muted bg-surface-2 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          {value}
        </div>
        <div className="text-xs font-bold text-fg-muted mt-0.5">
          {title}
        </div>
        {label && (
          <p className="text-[11px] text-subtle mt-1">
            {label}
          </p>
        )}
      </div>

    </div>
  )
}

export default StatCard
