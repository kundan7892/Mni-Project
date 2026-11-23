import React from 'react'
import { X, Calendar, Store, MapPin, ShieldCheck, Clock, FileText, CheckCircle2, Navigation, AlertCircle } from 'lucide-react'

function RentalDetailsModal({ rental, onClose, onTrackClick }) {
  if (!rental) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between bg-surface-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent-ink bg-accent/10 px-2.5 py-0.5 rounded-md">
              Rental Details #{rental.id}
            </span>
            <h2 className="text-xl font-semibold text-fg mt-1">
              {rental.droneName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Drone Showcase */}
          <div className="flex items-center gap-4 bg-surface-2 p-4 rounded-2xl border border-line">
            <img
              src={rental.droneImage}
              alt={rental.droneName}
              className="w-20 h-20 rounded-xl object-cover border border-line shrink-0"
            />
            <div className="space-y-1">
              <div className="font-bold text-fg text-base">{rental.droneName}</div>
              <div className="text-muted font-medium">Brand: {rental.brand} • Category: {rental.category}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: {rental.status}</span>
              </div>
            </div>
          </div>

          {/* Rental Period & Shop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-surface-2 rounded-2xl border border-line space-y-2">
              <div className="font-bold text-fg flex items-center gap-1.5 text-xs text-accent-ink uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Rental Period</span>
              </div>
              <div className="text-fg-muted font-semibold">
                {rental.startDate} to {rental.endDate}
              </div>
              <div className="text-muted text-xs">
                Duration: {rental.durationDays} Days
              </div>
            </div>

            <div className="p-4 bg-surface-2 rounded-2xl border border-line space-y-2">
              <div className="font-bold text-fg flex items-center gap-1.5 text-xs text-accent-ink uppercase tracking-wider">
                <Store className="w-4 h-4" />
                <span>Rental Shop Host</span>
              </div>
              <div className="text-fg-muted font-semibold">{rental.shopName}</div>
              <div className="text-muted text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-subtle" />
                <span>{rental.shopLocation}</span>
              </div>
            </div>

          </div>

          {/* Payment & Deposit Breakdown */}
          <div className="p-4 rounded-2xl border border-line space-y-3">
            <h4 className="font-semibold text-fg text-xs uppercase tracking-wider text-accent-ink">
              Payment & Security Deposit
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-surface-2 p-3 rounded-xl border border-line">
                <span className="text-subtle block font-medium">Daily Rate</span>
                <span className="font-bold text-fg">₹{rental.dailyRate?.toLocaleString('en-IN')}/day</span>
              </div>
              <div className="bg-surface-2 p-3 rounded-xl border border-line">
                <span className="text-subtle block font-medium">Rental Subtotal</span>
                <span className="font-bold text-fg">₹{rental.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/25 text-amber-400">
                <span className="text-amber-400 block font-medium">Security Deposit</span>
                <span className="font-bold">₹{rental.securityDeposit?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-accent/10 rounded-2xl border border-accent/25 text-xs text-accent-ink space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-accent-ink">
              <ShieldCheck className="w-4 h-4 text-accent-ink" />
              <span>Rental Operating Guidelines</span>
            </div>
            <p className="leading-relaxed text-accent-ink">
              Maintain visual line-of-sight during flight. Charge batteries fully before takeoff using the provided hub. Return gear by 6:00 PM on your end date to avoid late penalty charges.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface-2 flex items-center justify-between gap-3">
          {rental.trackingAvailable && onTrackClick ? (
            <button
              onClick={() => { onClose(); onTrackClick(rental); }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Track Drone Live</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="bg-surface-3 hover:bg-line-strong text-fg font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default RentalDetailsModal
