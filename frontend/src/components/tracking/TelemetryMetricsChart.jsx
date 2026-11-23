import React, { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity, Battery, Compass, Zap } from 'lucide-react'

function TelemetryMetricsChart({ history, battery, speed, altitude }) {
  const [activeTab, setActiveTab] = useState('altitudeSpeed') // 'altitudeSpeed', 'battery'

  return (
    <div className="bg-surface rounded-2xl p-5 border border-line shadow-2xs space-y-4">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 text-accent-ink rounded-2xl">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-fg">Live Telemetry Performance Analytics</h3>
            <p className="text-[11px] text-muted">Real-time sensor logs stream feed</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-surface-2 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('altitudeSpeed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'altitudeSpeed' ? 'bg-surface text-fg shadow-xs' : 'text-muted hover:text-fg'
            }`}
          >
            Altitude & Speed
          </button>

          <button
            onClick={() => setActiveTab('battery')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'battery' ? 'bg-surface text-fg shadow-xs' : 'text-muted hover:text-fg'
            }`}
          >
            Battery Discharge
          </button>
        </div>
      </div>

      {/* CHART GRAPH AREA */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'altitudeSpeed' ? (
            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9898a2' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9898a2' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111113',
                  borderRadius: '16px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Line type="monotone" dataKey="altitude" name="Altitude (m)" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} />
              <Line type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#d97706" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#d97706' }} />
            </LineChart>
          ) : (
            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9898a2' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9898a2' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111113',
                  borderRadius: '16px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Line type="monotone" dataKey="battery" name="Battery %" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* QUICK STAT METRICS SUMMARY */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line text-xs">
        <div className="bg-surface-2 p-2.5 rounded-2xl flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent-ink shrink-0" />
          <div>
            <span className="text-[10px] text-subtle block font-bold">ALTITUDE</span>
            <span className="font-semibold text-fg">{altitude} m</span>
          </div>
        </div>

        <div className="bg-surface-2 p-2.5 rounded-2xl flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-subtle block font-bold">AIR SPEED</span>
            <span className="font-semibold text-fg">{speed} km/h</span>
          </div>
        </div>

        <div className="bg-surface-2 p-2.5 rounded-2xl flex items-center gap-2">
          <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-subtle block font-bold">BATTERY</span>
            <span className="font-semibold text-emerald-400">{battery}%</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TelemetryMetricsChart
