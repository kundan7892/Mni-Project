import React from 'react'
import { FileText, MapPin, Navigation, User, Building2, Calendar, Clock, ShieldCheck } from 'lucide-react'

/**
 * FlightDetails Component
 * Displays flight information and booking specs.
 */
function FlightDetails({ drone }) {
  if (!drone) return null

  const details = [
    { label: "Booking ID", value: drone.bookingId, isMono: true },
    { label: "Customer", value: drone.customerName || "N/A" },
    { label: "Drone Model", value: drone.droneName },
    { label: "Fulfilling Shop", value: drone.shopName },
    { label: "Flight Started", value: "02:15 PM" },
    { label: "Duration Elapsed", value: `${drone.flightTime} min` },
    { label: "Live Heading", value: `${drone.heading !== undefined ? drone.heading : 90}°` },
    { label: "Telemetry Feed", value: drone.isSimulated ? "Simulated Mode" : "Hardware Active" },
    { label: "Target Destination", value: drone.destination }
  ]

  return (
    <div className="bg-surface p-5 rounded-2xl border border-line shadow-2xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <h4 className="text-sm font-semibold text-fg flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-ink" />
          <span>Flight Mission Details</span>
        </h4>
        <span className="text-xs font-mono font-bold text-accent-ink bg-accent/10 px-2.5 py-0.5 rounded-lg border border-accent/25">
          {drone.bookingId}
        </span>
      </div>

      {/* Flight Route Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        
        {/* Departure Hub */}
        <div className="p-3 bg-surface-2 rounded-2xl border border-line space-y-1">
          <span className="text-[10px] font-bold uppercase text-subtle block">Origin Hub</span>
          <div className="font-bold text-fg flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-accent-ink shrink-0" />
            <span>{drone.startLocation}</span>
          </div>
        </div>

        {/* Destination */}
        <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-1">
          <span className="text-[10px] font-bold uppercase text-rose-400 block">Destination</span>
          <div className="font-bold text-fg flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{drone.destination}</span>
          </div>
        </div>

      </div>

      {/* Metadata Specification Table */}
      <div className="bg-surface-2 rounded-2xl border border-line divide-y divide-line text-xs">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-2.5 px-4">
            <span className="text-muted font-medium">{item.label}</span>
            <span className={`font-bold text-fg ${item.isMono ? 'font-mono text-accent-ink' : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default FlightDetails
