import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Calendar, Layers } from 'lucide-react'

/**
 * BookingAnalyticsChart Component
 * Visualizes booking trends over time using Recharts BarChart.
 */
function BookingAnalyticsChart({ data = [], title = "Booking Velocity & Volume", subtitle = "Monthly completed vs confirmed booking volume" }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-line shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent-ink" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Recharts Bar Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
            <XAxis dataKey="month" stroke="#9898a2" fontSize={11} tickLine={false} />
            <YAxis stroke="#9898a2" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111113', color: '#FFF', borderRadius: '14px', fontSize: '12px', border: 'none', padding: '10px 14px' }}
              formatter={(val, name) => [`${val} Bookings`, name]}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
            <Bar dataKey="bookings" name="Total Bookings" fill="#5b5bd6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BookingAnalyticsChart
