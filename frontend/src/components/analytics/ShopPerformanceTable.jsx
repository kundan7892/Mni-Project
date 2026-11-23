import React from 'react'
import { Store, Award, TrendingUp, Users, Building2 } from 'lucide-react'

/**
 * ShopPerformanceTable Component
 * Super Admin ranking table for partner shops performance.
 */
function ShopPerformanceTable({ data = [], title = "Top Performing Partner Shops", subtitle = "Ranked by gross rental billing and active user volume" }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-subtle font-medium">{subtitle}</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 font-mono">
          {data.length} Partner Stores
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
            <tr>
              <th className="py-3.5 px-4">Rank</th>
              <th className="py-3.5 px-4">Shop Storefront</th>
              <th className="py-3.5 px-4 text-center">Fleet Drones</th>
              <th className="py-3.5 px-4 text-center">Customers</th>
              <th className="py-3.5 px-4 text-center">Total Bookings</th>
              <th className="py-3.5 px-4">Gross Revenue</th>
              <th className="py-3.5 px-4 text-center">Growth</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-medium text-fg-muted">
            {data.map((shop, idx) => {
              const medalBadge =
                idx === 0 ? '#1' :
                idx === 1 ? '#2' :
                idx === 2 ? '#3' : `#${idx + 1}`

              return (
                <tr key={shop.shopId || idx} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-fg">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ${
                      idx === 0 ? 'bg-amber-500/10 text-amber-400 font-semibold' :
                      idx === 1 ? 'bg-surface-3 text-fg font-semibold' :
                      idx === 2 ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-muted font-bold'
                    }`}>
                      {medalBadge}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-fg flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-accent-ink shrink-0" />
                    <span>{shop.shopName || shop.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-fg">
                    {shop.totalDrones || shop.drones}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-fg-muted">
                    {shop.customers}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-fg">
                    {shop.bookings}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-fg">
                    ₹{shop.revenue ? shop.revenue.toLocaleString() : "0"}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-400">
                    {shop.growth}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
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

export default ShopPerformanceTable
