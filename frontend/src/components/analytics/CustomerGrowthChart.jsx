import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Users, TrendingUp } from 'lucide-react'

/**
 * CustomerGrowthChart Component
 * Visualizes customer user registrations & active users over time.
 */
function CustomerGrowthChart({ data = [], title = "Customer Base Growth", subtitle = "Cumulative registered customer accounts" }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-line shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Recharts Line Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
            <XAxis dataKey="month" stroke="#9898a2" fontSize={11} tickLine={false} />
            <YAxis stroke="#9898a2" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111113', color: '#FFF', borderRadius: '14px', fontSize: '12px', border: 'none', padding: '10px 14px' }}
              formatter={(val, name) => [`${val} Accounts`, name]}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
            <Line type="monotone" dataKey="customers" name="Total Customers" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="activeUsers" name="Active Renters" stroke="#5b5bd6" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CustomerGrowthChart
