import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Upload, FileText, X, Loader2, CalendarX, Lock } from 'lucide-react'
import droneService from '../services/droneService'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import { uploadFiles } from '../services/uploadService'
import { useAuth } from '../context/AuthContext'
import { ADDONS } from '../components/booking/addons'
import { Button, Card, Field, ErrorNote, Spinner, inputClass } from '../components/manage/ui'
import { formatINR, formatRange, normalizeDrone, toInputDate, toRentalRange } from '../lib/format'

const DAY = 24 * 60 * 60 * 1000
const PURPOSES = ['Aerial photography', 'Videography / film', 'Survey or mapping', 'Inspection', 'Agriculture', 'Events', 'Personal / learning']
const EXPERIENCE = ['First time', 'Beginner (under 10 hours)', 'Intermediate (10–50 hours)', 'Experienced (50+ hours)', 'Certified pilot']
const DOC_TYPES = [
  { id: 'Government ID', label: 'Government ID', hint: 'Aadhaar, passport or driving licence', required: true },
  { id: 'Pilot certificate', label: 'Pilot certificate', hint: 'DGCA remote pilot certificate, if you have one', required: false }
]

const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return toInputDate(new Date(y, m - 1, d + n))
}

function Section({ step, title, children }) {
  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <h2 className="flex items-center gap-3 text-base font-medium text-fg">
        <span className="w-6 h-6 rounded-full bg-surface-3 text-xs text-fg-muted flex items-center justify-center tabular-nums">{step}</span>
        {title}
      </h2>
      {children}
    </Card>
  )
}

function DocumentSlot({ type, doc, onUploaded, onRemove }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const pick = async (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return setError('File must be 5 MB or smaller.')
    setBusy(true)
    setError(null)
    try {
      const [uploaded] = await uploadFiles([file])
      onUploaded({ type: type.id, name: uploaded.name, url: uploaded.url })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-lg ring-1 ring-line p-3 flex items-center gap-3">
      <FileText className="w-5 h-5 text-subtle shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-fg">
          {type.label} {type.required ? <span className="text-subtle">(required)</span> : <span className="text-subtle">(optional)</span>}
        </div>
        <div className={`text-xs truncate ${error ? 'text-rose-300' : 'text-subtle'}`}>{error || (doc ? doc.name : type.hint)}</div>
      </div>
      {doc ? (
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <button type="button" onClick={onRemove} className="p-1 rounded text-muted hover:text-fg cursor-pointer" aria-label={`Remove ${type.label}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Button size="sm" onClick={() => ref.current?.click()} loading={busy}>
          {!busy && <Upload className="w-3.5 h-3.5" />} Upload
        </Button>
      )}
      <input ref={ref} type="file" hidden accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}

/** Rental request page: choose dates and extras, add details and ID, submit for approval. */
function BookingPage() {
  const { id } = useParams()
  const location = useLocation()
  const { isAuthenticated, userRole } = useAuth()

  const [drone, setDrone] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [reserved, setReserved] = useState([])

  const today = toInputDate(new Date())
  const [startDay, setStartDay] = useState(() => addDays(today, 1))
  const [endDay, setEndDay] = useState(() => addDays(today, 3))
  const [addons, setAddons] = useState([])
  const [info, setInfo] = useState(() => {
    const u = authService.getStoredUser()
    return { fullName: u?.name || '', email: u?.email || '', phone: u?.phone || '', address: '', city: '', state: '', pinCode: '', purpose: PURPOSES[0], experience: EXPERIENCE[1] }
  })
  const [notes, setNotes] = useState('')
  const [documents, setDocuments] = useState({})
  const [agreed, setAgreed] = useState(false)

  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)

  useEffect(() => {
    let alive = true
    droneService
      .getDroneById(id)
      .then((d) => alive && (d ? setDrone(normalizeDrone(d)) : setLoadError('not-found')))
      .catch((err) => alive && setLoadError(err.status === 404 || err.status === 400 ? 'not-found' : err.message))
    droneService.getAvailability(id).then((r) => alive && setReserved(r)).catch(() => {})
    return () => {
      alive = false
    }
  }, [id])

  // Fill phone from the profile if the cached session doesn't have it
  useEffect(() => {
    if (!isAuthenticated) return
    authService
      .getProfile()
      .then((u) => u && setInfo((p) => ({ ...p, fullName: p.fullName || u.name, email: p.email || u.email, phone: p.phone || u.phone || '' })))
      .catch(() => {})
  }, [isAuthenticated])

  const range = useMemo(() => (startDay && endDay && endDay >= startDay ? toRentalRange(startDay, endDay) : null), [startDay, endDay])
  const days = range ? Math.round((new Date(range.endDate) - new Date(range.startDate)) / DAY) : 0

  const clash = useMemo(() => {
    if (!range) return null
    const s = new Date(range.startDate)
    const e = new Date(range.endDate)
    return reserved.find((r) => new Date(r.startDate) < e && new Date(r.endDate) > s) || null
  }, [range, reserved])

  const canBook = isAuthenticated && userRole === 'customer'

  // Live server quote (authoritative price)
  useEffect(() => {
    if (!drone || !range || !canBook) return
    let alive = true
    setQuoteLoading(true)
    const t = setTimeout(() => {
      bookingService
        .getQuote({ droneId: drone._id, ...range, selectedAddons: addons })
        .then((q) => alive && setQuote(q))
        .catch(() => alive && setQuote(null))
        .finally(() => alive && setQuoteLoading(false))
    }, 250)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [drone, range, addons, canBook])

  // Client-side estimate shown until (or if) the server quote arrives
  const estimate = useMemo(() => {
    if (!drone || !days) return null
    const base = drone.pricePerDay * days
    const extras = addons.reduce((sum, aid) => {
      const a = ADDONS.find((x) => x.id === aid)
      return sum + (a ? (a.priceType === 'perDay' ? a.price * days : a.price) : 0)
    }, 0)
    return { baseCost: base, addonsTotal: extras, totalPrice: base + extras, securityDeposit: drone.securityDeposit, durationDays: days }
  }, [drone, days, addons])

  const price = quote?.quote || estimate

  const setField = (k) => (e) => {
    setInfo((p) => ({ ...p, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const toggleAddon = (aid) => setAddons((list) => (list.includes(aid) ? list.filter((x) => x !== aid) : [...list, aid]))

  const validate = () => {
    const e = {}
    if (!range) e.dates = 'Choose an end date on or after the start date.'
    else if (startDay < today) e.dates = 'The start date cannot be in the past.'
    else if (clash) e.dates = 'Those dates overlap an existing booking.'
    if (info.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) e.email = 'Enter a valid email.'
    if (!/^[+\d][\d\s-]{8,}$/.test(info.phone.trim())) e.phone = 'Enter a phone number we can reach you on.'
    if (!info.address.trim()) e.address = 'Enter your address.'
    if (!info.city.trim()) e.city = 'Enter your city.'
    if (!documents['Government ID']) e.documents = 'Upload a government ID to continue.'
    if (!agreed) e.agreed = 'Please accept the rental terms.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    try {
      const booking = await bookingService.createBooking({
        droneId: drone._id,
        ...range,
        selectedAddons: addons,
        customerInfo: info,
        documents: Object.values(documents),
        notes: notes.trim()
      })
      setCreated(booking)
      window.scrollTo({ top: 0 })
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError === 'not-found') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-xl font-semibold text-fg">This drone isn't available</h1>
        <p className="text-sm text-muted">It may have been removed from the catalogue.</p>
        <Link to="/drones" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
          <ChevronLeft className="w-4 h-4" /> Browse drones
        </Link>
      </div>
    )
  }
  if (loadError) return <div className="max-w-xl mx-auto px-4 py-24"><ErrorNote>{loadError}</ErrorNote></div>
  if (!drone) return <Spinner />

  /* ---------- Confirmation ---------- */
  if (created) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
        <Card className="p-8 text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-fg">Request sent</h1>
            <p className="text-sm text-muted">
              We'll review your request for the {drone.name} and confirm shortly. You can follow its status in My rentals.
            </p>
          </div>
          <div className="rounded-lg bg-surface-2 divide-y divide-line text-sm text-left">
            <div className="flex justify-between px-4 py-2.5"><span className="text-muted">Booking</span><span className="font-mono text-fg">{created.bookingNumber}</span></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-muted">Dates</span><span className="text-fg">{formatRange(created.startDate, created.endDate)}</span></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-muted">Rental total</span><span className="text-fg">{formatINR(created.totalPrice)}</span></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-muted">Refundable deposit</span><span className="text-fg">{formatINR(created.securityDeposit)}</span></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-muted">Status</span><span className="text-amber-300">Awaiting approval</span></div>
          </div>
          <p className="text-xs text-subtle">Payment and the deposit are collected at pickup, after your request is approved.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/user/rentals"><Button variant="primary" className="w-full">View my rentals</Button></Link>
            <Link to="/drones"><Button variant="ghost" className="w-full">Keep browsing</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const loginHref = `/auth/login?redirect=${encodeURIComponent(location.pathname)}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-6">
      <Link to={`/drones/${drone._id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ChevronLeft className="w-4 h-4" /> Back to {drone.name}
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-fg">Request a rental</h1>
        <p className="text-sm text-muted">Nothing is charged now. The shop confirms your dates first, and you pay at pickup.</p>
      </div>

      {!canBook ? (
        <Card className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-muted" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-base font-medium text-fg">
              {isAuthenticated ? 'Rentals are booked from a customer account' : 'Sign in to request this drone'}
            </h2>
            <p className="text-sm text-muted">
              {isAuthenticated
                ? 'You are signed in as staff. Sign in with a customer account to place a rental request.'
                : 'You need an account so we can confirm your booking and keep you updated.'}
            </p>
          </div>
          {!isAuthenticated && (
            <div className="flex gap-2">
              <Link to={`/auth/register?redirect=${encodeURIComponent(location.pathname)}`}><Button variant="ghost">Create account</Button></Link>
              <Link to={loginHref}><Button variant="primary">Sign in</Button></Link>
            </div>
          )}
        </Card>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-4">
            <ErrorNote>{submitError}</ErrorNote>

            <Section step="1" title="Dates">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Pick up">
                  <input
                    type="date"
                    className={inputClass}
                    min={today}
                    value={startDay}
                    onChange={(e) => {
                      const v = e.target.value
                      setStartDay(v)
                      if (v && endDay < v) setEndDay(v)
                      setErrors((er) => ({ ...er, dates: undefined }))
                    }}
                  />
                </Field>
                <Field label="Return (last day of rental)">
                  <input
                    type="date"
                    className={inputClass}
                    min={startDay || today}
                    value={endDay}
                    onChange={(e) => { setEndDay(e.target.value); setErrors((er) => ({ ...er, dates: undefined })) }}
                  />
                </Field>
              </div>
              {(errors.dates || clash) && (
                <div className="flex items-start gap-2 text-sm text-rose-300">
                  <CalendarX className="w-4 h-4 mt-0.5 shrink-0" />
                  {clash ? `Already booked ${formatRange(clash.startDate, clash.endDate)}. Please pick other dates.` : errors.dates}
                </div>
              )}
              {reserved.length > 0 && (
                <div className="text-xs text-subtle">
                  Already booked: {reserved.map((r) => formatRange(r.startDate, r.endDate)).join(' · ')}
                </div>
              )}
            </Section>

            <Section step="2" title="Extras">
              <div className="grid sm:grid-cols-2 gap-2">
                {ADDONS.map((a) => {
                  const on = addons.includes(a.id)
                  return (
                    <label key={a.id} className={`flex items-start gap-3 rounded-lg p-3 ring-1 cursor-pointer transition-colors ${on ? 'ring-accent/60 bg-accent/5' : 'ring-line hover:ring-line-strong'}`}>
                      <input type="checkbox" className="mt-0.5 w-4 h-4 accent-accent" checked={on} onChange={() => toggleAddon(a.id)} />
                      <span className="flex-1 min-w-0">
                        <span className="flex justify-between gap-2 text-sm text-fg">
                          {a.name}
                          <span className="text-muted tabular-nums whitespace-nowrap">{formatINR(a.price)}{a.priceType === 'perDay' ? '/day' : ''}</span>
                        </span>
                        <span className="block text-xs text-subtle mt-0.5">{a.description}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </Section>

            <Section step="3" title="Your details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" error={errors.fullName}>
                  <input className={inputClass} value={info.fullName} onChange={setField('fullName')} autoComplete="name" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input className={inputClass} value={info.phone} onChange={setField('phone')} autoComplete="tel" placeholder="98765 43210" />
                </Field>
                <Field label="Email" error={errors.email} className="sm:col-span-2">
                  <input className={inputClass} type="email" value={info.email} onChange={setField('email')} autoComplete="email" />
                </Field>
                <Field label="Address" error={errors.address} className="sm:col-span-2">
                  <input className={inputClass} value={info.address} onChange={setField('address')} autoComplete="street-address" />
                </Field>
                <Field label="City" error={errors.city}>
                  <input className={inputClass} value={info.city} onChange={setField('city')} autoComplete="address-level2" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="State">
                    <input className={inputClass} value={info.state} onChange={setField('state')} autoComplete="address-level1" />
                  </Field>
                  <Field label="PIN code">
                    <input className={inputClass} value={info.pinCode} onChange={setField('pinCode')} autoComplete="postal-code" inputMode="numeric" />
                  </Field>
                </div>
                <Field label="What will you use it for?">
                  <select className={inputClass} value={info.purpose} onChange={setField('purpose')}>
                    {PURPOSES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Flying experience">
                  <select className={inputClass} value={info.experience} onChange={setField('experience')}>
                    {EXPERIENCE.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Anything we should know?" className="sm:col-span-2">
                  <textarea rows={2} className={`${inputClass} h-auto py-2 resize-y`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional: pickup time, location of the shoot…" />
                </Field>
              </div>
            </Section>

            <Section step="4" title="Verification">
              <div className="space-y-2">
                {DOC_TYPES.map((t) => (
                  <DocumentSlot
                    key={t.id}
                    type={t}
                    doc={documents[t.id]}
                    onUploaded={(doc) => { setDocuments((d) => ({ ...d, [t.id]: doc })); setErrors((er) => ({ ...er, documents: undefined })) }}
                    onRemove={() => setDocuments((d) => { const n = { ...d }; delete n[t.id]; return n })}
                  />
                ))}
              </div>
              {errors.documents && <p className="text-xs text-rose-300">{errors.documents}</p>}
              <p className="text-xs text-subtle">PDF, JPG or PNG up to 5 MB. Only the shop handling your rental can see these.</p>
            </Section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <Card className="overflow-hidden">
              <div className="flex gap-3 p-4 border-b border-line">
                {drone.image && <img src={drone.image} alt="" className="w-20 h-16 rounded-md object-cover bg-surface-2" />}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg truncate">{drone.name}</div>
                  <div className="text-xs text-muted">{drone.brand} · {drone.category}</div>
                  <div className="text-xs text-subtle mt-1">{formatINR(drone.pricePerDay)} / day</div>
                </div>
              </div>

              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{range ? formatRange(range.startDate, range.endDate) : 'Choose dates'}</span>
                  <span className="text-fg-muted">{days} day{days === 1 ? '' : 's'}</span>
                </div>
                {price && (
                  <>
                    <div className="flex justify-between"><span className="text-muted">Rental</span><span className="text-fg tabular-nums">{formatINR(price.baseCost)}</span></div>
                    {price.addonsTotal > 0 && (
                      <div className="flex justify-between"><span className="text-muted">Extras</span><span className="text-fg tabular-nums">{formatINR(price.addonsTotal)}</span></div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-line font-medium">
                      <span className="text-fg">Total</span>
                      <span className="text-fg tabular-nums flex items-center gap-2">
                        {quoteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-subtle" />}
                        {formatINR(price.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs"><span className="text-subtle">Refundable deposit, at pickup</span><span className="text-muted tabular-nums">{formatINR(price.securityDeposit)}</span></div>
                  </>
                )}
              </div>

              <div className="p-4 pt-0 space-y-3">
                <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
                  <input type="checkbox" className="mt-0.5 w-4 h-4 accent-accent" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors((er) => ({ ...er, agreed: undefined })) }} />
                  <span>
                    I'll fly within local drone rules, return it on time, and accept the{' '}
                    <Link to="/faq" target="_blank" className="text-accent-ink hover:underline">rental terms</Link>.
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-rose-300">{errors.agreed}</p>}
                {Object.keys(errors).filter((k) => errors[k]).length > 0 && !errors.agreed && (
                  <p className="text-xs text-rose-300">Please fix the highlighted fields.</p>
                )}
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting} disabled={Boolean(clash)}>
                  Send request
                </Button>
              </div>
            </Card>
            {drone.status !== 'available' && (
              <p className="text-xs text-subtle px-1">
                This drone is currently {drone.status === 'rented' ? 'out with another customer' : drone.status}. You can still request future dates.
              </p>
            )}
          </aside>
        </form>
      )}
    </div>
  )
}

export default BookingPage
