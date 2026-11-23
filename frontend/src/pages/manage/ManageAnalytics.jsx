import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts'
import { IndianRupee, CalendarCheck, Users, Gauge } from 'lucide-react'
import adminService from '../../services/adminService'
import { Card, PageHeader, Spinner, ErrorNote, Stat } from '../../components/manage/ui'
import { BOOKING_STATUS, formatINR } from '../../lib/format'

const AXIS = { stroke: '#6c6c76', fontSize: 12, tickLine: false, axisLine: false }
const compactINR = (v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`)

function ChartTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-line bg-surface-2 px-3 py-2 text-xs shadow-xl">
      <div className="text-muted mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="text-fg tabular-nums">
          {money ? formatINR(p.value) : `${p.value} ${p.name}`}
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b5bd6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#5b5bd6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#26262b" vertical={false} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} width={52} tickFormatter={compactINR} />
        <Tooltip content={<ChartTooltip money />} cursor={{ stroke: '#3a3a41' }} />
        <Area type="monotone" dataKey="revenue" stroke="#8b8ce8" strokeWidth={2} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Business analytics computed from real bookings (admin: all shops, owner: own fleet). */
function ManageAnalytics() {
  const [months, setMonths] = useState(6)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setData(null)
    setError(null)
    adminService
      .getAnalytics(months)
      .then((d) => alive && setData(d))
      .catch((err) => alive && setError(err.message))
    return () => {
      alive = false
    }
  }, [months])

  const t = data?.totals
  const statusRows = data
    ? Object.entries(data.byStatus)
        .map(([status, count]) => ({ status, count, label: BOOKING_STATUS[status]?.short || status }))
        .sort((a, b) => b.count - a.count)
    : []
  const maxStatus = Math.max(1, ...statusRows.map((r) => r.count))

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Calculated from your bookings. Revenue counts confirmed, active and completed rentals."
        actions={
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="h-9 rounded-lg bg-surface-2 border border-line px-3 text-sm text-fg"
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        }
      />

      <ErrorNote>{error}</ErrorNote>

      {!data ? (
        !error && <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Revenue" icon={IndianRupee} value={formatINR(t.revenue)} hint={`${formatINR(t.collected)} collected`} />
            <Stat label="Bookings" icon={CalendarCheck} value={t.bookings} hint={`${t.pending} awaiting approval`} />
            <Stat label="Customers" icon={Users} value={t.customers} hint={`${t.rentalDays} rental days booked`} />
            <Stat label="Fleet utilisation" icon={Gauge} value={`${t.utilization}%`} hint={`${t.rentedDrones} of ${t.drones} drones out now`} />
          </div>

          <Card className="p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-sm font-medium text-fg">Revenue by month</h2>
              <span className="text-xs text-subtle">by request date</span>
            </div>
            <RevenueChart data={data.monthly} />
          </Card>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h2 className="text-sm font-medium text-fg mb-4">Bookings by month</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#26262b" vertical={false} />
                  <XAxis dataKey="month" {...AXIS} />
                  <YAxis {...AXIS} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#18181b' }} />
                  <Bar dataKey="bookings" name="bookings" fill="#5b5bd6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-sm font-medium text-fg">Booking outcomes</h2>
                <span className="text-xs text-subtle">{t.approvalRate}% approval rate</span>
              </div>
              <div className="space-y-3">
                {statusRows.map((r) => (
                  <div key={r.status} className="grid grid-cols-[96px_1fr_32px] items-center gap-3 text-sm">
                    <span className="text-muted">{r.label}</span>
                    <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${(r.count / maxStatus) * 100}%` }} />
                    </div>
                    <span className="text-right text-fg tabular-nums">{r.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <h2 className="text-sm font-medium text-fg px-5 pt-5 pb-3">Top drones</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-subtle border-y border-line">
                    <th className="font-medium px-5 py-2">Drone</th>
                    <th className="font-medium px-5 py-2 text-right">Rentals</th>
                    <th className="font-medium px-5 py-2 text-right">Days</th>
                    <th className="font-medium px-5 py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.topDrones.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-6 text-center text-muted">No confirmed rentals yet.</td></tr>
                  )}
                  {data.topDrones.map((d) => (
                    <tr key={d.id}>
                      <td className="px-5 py-2.5 text-fg">{d.name}</td>
                      <td className="px-5 py-2.5 text-right text-fg-muted tabular-nums">{d.bookings}</td>
                      <td className="px-5 py-2.5 text-right text-fg-muted tabular-nums">{d.days}</td>
                      <td className="px-5 py-2.5 text-right text-fg tabular-nums">{formatINR(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-medium text-fg mb-4">Revenue by category</h2>
              {data.byCategory.length === 0 ? (
                <p className="text-sm text-muted">No confirmed rentals yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.byCategory.map((c) => (
                    <div key={c.category} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-fg-muted">{c.category}</span>
                        <span className="text-fg tabular-nums">{formatINR(c.revenue)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${(c.revenue / data.byCategory[0].revenue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  )
}

export default ManageAnalytics
