import React, { useState } from 'react'
import { X, Store, User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Power } from 'lucide-react'

function ShopDetailsModal({ shop, onClose, onUpdateStatus }) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [showSuspendBox, setShowSuspendBox] = useState(false)

  if (!shop) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2">
          <div className="flex items-center gap-3">
            <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-2xl object-cover border border-line shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-fg">{shop.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                  ID #{shop.shopId}
                </span>
              </div>
              <div className="text-xs text-muted">{shop.location}</div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Owner & Contact */}
          <div className="p-4 bg-surface-2 rounded-2xl border border-line space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Shop Host Owner Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-fg-muted pt-1">
              <div>
                <span className="text-subtle block font-medium text-[11px]">Owner Name</span>
                <span className="font-bold text-fg">{shop.ownerName}</span>
              </div>
              <div>
                <span className="text-subtle block font-medium text-[11px]">Email</span>
                <span className="font-medium">{shop.ownerEmail}</span>
              </div>
              <div>
                <span className="text-subtle block font-medium text-[11px]">Phone</span>
                <span className="font-medium">{shop.phone}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-accent/10 p-3 rounded-2xl border border-accent/25">
              <span className="text-accent-ink block font-medium text-[11px]">Fleet Drones</span>
              <span className="text-lg font-semibold text-accent-ink">{shop.dronesCount || 24}</span>
            </div>
            <div className="bg-accent/10 p-3 rounded-2xl border border-accent/25">
              <span className="text-accent-ink block font-medium text-[11px]">Active Rentals</span>
              <span className="text-lg font-semibold text-accent-ink">{shop.activeRentalsCount || 5}</span>
            </div>
            <div className="bg-accent/10 p-3 rounded-2xl border border-accent/25">
              <span className="text-accent-ink block font-medium text-[11px]">Customers</span>
              <span className="text-lg font-semibold text-accent-ink">{shop.customersCount || 142}</span>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/25">
              <span className="text-emerald-400 block font-medium text-[11px]">Total Revenue</span>
              <span className="text-lg font-semibold text-emerald-400">₹{((shop.revenue || 1845000)/1000).toFixed(0)}k</span>
            </div>
          </div>

          {/* Reject / Suspend Reason Box */}
          {showRejectBox && (
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-2">
              <label className="block text-xs font-bold text-rose-400">Provide Rejection Reason:</label>
              <input
                type="text"
                placeholder="Reason for rejecting shop application..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-surface border border-rose-500/25 rounded-xl p-2.5 text-xs text-fg"
              />
              <button
                onClick={() => { onUpdateStatus(shop.shopId, 'Rejected', 'Rejected', rejectReason); onClose(); }}
                className="bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          )}

          {showSuspendBox && (
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/25 space-y-2">
              <label className="block text-xs font-bold text-amber-400">Provide Suspension Reason:</label>
              <input
                type="text"
                placeholder="Reason for shop suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full bg-surface border border-amber-500/25 rounded-xl p-2.5 text-xs text-fg"
              />
              <button
                onClick={() => { onUpdateStatus(shop.shopId, 'Suspended', shop.verification, suspendReason); onClose(); }}
                className="bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Confirm Suspension
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {shop.verification === 'Pending' && (
              <>
                <button
                  onClick={() => { onUpdateStatus(shop.shopId, 'Active', 'Verified'); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Approve Shop
                </button>
                <button
                  onClick={() => setShowRejectBox(true)}
                  className="bg-rose-500/10 text-rose-400 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Reject Shop
                </button>
              </>
            )}

            {shop.status === 'Active' && shop.verification === 'Verified' && (
              <button
                onClick={() => setShowSuspendBox(true)}
                className="bg-amber-600 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Suspend Shop
              </button>
            )}

            {shop.status === 'Suspended' && (
              <button
                onClick={() => { onUpdateStatus(shop.shopId, 'Active', 'Verified'); onClose(); }}
                className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Reactivate Shop
              </button>
            )}
          </div>

          <button onClick={onClose} className="bg-surface-3 hover:bg-line-strong text-fg font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer ml-auto">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default ShopDetailsModal
