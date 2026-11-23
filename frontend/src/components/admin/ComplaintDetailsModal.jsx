import React, { useState } from 'react'
import { X, AlertCircle, CheckCircle2, User, Store, ShieldAlert, MessageSquare, Send } from 'lucide-react'

function ComplaintDetailsModal({ complaint, onClose, onResolveComplaint }) {
  const [adminNote, setAdminNote] = useState('')

  if (!complaint) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md">
              Complaint Ticket #{complaint.id}
            </span>
            <h2 className="text-lg font-semibold text-fg mt-1">{complaint.subject}</h2>
          </div>

          <button onClick={onClose} className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          
          <div className="grid grid-cols-2 gap-3 bg-surface-2 p-4 rounded-2xl border border-line">
            <div>
              <span className="text-subtle block font-medium text-[11px]">Reporting Customer</span>
              <span className="font-bold text-fg">{complaint.customerName}</span>
              <div className="text-muted text-xs">{complaint.customerEmail}</div>
            </div>
            <div>
              <span className="text-subtle block font-medium text-[11px]">Against Shop</span>
              <span className="font-bold text-fg">{complaint.shopName}</span>
              <div className="text-accent-ink text-xs font-mono">Booking: {complaint.bookingId}</div>
            </div>
          </div>

          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-1.5 text-rose-400">
            <div className="font-bold flex items-center gap-1.5 text-xs text-rose-400">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Issue Description</span>
            </div>
            <p className="text-xs leading-relaxed text-fg font-medium">
              "{complaint.description}"
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider">
              Add Admin Resolution Note
            </label>
            <textarea
              rows={3}
              placeholder="Enter resolution details or refund instructions..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl p-3 text-xs font-medium text-fg"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-2 flex items-center justify-between gap-3">
          {complaint.status !== 'Resolved' && (
            <button
              onClick={() => { onResolveComplaint(complaint.id, adminNote || 'Resolved by Super Admin'); onClose(); }}
              className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Resolve & Close Ticket
            </button>
          )}

          <button onClick={onClose} className="bg-surface-3 hover:bg-line-strong text-fg font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer ml-auto">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default ComplaintDetailsModal
