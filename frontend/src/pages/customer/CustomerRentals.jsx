import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Compass } from 'lucide-react'
import bookingService from '../../services/bookingService'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote, Tabs, Modal, inputClass } from '../../components/manage/ui'
import { BookingStatusBadge, PaymentBadge } from '../../components/manage/Badge'
import { ADDON_LABELS } from '../../components/booking/addons'
import { formatINR, formatRange, formatDateTime } from '../../lib/format'

const STEPS = [
  { key: 'pending', label: 'Requested' },
  { key: 'approved', label: 'Confirmed' },
  { key: 'active', label: 'Picked up' },
  { key: 'completed', label: 'Returned' }
]

const GROUPS = {
  upcoming: ['pending', 'approved', 'confirmed'],
  active: ['active'],
  past: ['completed', 'rejected', 'cancelled']
}

function Progress({ status }) {
  if (status === 'rejected' || status === 'cancelled') return null
  const idx = STEPS.findIndex((s) => s.key === (status === 'confirmed' ? 'approved' : status))
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STEPS.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 ${i <= idx ? 'text-fg' : 'text-subtle'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${i < idx ? 'bg-accent-ink' : i === idx ? 'bg-accent ring-4 ring-accent/20' : 'bg-line-strong'}`} />
            {s.label}
          </span>
          {i < STEPS.length - 1 && <span className={`w-6 h-px ${i < idx ? 'bg-accent-ink/60' : 'bg-line'}`} />}
        </li>
      ))}
    </ol>
  )
}

function RentalCard({ booking, onCancel }) {
  const drone = typeof booking.droneId === 'object' ? booking.droneId : null
  const canCancel = ['pending', 'approved', 'confirmed'].includes(booking.bookingStatus)

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 aspect-[16/10] sm:aspect-auto bg-surface-2 shrink-0 relative overflow-hidden">
          {drone?.image && <img src={drone.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
        <div className="flex-1 p-5 space-y-4 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {drone ? (
                  <Link to={`/drones/${drone._id}`} className="font-medium text-fg hover:underline truncate">{booking.droneName}</Link>
                ) : (
                  <span className="font-medium text-fg">{booking.droneName}</span>
                )}
              </div>
              <div className="text-sm text-muted">
                {formatRange(booking.startDate, booking.endDate)} · {booking.durationDays} day{booking.durationDays === 1 ? '' : 's'}
                {booking.shopName ? ` · ${booking.shopName}` : ''}
              </div>
            </div>
            <div className="flex gap-2">
              <BookingStatusBadge status={booking.bookingStatus} long />
            </div>
          </div>

          <Progress status={booking.bookingStatus} />

          {booking.bookingStatus === 'rejected' && (
            <p className="text-sm text-muted">
              The shop couldn't accept this request{booking.rejectionReason ? `: ${booking.rejectionReason}` : '.'}
            </p>
          )}
          {booking.bookingStatus === 'cancelled' && booking.cancellationReason && (
            <p className="text-sm text-muted">Cancelled: {booking.cancellationReason}</p>
          )}
          {booking.bookingStatus === 'approved' && (
            <p className="text-sm text-muted">Confirmed. Bring your ID to pickup; the deposit of {formatINR(booking.securityDeposit)} is collected then.</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line text-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
              <span className="font-mono text-xs">{booking.bookingNumber}</span>
              <span>Total <span className="text-fg tabular-nums">{formatINR(booking.totalPrice)}</span></span>
              {(booking.selectedAddons || []).length > 0 && (
                <span className="text-xs">{booking.selectedAddons.map((a) => ADDON_LABELS[a] || a).join(', ')}</span>
              )}
              <PaymentBadge status={booking.paymentStatus} />
            </div>
            <div className="flex gap-2">
              {booking.bookingStatus === 'active' && (
                <Link to="/user/tracking"><Button size="sm">Track</Button></Link>
              )}
              {['completed', 'rejected', 'cancelled'].includes(booking.bookingStatus) && drone && (
                <Link to={`/booking/${drone._id}`}><Button size="sm">Book again</Button></Link>
              )}
              {canCancel && (
                <Button size="sm" variant="danger-ghost" onClick={() => onCancel(booking)}>Cancel</Button>
              )}
            </div>
          </div>
          <div className="text-xs text-subtle">Requested {formatDateTime(booking.createdAt)}</div>
        </div>
      </div>
    </Card>
  )
}

/** The signed-in customer's rentals, with live status from the backend. */
function CustomerRentals() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('upcoming')
  const [cancelling, setCancelling] = useState(null)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingService.getBookings({ limit: 200 })
      setBookings(res?.bookings || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const grouped = useMemo(() => {
    const g = { upcoming: [], active: [], past: [] }
    bookings.forEach((b) => {
      const key = Object.keys(GROUPS).find((k) => GROUPS[k].includes(b.bookingStatus)) || 'past'
      g[key].push(b)
    })
    g.upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    return g
  }, [bookings])

  // Open the most relevant tab on first load
  useEffect(() => {
    if (!loading && grouped.upcoming.length === 0) {
      if (grouped.active.length) setTab('active')
      else if (grouped.past.length) setTab('past')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const confirmCancel = async () => {
    setBusy(true)
    setError(null)
    try {
      const updated = await bookingService.cancelBooking(cancelling._id, reason.trim() || 'Cancelled by customer')
      setBookings((list) => list.map((b) => (b._id === updated._id ? { ...b, ...updated } : b)))
      setCancelling(null)
      setReason('')
    } catch (err) {
      setError(err.message)
      setCancelling(null)
    } finally {
      setBusy(false)
    }
  }

  const tabs = [
    { value: 'upcoming', label: 'Upcoming', count: grouped.upcoming.length },
    { value: 'active', label: 'In progress', count: grouped.active.length },
    { value: 'past', label: 'Past', count: grouped.past.length }
  ]
  const list = grouped[tab]

  return (
    <>
      <PageHeader
        title="My rentals"
        description="Track your requests from approval to return."
        actions={<Link to="/drones"><Button variant="primary"><Compass className="w-4 h-4" /> Rent a drone</Button></Link>}
      />

      <ErrorNote>{error}</ErrorNote>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {loading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <Card>
          <Empty
            icon={CalendarRange}
            title={tab === 'upcoming' ? 'No upcoming rentals' : tab === 'active' ? 'Nothing out right now' : 'No past rentals yet'}
            description={tab === 'upcoming' ? 'Find a drone and request your dates. The shop confirms within a day.' : undefined}
            action={tab === 'upcoming' && <Link to="/drones"><Button variant="primary">Browse drones</Button></Link>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((b) => <RentalCard key={b._id} booking={b} onCancel={setCancelling} />)}
        </div>
      )}

      <Modal
        open={Boolean(cancelling)}
        size="sm"
        onClose={() => setCancelling(null)}
        title="Cancel this rental?"
        description={cancelling ? `${cancelling.droneName}, ${formatRange(cancelling.startDate, cancelling.endDate)}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelling(null)}>Keep booking</Button>
            <Button variant="danger" loading={busy} onClick={confirmCancel}>Cancel rental</Button>
          </>
        }
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-fg-muted">Reason (optional)</span>
          <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Plans changed" />
        </label>
      </Modal>
    </>
  )
}

export default CustomerRentals
