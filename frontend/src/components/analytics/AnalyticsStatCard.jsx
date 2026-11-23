import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * AnalyticsStatCard Component
 * Reusable KPI Card displaying title, value, percentage change, and trend icon.
 */
function AnalyticsStatCard({
  title = "Metric",
  value = "0",
  change = "+0%",
  isPositive = true,
  icon: Icon,
  colorScheme = "blue", // "blue" | "emerald" | "purple" | "amber" | "rose"
  subtitle
}) {
  const getColorStyles = () => {
    switch (colorScheme) {
      case 'emerald':
        return { cardBg: 'bg-emerald-500/10 border-emerald-500/25', iconBg: 'bg-emerald-600 text-white', textAccent: 'text-emerald-400' }
      case 'purple':
        return { cardBg: 'bg-accent/10 border-accent/25', iconBg: 'bg-accent text-white', textAccent: 'text-accent-ink' }
      case 'amber':
        return { cardBg: 'bg-amber-500/10 border-amber-500/25', iconBg: 'bg-amber-500 text-white', textAccent: 'text-amber-400' }
      case 'rose':
        return { cardBg: 'bg-rose-500/10 border-rose-500/25', iconBg: 'bg-rose-600 text-white', textAccent: 'text-rose-400' }
      default:
        return { cardBg: 'bg-accent/10 border-accent/25', iconBg: 'bg-accent text-white', textAccent: 'text-accent-ink' }
    }
  }

  const styles = getColorStyles()
  const isNeutral = change === '0%' || change === '0' || !change

  return (
    <div className={`p-5 rounded-2xl border ${styles.cardBg} bg-surface shadow-2xs space-y-3 transition-all hover:shadow-md hover:scale-[1.01]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl shadow-xs shrink-0 ${styles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight font-mono">
          {value}
        </div>

        <div className="flex items-center justify-between">
          {change && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
              isNeutral
                ? 'text-muted'
                : isPositive
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}>
              {isNeutral ? (
                <Minus className="w-3.5 h-3.5" />
              ) : isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{change}</span>
              <span className="text-[10px] text-subtle font-normal">vs prev period</span>
            </span>
          )}

          {subtitle && (
            <span className="text-[10px] text-subtle font-medium ml-auto">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsStatCard
