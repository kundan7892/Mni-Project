import React, { useState, useMemo } from 'react'
import { Store, MapPin, Phone, Mail, Globe, Clock, ShieldCheck, Edit, Save, CheckCircle2, Power } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { shopProfiles } from '../../data/shops'

function ShopOwnerProfile() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  const initialShop = useMemo(() => {
    return shopProfiles.find((s) => s.shopId === shopId) || shopProfiles[0]
  }, [shopId])

  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  // Shop Status Toggle
  const [shopStatus, setShopStatus] = useState(initialShop.status || 'Open')

  // Form State
  const [shopData, setShopData] = useState({
    name: initialShop.name,
    description: initialShop.description,
    phone: initialShop.phone,
    email: initialShop.email,
    address: initialShop.address,
    location: initialShop.location,
    operatingHours: initialShop.operatingHours,
    website: initialShop.website,
    logo: initialShop.logo
  })

  const handleSave = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setSuccessMsg('Shop profile updated successfully.')
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Shop Storefront Profile
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Manage your public shop listing details, operating status, and store location.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Shop Profile'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SHOP STATUS TOGGLE CARD */}
      <div className="bg-surface p-5 rounded-2xl border border-line shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent/10 text-accent-ink">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-fg text-sm">Shop Operating Status</div>
            <div className="text-xs text-muted">Toggle whether your shop is accepting new rental bookings.</div>
          </div>
        </div>

        <select
          value={shopStatus}
          onChange={(e) => {
            setShopStatus(e.target.value)
            setSuccessMsg(`Shop status changed to '${e.target.value}'.`)
            setTimeout(() => setSuccessMsg(null), 3000)
          }}
          className={`py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer border ${
            shopStatus === 'Open'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
          }`}
        >
          <option value="Open">Open for Rentals</option>
          <option value="Closed">Closed</option>
          <option value="Temporarily Unavailable">Temporarily Unavailable</option>
        </select>
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="bg-surface rounded-2xl border border-line p-6 sm:p-10 shadow-2xs space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-surface-2 rounded-2xl border border-line">
          <img
            src={shopData.logo}
            alt={shopData.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent-ink text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-accent/25">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-ink" />
              <span>Verified Storefront (Shop ID: #{shopId})</span>
            </div>
            <h2 className="text-2xl font-semibold text-fg">{shopData.name}</h2>
            <p className="text-muted text-xs">{shopData.location}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Shop Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-3 px-4 text-sm font-semibold text-fg"
                  required
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-bold text-fg text-sm">
                  {shopData.name}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Shop Description
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl p-3 text-xs font-semibold text-fg"
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line text-fg-muted leading-relaxed font-medium">
                  {shopData.description}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.phone}
                  onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-3 px-4 text-sm font-semibold text-fg"
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-bold text-fg">
                  {shopData.phone}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-medium text-muted">
                {shopData.email} (Owner Primary)
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Physical Store Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.address}
                  onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-3 px-4 text-sm font-semibold text-fg"
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-bold text-fg">
                  {shopData.address}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Operating Hours
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.operatingHours}
                  onChange={(e) => setShopData({ ...shopData, operatingHours: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-3 px-4 text-sm font-semibold text-fg"
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-bold text-fg">
                  {shopData.operatingHours}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">
                Website URL
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={shopData.website}
                  onChange={(e) => setShopData({ ...shopData, website: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-3 px-4 text-sm font-semibold text-fg"
                />
              ) : (
                <div className="p-3.5 bg-surface-2 rounded-xl border border-line font-bold text-accent-ink">
                  {shopData.website}
                </div>
              )}
            </div>

          </div>

          {isEditing && (
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Shop Profile</span>
              </button>
            </div>
          )}

        </form>

      </div>

    </div>
  )
}

export default ShopOwnerProfile
