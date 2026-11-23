import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Search, PackageCheck, ShieldCheck, BatteryCharging, Headphones } from 'lucide-react'
import droneService from '../services/droneService'
import DroneCard from '../components/DroneCard'
import { normalizeDrone } from '../lib/format'

const STEPS = [
  { icon: Search, title: 'Pick a drone', text: 'Browse the fleet and compare cameras, flight time and daily price.' },
  { icon: CalendarCheck, title: 'Request your dates', text: 'Choose pickup and return days, add extras, and upload your ID. Nothing is charged yet.' },
  { icon: PackageCheck, title: 'Collect and fly', text: 'Once the shop confirms, pick it up, pay, and fly. Return it when you are done.' }
]

const PROMISES = [
  { icon: ShieldCheck, title: 'Inspected before every rental', text: 'Each drone is checked, calibrated and test-flown before it leaves.' },
  { icon: BatteryCharging, title: 'Ready to fly', text: 'Charged batteries, spare propellers and a hard case come in the box.' },
  { icon: Headphones, title: 'Help when you need it', text: 'Questions about settings or airspace? We answer during your rental.' }
]

function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let alive = true
    droneService
      .getDrones({ limit: 50, sort: 'recommended' })
      .then((res) => {
        if (!alive) return
        const list = (res?.drones || []).map(normalizeDrone)
        setFeatured(list.filter((d) => d.status === 'available').slice(0, 3))
        const counts = list.reduce((acc, d) => ({ ...acc, [d.category]: (acc[d.category] || 0) + 1 }), {})
        setCategories(Object.entries(counts).sort((a, b) => b[1] - a[1]))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-fg leading-[1.05]">
              Rent a professional drone for the day.
            </h1>
            <p className="text-lg text-muted max-w-lg">
              Cinema, survey, inspection and starter drones, inspected and ready to fly. Request your dates online and collect once they're confirmed.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/drones" className="h-11 px-5 inline-flex items-center gap-2 rounded-lg bg-fg text-canvas text-sm font-medium hover:bg-fg-muted transition-colors">
                Browse drones <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/how-it-works" className="h-11 px-5 inline-flex items-center rounded-lg ring-1 ring-line text-sm text-fg hover:bg-surface-2 transition-colors">
                How it works
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#ececef] flex items-center justify-center">
              <img src="/drone-aero-x4-front.png" alt="Aero X4 camera drone" className="w-[88%] h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-fg tracking-tight">Available now</h2>
              <p className="text-sm text-muted">A few of the drones you can book today.</p>
            </div>
            <Link to="/drones" className="text-sm text-muted hover:text-fg inline-flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((d) => <DroneCard key={d._id} drone={d} />)}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-y border-line bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
          <h2 className="text-2xl font-semibold text-fg tracking-tight">Three steps to the sky</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-subtle tabular-nums">0{i + 1}</span>
                  <s.icon className="w-5 h-5 text-accent-ink" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-medium text-fg">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-6">
          <h2 className="text-2xl font-semibold text-fg tracking-tight">Find the right drone for the job</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(([name, count]) => (
              <Link
                key={name}
                to={`/drones?category=${encodeURIComponent(name)}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full ring-1 ring-line text-sm text-fg hover:bg-surface-2 transition-colors"
              >
                {name}
                <span className="text-subtle tabular-nums">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Promises */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {PROMISES.map((p) => (
            <div key={p.title} className="rounded-xl border border-line bg-surface p-6 space-y-3">
              <p.icon className="w-5 h-5 text-muted" strokeWidth={1.75} />
              <h3 className="text-base font-medium text-fg">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-line bg-surface px-8 py-12 sm:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-fg tracking-tight">Planning a shoot?</h2>
            <p className="text-muted">Check availability and send a request in a couple of minutes.</p>
          </div>
          <Link to="/drones" className="h-11 px-5 inline-flex items-center gap-2 rounded-lg bg-fg text-canvas text-sm font-medium hover:bg-fg-muted transition-colors shrink-0">
            Browse drones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
