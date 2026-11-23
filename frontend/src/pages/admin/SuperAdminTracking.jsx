import React, { useState, useMemo } from 'react'
import { Building2, Radio, RefreshCw, ShieldAlert, AlertTriangle, Layers } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import initialTrackingData from '../../data/tracking'
import useLiveTracking from '../../hooks/useLiveTracking'
import TrackingStats from '../../components/tracking/TrackingStats'
import TrackingMap from '../../components/tracking/TrackingMap'
import TrackingDroneList from '../../components/tracking/TrackingDroneList'
import DroneTelemetry from '../../components/tracking/DroneTelemetry'
import FlightHistoryChart from '../../components/tracking/FlightHistoryChart'
import FlightDetails from '../../components/tracking/FlightDetails'
import TrackingAlerts from '../../components/tracking/TrackingAlerts'
import TrackingFilters from '../../components/tracking/TrackingFilters'
import EmergencyAlertModal from '../../components/tracking/EmergencyAlertModal'

/*
  SECURITY NOTE & DEVELOPER WARNING:
  Frontend filtering is only for demonstration.
  Real tracking authorization must be enforced by the backend.
  A customer must only receive telemetry for their authorized rental.
  A shop owner must only receive telemetry for drones belonging to their shop.
  Super Admin can receive platform-wide telemetry.
*/

function SuperAdminTracking() {
  const { currentUser } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [batteryFilter, setBatteryFilter] = useState('All')
  const [shopFilter, setShopFilter] = useState('All')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  // Live tracking hook
  const { drones, selectedDrone, selectedDroneId, setSelectedDroneId, lastSyncSeconds } = useLiveTracking(initialTrackingData)

  // Extract unique shop names list for Admin Shop Filter
  const shopsList = useMemo(() => {
    return Array.from(new Set(drones.map((d) => d.shopName)))
  }, [drones])

  // SUPER ADMIN ROLE ACCESS:
  // Super Admin can see ALL tracked drones from all shops (no mandatory shop-level filtering)
  const filteredDrones = useMemo(() => {
    return drones.filter((drone) => {
      // Search filter
      const matchesSearch =
        drone.droneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drone.customerName && drone.customerName.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const matchesStatus = statusFilter === 'All' || drone.status === statusFilter

      // Battery filter
      let matchesBattery = true
      if (batteryFilter === 'above50') matchesBattery = drone.battery > 50
      if (batteryFilter === '20to50') matchesBattery = drone.battery >= 20 && drone.battery <= 50
      if (batteryFilter === 'below20') matchesBattery = drone.battery < 20

      // Admin Shop filter
      const matchesShop = shopFilter === 'All' || drone.shopName === shopFilter

      return matchesSearch && matchesStatus && matchesBattery && matchesShop
    })
  }, [drones, searchTerm, statusFilter, batteryFilter, shopFilter])

  const activeDrone = drones.find((d) => d.id === selectedDroneId || d.bookingId === selectedDroneId) || drones[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Platform Live Tracking
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Nationwide satellite telemetry command center for all partner shop drone operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-2 px-3.5 py-2 rounded-xl border border-line text-xs font-bold text-fg-muted flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Synced: {lastSyncSeconds}s ago</span>
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

      {/* ADMIN SUMMARY STATS CARDS */}
      <TrackingStats drones={drones} />

      {/* FILTER BAR WITH ADMIN SHOP FILTER */}
      <TrackingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        batteryFilter={batteryFilter}
        onBatteryChange={setBatteryFilter}
        shopFilter={shopFilter}
        onShopChange={setShopFilter}
        showShopFilter={true}
        shopsList={shopsList}
      />

      {/* MAIN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Drone Cards List (4 cols desktop) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase text-muted tracking-wider">
              All Monitored Drones ({filteredDrones.length})
            </h3>
            <span className="text-[11px] font-bold text-emerald-400">Select to focus</span>
          </div>

          <TrackingDroneList
            drones={filteredDrones}
            selectedDroneId={activeDrone?.id}
            onSelectDrone={(drone) => setSelectedDroneId(drone.id)}
          />
        </div>

        {/* Right Column: Live Map & Telemetry Panel (8 cols desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* MAP */}
          <TrackingMap
            selectedDrone={activeDrone}
            allDrones={filteredDrones}
            onSelectDrone={(drone) => setSelectedDroneId(drone.id)}
            onEmergencyClick={() => setShowEmergencyModal(true)}
          />

          {/* TELEMETRY METRICS */}
          <DroneTelemetry drone={activeDrone} />

          {/* CHARTS */}
          <FlightHistoryChart drone={activeDrone} />

        </div>

      </div>

      {/* FLIGHT DETAILS & ALERTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlightDetails drone={activeDrone} />
        <TrackingAlerts drone={activeDrone} />
      </div>

      {/* EMERGENCY ALERT MODAL */}
      <EmergencyAlertModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        droneName={activeDrone?.droneName}
        bookingId={activeDrone?.bookingId}
      />

    </div>
  )
}

export default SuperAdminTracking
