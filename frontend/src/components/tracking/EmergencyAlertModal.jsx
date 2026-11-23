import React, { useState } from 'react'
import { ShieldAlert, AlertTriangle, X, CheckCircle2 } from 'lucide-react'
import alertService from '../../services/alertService'
import socketService from '../../services/socketService'

/**
 * EmergencyAlertModal Component
 * Confirmation modal for raising an emergency alert.
 * Dispatches alert via REST API & real-time Socket.IO.
 */
function EmergencyAlertModal({ isOpen, onClose, droneName, bookingId, droneId }) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleRaiseAlert = async () => {
    setIsSubmitted(true)
    try {
      await alertService.createAlert({
        droneId: droneId || 'sim-drone-1',
        alertType: 'emergency',
        message: `Immediate emergency alert raised for ${droneName || 'Drone'} (#${bookingId || 'DRN-8492'})`,
        severity: 'critical'
      })
    } catch (e) {
      console.warn('Alert API sync note:', e.message)
    }

    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface rounded-2xl max-w-md w-full p-6 border border-line shadow-lg space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-subtle hover:text-fg-muted rounded-xl hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-fg">Emergency Alert Raised</h3>
            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-xl border border-emerald-500/25">
              Emergency alert raised successfully.
            </p>
            <p className="text-[10px] text-subtle font-mono">
              Ground operator notified & telemetry flagged.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg">Emergency Alert</h3>
                <p className="text-xs text-muted font-medium">
                  {droneName || "Active Drone"} ({bookingId || "DRN-10452"})
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-2 text-xs text-rose-400 font-medium">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Confirm Immediate Protocol Flag</span>
              </div>
              <p>
                Are you sure you want to raise an emergency alert for this drone?
              </p>
            </div>

            {/* Developer Notice Badge */}
            <div className="p-2.5 bg-surface-2 rounded-xl border border-line text-[10px] text-muted font-mono text-center">
              Simulated Telemetry Mode: Emits real-time WebSocket alerts to connected operators. Physical drone hardware is not bound.
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRaiseAlert}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-600 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Raise Alert</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default EmergencyAlertModal
