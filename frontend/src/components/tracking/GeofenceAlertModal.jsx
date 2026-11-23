import React from 'react'
import { AlertTriangle, ShieldAlert, Navigation, X } from 'lucide-react'
import alertService from '../../services/alertService'

function GeofenceAlertModal({ isOpen, onClose, telemetry, onRTH }) {
  if (!isOpen) return null

  const handleTriggerRTH = async () => {
    try {
      if (telemetry?.droneId || telemetry?.id) {
        await alertService.createAlert({
          droneId: telemetry?.droneId || telemetry?.id,
          alertType: 'geofence',
          message: `Geofence boundary breach acknowledged. Simulated RTH requested for ${telemetry?.droneName || 'Drone'}.`,
          severity: 'high',
          location: {
            latitude: telemetry?.lat || telemetry?.latitude || 12.9716,
            longitude: telemetry?.lng || telemetry?.longitude || 77.5946,
            altitude: telemetry?.altitude || 45
          }
        });
      }
    } catch (e) {
      // Handled
    }
    if (onRTH) onRTH();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-surface rounded-2xl p-6 max-w-lg w-full border-2 border-rose-500/40 shadow-lg space-y-4 relative overflow-hidden">
        
        {/* Top Warning Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500 animate-pulse" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-subtle hover:text-muted p-1.5 rounded-full hover:bg-surface-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-rose-500/10 rounded-2xl shrink-0">
            <ShieldAlert className="w-8 h-8 text-rose-400 animate-bounce" />
          </div>
          <div>
            <div className="inline-block bg-rose-500/10 text-rose-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              Safety Perimeter Warning
            </div>
            <h3 className="text-xl font-semibold text-fg">
              Geofence Flight Boundary Alert
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Automated Air Traffic Telemetry Safety Service
            </p>
          </div>
        </div>

        <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/25 space-y-2 text-xs text-rose-400">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Target Drone: {telemetry?.droneName} ({telemetry?.bookingId})</span>
          </div>
          <p className="leading-relaxed">
            The drone telemetry system detected the aircraft reaching or exceeding the maximum pre-approved flight safety radius of <strong>{telemetry?.geofenceRadiusMeters} meters</strong> from origin base.
          </p>
          <div className="font-mono text-[11px] bg-white/80 p-2 rounded-xl border border-rose-500/25">
            GPS Location: {telemetry?.lat}° N, {telemetry?.lng}° E • Battery: {telemetry?.battery}%
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
          >
            Dismiss & Keep Manual Flight
          </button>

          <button
            onClick={handleTriggerRTH}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Trigger Simulated Return-To-Home</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default GeofenceAlertModal
