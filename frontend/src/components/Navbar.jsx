import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { name: 'Drones', path: '/drones' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' }
]

export const dashboardPathFor = (role) =>
  role === 'super-admin' || role === 'admin' ? '/admin/dashboard' : role === 'shop-owner' || role === 'owner' ? '/owner/dashboard' : '/user/dashboard'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, userRole, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => `px-3 py-1.5 text-sm rounded-md transition-colors ${isActive ? 'text-fg' : 'text-muted hover:text-fg'}`

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${scrolled || open ? 'bg-canvas/85 backdrop-blur-md border-b border-line' : 'border-b border-transparent'}`}>
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-md bg-fg text-canvas flex items-center justify-center text-[13px] font-bold">D</span>
          <span className="text-[15px] font-semibold tracking-tight text-fg">DroneHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>{item.name}</NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button type="button" onClick={handleLogout} className="px-3 py-1.5 text-sm text-muted hover:text-fg cursor-pointer">Sign out</button>
              <Link to={dashboardPathFor(userRole)} className="h-8 px-3.5 inline-flex items-center rounded-lg bg-fg text-canvas text-sm font-medium hover:bg-fg-muted transition-colors">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="px-3 py-1.5 text-sm text-muted hover:text-fg">Sign in</Link>
              <Link to="/auth/register" className="h-8 px-3.5 inline-flex items-center rounded-lg bg-fg text-canvas text-sm font-medium hover:bg-fg-muted transition-colors">
                Create account
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className="md:hidden p-2 -mr-2 text-muted hover:text-fg cursor-pointer" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line px-4 py-4 space-y-1 bg-canvas">
          {NAV.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-surface-2 text-fg' : 'text-muted'}`}>
              {item.name}
            </NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-line flex gap-2">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPathFor(userRole)} className="flex-1 h-9 inline-flex items-center justify-center rounded-lg bg-fg text-canvas text-sm font-medium">Dashboard</Link>
                <button type="button" onClick={handleLogout} className="flex-1 h-9 rounded-lg ring-1 ring-line text-sm text-fg cursor-pointer">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="flex-1 h-9 inline-flex items-center justify-center rounded-lg ring-1 ring-line text-sm text-fg">Sign in</Link>
                <Link to="/auth/register" className="flex-1 h-9 inline-flex items-center justify-center rounded-lg bg-fg text-canvas text-sm font-medium">Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
