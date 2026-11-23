import { useState, useEffect, useCallback } from 'react'
import { initialTelemetryMap } from '../data/telemetryData'

export function useTelemetrySimulator(rentalKey = "RNT-101", fallbackData = null) {
  const getInitialState = useCallback(() => {
    if (initialTelemetryMap[rentalKey]) {
      return { ...initialTelemetryMap[rentalKey] }
    }
    if (fallbackData) {
      return {
        rentalId: rentalKey,
        bookingId: fallbackData.bookingId || "DRN-LIVE",
        droneName: fallbackData.droneName || "Drone Hub Unit",
        shopName: fallbackData.shopName || "SkyRent Hub",
        shopLocation: fallbackData.shopLocation || "Bengaluru",
        customerName: fallbackData.customerName || "User",
        statusText: fallbackData.telemetry?.statusText || "In Flight",
        statusType: "active",
        lat: fallbackData.telemetry?.lat || 12.9716,
        lng: fallbackData.telemetry?.lng || 77.5946,
        targetLat: 12.9850,
        targetLng: 77.6150,
        originLat: 12.9600,
        originLng: 77.5800,
        altitude: parseFloat(fallbackData.telemetry?.altitude) || 120,
        speed: parseFloat(fallbackData.telemetry?.speed) || 42,
        battery: fallbackData.telemetry?.battery || 78,
        signalPercent: 92,
        signalText: fallbackData.telemetry?.signal || "Excellent",
        satellites: 15,
        flightTimeMin: parseFloat(fallbackData.telemetry?.flightTime) || 18,
        totalDistanceKm: 4.5,
        geofenceRadiusMeters: 3000,
        isWithinGeofence: true,
        pitch: 3,
        roll: -1,
        yaw: 120,
        cameraStreamUrl: fallbackData.droneImage || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
        waypoints: [
          { id: 1, label: "Takeoff Base", lat: 12.9600, lng: 77.5800, status: "Passed" },
          { id: 2, label: "Waypoint 1", lat: 12.9716, lng: 77.5946, status: "Current" },
          { id: 3, label: "Destination Zone", lat: 12.9850, lng: 77.6150, status: "Upcoming" }
        ],
        history: [
          { time: "10:00", altitude: 0, speed: 0, battery: 100 },
          { time: "10:05", altitude: 60, speed: 30, battery: 92 },
          { time: "10:10", altitude: 120, speed: 42, battery: 84 },
          { time: "10:15", altitude: 120, speed: 42, battery: 78 }
        ]
      }
    }
    return { ...initialTelemetryMap["RNT-101"] }
  }, [rentalKey, fallbackData])

  const [telemetry, setTelemetry] = useState(getInitialState)
  const [isSimulating, setIsSimulating] = useState(true)
  const [lastSync, setLastSync] = useState("Just now")
  const [commandNotification, setCommandNotification] = useState(null)

  // Reset state when rentalKey changes
  useEffect(() => {
    setTelemetry(getInitialState())
  }, [rentalKey, getInitialState])

  // Periodic Telemetry Tick Engine (every 3 seconds)
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (!prev) return prev
        if (prev.statusType === 'standby') return prev

        // Calculate dynamic shifts
        const latDelta = (Math.random() - 0.48) * 0.0004
        const lngDelta = (Math.random() - 0.48) * 0.0004

        let newAlt = prev.altitude
        let newSpeed = prev.speed

        if (prev.statusType === 'landing') {
          newAlt = Math.max(0, prev.altitude - 15)
          newSpeed = Math.max(0, prev.speed - 8)
        } else if (prev.statusType === 'rth') {
          // move closer to origin
          newAlt = 100
          newSpeed = 50
        } else {
          newAlt = Math.max(20, Math.min(250, prev.altitude + Math.floor((Math.random() - 0.5) * 6)))
          newSpeed = Math.max(10, Math.min(65, prev.speed + Math.floor((Math.random() - 0.5) * 4)))
        }

        const newBattery = Math.max(1, prev.battery - (Math.random() > 0.6 ? 1 : 0))
        const newSatellites = Math.max(8, Math.min(22, prev.satellites + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

        const updatedHistory = [...prev.history]
        if (updatedHistory.length > 8) updatedHistory.shift()
        updatedHistory.push({
          time: nowTime.split(':')[1] + 'm ' + nowTime.split(':')[2] + 's',
          altitude: newAlt,
          speed: newSpeed,
          battery: newBattery
        })

        return {
          ...prev,
          lat: Number((prev.lat + latDelta).toFixed(5)),
          lng: Number((prev.lng + lngDelta).toFixed(5)),
          altitude: newAlt,
          speed: newSpeed,
          battery: newBattery,
          satellites: newSatellites,
          pitch: Number((prev.pitch + (Math.random() - 0.5) * 2).toFixed(1)),
          roll: Number((prev.roll + (Math.random() - 0.5) * 2).toFixed(1)),
          yaw: Math.round((prev.yaw + (Math.random() - 0.5) * 5 + 360) % 360),
          history: updatedHistory,
          statusText: newBattery <= 15 ? "CRITICAL BATTERY" : prev.statusText,
          statusType: newBattery <= 15 ? "alert" : prev.statusType
        }
      })

      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isSimulating])

  // Command handlers
  const triggerRTH = () => {
    setTelemetry((prev) => ({
      ...prev,
      statusText: "Auto Return-To-Home (RTH)",
      statusType: "rth",
      targetLat: prev.originLat,
      targetLng: prev.originLng
    }))
    setCommandNotification("Command Transmitted: Auto Return-To-Home (RTH) Activated.")
    setTimeout(() => setCommandNotification(null), 4000)
  }

  const triggerHold = () => {
    setTelemetry((prev) => ({
      ...prev,
      statusText: "Hovering / Position Hold",
      statusType: "standby",
      speed: 0
    }))
    setCommandNotification("Command Transmitted: Drone Position Hold Engaged.")
    setTimeout(() => setCommandNotification(null), 4000)
  }

  const triggerLand = () => {
    setTelemetry((prev) => ({
      ...prev,
      statusText: "Initiating Controlled Landing",
      statusType: "landing"
    }))
    setCommandNotification("Command Transmitted: Immediate Controlled Landing Initiated.")
    setTimeout(() => setCommandNotification(null), 4000)
  }

  const triggerSnapshot = () => {
    setCommandNotification("Remote FPV Snapshot Captured & Saved to Flight Logs!")
    setTimeout(() => setCommandNotification(null), 4000)
  }

  const forceSync = () => {
    setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

  return {
    telemetry,
    setTelemetry,
    isSimulating,
    setIsSimulating,
    lastSync,
    commandNotification,
    triggerRTH,
    triggerHold,
    triggerLand,
    triggerSnapshot,
    forceSync
  }
}
