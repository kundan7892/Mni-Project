import React, { useState, useMemo } from 'react'
import { Radio, Navigation, Clock, ShieldAlert, PhoneCall, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import initialTrackingData from '../../data/tracking'
import useLiveTracking from '../../hooks/useLiveTracking'
import TrackingMap from '../../components/tracking/TrackingMap'
import DroneTelemetry from '../../components/tracking/DroneTelemetry'
import FlightDetails from '../../components/tracking/FlightDetails'
import TrackingAlerts from '../../components/tracking/TrackingAlerts'
import EmergencyAlertModal from '../../components/tracking/EmergencyAlertModal'

/*
  SECURITY NOTE & DEVELOPER WARNING:
  Frontend filtering is only for demonstration.
  Real tracking authorization must be enforced by the backend.
  A customer must only receive telemetry for their authorized rental.
  A shop owner must only receive telemetry for drones belonging to their shop.
  Super Admin can receive platform-wide telemetry.
*/

function CustomerTracking() {
  const { currentUser } = useAuth()
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  // Use live tracking hook with interval simulation
  const { drones, selectedDrone, setSelectedDroneId, lastSyncSeconds } = useLiveTracking(initialTrackingData)

  // CUSTOMER ROLE ISOLATION:
  // Customer can track ONLY drones associated with their own active rental
  const customerDrones = useMemo(() => {
    /*
      SECURITY NOTE:
      In production, backend APIs must scope queries to `WHERE customer_id = authenticated_user_id`.
    */
    const userId = currentUser?.id || 3 // Fallback to Demo Customer ID 3
    const filtered = drones.filter((d) => d.customerId === userId)
    // If no matching customer record found in mock data, return user's active rental (ID 1)
    return filtered.length > 0 ? filtered : drones.slice(0, 1)
  }, [drones, currentUser])

  const activeDrone = customerDrones[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Track My Drone
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              In Flight
            </span>
          </div>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Real-time GPS telemetry for your active drone rental <strong className="text-fg">{activeDrone?.droneName}</strong>
          </p>
        </div>

        {/* Live Synchronization Status Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-surface-2 px-3.5 py-2 rounded-xl border border-line text-xs font-bold text-fg-muted flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Last synchronized: {lastSyncSeconds}s ago</span>
          </div>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="bg-rose-600 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* LIVE TRACKING MAP HUD */}
      <TrackingMap
        selectedDrone={activeDrone}
        allDrones={[activeDrone]}
        onEmergencyClick={() => setShowEmergencyModal(true)}
      />

      {/* TELEMETRY PANEL */}
      <DroneTelemetry drone={activeDrone} />

      {/* FLIGHT DETAILS & ALERTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlightDetails drone={activeDrone} />
        <TrackingAlerts drone={activeDrone} />
      </div>

      {/* EMERGENCY ALERT CONFIRMATION MODAL */}
      <EmergencyAlertModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        droneName={activeDrone?.droneName}
        bookingId={activeDrone?.bookingId}
      />

    </div>
  )
}

export default CustomerTracking
