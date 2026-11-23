import React, { useState } from 'react'
import { Star, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { initialOwnerReviews } from '../../data/ownerData'

function SuperAdminReviews() {
  const [reviews, setReviews] = useState(
    initialOwnerReviews.map((r) => ({ ...r, status: 'Visible' }))
  )
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleToggleHide = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Visible' ? 'Hidden' : 'Visible'
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    )
    showToast(`Review #${id} set to '${nextStatus}'.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Global Review Moderation Desk ({reviews.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Audit customer feedback across all partner storefronts and moderate inappropriate content.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-surface p-6 rounded-2xl border border-line shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={rev.avatar} alt={rev.customerName} className="w-10 h-10 rounded-xl object-cover border border-line shrink-0" />
                <div>
                  <h3 className="font-bold text-fg text-sm">{rev.customerName}</h3>
                  <div className="text-xs text-subtle">Rented: <strong>{rev.droneName}</strong> • {rev.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  rev.status === 'Visible' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                }`}>
                  {rev.status}
                </span>

                <button
                  onClick={() => handleToggleHide(rev.id, rev.status)}
                  className="bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  {rev.status === 'Visible' ? 'Hide Review' : 'Restore'}
                </button>
              </div>
            </div>

            <p className="text-xs text-fg-muted leading-relaxed font-medium">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default SuperAdminReviews
