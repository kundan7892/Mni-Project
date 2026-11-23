import React from 'react'
import { Radio, Navigation, Battery, Clock, MapPin, User, Building2, ChevronRight } from 'lucide-react'

/**
 * TrackingDroneList Component
 * Renders list of trackable drone cards.
 * Highlighting selected drone card and allowing click selection.
 */
function TrackingDroneList({
  drones = [],
  selectedDroneId,
  onSelectDrone,
  compact = false
}) {
  if (!drones.length) {
    return (
      <div className="bg-surface p-8 rounded-2xl border border-line text-center space-y-3">
        <Radio className="w-8 h-8 text-fg-muted mx-auto" />
        <div className="text-sm font-bold text-fg-muted">No Tracked Drones Found</div>
        <p className="text-xs text-subtle">Try adjusting your search query or filter parameters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {drones.map((drone) => {
        const isSelected = drone.id === selectedDroneId || drone.bookingId === selectedDroneId

        // Dynamic status badge styling
        const getStatusBadge = () => {
          if (drone.status === 'offline') {
            return {
              bg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
              dot: 'bg-rose-500',
              label: 'Offline'
            }
          }
          if (drone.battery < 20) {
            return {
              bg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
              dot: 'bg-rose-500 animate-ping',
              label: 'Low Battery'
            }
          }
          if (drone.status === 'idle') {
            return {
              bg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
              dot: 'bg-amber-500',
              label: 'Idle'
            }
          }
          if (drone.status === 'returned') {
            return {
              bg: 'bg-surface-2 text-fg-muted border-line',
              dot: 'bg-subtle',
              label: 'Returned'
            }
          }
          return {
            bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
            dot: 'bg-emerald-500 animate-ping',
            label: 'In Flight'
          }
        }

        const statusStyle = getStatusBadge()

        return (
          <div
            key={drone.id || drone.bookingId}
            onClick={() => onSelectDrone(drone)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              isSelected
                ? 'bg-accent/10 border-accent shadow-md ring-2 ring-accent/40'
                : 'bg-surface border-line hover:border-accent/25 hover:shadow-xs'
            }`}
          >
            {/* Selection indicator pill */}
            {isSelected && (
              <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-semibold uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                Selected
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Drone Thumbnail */}
              <img
                src={drone.droneImage || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=150&q=80"}
                alt={drone.droneName}
                className="w-12 h-12 rounded-xl object-cover border border-line shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Title & Status */}
                <div className="flex items-center justify-between gap-2 pr-12">
                  <h4 className="text-xs font-semibold text-fg truncate">
                    {drone.droneName}
                  </h4>
                </div>

                {/* Shop & Booking ID */}
                <div className="flex items-center gap-2 text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1 font-bold text-fg-muted truncate">
                    <Building2 className="w-3 h-3 text-subtle shrink-0" />
                    {drone.shopName}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-accent-ink font-bold shrink-0">
                    {drone.bookingId}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="pt-0.5 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    <span>{statusStyle.label}</span>
                  </span>

                  <span className="text-[10px] text-subtle font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-subtle" />
                    {drone.lastUpdated || "Just now"}
                  </span>
                </div>

                {/* Dynamic Telemetry Quick Metrics Bar */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-line text-[10px]">
                  <div className="bg-surface-2 p-1.5 rounded-lg border border-line">
                    <span className="text-subtle block text-[9px]">Battery</span>
                    <span className={`font-mono font-semibold ${
                      drone.battery < 20 ? 'text-rose-400 animate-pulse' : drone.battery < 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {drone.battery}%
                    </span>
                  </div>

                  <div className="bg-surface-2 p-1.5 rounded-lg border border-line">
                    <span className="text-subtle block text-[9px]">Speed</span>
                    <span className="font-mono font-semibold text-fg">
                      {drone.speed} km/h
                    </span>
                  </div>

                  <div className="bg-surface-2 p-1.5 rounded-lg border border-line">
                    <span className="text-subtle block text-[9px]">Altitude</span>
                    <span className="font-mono font-semibold text-fg">
                      {drone.altitude} m
                    </span>
                  </div>
                </div>

                {/* Customer name */}
                {drone.customerName && (
                  <div className="text-[10px] text-muted flex items-center gap-1 pt-1">
                    <User className="w-3 h-3 text-subtle" />
                    <span>Customer: <strong className="text-fg font-semibold">{drone.customerName}</strong></span>
                  </div>
                )}

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TrackingDroneList
