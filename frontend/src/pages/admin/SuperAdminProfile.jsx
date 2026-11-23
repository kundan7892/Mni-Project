import React, { useState } from 'react'
import { User, Mail, Phone, ShieldCheck, Edit, Save, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function SuperAdminProfile() {
  const { currentUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Platform Admin',
    email: currentUser?.email || 'admin@dronehub.com',
    phone: '+91 98000 00000',
    role: 'Super Administrator',
    createdDate: 'January 2025',
    lastLogin: 'Today at 01:24 AM'
  })

  const handleSave = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setSuccessMsg('Admin profile updated successfully.')
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Super Admin Profile
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Master administrator account credentials and identity permissions.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CARD */}
      <div className="bg-surface rounded-2xl border border-line p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="flex items-center gap-5 p-5 bg-surface text-white rounded-2xl">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt={profileData.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full System Root Access</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{profileData.name}</h2>
            <p className="text-xs text-fg-muted">{profileData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                  required
                />
              ) : (
                <div className="p-3 bg-surface-2 rounded-xl font-bold text-fg">{profileData.name}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Email Address</label>
              <div className="p-3 bg-surface-2 rounded-xl font-medium text-muted">{profileData.email}</div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 px-3 font-semibold text-fg"
                />
              ) : (
                <div className="p-3 bg-surface-2 rounded-xl font-bold text-fg">{profileData.phone}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-fg-muted uppercase tracking-wider">Role Clearance</label>
              <div className="p-3 bg-surface-2 rounded-xl font-bold text-emerald-400">{profileData.role}</div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-2 flex justify-end">
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer">
                <Save className="w-4 h-4 inline mr-1" />
                <span>Save Profile</span>
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  )
}

export default SuperAdminProfile
