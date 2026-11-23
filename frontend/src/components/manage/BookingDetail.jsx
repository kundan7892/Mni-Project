import React, { useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import { Modal, Button, ErrorNote, inputClass } from './ui'
import { BookingStatusBadge, PaymentBadge } from './Badge'
import { formatINR, formatRange, formatDateTime } from '../../lib/format'
import { ADDON_LABELS } from '../booking/addons'
import bookingService from '../../services/bookingService'
import { notifyBookingsChanged } from '../../lib/events'

/** Which lifecycle actions an owner/admin can take from each status. */
const NEXT_ACTIONS = {
  pending: [
    { status: 'approved', label: 'Approve', variant: 'primary' },
    { status: 'rejected', label: 'Decline', variant: 'danger-ghost', needsNote: true }
  ],
  approved: [
    { status: 'active', label: 'Mark as picked up', variant: 'primary' },
    { status: 'cancelled', label: 'Cancel booking', variant: 'danger-ghost', needsNote: true }
  ],
  confirmed: [
    { status: 'active', label: 'Mark as picked up', variant: 'primary' },
    { status: 'cancelled', label: 'Cancel booking', variant: 'danger-ghost', needsNote: true }
  ],
  active: [{ status: 'completed', label: 'Mark as returned', variant: 'success' }]
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-6 py-2 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-fg text-right min-w-0 break-words">{children}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-1">
      <h3 className="text-xs font-medium text-subtle">{title}</h3>
      <div className="divide-y divide-line">{children}</div>
    </section>
  )
}

/**
 * Detail view of one booking for shop owners / admins, with lifecycle actions.
 * `onChange(updatedBooking)` is called after any successful action.
 */
function BookingDetail({ booking, onClose, onChange }) {
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [noteFor, setNoteFor] = useState(null)
  const [note, setNote] = useState('')

  if (!booking) return null

  const drone = booking.droneId && typeof booking.droneId === 'object' ? booking.droneId : null
  const info = booking.customerInfo || {}
  const actions = NEXT_ACTIONS[booking.bookingStatus] || []

  const run = async (key, fn) => {
    setBusy(key)
    setError(null)
    try {
      const updated = await fn()
      onChange?.(updated)
      notifyBookingsChanged()
      setNoteFor(null)
      setNote('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const doStatus = (action) => {
    if (action.needsNote && noteFor !== action.status) {
      setNoteFor(action.status)
      return
    }
    run(action.status, () => bookingService.updateBookingStatus(booking._id, action.status, note))
  }

  const paymentAction =
    booking.paymentStatus === 'pending' && ['approved', 'active', 'completed'].includes(booking.bookingStatus)
      ? { to: 'paid', label: 'Record payment' }
      : booking.paymentStatus === 'paid' && ['cancelled', 'rejected'].includes(booking.bookingStatus)
        ? { to: 'refunded', label: 'Mark refunded' }
        : null

  const footer = (
    <div className="w-full flex flex-wrap items-center justify-between gap-2">
      <div>
        {paymentAction && (
          <Button
            variant="secondary"
            loading={busy === 'payment'}
            onClick={() => run('payment', () => bookingService.updatePaymentStatus(booking._id, paymentAction.to))}
          >
            {paymentAction.label}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.length === 0 && <Button onClick={onClose}>Close</Button>}
        {actions.map((a) => (
          <Button key={a.status} variant={a.variant} loading={busy === a.status} onClick={() => doStatus(a)}>
            {noteFor === a.status ? `Confirm ${a.label.toLowerCase()}` : a.label}
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={`Booking ${booking.bookingNumber}`}
      description={`Requested ${formatDateTime(booking.createdAt)}`}
      footer={footer}
    >
      <div className="space-y-6">
        <ErrorNote>{error}</ErrorNote>

        {noteFor && (
          <div className="space-y-2 rounded-lg bg-surface-2 p-3 ring-1 ring-line">
            <label className="block text-xs font-medium text-fg-muted">
              {noteFor === 'rejected' ? 'Reason for declining (shown to the customer)' : 'Reason for cancelling'}
            </label>
            <input autoFocus className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
          </div>
        )}

        <div className="flex gap-4 items-start">
          {drone?.image && <img src={drone.image} alt="" className="w-24 h-20 rounded-lg object-cover bg-surface-2 shrink-0" />}
          <div className="min-w-0 space-y-1.5">
            <div className="text-base font-medium text-fg">{booking.droneName || drone?.name}</div>
            <div className="text-sm text-muted">
              {formatRange(booking.startDate, booking.endDate)} · {booking.durationDays} day{booking.durationDays === 1 ? '' : 's'}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <BookingStatusBadge status={booking.bookingStatus} long />
              <PaymentBadge status={booking.paymentStatus} />
            </div>
          </div>
        </div>

        {booking.rejectionReason && booking.bookingStatus === 'rejected' && (
          <p className="text-sm text-muted">Declined: {booking.rejectionReason}</p>
        )}
        {booking.cancellationReason && booking.bookingStatus === 'cancelled' && (
          <p className="text-sm text-muted">Cancelled: {booking.cancellationReason}</p>
        )}

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          <Section title="Customer">
            <Row label="Name">{info.fullName || booking.customerName}</Row>
            <Row label="Email">{info.email || booking.customerEmail}</Row>
            <Row label="Phone">{info.phone || booking.customerPhone || '—'}</Row>
            <Row label="Address">{[info.address, info.city, info.state, info.pinCode].filter(Boolean).join(', ') || '—'}</Row>
            <Row label="Purpose">{info.purpose || '—'}</Row>
            <Row label="Experience">{info.experience || '—'}</Row>
          </Section>

          <Section title="Charges">
            <Row label="Rental">{formatINR(booking.totalPrice - (booking.addonsTotal || 0))}</Row>
            {(booking.selectedAddons || []).length > 0 && (
              <Row label="Add-ons">
                {booking.selectedAddons.map((a) => ADDON_LABELS[a] || a).join(', ')} · {formatINR(booking.addonsTotal)}
              </Row>
            )}
            <Row label="Total">{formatINR(booking.totalPrice)}</Row>
            <Row label="Refundable deposit">{formatINR(booking.securityDeposit)}</Row>
          </Section>
        </div>

        <Section title="Documents">
          {(booking.documents || []).length === 0 ? (
            <p className="py-2 text-sm text-muted">No documents uploaded.</p>
          ) : (
            booking.documents.map((d) => (
              <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 text-sm text-fg hover:text-accent-ink">
                <FileText className="w-4 h-4 text-muted" />
                <span className="flex-1 truncate">{d.type ? `${d.type} — ` : ''}{d.name || 'Document'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-subtle" />
              </a>
            ))
          )}
        </Section>

        {(booking.statusHistory || []).length > 0 && (
          <Section title="History">
            {booking.statusHistory.map((h, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                <span className="text-fg">
                  <BookingStatusBadge status={h.status} />
                  {h.note && <span className="ml-2 text-muted">{h.note}</span>}
                </span>
                <span className="text-xs text-subtle whitespace-nowrap">
                  {h.by ? `${h.by} · ` : ''}{formatDateTime(h.at)}
                </span>
              </div>
            ))}
          </Section>
        )}

        {booking.notes && (
          <Section title="Notes from customer">
            <p className="py-2 text-sm text-fg-muted whitespace-pre-line">{booking.notes}</p>
          </Section>
        )}
      </div>
    </Modal>
  )
}

export default BookingDetail
