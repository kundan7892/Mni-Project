import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Radio, CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react'
import bookingService from '../../services/bookingService'
import droneService from '../../services/droneService'
import { useAuth } from '../../context/AuthContext'
import { Button, Card, Spinner, ErrorNote, Stat } from '../../components/manage/ui'
import { BookingStatusBadge } from '../../components/manage/Badge'
import { formatINR, formatRange, normalizeDrone } from '../../lib/format'

const REVENUE = ['approved', 'confirmed', 'active', 'completed']

function CustomerOverview() {
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    bookingService
      .getBookings({ limit: 200 })
      .then((res) => alive && setBookings(res?.bookings || []))
      .catch((err) => alive && setError(err.message))
    droneService
      .getDrones({ limit: 3, sort: 'recommended', status: 'available' })
      .then((res) => alive && setSuggestions((res?.drones || []).map(normalizeDrone)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    const list = bookings || []
    const count = (...s) => list.filter((b) => s.includes(b.bookingStatus)).length
    return {
      upcoming: count('pending', 'approved', 'confirmed'),
      active: count('active'),
      completed: count('completed'),
      spent: list.filter((b) => REVENUE.includes(b.bookingStatus)).reduce((s, b) => s + b.totalPrice, 0)
    }
  }, [bookings])

  const next = useMemo(
    () =>
      (bookings || [])
        .filter((b) => ['active', 'approved', 'confirmed', 'pending'].includes(b.bookingStatus))
        .sort((a, b) => (a.bookingStatus === 'active' ? -1 : b.bookingStatus === 'active' ? 1 : new Date(a.startDate) - new Date(b.startDate)))[0],
    [bookings]
  )

  const firstName = currentUser?.name?.split(' ')[0]

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-fg">Hi{firstName ? ` ${firstName}` : ''}</h1>
          <p className="text-sm text-muted">Your rentals at a glance.</p>
        </div>
        <Link to="/drones"><Button variant="primary">Rent a drone <ArrowRight className="w-4 h-4" /></Button></Link>
      </div>

      <ErrorNote>{error}</ErrorNote>

      {!bookings && !error ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Upcoming" icon={CalendarRange} value={stats.upcoming} hint="requested or confirmed" />
            <Stat label="In progress" icon={Radio} value={stats.active} hint="drones with you now" />
            <Stat label="Completed" icon={CheckCircle2} value={stats.completed} hint="returned rentals" />
            <Stat label="Total spent" icon={IndianRupee} value={formatINR(stats.spent)} hint="on confirmed rentals" />
          </div>

          {next ? (
            <Card className="overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-64 aspect-[16/10] sm:aspect-auto bg-surface-2 shrink-0 relative overflow-hidden">
                {next.droneId?.image && <img src={next.droneId.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="flex-1 p-5 space-y-3">
                <div className="text-xs text-subtle">{next.bookingStatus === 'active' ? 'With you now' : 'Next up'}</div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-medium text-fg">{next.droneName}</h2>
                  <BookingStatusBadge status={next.bookingStatus} long />
                </div>
                <p className="text-sm text-muted">
                  {formatRange(next.startDate, next.endDate)} · {formatINR(next.totalPrice)}
                </p>
                <div className="flex gap-2 pt-1">
                  <Link to="/user/rentals"><Button size="sm">View details</Button></Link>
                  {next.bookingStatus === 'active' && <Link to="/user/tracking"><Button size="sm" variant="primary">Track live</Button></Link>}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-medium text-fg">No rentals coming up</h2>
                <p className="text-sm text-muted">Pick a drone, choose your dates, and we'll confirm your request.</p>
              </div>
              <Link to="/drones"><Button variant="primary">Browse drones</Button></Link>
            </Card>
          )}

          {suggestions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-fg">Available to rent</h2>
                <Link to="/drones" className="text-xs text-muted hover:text-fg">See all</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {suggestions.map((d) => (
                  <Link key={d._id} to={`/drones/${d._id}`} className="group">
                    <Card className="overflow-hidden hover:border-line-strong transition-colors">
                      <div className="aspect-[16/10] bg-surface-2 overflow-hidden">
                        {d.image && <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <div className="p-4 flex items-baseline justify-between gap-2">
                        <span className="text-sm text-fg truncate">{d.name}</span>
                        <span className="text-sm text-muted tabular-nums whitespace-nowrap">{formatINR(d.pricePerDay)}/day</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}

export default CustomerOverview
