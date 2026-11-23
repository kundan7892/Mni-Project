import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, Inbox, Radio, Package, ArrowRight } from 'lucide-react'
import adminService from '../../services/adminService'
import bookingService from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import { Card, Spinner, ErrorNote, Stat, Button } from '../../components/manage/ui'
import { BookingStatusBadge } from '../../components/manage/Badge'
import { RevenueChart } from './ManageAnalytics'
import { formatINR, formatRange, timeAgo } from '../../lib/format'

/** Landing page of the admin / shop owner dashboard. */
function ManageOverview({ basePath }) {
  const { currentUser } = useAuth()
  const [data, setData] = useState(null)
  const [pending, setPending] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([adminService.getAnalytics(6), bookingService.getBookings({ status: 'pending', limit: 5 })])
      .then(([analytics, pend]) => {
        if (!alive) return
        setData(analytics)
        setPending(pend?.bookings || [])
      })
      .catch((err) => alive && setError(err.message))
    return () => {
      alive = false
    }
  }, [])

  const t = data?.totals
  const firstName = currentUser?.name?.split(' ')[0]

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-fg">Welcome back{firstName ? `, ${firstName}` : ''}</h1>
        <p className="text-sm text-muted">Here is how your rentals are doing.</p>
      </div>

      <ErrorNote>{error}</ErrorNote>
      {!data && !error && <Spinner />}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Revenue (all time)" icon={IndianRupee} value={formatINR(t.revenue)} hint={`${formatINR(t.collected)} collected`} />
            <Stat label="Awaiting approval" icon={Inbox} value={t.pending} hint="rental requests" />
            <Stat label="Out with customers" icon={Radio} value={t.active} hint={`${t.utilization}% of fleet`} />
            <Stat label="Products listed" icon={Package} value={t.listedDrones} hint={`${t.drones} in catalogue`} />
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-3 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-fg">Revenue, last 6 months</h2>
                <Link to={`${basePath}/analytics`} className="text-xs text-muted hover:text-fg">Full analytics</Link>
              </div>
              <RevenueChart data={data.monthly} height={240} />
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-sm font-medium text-fg">Needs your decision</h2>
                <Link to={`${basePath}/requests`} className="text-xs text-muted hover:text-fg">All requests</Link>
              </div>
              {pending.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-muted">You're all caught up. No pending requests.</p>
              ) : (
                <ul className="divide-y divide-line border-t border-line">
                  {pending.map((b) => (
                    <li key={b._id}>
                      <Link to={`${basePath}/requests`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface-2">
                        <div className="min-w-0">
                          <div className="text-sm text-fg truncate">{b.customerName} · {b.droneName}</div>
                          <div className="text-xs text-subtle">{formatRange(b.startDate, b.endDate)} · {timeAgo(b.createdAt)}</div>
                        </div>
                        <span className="text-sm text-fg-muted tabular-nums shrink-0">{formatINR(b.totalPrice)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {pending.length > 0 && (
                <div className="mt-auto p-4 border-t border-line">
                  <Link to={`${basePath}/requests`}>
                    <Button variant="primary" className="w-full">Review requests <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-sm font-medium text-fg">Latest orders</h2>
              <Link to={`${basePath}/orders`} className="text-xs text-muted hover:text-fg">All orders</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line border-t border-line">
                  {data.recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="px-5 py-3 font-mono text-xs text-fg-muted">{b.bookingNumber}</td>
                      <td className="px-5 py-3 text-fg">{b.customerName}</td>
                      <td className="px-5 py-3 text-fg-muted">{b.droneName}</td>
                      <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatRange(b.startDate, b.endDate)}</td>
                      <td className="px-5 py-3 text-right text-fg tabular-nums">{formatINR(b.totalPrice)}</td>
                      <td className="px-5 py-3 text-right"><BookingStatusBadge status={b.bookingStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </>
  )
}

export default ManageOverview
