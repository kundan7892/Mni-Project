import React from 'react'
import { Zap, Gauge, ArrowUp, Wifi, MapPin, Clock, Timer, ShieldCheck } from 'lucide-react'
import BatteryIndicator from './BatteryIndicator'
import SignalIndicator from './SignalIndicator'

/**
 * DroneTelemetry Component
 * Telemetry Panel showing live drone operational metrics:
 * Battery, Speed, Altitude, Signal, Distance, Flight Time, ETA
 */
function DroneTelemetry({ drone }) {
  if (!drone) {
    return (
      <div className="bg-surface p-6 rounded-2xl border border-line text-center text-subtle text-xs font-bold">
        Select a drone to inspect telemetry
      </div>
    )
  }

  const metrics = [
    {
      label: "Air Speed",
      value: `${drone.speed} km/h`,
      sub: "Ground Speed",
      icon: Gauge,
      color: "text-accent-ink bg-accent/10 border-accent/25"
    },
    {
      label: "Flight Altitude",
      value: `${drone.altitude} m`,
      sub: "Above Ground Level",
      icon: ArrowUp,
      color: "text-accent-ink bg-accent/10 border-accent/25"
    },
    {
      label: "Distance Remaining",
      value: `${drone.distance} km`,
      sub: "To Destination",
      icon: MapPin,
      color: "text-accent-ink bg-accent/10 border-accent/25"
    },
    {
      label: "Flight Time Elapsed",
      value: `${drone.flightTime} min`,
      sub: "Mission Duration",
      icon: Clock,
      color: "text-accent-ink bg-accent/10 border-accent/25"
    },
    {
      label: "Estimated Arrival (ETA)",
      value: drone.eta || "18 min",
      sub: "Destination ETA",
      icon: Timer,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
    }
  ]

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-2xs space-y-6">
      
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-ink" />
            <span>Telemetry Dashboard — {drone.droneName}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">
            Booking: <strong className="font-mono text-fg-muted">{drone.bookingId}</strong>
            {drone.heading !== undefined && (
              <span className="ml-2 text-muted font-mono">
                • Heading: {drone.heading}°
              </span>
            )}
          </p>
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
          drone.telemetrySource === 'real'
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
            : 'text-amber-400 bg-amber-500/10 border-amber-500/25'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
            drone.telemetrySource === 'real' ? 'bg-emerald-500' : 'bg-amber-500'
          }`} />
          {drone.telemetrySource === 'real' ? 'Live Hardware Telemetry' : 'Simulated Telemetry Mode'}
        </span>
      </div>

      {/* Gauges Grid: Battery & Signal Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Battery Telemetry Card */}
        <div className="bg-surface-2 p-4 rounded-2xl border border-line space-y-2">
          <div className="text-xs font-bold text-muted uppercase tracking-wider">
            Battery Telemetry
          </div>
          <BatteryIndicator battery={drone.battery ?? drone.batteryLevel ?? 100} showDetails={true} />
        </div>

        {/* Signal Telemetry Card */}
        <div className="bg-surface-2 p-4 rounded-2xl border border-line space-y-2">
          <div className="text-xs font-bold text-muted uppercase tracking-wider">
            Signal Transmission
          </div>
          <SignalIndicator signal={drone.signal} showLabel={true} />
        </div>

      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border ${m.color} space-y-1 transition-all hover:scale-102`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  {m.label}
                </span>
                <Icon className="w-3.5 h-3.5 opacity-80" />
              </div>
              <div className="text-lg font-semibold tracking-tight font-mono">
                {m.value}
              </div>
              <div className="text-[9px] text-subtle font-medium">
                {m.sub}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default DroneTelemetry
