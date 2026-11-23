import React, { useState, useEffect } from 'react'
import { X, Save, Store, MapPin, Mail, Phone } from 'lucide-react'

function ShopFormModal({ isOpen, onClose, onSave, shopToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    phone: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pinCode: '560001',
    description: '',
    operatingHours: '09:00 AM - 08:00 PM',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    verification: 'Verified'
  })

  useEffect(() => {
    if (shopToEdit) {
      setFormData({
        name: shopToEdit.name || '',
        ownerName: shopToEdit.ownerName || '',
        ownerEmail: shopToEdit.ownerEmail || '',
        phone: shopToEdit.phone || '',
        address: shopToEdit.address || '',
        city: shopToEdit.city || '',
        state: shopToEdit.state || 'Karnataka',
        pinCode: shopToEdit.pinCode || '560001',
        description: shopToEdit.description || '',
        operatingHours: shopToEdit.operatingHours || '09:00 AM - 08:00 PM',
        logo: shopToEdit.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
        status: shopToEdit.status || 'Active',
        verification: shopToEdit.verification || 'Verified'
      })
    } else {
      setFormData({
        name: '',
        ownerName: '',
        ownerEmail: '',
        phone: '',
        address: '',
        city: '',
        state: 'Karnataka',
        pinCode: '560001',
        description: '',
        operatingHours: '09:00 AM - 08:00 PM',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
        status: 'Active',
        verification: 'Verified'
      })
    }
  }, [shopToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface-2">
          <div>
            <h2 className="text-xl font-semibold text-fg">
              {shopToEdit ? 'Edit Shop Partner Storefront' : 'Register New Shop Partner'}
            </h2>
            <p className="text-xs text-muted">
              {shopToEdit ? `Updating store details for ${shopToEdit.name}` : 'Create a new storefront listing on DroneHub platform.'}
            </p>
          </div>

          <button onClick={onClose} className="p-2 text-subtle hover:text-fg-muted hover:bg-surface-3 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1 sm:col-span-2">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Shop Name *</label>
              <input
                type="text"
                placeholder="e.g. SkyRent Bengaluru"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Owner Full Name *</label>
              <input
                type="text"
                placeholder="Owner name"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Owner Email *</label>
              <input
                type="email"
                placeholder="owner@example.com"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Phone Number *</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">City *</label>
              <input
                type="text"
                placeholder="Bengaluru"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Full Address *</label>
              <input
                type="text"
                placeholder="Street address & area"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                required
              />
            </div>

          </div>

          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-surface-2 text-fg-muted font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer">
              <Save className="w-4 h-4 inline mr-1" />
              <span>{shopToEdit ? 'Save Changes' : 'Register Shop'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default ShopFormModal
