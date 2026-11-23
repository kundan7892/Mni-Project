import React, { useState } from 'react'
import { Navigation, Compass, Layers, Eye, Maximize2, Crosshair, ShieldAlert, Radio, Video, MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { mapThemes } from '../../data/telemetryData'

function TelemetryMapHUD({ telemetry, onRTH, onHold, onLand }) {
  const [viewMode, setViewMode] = useState('map') // 'map', 'fpv', 'split'
  const [selectedThemeId, setSelectedThemeId] = useState('dark')
  const [showGeofence, setShowGeofence] = useState(true)
  const [showRadar, setShowRadar] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1) // 1x, 1.25x, 1.5x

  const activeTheme = mapThemes.find((t) => t.id === selectedThemeId) || mapThemes[0]

  const zoomScale = zoomLevel

  return (
    <div className="space-y-4">
      {/* HUD HEADER CONTROLS BAR */}
      <div className="bg-surface text-white p-3 sm:p-4 rounded-2xl border border-line flex flex-wrap items-center justify-between gap-3 shadow-lg">
        
        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-canvas p-1 rounded-2xl border border-line">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-accent text-white shadow-md' : 'text-subtle hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tactical Map</span>
          </button>
          
          <button
            onClick={() => setViewMode('fpv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'fpv' ? 'bg-emerald-600 text-white shadow-md' : 'text-subtle hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>FPV Stream</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-accent text-white shadow-md' : 'text-subtle hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Split Screen</span>
          </button>
        </div>

        {/* Map Theme & Layer Options */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-subtle font-bold bg-canvas px-3 py-1.5 rounded-2xl border border-line">
            <Layers className="w-3.5 h-3.5 text-accent-ink" />
            <span className="hidden sm:inline">Theme:</span>
            <select
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {mapThemes.map((t) => (
                <option key={t.id} value={t.id} className="bg-surface text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick HUD Overlay Toggles */}
          <button
            onClick={() => setShowGeofence(!showGeofence)}
            className={`text-xs font-bold px-3 py-1.5 rounded-2xl border transition-colors cursor-pointer flex items-center gap-1 ${
              showGeofence ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300' : 'bg-canvas border-line text-muted'
            }`}
            title="Toggle Geofence Perimeter"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Geofence</span>
          </button>
        </div>

      </div>

      {/* MAIN VIEW CONTAINER */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* TACTICAL MAP CONTAINER */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div 
            className="relative h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border-2 border-line shadow-lg transition-all flex items-center justify-center select-none"
            style={{ backgroundColor: activeTheme.bg }}
          >
            
            {/* Grid Pattern Layer */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none transition-transform duration-300"
              style={{
                backgroundImage: `radial-gradient(${activeTheme.gridColor} 1.2px, transparent 1.2px), radial-gradient(${activeTheme.gridColor} 1.2px, ${activeTheme.bg} 1.2px)`,
                backgroundSize: `40px 40px`,
                backgroundPosition: `0 0, 20px 20px`,
                transform: `scale(${zoomScale})`
              }}
            />

            {/* Radar Sweep Effect */}
            {showRadar && (
              <div className="absolute w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full border border-accent/15 pointer-events-none flex items-center justify-center animate-pulse">
                <div className="w-[350px] h-[350px] rounded-full border border-accent/25" />
                <div className="w-[180px] h-[180px] rounded-full border border-accent/35" />
              </div>
            )}

            {/* Geofence Safety Circle Overlay */}
            {showGeofence && (
              <div 
                className={`absolute w-[440px] h-[440px] sm:w-[520px] sm:h-[520px] rounded-full border-2 border-dashed pointer-events-none flex items-center justify-center ${
                  telemetry.isWithinGeofence ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/60 bg-rose-500/10 animate-ping'
                }`}
              >
                <span className="absolute top-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-black/90 text-emerald-400 border border-emerald-500/30">
                  Authorized Flight Geofence Zone ({telemetry.geofenceRadiusMeters}m)
                </span>
              </div>
            )}

            {/* SVG Flight Path Vector Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#c4c5f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                d="M 120 320 Q 260 140, 460 220 T 640 180"
                fill="none"
                stroke="url(#pathGrad)"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Waypoint 1: Base Station */}
            <div className="absolute left-[120px] top-[320px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-line shadow-md">
                {telemetry.shopName || "Takeoff Hub"}
              </div>
              <div className="w-4 h-4 bg-accent rounded-full ring-4 ring-accent/40 mt-1" />
            </div>

            {/* Waypoint Destination Pin */}
            <div className="absolute right-[80px] top-[180px] translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-line shadow-md">
                Target Mission Zone
              </div>
              <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30 mt-1" />
            </div>

            {/* ANIMATED DRONE TELEMETRY MARKER */}
            <div className="absolute left-[460px] top-[220px] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer transition-transform group">
              
              {/* Drone Label Tooltip */}
              <div className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg border border-white flex items-center gap-1.5 group-hover:bg-accent">
                <Navigation className="w-3.5 h-3.5 animate-spin" style={{ transform: `rotate(${telemetry.yaw}deg)` }} />
                <span>{telemetry.droneName}</span>
                <span className="bg-canvas text-accent-ink text-[10px] font-mono px-1.5 py-0.2 rounded-md">
                  {telemetry.altitude}m
                </span>
              </div>

              {/* Pulsing Signal Beacon */}
              <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center mt-1 animate-ping">
                <div className="w-3.5 h-3.5 bg-accent rounded-full ring-4 ring-accent/40 shadow-glow" />
              </div>
            </div>

            {/* MAP HUD OVERLAY CORNERS */}
            <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-line text-white text-xs space-y-1 shadow-lg">
              <div className="font-semibold text-accent-ink flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Telemetry Satellite Stream</span>
              </div>
              <div className="text-[11px] text-fg-muted font-mono">
                GPS: {telemetry.lat.toFixed(4)}° N, {telemetry.lng.toFixed(4)}° E
              </div>
              <div className="text-[10px] text-subtle">
                Sats: <strong className="text-white">{telemetry.satellites} Lock</strong> • Pitch: {telemetry.pitch}°
              </div>
            </div>

            {/* MAP CONTROL BUTTONS (RIGHT SIDE) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.25))}
                className="bg-black/90 hover:bg-surface-2 text-white p-2 rounded-xl border border-line shadow-md cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-accent-ink" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="bg-black/90 hover:bg-surface-2 text-white p-2 rounded-xl border border-line shadow-md cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-accent-ink" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="bg-black/90 hover:bg-surface-2 text-white p-2 rounded-xl border border-line shadow-md cursor-pointer transition-colors"
                title="Re-center Map"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

          </div>
        )}

        {/* FPV LIVE CAMERA FEED PREVIEW */}
        {(viewMode === 'fpv' || viewMode === 'split') && (
          <div className="relative h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border-2 border-line bg-canvas shadow-lg flex items-center justify-center group">
            
            {/* Camera Video Stream Image Simulator */}
            <img
              src={telemetry.cameraStreamUrl}
              alt="Live Drone FPV Feed"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 "
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

            {/* FPV HUD CROSSHAIR OVERLAY */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <Crosshair className="w-24 h-24 text-emerald-400 stroke-1" />
              {/* Pitch Horizon Line */}
              <div className="absolute w-48 h-0.5 bg-emerald-500/40" />
              <div className="absolute h-12 w-0.5 bg-emerald-500/40" />
            </div>

            {/* TOP BAR FPV OSD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
              <div className="bg-rose-500/90 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-rose-500/40">
                <span className="w-2 h-2 rounded-full bg-surface animate-ping" />
                <span>REC 4K 60FPS</span>
              </div>

              <div className="bg-black/90 backdrop-blur-md px-3 py-1 rounded-full border border-line font-mono text-[11px]">
                CAM LATENCY: <span className="text-emerald-400 font-bold">24ms HD</span>
              </div>
            </div>

            {/* BOTTOM BAR FPV TELEMETRY OVERLAY */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-line text-white text-xs flex flex-wrap items-center justify-between gap-3 font-mono shadow-lg z-10">
              <div>
                <span className="text-subtle block text-[10px]">ALTITUDE</span>
                <span className="text-sm font-semibold text-accent-ink">{telemetry.altitude} M</span>
              </div>

              <div>
                <span className="text-subtle block text-[10px]">AIR SPEED</span>
                <span className="text-sm font-semibold text-amber-400">{telemetry.speed} KM/H</span>
              </div>

              <div>
                <span className="text-subtle block text-[10px]">PITCH / ROLL</span>
                <span className="text-sm font-bold text-white">{telemetry.pitch}° / {telemetry.roll}°</span>
              </div>

              <div>
                <span className="text-subtle block text-[10px]">BATTERY</span>
                <span className="text-sm font-semibold text-emerald-400">{telemetry.battery}%</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default TelemetryMapHUD
