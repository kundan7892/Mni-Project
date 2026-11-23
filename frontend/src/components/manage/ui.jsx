import React, { useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

/* Small set of shared primitives for the dashboard / management pages. */

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface-2 text-fg ring-1 ring-inset ring-line hover:bg-surface-3',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  danger: 'bg-rose-600/90 text-white hover:bg-rose-500',
  'danger-ghost': 'text-rose-300 hover:bg-rose-500/10'
}

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2'
}

export function Button({ variant = 'secondary', size = 'md', loading = false, className = '', children, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-surface rounded-xl border border-line ${className}`} {...props}>
      {children}
    </div>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-fg">{title}</h1>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Stat({ label, value, hint, icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-muted">
        <span className="text-xs font-medium">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-subtle" />}
      </div>
      <div className="mt-2 text-2xl font-semibold text-fg tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-subtle">{hint}</div>}
    </Card>
  )
}

export function Empty({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-surface-2 ring-1 ring-line flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-muted" />
        </div>
      )}
      <h3 className="text-sm font-medium text-fg">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <Loader2 className="w-4 h-4 animate-spin" />
      {label}
    </div>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <div className="rounded-lg bg-rose-500/10 ring-1 ring-inset ring-rose-500/20 px-3 py-2 text-sm text-rose-300">
      {children}
    </div>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`relative px-3 py-2 text-sm whitespace-nowrap transition-colors cursor-pointer ${
            value === t.value ? 'text-fg' : 'text-muted hover:text-fg'
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`ml-1.5 text-xs tabular-nums ${value === t.value ? 'text-fg-muted' : 'text-subtle'}`}>{t.count}</span>
          )}
          {value === t.value && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />}
        </button>
      ))}
    </div>
  )
}

export const inputClass =
  'w-full h-9 rounded-lg bg-surface-2 border border-line px-3 text-sm text-fg placeholder:text-subtle focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition'

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && <span className="block text-xs font-medium text-fg-muted">{label}</span>}
      {children}
      {error ? <span className="block text-xs text-rose-300">{error}</span> : hint && <span className="block text-xs text-subtle">{hint}</span>}
    </label>
  )
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  const width = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={`relative w-full ${width} max-h-[90vh] flex flex-col bg-surface rounded-xl border border-line shadow-2xl animate-fadeIn`}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
          <div>
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1 -m-1 rounded-md text-muted hover:text-fg hover:bg-surface-2 cursor-pointer" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-3 border-t border-line">{footer}</div>}
      </div>
    </div>
  )
}
