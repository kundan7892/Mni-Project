import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Store, MapPin, Radio, Eye, FileText, ArrowRight } from 'lucide-react'

function RentalCard({ rental, onViewDetails, onTrackDrone }) {
  const navigate = useNavigate()

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500 text-white'
      case 'Upcoming':
        return 'bg-accent text-white'
      case 'Completed':
        return 'bg-surface-3 text-white'
      case 'Cancelled':
        return 'bg-rose-500 text-white'
      default:
        return 'bg-subtle text-white'
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-line shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group">
      
      {/* Drone Image */}
      <div className="relative sm:w-56 h-48 sm:h-auto bg-surface-2 shrink-0 overflow-hidden">
        <img
          src={rental.droneImage}
          alt={rental.droneName}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${getStatusBadgeStyle(rental.status)}`}>
          {rental.status}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Category & Booking ID */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-accent-ink uppercase tracking-wider bg-accent/10 px-2.5 py-0.5 rounded-md">
              {rental.category}
            </span>
            <span className="text-subtle font-mono font-medium">
              ID: {rental.bookingId}
            </span>
          </div>

          {/* Drone Title */}
          <h3 className="text-lg font-bold text-fg group-hover:text-accent-ink transition-colors">
            {rental.droneName}
          </h3>

          {/* Shop & Location */}
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex items-center gap-1 font-medium text-fg-muted">
              <Store className="w-3.5 h-3.5 text-accent-ink shrink-0" />
              <span>{rental.shopName}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-subtle shrink-0" />
              <span>{rental.shopLocation}</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2 text-xs text-muted pt-1">
            <Calendar className="w-4 h-4 text-subtle shrink-0" />
            <span className="font-semibold text-fg">{rental.startDate} to {rental.endDate}</span>
            <span className="text-subtle">({rental.durationDays} Days)</span>
          </div>
        </div>

        {/* Footer Actions & Tracking */}
        <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
          
          {/* Tracking Status Indicator */}
          {rental.trackingAvailable ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{rental.trackingStatus}</span>
            </div>
          ) : (
            <span className="text-xs text-subtle font-medium">
              {rental.trackingStatus}
            </span>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onViewDetails(rental)}
              className="inline-flex items-center gap-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            {rental.trackingAvailable && (
              <button
                onClick={() => onTrackDrone ? onTrackDrone(rental) : navigate('/user/tracking')}
                className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Track Drone</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}

export default RentalCard
