import React, { useState, useMemo } from 'react'
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

function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loginHref = searchParams.get('redirect')?.startsWith('/') ? `/auth/login?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : '/auth/login'
  const { register } = useAuth()

  const [role, setRole] = useState('customer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: 'bg-surface-3', width: 'w-0', score: 0 }
    let score = 0
    if (password.length >= 8) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' }
    if (score === 3) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!fullName || fullName.trim().length < 2) { setErrorMessage('Please enter your full legal name.'); return }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErrorMessage('Please enter a valid email address.'); return }
    if (!phone || !/^[0-9+\s-]{10,15}$/.test(phone.trim())) { setErrorMessage('Please enter a valid phone number.'); return }
    if (!password || password.length < 8) { setErrorMessage('Password must be at least 8 characters long.'); return }
    if (password !== confirmPassword) { setErrorMessage('Passwords do not match.'); return }
    if (!agreeTerms) { setErrorMessage('You must agree to the Terms & Conditions to register.'); return }
    try {
      const result = await register({ fullName, email, phone, password, role })
      if (result.success) setIsSuccess(true)
      else setErrorMessage(result.error)
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.')
    }
  }

  const inputClass = "w-full h-11 bg-surface-2 border border-line/50 focus:border-accent/60 focus:ring-1 focus:ring-accent/20 focus:outline-none rounded-xl px-4 text-[14px] text-fg placeholder-line transition-all"
  const labelClass = "block text-xs font-medium text-fg-muted mb-1.5"

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold text-fg tracking-tight">
              Account Created!
            </h1>
            <p className="text-[13px] text-muted max-w-sm mx-auto">
              Your DroneHub account has been created. You can now sign in using your credentials.
            </p>
          </div>
          <Link
            to={loginHref}
            className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-accent text-white font-bold text-[14px] transition-all hover:bg-accent-hover active:scale-95"
          >
            Go to Login
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="space-y-5">

        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-fg tracking-tight">
            Create Your Account
          </h1>
          <p className="text-[13px] text-muted">Join thousands of pilots and drone rental hosts.</p>
        </div>

        {/* Account Type */}
        <div className="space-y-2">
          <label className={labelClass}>Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { r: 'customer', icon: 'person', label: 'Customer', desc: 'Rent drones for your projects & missions.', color: '#5b5bd6' },
              { r: 'shop-owner', icon: 'storefront', label: 'Shop Owner', desc: 'List & manage your rental fleet business.', color: '#a8aaf4' },
            ].map(({ r, icon, label, desc, color }) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${role === r
                  ? 'border-accent/60 bg-accent/8 '
                  : 'border-line/40 bg-surface-2 hover:border-line/70'
                  }`}
              >
                <div className="flex items-center gap-2 text-[13px] font-semibold text-fg">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  {label}
                </div>
                <p className="text-[11px] text-muted mt-1 leading-tight">{desc}</p>
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
            <label className={labelClass}>Full Legal Name <span className="text-rose-300">*</span></label>
            <div className="relative">
              <input type="text" placeholder="e.g. Kartikey Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`${inputClass} pr-10`} required />
              <span className="material-symbols-outlined text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '16px' }}>person</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Email <span className="text-rose-300">*</span></label>
              <div className="relative">
                <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pr-10`} required />
                <span className="material-symbols-outlined text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '16px' }}>mail</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone <span className="text-rose-300">*</span></label>
              <div className="relative">
                <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} pr-10`} required />
                <span className="material-symbols-outlined text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '16px' }}>phone</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Password <span className="text-rose-300">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-accent cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm Password <span className="text-rose-300">*</span></label>
              <input type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
            </div>
          </div>

          {/* Password strength */}
          {password && (
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between font-semibold text-muted">
                <span>Password Strength:</span>
                <span style={{ color: passwordStrength.label === 'Strong' ? '#34d399' : passwordStrength.label === 'Medium' ? '#fbbf24' : '#fda4af' }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden border border-line/30">
                <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300 rounded-full`} />
              </div>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer text-[12px] text-muted select-none">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 rounded accent-[#5b5bd6] bg-surface-2 mt-0.5" />
            <span>
              I agree to the{' '}
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('DroneHub Rental Terms & Safety Policy') }} className="text-accent hover:text-accent-hover underline font-bold transition-colors">
                Terms & Conditions
              </a>
              {' '}and Drone Operating Safety Guidelines.
            </span>
          </label>

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-accent text-white font-bold text-[14px] transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            Create Account
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </form>

        <div className="text-center text-[12px] text-muted pt-2 border-t border-line/30">
          Already have a DroneHub account?{' '}
          <Link to={loginHref} className="font-bold text-accent hover:text-accent-hover transition-colors">Sign In</Link>
        </div>

      </div>
    </AuthLayout>
  )
}

export default RegisterPage
