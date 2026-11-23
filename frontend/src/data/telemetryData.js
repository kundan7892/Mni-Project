// DroneHub Telemetry & Live Tracking Data Layer (Phase 9)

export const initialTelemetryMap = {
  "RNT-101": {
    rentalId: "RNT-101",
    bookingId: "DRN-8492",
    droneName: "Mavic 3 Pro",
    shopName: "SkyRent Bengaluru",
    shopLocation: "Bengaluru, Karnataka",
    customerName: "Rahul Sharma",
    statusText: "In Flight",
    statusType: "active", // active, standby, rth, landing, alert
    lat: 12.9716,
    lng: 77.5946,
    targetLat: 12.9820,
    targetLng: 77.6100,
    originLat: 12.9600,
    originLng: 77.5800,
    altitude: 120, // meters
    speed: 42, // km/h
    battery: 78,
    signalPercent: 94,
    signalText: "Excellent",
    satellites: 16,
    flightTimeMin: 18,
    totalDistanceKm: 4.8,
    geofenceRadiusMeters: 3000,
    isWithinGeofence: true,
    pitch: 4,
    roll: -2,
    yaw: 145,
    cameraStreamUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    waypoints: [
      { id: 1, label: "Takeoff Point (SkyRent Hub)", lat: 12.9600, lng: 77.5800, status: "Passed" },
      { id: 2, label: "Waypoint A (MG Road Orbit)", lat: 12.9716, lng: 77.5946, status: "Current" },
      { id: 3, label: "Waypoint B (Indiranagar Survey)", lat: 12.9820, lng: 77.6100, status: "Upcoming" },
      { id: 4, label: "Destination Point", lat: 12.9900, lng: 77.6250, status: "Upcoming" }
    ],
    history: [
      { time: "10:00", altitude: 0, speed: 0, battery: 100 },
      { time: "10:05", altitude: 45, speed: 22, battery: 95 },
      { time: "10:10", altitude: 90, speed: 38, battery: 89 },
      { time: "10:15", altitude: 120, speed: 45, battery: 83 },
      { time: "10:18", altitude: 120, speed: 42, battery: 78 }
    ]
  },
  "RNT-102": {
    rentalId: "RNT-102",
    bookingId: "DRN-7320",
    droneName: "DJI Mini 4 Pro Fly More",
    shopName: "AeroTech Mumbai",
    shopLocation: "Mumbai, Maharashtra",
    customerName: "Priya Patel",
    statusText: "On Standby",
    statusType: "standby",
    lat: 19.0760,
    lng: 72.8777,
    targetLat: 19.0850,
    targetLng: 72.8900,
    originLat: 19.0700,
    originLng: 72.8700,
    altitude: 0,
    speed: 0,
    battery: 100,
    signalPercent: 98,
    signalText: "Strong",
    satellites: 18,
    flightTimeMin: 0,
    totalDistanceKm: 0,
    geofenceRadiusMeters: 2500,
    isWithinGeofence: true,
    pitch: 0,
    roll: 0,
    yaw: 90,
    cameraStreamUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    waypoints: [
      { id: 1, label: "Pad 1 - AeroTech Hub", lat: 19.0760, lng: 72.8777, status: "Current" },
      { id: 2, label: "BKC Commercial Zone", lat: 19.0850, lng: 72.8900, status: "Upcoming" }
    ],
    history: [
      { time: "10:00", altitude: 0, speed: 0, battery: 100 },
      { time: "10:05", altitude: 0, speed: 0, battery: 100 },
      { time: "10:10", altitude: 0, speed: 0, battery: 100 }
    ]
  },
  "DRN-10454": {
    rentalId: "RNT-OWN-1",
    bookingId: "DRN-10454",
    droneName: "Mavic 3 Enterprise Multispectral",
    shopName: "SkyRent Bengaluru",
    shopLocation: "Bengaluru, Karnataka",
    customerName: "Vikram Malhotra",
    statusText: "Surveying Mission",
    statusType: "active",
    lat: 12.9352,
    lng: 77.6245,
    targetLat: 12.9450,
    targetLng: 77.6350,
    originLat: 12.9250,
    originLng: 77.6100,
    altitude: 145,
    speed: 48,
    battery: 82,
    signalPercent: 91,
    signalText: "Excellent",
    satellites: 19,
    flightTimeMin: 24,
    totalDistanceKm: 6.2,
    geofenceRadiusMeters: 4000,
    isWithinGeofence: true,
    pitch: 2,
    roll: 1,
    yaw: 210,
    cameraStreamUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    waypoints: [
      { id: 1, label: "SkyRent Hub Base", lat: 12.9250, lng: 77.6100, status: "Passed" },
      { id: 2, label: "Koramangala Agri Sector", lat: 12.9352, lng: 77.6245, status: "Current" },
      { id: 3, label: "HSR Grid Survey Zone", lat: 12.9450, lng: 77.6350, status: "Upcoming" }
    ],
    history: [
      { time: "09:30", altitude: 0, speed: 0, battery: 100 },
      { time: "09:40", altitude: 80, speed: 30, battery: 94 },
      { time: "09:50", altitude: 140, speed: 46, battery: 88 },
      { time: "10:00", altitude: 145, speed: 48, battery: 82 }
    ]
  },
  "DRN-30101": {
    rentalId: "RNT-ADM-1",
    bookingId: "DRN-30101",
    droneName: "Phantom 4 RTK Mapper",
    shopName: "GeoSpatial Fleet Delhi",
    shopLocation: "New Delhi, Delhi",
    customerName: "Siddharth Mehta",
    statusText: "Low Battery Warning",
    statusType: "alert",
    lat: 28.6139,
    lng: 77.2090,
    targetLat: 28.6250,
    targetLng: 77.2200,
    originLat: 28.6000,
    originLng: 77.1900,
    altitude: 85,
    speed: 35,
    battery: 18,
    signalPercent: 74,
    signalText: "Moderate",
    satellites: 12,
    flightTimeMin: 38,
    totalDistanceKm: 8.9,
    geofenceRadiusMeters: 5000,
    isWithinGeofence: false,
    pitch: -3,
    roll: 4,
    yaw: 315,
    cameraStreamUrl: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=1200&q=80",
    waypoints: [
      { id: 1, label: "Delhi Base Dispatch", lat: 28.6000, lng: 77.1900, status: "Passed" },
      { id: 2, label: "CP Grid Mapping", lat: 28.6139, lng: 77.2090, status: "Current" },
      { id: 3, label: "Auto RTH Target", lat: 28.6000, lng: 77.1900, status: "Triggered" }
    ],
    history: [
      { time: "09:00", altitude: 0, speed: 0, battery: 100 },
      { time: "09:15", altitude: 100, speed: 40, battery: 72 },
      { time: "09:30", altitude: 110, speed: 42, battery: 45 },
      { time: "09:45", altitude: 85, speed: 35, battery: 18 }
    ]
  }
}

export const mapThemes = [
  { id: "dark", label: "Dark Tactical", bg: "#111113", gridColor: "#38bdf8", accent: "#0284c7" },
  { id: "satellite", label: "Satellite Hybrid", bg: "#051622", gridColor: "#34d399", accent: "#059669" },
  { id: "topographic", label: "Topo Contour", bg: "#1e1b4b", gridColor: "#c4c5f7", accent: "#8b8ce8" },
  { id: "light", label: "Daylight Contrast", bg: "#26262b", gridColor: "#9898a2", accent: "#5b5bd6" }
]
