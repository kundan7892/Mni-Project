import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardList, Search, Download } from 'lucide-react'
import bookingService from '../../services/bookingService'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote, Tabs, inputClass } from '../../components/manage/ui'
import { BookingStatusBadge, PaymentBadge } from '../../components/manage/Badge'
import BookingDetail from '../../components/manage/BookingDetail'
import { formatINR, formatRange, formatDate } from '../../lib/format'
import { exportToCSV } from '../../utils/exportCsv'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected,cancelled', label: 'Declined & cancelled' }
]

/** Every booking, with lifecycle management (admin: all shops, owner: own fleet). */
function Orders() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [data, setData] = useState({ bookings: [], counts: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingService.getBookings({ status: tab === 'all' ? undefined : tab, search: query, limit: 200 })
      setData({ bookings: res?.bookings || [], counts: res?.counts || {} })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [tab, query])

  useEffect(() => {
    load()
  }, [load])

  const tabs = useMemo(() => {
    const c = data.counts
    const all = Object.values(c).reduce((s, n) => s + n, 0)
    return TABS.map((t) => ({
      ...t,
      count:
        t.value === 'all'
          ? all
          : t.value.split(',').reduce((s, k) => s + (c[k] || 0) + (k === 'approved' ? c.confirmed || 0 : 0), 0)
    }))
  }, [data.counts])

  const handleChange = (updated) => {
    setSelected(updated)
    load()
  }

  const handleExport = () => {
    exportToCSV(
      data.bookings.map((b) => ({
        Booking: b.bookingNumber,
        Customer: b.customerName,
        Email: b.customerEmail,
        Drone: b.droneName,
        Start: formatDate(b.startDate),
        Days: b.durationDays,
        Total: b.totalPrice,
        Status: b.bookingStatus,
        Payment: b.paymentStatus,
        Requested: formatDate(b.createdAt)
      })),
      'orders.csv'
    )
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every rental, from request to return. Click a row to manage it."
        actions={
          <Button variant="secondary" onClick={handleExport} disabled={!data.bookings.length}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        }
      />

      <Card>
        <div className="px-4 pt-2">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
        </div>
        <div className="p-4 border-b border-line">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search booking, customer or drone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-4">
            <ErrorNote>{error}</ErrorNote>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : data.bookings.length === 0 ? (
          <Empty
            icon={ClipboardList}
            title="No orders found"
            description={query ? 'Try a different search.' : 'Orders appear here once customers request rentals.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-subtle border-b border-line">
                  <th className="font-medium px-4 py-2.5">Booking</th>
                  <th className="font-medium px-4 py-2.5">Customer</th>
                  <th className="font-medium px-4 py-2.5">Drone</th>
                  <th className="font-medium px-4 py-2.5">Dates</th>
                  <th className="font-medium px-4 py-2.5 text-right">Total</th>
                  <th className="font-medium px-4 py-2.5">Status</th>
                  <th className="font-medium px-4 py-2.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.bookings.map((b) => (
                  <tr key={b._id} onClick={() => setSelected(b)} className="hover:bg-surface-2 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-fg-muted whitespace-nowrap">{b.bookingNumber}</td>
                    <td className="px-4 py-3">
                      <div className="text-fg">{b.customerName}</div>
                      <div className="text-xs text-subtle">{b.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{b.droneName}</td>
                    <td className="px-4 py-3 text-fg-muted whitespace-nowrap">{formatRange(b.startDate, b.endDate)}</td>
                    <td className="px-4 py-3 text-right text-fg tabular-nums">{formatINR(b.totalPrice)}</td>
                    <td className="px-4 py-3"><BookingStatusBadge status={b.bookingStatus} /></td>
                    <td className="px-4 py-3"><PaymentBadge status={b.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} onChange={handleChange} />}
    </>
  )
}

export default Orders
