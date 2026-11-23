import React, { useState, useMemo } from 'react'
import { Building2, Radio, RefreshCw, ShieldAlert, Layers } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import initialTrackingData from '../../data/tracking'
import useLiveTracking from '../../hooks/useLiveTracking'
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

function ShopOwnerTracking() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101 // SkyRent Bengaluru Shop 101

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [batteryFilter, setBatteryFilter] = useState('All')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  // Live tracking hook
  const { drones, selectedDrone, selectedDroneId, setSelectedDroneId, lastSyncSeconds } = useLiveTracking(initialTrackingData)

  // SHOP OWNER ROLE DATA ISOLATION:
  // Shop Owner can track ONLY drones belonging to their own shop
  const shopDrones = useMemo(() => {
    /*
      SECURITY NOTE:
      In production, backend APIs must scope queries to `WHERE shop_id = authenticated_shop_id`.
    */
    return drones.filter((drone) => drone.shopId === shopId)
  }, [drones, shopId])

  // Filtered drones based on user input
  const filteredShopDrones = useMemo(() => {
    return shopDrones.filter((drone) => {
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

      return matchesSearch && matchesStatus && matchesBattery
    })
  }, [shopDrones, searchTerm, statusFilter, batteryFilter])

  const activeDrone = shopDrones.find((d) => d.id === selectedDroneId || d.bookingId === selectedDroneId) || shopDrones[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            My Shop — Live Drone Tracking
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Real-time GPS monitoring and telemetry hub for drones dispatched from <strong className="text-accent-ink">{currentUser?.shopName || "SkyRent Bengaluru"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-2 px-3.5 py-2 rounded-xl border border-line text-xs font-bold text-fg-muted flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-accent-ink animate-spin" style={{ animationDuration: '8s' }} />
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

      {/* FILTER BAR */}
      <TrackingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        batteryFilter={batteryFilter}
        onBatteryChange={setBatteryFilter}
        showShopFilter={false}
      />

      {/* MAIN TRACKING DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Drone Cards List (4 cols desktop) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase text-muted tracking-wider">
              Dispatched Fleet ({filteredShopDrones.length})
            </h3>
            <span className="text-[11px] font-bold text-accent-ink">Click to focus map</span>
          </div>

          <TrackingDroneList
            drones={filteredShopDrones}
            selectedDroneId={activeDrone?.id}
            onSelectDrone={(drone) => setSelectedDroneId(drone.id)}
          />
        </div>

        {/* Right Column: Live Map & Telemetry Panel (8 cols desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* MAP */}
          <TrackingMap
            selectedDrone={activeDrone}
            allDrones={shopDrones}
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

export default ShopOwnerTracking
