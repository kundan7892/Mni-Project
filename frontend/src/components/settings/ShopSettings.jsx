import React, { useState } from 'react'
import { Store, MapPin, Mail, Phone, Clock, Save, CheckCircle2 } from 'lucide-react'
import { getSettings, saveSettings } from '../../utils/settingsUtils'

/**
 * ShopSettings Component
 * Storefront configuration editor for shop owners.
 */
function ShopSettings({ onSaved }) {
  const [formData, setFormData] = useState(() => getSettings('owner'))
  const [toastMsg, setToastMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveSettings('owner', formData)
    setToastMsg('Shop settings updated successfully.')
    setTimeout(() => setToastMsg(''), 3000)
    if (onSaved) onSaved(formData)
  }

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-2xs space-y-6">
      
      {toastMsg && (
        <div className="bg-accent/10 text-accent-ink p-3 rounded-2xl border border-accent/25 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-accent-ink shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="pb-4 border-b border-line">
        <h3 className="text-base font-semibold text-fg flex items-center gap-2">
          <Store className="w-4 h-4 text-accent-ink" />
          <span>Shop Storefront Profile & Business Hours</span>
        </h3>
        <p className="text-xs text-subtle font-medium">Manage public storefront name, address, business hours, and policy details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Contact Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Contact Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-fg-muted">Store Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Opening Time</label>
            <input
              type="text"
              name="openingTime"
              value={formData.openingTime || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-fg-muted">Closing Time</label>
            <input
              type="text"
              name="closingTime"
              value={formData.closingTime || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-semibold text-fg outline-hidden"
            />
          </div>

        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Shop Settings</span>
          </button>
        </div>
      </form>

    </div>
  )
}

export default ShopSettings
