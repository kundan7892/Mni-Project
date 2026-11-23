import React from 'react'
import { X, User, Mail, Phone, ShieldCheck, CreditCard, Calendar, Star } from 'lucide-react'

function CustomerDetailsModal({ customer, onClose }) {
  if (!customer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2">
          <div className="flex items-center gap-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-12 h-12 rounded-2xl object-cover border border-line shrink-0"
            />
            <div>
              <h2 className="text-lg font-semibold text-fg">{customer.name}</h2>
              <div className="text-xs text-muted font-mono">ID: {customer.id}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3 bg-surface-2 p-4 rounded-2xl border border-line">
            <div>
              <span className="text-subtle block font-medium">Email Address</span>
              <span className="font-bold text-fg">{customer.email}</span>
            </div>
            <div>
              <span className="text-subtle block font-medium">Phone Number</span>
              <span className="font-bold text-fg">{customer.phone}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-accent/10 p-3 rounded-2xl border border-accent/25">
              <span className="text-accent-ink block font-medium">Total Rentals</span>
              <span className="text-lg font-semibold text-accent-ink">{customer.totalRentals}</span>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/25">
              <span className="text-emerald-400 block font-medium">Total Spent</span>
              <span className="text-lg font-semibold text-emerald-400">₹{customer.totalSpent?.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-accent/10 p-3 rounded-2xl border border-accent/25">
              <span className="text-accent-ink block font-medium">Clearance</span>
              <span className="text-xs font-semibold text-accent-ink uppercase block mt-1">{customer.documentsStatus || 'Verified'}</span>
            </div>
          </div>

          {/* Active Rental */}
          {customer.activeRental && (
            <div className="p-4 bg-surface text-white rounded-2xl space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent-ink">Current Active Rental</div>
              <div className="font-bold text-sm">{customer.activeRental}</div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-2 text-right">
          <button
            onClick={onClose}
            className="bg-surface-3 hover:bg-line-strong text-fg font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  )
}

export default CustomerDetailsModal
