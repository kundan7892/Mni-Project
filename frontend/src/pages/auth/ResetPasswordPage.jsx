import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'

/*
  DEVELOPER NOTE:
  This authentication system is a frontend prototype.
  Real authentication, authorization, password hashing,
  sessions/tokens, and backend security must be implemented
  when the backend is connected.
*/

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Password strength meter
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { label: '', color: 'bg-surface-3', score: 0 }
    let score = 0
    if (newPassword.length >= 8) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++
    if (/[A-Z]/.test(newPassword)) score++

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' }
    if (score === 3) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  }, [newPassword])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSuccess(true)
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-fg tracking-tight">
                Reset Password
              </h1>
              <p className="text-muted text-sm">
                Create a new secure password for your DroneHub account.
              </p>
            </div>

            {/* ERROR DISPLAY */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-2 border border-line focus:border-accent focus:bg-surface focus:outline-none rounded-xl py-3 pl-4 pr-10 text-sm text-fg font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-muted cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-muted">
                    <span>Strength:</span>
                    <span className={passwordStrength.label === 'Strong' ? 'text-emerald-400' : passwordStrength.label === 'Medium' ? 'text-amber-400' : 'text-rose-400'}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                  </div>
                </div>
              )}

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-2 border border-line focus:border-accent focus:bg-surface focus:outline-none rounded-xl py-3 pl-4 pr-10 text-sm text-fg font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reset Password</span>
                <KeyRound className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* SUCCESS DISPLAY */
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-fg tracking-tight">
                Password Reset Successfully
              </h2>
              <p className="text-muted text-sm max-w-sm mx-auto">
                Your password has been updated in this frontend simulation. You can now log in with your new credentials.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage
