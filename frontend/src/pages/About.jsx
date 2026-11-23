import React from 'react'
import { Link } from 'react-router-dom'
import { Navigation, Target, Eye, Users, Store, Shield, CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { roleBenefitsData } from '../data/mockData'

// About Component: Public page highlighting DroneHub mission, vision, and role benefits
function About() {
  return (
    <div className="space-y-20 pb-20 pt-28 bg-canvas">

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-wide text-accent-ink bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
          Empowering Aerial Innovation
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          About <span className="">DroneHub</span>
        </h1>
        <p className="text-lg text-subtle max-w-3xl mx-auto leading-relaxed">
          DroneHub is designed to connect drone rental businesses with customers looking for specialized drones for photography, videography, agriculture, surveying, industrial inspection, and beyond.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Mission Card */}
          <div className="relative bg-surface border border-accent/30 text-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-4 overflow-hidden ">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-ink">
              <Target className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-ink">Our Core Mission</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
              "Making drone technology more accessible through a simple and connected rental experience."
            </h2>
            <p className="text-fg-muted text-sm leading-relaxed">
              We break down financial barriers by enabling pilots and companies to rent high-performance UAV equipment on demand rather than absorbing high upfront capital expenditures.
            </p>
          </div>

          {/* Vision Card */}
          <div className="relative bg-black/60 border border-accent/20 text-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-4 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 text-accent-ink flex items-center justify-center">
              <Eye className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-ink">Our Future Vision</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
              "To build a trusted and scalable digital ecosystem for drone rental and management."
            </h2>
            <p className="text-subtle text-sm leading-relaxed">
              We envision a future where multi-tenant drone rental shops, fleet monitoring telemetry, and automated compliance come together in one smart unified hub.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Benefits Section for 3 Roles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wide text-accent-ink">Built For Everyone</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-muted">
            DroneHub bridges the gap between individual renters, certified host shop owners, and platform administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Benefit 1: Customers */}
          <div className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-8 rounded-2xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent border border-accent/30 text-accent-ink group-hover:text-accent-ink group-hover:border-accent/40 flex items-center justify-center transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.customers.title}</h3>
              <p className="text-sm text-muted">{roleBenefitsData.customers.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.customers.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-subtle leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/drones" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-ink hover:text-accent-ink pt-4 transition-colors">
              <span>Start Renting Drones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Benefit 2: Shop Owners */}
          <div className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-8 rounded-2xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent border border-accent/30 text-accent-ink group-hover:text-accent-ink group-hover:border-accent/40 flex items-center justify-center transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.shopOwners.title}</h3>
              <p className="text-sm text-muted">{roleBenefitsData.shopOwners.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.shopOwners.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-subtle leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-ink hover:text-accent-ink pt-4 transition-colors">
              <span>Register Your Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Benefit 3: Administrators */}
          <div className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-8 rounded-2xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent border border-accent/30 text-accent-ink group-hover:text-accent-ink group-hover:border-accent/40 flex items-center justify-center transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.administrators.title}</h3>
              <p className="text-sm text-muted">{roleBenefitsData.administrators.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.administrators.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-subtle leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-ink hover:text-accent-ink pt-4 transition-colors">
              <span>Explore Platform Tech</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-accent/30 p-8 sm:p-12 rounded-2xl text-center space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent-ink px-4 py-1.5 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4 text-accent-ink" />
              <span>Join the Network</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Want to join the DroneHub network?</h3>
            <p className="text-subtle max-w-xl mx-auto text-sm">
              Whether you are looking to rent equipment or expand your rental store presence, DroneHub is here to assist.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-accent text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg "
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About
