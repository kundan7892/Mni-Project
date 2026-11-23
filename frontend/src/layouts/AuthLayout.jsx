import React from 'react'

/** Centered card used by sign in, sign up and password reset pages. */
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
