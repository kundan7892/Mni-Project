import React, { useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity, Battery, Gauge } from 'lucide-react'

/**
 * FlightHistoryChart Component
 * Visualizes historical battery decay and flight speed using Recharts Area Charts.
 */
function FlightHistoryChart({ drone }) {
  const [activeTab, setActiveTab] = useState('battery') // 'battery' | 'speed'

  const batteryData = drone?.batteryHistory || [
    { time: "14:00", battery: 100 },
    { time: "14:05", battery: 95 },
    { time: "14:10", battery: 90 },
    { time: "14:15", battery: 85 },
    { time: "14:20", battery: 81 },
    { time: "14:25", battery: drone?.battery || 78 }
  ]

  const speedData = drone?.speedHistory || [
    { time: "14:00", speed: 0 },
    { time: "14:05", speed: 22 },
    { time: "14:10", speed: 34 },
    { time: "14:15", speed: 30 },
    { time: "14:20", speed: 36 },
    { time: "14:25", speed: drone?.speed || 32 }
  ]

  return (
    <div className="bg-surface p-5 rounded-2xl border border-line shadow-2xs space-y-4">
      
      {/* Header with Switcher Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-fg flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-ink" />
            <span>Flight Telemetry Analytics</span>
          </h4>
          <p className="text-[11px] text-subtle">Historical performance metrics</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('battery')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'battery'
                ? 'bg-surface text-emerald-400 shadow-xs'
                : 'text-muted hover:text-fg'
            }`}
          >
            <Battery className="w-3.5 h-3.5" />
            <span>Battery</span>
          </button>

          <button
            onClick={() => setActiveTab('speed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'speed'
                ? 'bg-surface text-accent-ink shadow-xs'
                : 'text-muted hover:text-fg'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed</span>
          </button>
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'battery' ? (
            <AreaChart data={batteryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="time" stroke="#9898a2" fontSize={10} tickLine={false} />
              <YAxis stroke="#9898a2" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111113', color: '#FFF', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                formatter={(val) => [`${val}%`, 'Battery']}
              />
              <Area type="monotone" dataKey="battery" stroke="#34d399" strokeWidth={2.5} fillOpacity={1} fill="url(#batteryGrad)" />
            </AreaChart>
          ) : (
            <AreaChart data={speedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b5bd6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5b5bd6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="time" stroke="#9898a2" fontSize={10} tickLine={false} />
              <YAxis stroke="#9898a2" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111113', color: '#FFF', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                formatter={(val) => [`${val} km/h`, 'Speed']}
              />
              <Area type="monotone" dataKey="speed" stroke="#5b5bd6" strokeWidth={2.5} fillOpacity={1} fill="url(#speedGrad)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default FlightHistoryChart
