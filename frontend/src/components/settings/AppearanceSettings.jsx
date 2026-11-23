import React, { useState } from 'react'
import { Sun, Moon, Monitor, Globe, CheckCircle2, Layout } from 'lucide-react'
import { getTheme, saveTheme } from '../../utils/settingsUtils'

/**
 * AppearanceSettings Component
 * Allows user to set application theme, language, and layout density.
 */
function AppearanceSettings() {
  const [theme, setThemeState] = useState(() => getTheme())
  const [language, setLanguage] = useState('English')
  const [compactMode, setCompactMode] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const handleSelectTheme = (selected) => {
    setThemeState(selected)
    saveTheme(selected)
    setToastMsg(`Theme preference set to ${selected.toUpperCase()}`)
    setTimeout(() => setToastMsg(''), 2500)
  }

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-2xs space-y-6">
      
      {toastMsg && (
        <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-2xl border border-emerald-500/25 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="pb-4 border-b border-line">
        <h3 className="text-base font-semibold text-fg flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Appearance & Language Preferences</span>
        </h3>
        <p className="text-xs text-subtle font-medium">Customize interface theme, display density, and platform language.</p>
      </div>

      {/* Theme Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-fg-muted uppercase tracking-wider block">Interface Theme</label>
        <div className="grid grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => handleSelectTheme('light')}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-accent/10 border-accent text-accent-ink shadow-2xs ring-2 ring-accent/40'
                : 'bg-surface-2 border-line text-muted hover:border-line'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto text-amber-400" />
            <div className="text-xs font-semibold">Light Mode</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme('dark')}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-surface border-accent text-white shadow-2xs ring-2 ring-accent/40'
                : 'bg-black/90 border-line text-fg-muted hover:border-line'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto text-accent-ink" />
            <div className="text-xs font-semibold">Dark Mode</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme('system')}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
              theme === 'system'
                ? 'bg-accent/10 border-accent text-accent-ink shadow-2xs ring-2 ring-accent/40'
                : 'bg-surface-2 border-line text-muted hover:border-line'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto text-accent-ink" />
            <div className="text-xs font-semibold">System Match</div>
          </button>

        </div>
      </div>

      {/* Language Selector */}
      <div className="pt-4 border-t border-line space-y-3">
        <label className="text-xs font-bold text-fg-muted uppercase tracking-wider block">Display Language</label>
        <div className="flex items-center gap-3 max-w-xs">
          <Globe className="w-4 h-4 text-subtle shrink-0" />
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value)
              setToastMsg(`Language set to ${e.target.value}`)
              setTimeout(() => setToastMsg(''), 2500)
            }}
            className="w-full p-2.5 bg-surface-2 border border-line rounded-xl text-xs font-bold text-fg cursor-pointer"
          >
            <option value="English">English (United States)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>
      </div>

    </div>
  )
}

export default AppearanceSettings
