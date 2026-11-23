import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, User, Settings, LogOut, ShieldCheck, ChevronDown, Navigation } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

function DashboardHeader({ onMobileMenuToggle }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Get current hour for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-30 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Toggle & Greeting */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-fg-muted hover:text-accent-ink bg-surface-2 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-fg leading-snug">
              {greeting}, {currentUser?.name?.split(' ')[0] || 'Customer'} 
            </h1>
            <p className="text-xs text-muted hidden sm:block">
              Here's what's happening with your drone rentals today.
            </p>
          </div>
        </div>

        {/* Right Side: Notification Icon & Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Notification Bell Component */}
          <NotificationBell
            role="customer"
            userId={currentUser?.id || 3}
            viewAllLink="/user/notifications"
          />

          {/* User Profile Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 bg-surface-2 hover:bg-surface-2 p-1.5 pr-3 rounded-2xl border border-line transition-all cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover border border-line"
              />
              <div className="text-left text-xs hidden sm:block">
                <div className="font-semibold text-fg truncate max-w-[120px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-accent-ink font-bold uppercase tracking-wider">
                  Customer
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-subtle" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl border border-line shadow-lg py-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-line space-y-0.5">
                  <div className="font-bold text-fg">{currentUser?.name}</div>
                  <div className="text-muted text-[11px] truncate">{currentUser?.email}</div>
                </div>

                <Link
                  to="/user/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-fg-muted hover:bg-accent/10 hover:text-accent-ink font-bold transition-colors"
                >
                  <User className="w-4 h-4 text-accent-ink" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/user/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-fg-muted hover:bg-accent/10 hover:text-accent-ink font-bold transition-colors"
                >
                  <Settings className="w-4 h-4 text-accent-ink" />
                  <span>Account Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 font-bold transition-colors cursor-pointer text-left border-t border-line"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  )
}

export default DashboardHeader
