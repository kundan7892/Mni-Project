import React, { useState } from 'react'
import { User, Bell, Key, Sun, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ProfileSettings from '../../components/settings/ProfileSettings'
import NotificationSettings from '../../components/settings/NotificationSettings'
import SecuritySettings from '../../components/settings/SecuritySettings'
import AppearanceSettings from '../../components/settings/AppearanceSettings'
import { resetSettings } from '../../utils/settingsUtils'

function CustomerSettings() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showResetModal, setShowResetModal] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const handleReset = () => {
    resetSettings('customer')
    setShowResetModal(false)
    setToastMsg('Settings restored to default.')
    setTimeout(() => setToastMsg(''), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Login', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Sun }
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-surface text-white px-4 py-2.5 rounded-2xl border border-accent shadow-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Manage profile information, notification preferences, security, and theme settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-rose-500/10 text-fg-muted hover:text-rose-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* SETTINGS LAYOUT: SIDEBAR TABS & CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Settings Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-surface p-3 rounded-2xl border border-line shadow-2xs space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-accent text-white shadow-md '
                    : 'text-muted hover:bg-surface-2 hover:text-fg'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Panel (9 cols) */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && <ProfileSettings role="customer" />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
        </div>

      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-line shadow-lg space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-fg">Reset settings to default?</h3>
            <p className="text-xs text-muted">
              This will restore all notification preferences and profile fields to default state.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-600 transition-all shadow-md cursor-pointer"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CustomerSettings
