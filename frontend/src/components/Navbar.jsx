import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { currentUser, isAuthenticated, userRole, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Products', path: '/drones' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const getDashboardPath = () => {
    if (userRole === 'super-admin') return '/admin/dashboard'
    if (userRole === 'shop-owner') return '/owner/dashboard'
    return '/user/dashboard'
  }

  const getRoleLabel = () => {
    if (userRole === 'super-admin') return 'Super Admin'
    if (userRole === 'shop-owner') return 'Shop Owner'
    return 'Pilot'
  }

  const handleLogout = () => {
    logout()
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0c10]/98 backdrop-blur-2xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="h-14 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #0066ff 100%)' }}
          >
            <span
              className="material-symbols-outlined text-[#001a2e]"
              style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
            >
              flight_takeoff
            </span>
          </div>
          <span
            className="font-bold text-[17px] text-white tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            DroneHub
          </span>
        </Link>

        {/* Desktop Nav — DJI-style minimal, no icons */}
        <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 text-[13px] font-medium transition-colors rounded-md ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                />
                <span className="text-[13px] text-white/70 group-hover:text-white transition-colors">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-white/40" style={{ fontSize: '16px' }}>
                  expand_more
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="text-[13px] font-semibold text-white">{currentUser?.name}</div>
                    <div className="text-[11px] text-[#00f0ff] uppercase mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getRoleLabel()}
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>dashboard</span>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-[13px] text-white/60 hover:text-white px-3 py-1.5 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-1.5 h-8 px-5 rounded-full text-[13px] font-semibold text-[#001a2e] transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0c10]/98 backdrop-blur-2xl px-6 pt-4 pb-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/8'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-white/5 flex flex-col gap-2 mt-2">
            {isAuthenticated ? (
              <>
                <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
                  <img
                    src={currentUser?.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[13px] font-semibold text-white">{currentUser?.name}</div>
                    <div className="text-[10px] text-[#00f0ff] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{getRoleLabel()}</div>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-white/10 text-white py-2.5 rounded-full font-semibold text-[13px]"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-red-500/10 text-red-400 py-2.5 rounded-full font-semibold text-[13px] cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-white/60 hover:text-white py-2.5 rounded-full font-medium text-[13px] border border-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-[#001a2e] py-2.5 rounded-full font-bold text-[13px]"
                  style={{ background: 'linear-gradient(90deg, #00f0ff, #0066ff)' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
