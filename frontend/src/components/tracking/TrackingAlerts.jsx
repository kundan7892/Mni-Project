import React from 'react'
import { AlertTriangle, BatteryWarning, WifiOff, ShieldAlert, CheckCircle2, Bell } from 'lucide-react'

/**
 * TrackingAlerts Component
 * Renders warning & telemetry alerts cards for low battery, weak signal, offline, geofence.
 */
function TrackingAlerts({ drone }) {
  if (!drone) return null

  // Generate dynamic alerts array based on telemetry state
  const activeAlerts = []

  // Check Low Battery Alert (<20%)
  if (drone.battery < 20) {
    activeAlerts.push({
      id: 'low-battery',
      type: 'critical',
      icon: BatteryWarning,
      title: 'Low Battery Alert',
      message: `Drone battery level has dropped to ${drone.battery}%. Return-to-Home (RTH) advised.`,
      color: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
      iconBg: 'bg-rose-600 text-white'
    })
  }

  // Check Weak Signal (<70%)
  if (drone.signal > 0 && drone.signal < 70) {
    activeAlerts.push({
      id: 'weak-signal',
      type: 'warning',
      icon: AlertTriangle,
      title: 'Weak Signal Warning',
      message: `Signal strength is currently ${drone.signal}% below recommended safe threshold.`,
      color: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
      iconBg: 'bg-amber-500 text-white'
    })
  }

  // Check Drone Offline
  if (drone.status === 'offline' || drone.signal === 0) {
    activeAlerts.push({
      id: 'drone-offline',
      type: 'critical',
      icon: WifiOff,
      title: 'Drone Telemetry Offline',
      message: 'Drone has not reported location updates recently. Telemetry link lost.',
      color: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
      iconBg: 'bg-rose-600 text-white'
    })
  }

  // Check existing custom alerts
  if (drone.alerts && drone.alerts.length > 0) {
    drone.alerts.forEach((alt) => {
      if (!activeAlerts.some(a => a.id === alt.id)) {
        activeAlerts.push({
          id: alt.id,
          type: alt.type,
          icon: alt.type === 'critical' ? BatteryWarning : alt.type === 'warning' ? ShieldAlert : Bell,
          title: alt.title,
          message: alt.message,
          color: alt.type === 'critical' ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-accent/10 border-accent/25 text-accent-ink',
          iconBg: alt.type === 'critical' ? 'bg-rose-600 text-white' : 'bg-accent text-white'
        })
      }
    })
  }

  return (
    <div className="bg-surface p-5 rounded-2xl border border-line shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <h4 className="text-sm font-semibold text-fg flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Active Telemetry & Safety Alerts</span>
        </h4>
        <span className="text-xs font-bold text-subtle">
          {activeAlerts.length} Active Notice{activeAlerts.length === 1 ? '' : 's'}
        </span>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 text-xs font-bold text-emerald-400 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>No critical telemetry alerts. All flight parameters within normal parameters.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alt) => {
            const Icon = alt.icon
            return (
              <div
                key={alt.id}
                className={`p-3.5 rounded-2xl border ${alt.color} flex items-start gap-3 transition-all`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${alt.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h5 className="text-xs font-semibold">{alt.title}</h5>
                  <p className="text-[11px] opacity-90 leading-relaxed">{alt.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default TrackingAlerts
