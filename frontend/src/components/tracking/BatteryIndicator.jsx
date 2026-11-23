import React from 'react'
import { Battery, BatteryCharging, BatteryWarning, Zap } from 'lucide-react'

/**
 * BatteryIndicator Component
 * Renders battery percentage, visual progress bar, and dynamic status state.
 * Dynamic visual states:
 *   > 50: Normal (Emerald)
 *   20-50: Warning (Amber)
 *   < 20: Critical (Rose)
 */
function BatteryIndicator({ battery = 100, showDetails = true, size = "md" }) {
  // Determine state based on percentage
  const isCritical = battery < 20
  const isWarning = battery >= 20 && battery <= 50
  const isNormal = battery > 50

  const getColorClasses = () => {
    if (isCritical) {
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500',
        border: 'border-rose-500/25',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
        statusLabel: 'CRITICAL'
      }
    }
    if (isWarning) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500',
        border: 'border-amber-500/25',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
        statusLabel: 'WARNING'
      }
    }
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/25',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      statusLabel: 'HEALTHY'
    }
  }

  const styles = getColorClasses()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold">
          {isCritical ? (
            <BatteryWarning className={`w-4 h-4 ${styles.text} animate-bounce`} />
          ) : (
            <Battery className={`w-4 h-4 ${styles.text}`} />
          )}
          <span className={`text-sm font-semibold ${styles.text}`}>
            {battery}%
          </span>
        </div>

        {showDetails && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badgeBg}`}>
            {styles.statusLabel}
          </span>
        )}
      </div>

      {/* Battery Gauge Bar */}
      <div className="w-full h-2.5 bg-surface-3 rounded-full overflow-hidden p-0.5 border border-line">
        <div
          className={`h-full rounded-full transition-all duration-500 ${styles.bg} ${
            isCritical ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.max(0, Math.min(100, battery))}%` }}
        />
      </div>
    </div>
  )
}

export default BatteryIndicator
