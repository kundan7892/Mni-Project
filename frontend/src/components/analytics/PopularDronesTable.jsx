import React from 'react'
import { Navigation, Star, Award, TrendingUp } from 'lucide-react'

/**
 * PopularDronesTable Component
 * Ranked performance table for top rented drones.
 */
function PopularDronesTable({ data = [], title = "Top Performing Drone Models", subtitle = "Ranked by gross rental revenue and flight utilization" }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Navigation className="w-4 h-4 text-accent-ink" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">{subtitle}</p>
        </div>
        <span className="text-xs font-bold text-subtle font-mono">
          {data.length} Models Tracked
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Drone Model</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Total Rentals</th>
              <th className="py-3 px-4 text-center">Flight Hours</th>
              <th className="py-3 px-4">Gross Revenue</th>
              <th className="py-3 px-4 text-center">Utilization</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-medium text-fg-muted">
            {data.map((item, idx) => {
              const rankColor =
                idx === 0 ? 'text-amber-400 font-semibold text-sm' :
                idx === 1 ? 'text-subtle font-semibold text-sm' :
                idx === 2 ? 'text-amber-400 font-semibold text-sm' : 'text-muted font-bold'
              
              const badgeIcon = idx === 0 ? '#1' : idx === 1 ? '#2' : idx === 2 ? '#3' : `#${idx + 1}`

              return (
                <tr key={item.droneId || idx} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 ${rankColor}`}>
                      {badgeIcon}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-fg">
                    {item.droneName || item.name}
                  </td>
                  <td className="py-3.5 px-4 text-muted font-medium">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-fg">
                    {item.totalRentals || item.rentals}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-muted">
                    {item.rentalHours || item.hours || "—"} hrs
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-fg">
                    ₹{item.revenue ? item.revenue.toLocaleString() : "0"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-surface-2 rounded-full overflow-hidden border border-line">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${item.utilization}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-fg text-[11px]">
                        {item.utilization}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'Rented'
                        ? 'bg-accent/10 text-accent-ink border-accent/25'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PopularDronesTable
