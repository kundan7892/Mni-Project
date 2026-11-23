import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Store, User, LogOut, Sparkles, Clock, LayoutDashboard, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function DashboardPlaceholder({ expectedRole, title }) {
  const { currentUser, logout } = useAuth()

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super-admin':
        return { label: 'Super Admin Portal', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', icon: ShieldCheck }
      case 'shop-owner':
        return { label: 'Shop Owner Portal', color: 'bg-accent/10 text-accent-ink border-accent/25', icon: Store }
      default:
        return { label: 'Customer Rental Portal', color: 'bg-accent/10 text-accent-ink border-accent/25', icon: User }
    }
  }

  const roleMeta = getRoleBadge(currentUser?.role || expectedRole)
  const RoleIcon = roleMeta.icon

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header Banner Card */}
      <div className="bg-surface rounded-2xl border border-line p-8 sm:p-12 shadow-lg space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent-ink flex items-center justify-center mx-auto shadow-inner">
          <RoleIcon className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleMeta.color}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{roleMeta.label}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            {title || 'Dashboard'}
          </h1>

          <p className="text-muted text-base max-w-lg mx-auto">
            Welcome back, <span className="font-bold text-fg">{currentUser?.name || 'User'}</span>! You are successfully authenticated.
          </p>
        </div>

        {/* User Card Info */}
        <div className="bg-surface-2 p-5 rounded-2xl border border-line inline-flex flex-col sm:flex-row items-center gap-4 text-left max-w-md w-full">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser?.name}
            className="w-14 h-14 rounded-2xl object-cover border border-line shrink-0"
          />
          <div className="space-y-0.5 text-xs text-muted">
            <div className="font-semibold text-fg text-sm">{currentUser?.name}</div>
            <div>{currentUser?.email}</div>
            <div className="text-accent-ink font-semibold uppercase tracking-wider text-[10px] pt-1">
              Role Privilege: {currentUser?.role}
            </div>
          </div>
        </div>

        {/* Coming Soon Notice Box */}
        <div className="p-6 bg-surface text-white rounded-2xl space-y-3 max-w-lg mx-auto shadow-lg">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming Module</span>
          </div>
          
          <h3 className="text-xl font-semibold text-white">
            Full Interactive Dashboard Coming Soon!
          </h3>

          <p className="text-fg-muted text-xs leading-relaxed">
            The full role-based analytics, inventory control, fleet tracking, and management dashboards for {currentUser?.role} will be built in the upcoming dashboard phase.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/drones"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={logout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/10 text-rose-400 font-bold px-7 py-3 rounded-xl text-xs border border-rose-500/25 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </div>
  )
}

export default DashboardPlaceholder
