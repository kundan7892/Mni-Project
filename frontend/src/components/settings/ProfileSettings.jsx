import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Save, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { getSettings, saveSettings } from '../../utils/settingsUtils'

/**
 * ProfileSettings Component
 * User profile form editor with field validation and localStorage persistence.
 */
function ProfileSettings({ role = 'customer', onSaved }) {
  const [formData, setFormData] = useState(() => getSettings(role))
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [toastMsg, setToastMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!formData.name?.trim()) errs.name = 'Full Name is required.'
    if (!formData.email?.trim()) errs.email = 'Email address is required.'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address.'
    if (!formData.phone?.trim()) errs.phone = 'Phone number is required.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    saveSettings(role, formData)
    setIsEditing(false)
    setToastMsg('Profile updated successfully.')
    setTimeout(() => setToastMsg(''), 3000)
    if (onSaved) onSaved(formData)
  }

  const handleCancel = () => {
    setFormData(getSettings(role))
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-2xs space-y-6">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-2xl border border-emerald-500/25 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-fg flex items-center gap-2">
            <User className="w-4 h-4 text-accent-ink" />
            <span>Personal Profile & Contact Information</span>
          </h3>
          <p className="text-xs text-subtle font-medium">Update your account name, contact email, phone, and delivery address.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-accent-ink bg-accent/10 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={formData.name || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-2 border rounded-xl text-xs font-semibold text-fg transition-all outline-hidden ${
                  errors.name ? 'border-rose-500/40 bg-rose-500/10' : 'border-line focus:border-accent'
                } ${!isEditing ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.name && <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="email"
                name="email"
                disabled={!isEditing}
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-2 border rounded-xl text-xs font-semibold text-fg transition-all outline-hidden ${
                  errors.email ? 'border-rose-500/40 bg-rose-500/10' : 'border-line focus:border-accent'
                } ${!isEditing ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.email && <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={formData.phone || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-2 border rounded-xl text-xs font-semibold text-fg transition-all outline-hidden ${
                  errors.phone ? 'border-rose-500/40 bg-rose-500/10' : 'border-line focus:border-accent'
                } ${!isEditing ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.phone && <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
          </div>

          {/* Delivery / Office Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                name="address"
                disabled={!isEditing}
                value={formData.address || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg transition-all outline-hidden ${
                  !isEditing ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>

    </div>
  )
}

export default ProfileSettings
