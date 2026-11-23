import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { CheckCircle2, Clock, Activity, AlertCircle } from 'lucide-react'

/**
 * BookingStatusChart Component
 * Visualizes booking status distribution (Completed, Confirmed, Pending, Active, Cancelled).
 */
function BookingStatusChart({ data = [], title = "Booking Status Distribution", subtitle = "Breakdown of total platform bookings by status" }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-line shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-ink" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Recharts Pie */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={`status-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111113', color: '#FFF', borderRadius: '14px', fontSize: '12px', border: 'none', padding: '10px 14px' }}
              formatter={(val, name) => [`${val} Bookings`, 'Count']}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BookingStatusChart
