import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../context/AuthContext'

/*
  DEVELOPER NOTE:
  This authentication system is a frontend prototype.
  Real authentication, authorization, password hashing,
  sessions/tokens, and backend security must be implemented
  when the backend is connected.
*/

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Only allow in-app redirects (e.g. back to a booking page)
  const redirectTo = (searchParams.get('redirect') || '').startsWith('/') && !(searchParams.get('redirect') || '').startsWith('//') ? searchParams.get('redirect') : null
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('customer')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleQuickFill = (role, demoEmail, demoPassword) => {
    setSelectedRole(role)
    setEmail(demoEmail)
    setPassword(demoPassword)
    setErrorMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!email || !email.trim()) { setErrorMessage('Please enter your email address.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErrorMessage('Please enter a valid email address.'); return }
    if (!password || !password.trim()) { setErrorMessage('Please enter your password.'); return }
    setIsLoading(true)
    try {
      const result = await login(email, password, selectedRole)
      setIsLoading(false)
      if (result.success) {
        if (redirectTo && result.user.role === 'customer') navigate(redirectTo)
        else if (result.user.role === 'super-admin' || result.user.role === 'admin') navigate('/admin/dashboard')
        else if (result.user.role === 'shop-owner' || result.user.role === 'owner') navigate('/owner/dashboard')
        else navigate('/user/dashboard')
      } else {
        setErrorMessage(result.error)
      }
    } catch (err) {
      setIsLoading(false)
      setErrorMessage(err.message || 'Login encountered an unexpected error.')
    }
  }

  const inputClass = "w-full h-11 bg-surface-2 border border-line/50 focus:border-accent/60 focus:ring-1 focus:ring-accent/20 focus:outline-none rounded-xl px-4 text-[14px] text-fg placeholder-line transition-all"
  const labelClass = "block text-xs font-medium text-fg-muted mb-1.5"

  return (
    <AuthLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-fg tracking-tight">
            Sign in
          </h1>
          <p className="text-[13px] text-muted">Sign in to continue to your DroneHub account.</p>
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <label className={labelClass}>Login As</label>
          <div className="grid grid-cols-3 gap-2 bg-canvas border border-line/40 p-1.5 rounded-2xl">
            {[
              { role: 'customer', icon: 'person', label: 'Customer' },
              { role: 'shop-owner', icon: 'storefront', label: 'Shop Owner' },
              { role: 'super-admin', icon: 'admin_panel_settings', label: 'Admin' },
            ].map(({ role, icon, label }) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${selectedRole === role
                  ? 'bg-accent text-white '
                  : 'text-muted hover:text-fg hover:bg-surface-2'
                  }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/20 border border-rose-500/25 text-rose-300 rounded-2xl text-[12px] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: '16px' }}>error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pr-10`} required />
              <span className="material-symbols-outlined text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '16px' }}>mail</span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-accent cursor-pointer transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px] pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-muted select-none">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded accent-[#5b5bd6] bg-surface-2" />
              <span>Remember me</span>
            </label>
            <Link to="/auth/forgot-password" className="font-semibold text-accent hover:text-accent-hover transition-colors">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg bg-accent text-white font-bold text-[14px] transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span><span>Signing in...</span></>
            ) : (
              <><span>Sign In</span><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span></>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="p-4 bg-surface-2 border border-accent/15 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-fg-muted">
            <span className="material-symbols-outlined text-accent" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
            Demo accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { role: 'customer', email: 'user@dronehub.com', pass: 'user123', label: 'Customer', sub: 'user@dronehub.com', color: '#5b5bd6' },
              { role: 'shop-owner', email: 'owner@dronehub.com', pass: 'owner123', label: 'Owner 101', sub: 'SkyRent (101)', color: '#a8aaf4' },
              { role: 'shop-owner', email: 'owner2@dronehub.com', pass: 'owner123', label: 'Owner 102', sub: 'AeroTech (102)', color: '#a8aaf4' },
              { role: 'super-admin', email: 'admin@dronehub.com', pass: 'admin123', label: 'Super Admin', sub: 'admin@dronehub.com', color: '#34d399' },
            ].map(({ role, email: e, pass, label, sub, color }) => (
              <button key={label} type="button" onClick={() => handleQuickFill(role, e, pass)}
                className="p-2 bg-surface-3 hover:bg-line-strong border border-line/40 rounded-xl text-left transition-colors cursor-pointer">
                <div className="text-[11px] font-bold" style={{ color, }}>{label}</div>
                <div className="text-[10px] text-muted truncate">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[12px] text-muted pt-2 border-t border-line/30">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-bold text-accent hover:text-accent-hover transition-colors">Create one</Link>
        </div>

      </div>
    </AuthLayout>
  )
}

export default LoginPage
