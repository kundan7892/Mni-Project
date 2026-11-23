import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'

/**
 * SignalIndicator Component
 * Visual signal strength gauge with dynamic bars and quality text.
 */
function SignalIndicator({ signal = 100, showLabel = true }) {
  const isWeak = signal < 50 && signal > 0
  const isOffline = signal === 0
  const isFair = signal >= 50 && signal < 80
  const isStrong = signal >= 80

  const getLabel = () => {
    if (isOffline) return 'OFFLINE'
    if (isWeak) return 'WEAK'
    if (isFair) return 'FAIR'
    return 'STRONG'
  }

  const getColor = () => {
    if (isOffline) return 'text-rose-400'
    if (isWeak) return 'text-amber-400'
    if (isFair) return 'text-accent-ink'
    return 'text-emerald-400'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold">
          {isOffline ? (
            <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
          ) : (
            <Wifi className={`w-4 h-4 ${getColor()}`} />
          )}
          <span className={`text-sm font-semibold ${getColor()}`}>
            {signal}%
          </span>
        </div>
        {showLabel && (
          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
            isOffline ? 'bg-rose-500/10 text-rose-400' :
            isWeak ? 'bg-amber-500/10 text-amber-400' : 'bg-surface-2 text-fg-muted'
          }`}>
            {getLabel()}
          </span>
        )}
      </div>

      {/* Signal Strength Bars Visual */}
      <div className="flex items-end gap-1 h-2">
        {[25, 50, 75, 100].map((threshold, idx) => (
          <div
            key={idx}
            className={`w-full rounded-xs transition-colors ${
              signal >= threshold
                ? isWeak ? 'bg-amber-500' : isOffline ? 'bg-rose-500' : 'bg-emerald-500'
                : 'bg-surface-3'
            }`}
            style={{ height: `${(idx + 1) * 25}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default SignalIndicator
