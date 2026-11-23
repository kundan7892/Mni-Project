import React from 'react'
import { BOOKING_STATUS, PAYMENT_STATUS, DRONE_STATUS } from '../../lib/format'

const TONES = {
  amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
  accent: 'bg-accent/15 text-accent-ink ring-accent/25',
  neutral: 'bg-surface-3 text-muted ring-line-strong/60'
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${TONES[tone] || TONES.neutral} ${className}`}>
      {children}
    </span>
  )
}

export function BookingStatusBadge({ status, long = false }) {
  const meta = BOOKING_STATUS[status] || { label: status, short: status, tone: 'neutral' }
  return <Badge tone={meta.tone}>{long ? meta.label : meta.short}</Badge>
}

export function PaymentBadge({ status }) {
  const meta = PAYMENT_STATUS[status] || { label: status, tone: 'neutral' }
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export function DroneStatusBadge({ status }) {
  const meta = DRONE_STATUS[status] || { label: status, tone: 'neutral' }
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export default Badge
