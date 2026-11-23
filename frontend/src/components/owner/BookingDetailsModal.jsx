import React from 'react'
import { X, User, Mail, Phone, Calendar, CreditCard, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Store } from 'lucide-react'

function BookingDetailsModal({ booking, onClose, onUpdateStatus }) {
  if (!booking) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between bg-surface-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-ink bg-accent/10 px-2.5 py-0.5 rounded-md">
              Booking Request #{booking.bookingId}
            </span>
            <h2 className="text-xl font-semibold text-fg mt-1">
              {booking.droneName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Customer Info Box */}
          <div className="p-4 bg-surface-2 rounded-2xl border border-line space-y-2">
            <h3 className="text-xs font-semibold text-fg uppercase tracking-wider text-accent-ink flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-fg-muted pt-1">
              <div>
                <span className="text-subtle block font-medium text-[11px]">Full Name</span>
                <span className="font-bold text-fg">{booking.customerName}</span>
              </div>
              <div>
                <span className="text-subtle block font-medium text-[11px]">Email</span>
                <span className="font-medium">{booking.customerEmail}</span>
              </div>
              <div>
                <span className="text-subtle block font-medium text-[11px]">Phone</span>
                <span className="font-medium">{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Schedule & Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-surface-2 rounded-2xl border border-line space-y-2">
              <div className="font-bold text-fg flex items-center gap-1.5 text-xs text-accent-ink uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Rental Period</span>
              </div>
              <div className="text-fg font-bold">
                {booking.startDate} to {booking.endDate}
              </div>
              <div className="text-muted text-xs">
                Duration: {booking.durationDays} Days
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-2xl border border-accent/25 space-y-2 text-accent-ink">
              <div className="font-bold flex items-center gap-1.5 text-xs text-accent-ink uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>Payment & Deposit</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Rental Subtotal:</span>
                <span>₹{booking.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Security Deposit:</span>
                <span>₹{booking.securityDeposit?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold pt-1 border-t border-accent/25">
                <span>Total Amount:</span>
                <span>₹{((booking.amount || 0) + (booking.securityDeposit || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Document Clearance Status */}
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Customer Identification Clearance</span>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {booking.documentsStatus || 'Verified'}
            </span>
          </div>

        </div>

        {/* Footer Dynamic Status Actions */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface-2 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {booking.status === 'Pending' && (
              <>
                <button
                  onClick={() => { onUpdateStatus(booking.bookingId, 'Confirmed'); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                >
                  Approve Booking
                </button>
                <button
                  onClick={() => { onUpdateStatus(booking.bookingId, 'Cancelled'); onClose(); }}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reject Request
                </button>
              </>
            )}

            {booking.status === 'Confirmed' && (
              <button
                onClick={() => { onUpdateStatus(booking.bookingId, 'Active'); onClose(); }}
                className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                Start Rental Dispatch
              </button>
            )}

            {booking.status === 'Active' && (
              <button
                onClick={() => { onUpdateStatus(booking.bookingId, 'Completed'); onClose(); }}
                className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                Mark Returned & Refund Deposit
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-surface-3 hover:bg-line-strong text-fg font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  )
}

export default BookingDetailsModal
