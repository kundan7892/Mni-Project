import React from 'react'
import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Rent',
    links: [
      ['All drones', '/drones'],
      ['How it works', '/how-it-works'],
      ['FAQ', '/faq']
    ]
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Contact', '/contact']
    ]
  },
  {
    title: 'Account',
    links: [
      ['Sign in', '/auth/login'],
      ['Create account', '/auth/register'],
      ['My rentals', '/user/rentals']
    ]
  }
]

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-fg text-canvas flex items-center justify-center text-[13px] font-bold">D</span>
            <span className="text-[15px] font-semibold tracking-tight text-fg">DroneHub</span>
          </Link>
          <p className="text-sm text-muted max-w-xs">Professional drones for rent by the day, ready to fly.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="text-xs font-medium text-subtle">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-muted hover:text-fg transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-line text-xs text-subtle">
        © {new Date().getFullYear()} DroneHub
      </div>
    </footer>
  )
}

export default Footer
