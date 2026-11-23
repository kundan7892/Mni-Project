import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Heart, Camera, Clock, Gauge, Weight, Navigation, MapPin, ShieldCheck, CalendarDays, Check } from 'lucide-react'
import droneService from '../services/droneService'
import DroneCard from '../components/DroneCard'
import { Button, Card, Spinner, ErrorNote } from '../components/manage/ui'
import { useWishlist } from '../hooks/useWishlist'
import { formatINR, formatRange, normalizeDrone } from '../lib/format'

const IN_THE_BOX = [
  'Drone with calibrated gimbal',
  'Remote controller',
  'Three flight batteries and charging hub',
  'Spare propellers',
  'Hard carrying case',
  'Pre-flight checklist'
]

const STATUS_TEXT = {
  available: { text: 'Available now', dot: 'bg-emerald-400' },
  rented: { text: 'Currently out on rent. You can still book future dates.', dot: 'bg-amber-400' },
  maintenance: { text: 'In maintenance. Bookings open again soon.', dot: 'bg-subtle' },
  offline: { text: 'Not available to book right now.', dot: 'bg-subtle' }
}

function Spec({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="w-4 h-4 text-subtle shrink-0" />
      <span className="text-sm text-muted flex-1">{label}</span>
      <span className="text-sm text-fg">{value}</span>
    </div>
  )
}

function DroneDetails() {
  const { id } = useParams()
  const { has, toggle } = useWishlist()
  const [drone, setDrone] = useState(null)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(0)
  const [reserved, setReserved] = useState([])
  const [related, setRelated] = useState([])

  useEffect(() => {
    let alive = true
    setDrone(null)
    setError(null)
    setActive(0)
    droneService
      .getDroneById(id)
      .then((d) => {
        if (!alive) return
        const item = normalizeDrone(d)
        setDrone(item)
        droneService
          .getDrones({ category: item.category, limit: 4 })
          .then((res) => alive && setRelated((res?.drones || []).map(normalizeDrone).filter((x) => x._id !== item._id).slice(0, 3)))
          .catch(() => {})
      })
      .catch((err) => alive && setError(err.status === 404 || err.status === 400 ? 'not-found' : err.message))
    droneService.getAvailability(id).then((r) => alive && setReserved(r)).catch(() => {})
    return () => {
      alive = false
    }
  }, [id])

  if (error === 'not-found') {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center space-y-4">
        <h1 className="text-xl font-semibold text-fg">Drone not found</h1>
        <p className="text-sm text-muted">It may have been removed from the catalogue.</p>
        <Link to="/drones" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
          <ChevronLeft className="w-4 h-4" /> Browse drones
        </Link>
      </div>
    )
  }
  if (error) return <div className="max-w-xl mx-auto px-4 py-32"><ErrorNote>{error}</ErrorNote></div>
  if (!drone) return <div className="pt-28"><Spinner /></div>

  const status = STATUS_TEXT[drone.status] || STATUS_TEXT.available
  const bookable = drone.status === 'available' || drone.status === 'rented'
  const saved = has(drone._id)
  const specs = drone.specifications || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-12">
      <Link to="/drones" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ChevronLeft className="w-4 h-4" /> All drones
      </Link>

      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 items-start">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-2 border border-line">
            {drone.images[active] && <img src={drone.images[active]} alt={drone.name} className="w-full h-full object-cover" />}
          </div>
          {drone.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {drone.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`aspect-[4/3] rounded-md overflow-hidden bg-surface-2 cursor-pointer ring-2 transition ${i === active ? 'ring-accent' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                  aria-label={`Show photo ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-muted">{drone.brand} · {drone.category}</div>
            <h1 className="text-3xl font-semibold text-fg tracking-tight">{drone.name}</h1>
            {drone.model && drone.model !== drone.name && <div className="text-sm text-subtle">{drone.model}</div>}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-fg tabular-nums">{formatINR(drone.pricePerDay)}</span>
            <span className="text-muted">per day</span>
            {drone.pricePerHour > 0 && <span className="text-sm text-subtle">· {formatINR(drone.pricePerHour)} per hour</span>}
          </div>

          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            {status.text}
          </div>

          <div className="flex gap-2">
            {bookable ? (
              <Link to={`/booking/${drone._id}`} className="flex-1">
                <Button variant="primary" size="lg" className="w-full">Choose dates</Button>
              </Link>
            ) : (
              <Button size="lg" className="flex-1" disabled>Not available</Button>
            )}
            <Button size="lg" onClick={() => toggle(drone._id)} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}>
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </Button>
          </div>

          <Card className="divide-y divide-line px-4">
            <div className="flex items-start gap-3 py-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-subtle mt-0.5 shrink-0" />
              <span className="text-fg-muted">
                {drone.securityDeposit > 0 ? `${formatINR(drone.securityDeposit)} refundable deposit, collected at pickup.` : 'No deposit required.'} Nothing is charged until your request is approved.
              </span>
            </div>
            {drone.location && (
              <div className="flex items-start gap-3 py-3 text-sm">
                <MapPin className="w-4 h-4 text-subtle mt-0.5 shrink-0" />
                <span className="text-fg-muted">Pickup in {drone.location}{drone.shopName ? ` from ${drone.shopName}` : ''}</span>
              </div>
            )}
            {reserved.length > 0 && (
              <div className="flex items-start gap-3 py-3 text-sm">
                <CalendarDays className="w-4 h-4 text-subtle mt-0.5 shrink-0" />
                <span className="text-fg-muted">Booked: {reserved.map((r) => formatRange(r.startDate, r.endDate)).join(' · ')}</span>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10">
        <div className="space-y-10">
          {drone.description && (
            <section className="space-y-3">
              <h2 className="text-lg font-medium text-fg">About this drone</h2>
              <p className="text-fg-muted leading-relaxed whitespace-pre-line">{drone.description}</p>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-fg">What's in the box</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {IN_THE_BOX.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-fg-muted">
                  <Check className="w-4 h-4 text-subtle" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-fg">Rental terms</h2>
            <ul className="space-y-2 text-sm text-fg-muted list-disc pl-5 marker:text-subtle">
              <li>Free cancellation until your rental starts.</li>
              <li>Bring a government ID to pickup. The deposit is refunded after a damage-free return.</li>
              <li>Fly within local drone regulations and keep the drone in sight.</li>
              <li>Late returns are charged at the daily rate.</li>
            </ul>
          </section>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-fg">Specifications</h2>
          <Card className="px-4 divide-y divide-line">
            <Spec icon={Camera} label="Camera" value={specs.camera} />
            <Spec icon={Clock} label="Flight time" value={specs.flightTime ? `${specs.flightTime} min` : null} />
            <Spec icon={Gauge} label="Top speed" value={specs.speed} />
            <Spec icon={Navigation} label="Range" value={specs.maxRange ? `${specs.maxRange} km` : null} />
            <Spec icon={Weight} label="Weight" value={specs.weight} />
            <Spec icon={MapPin} label="GPS" value={specs.gps === false ? 'No' : 'Yes'} />
          </Card>
          {(specs.sensors || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {specs.sensors.map((s) => (
                <span key={s} className="text-xs text-muted rounded-md bg-surface-2 ring-1 ring-line px-2 py-1">{s}</span>
              ))}
            </div>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-fg">Similar drones</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((d) => <DroneCard key={d._id} drone={d} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default DroneDetails
