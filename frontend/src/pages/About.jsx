import React from 'react'
import { Link } from 'react-router-dom'
import { Navigation, Target, Eye, Users, Store, Shield, CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { roleBenefitsData } from '../data/mockData'

// About Component: Public page highlighting DroneHub mission, vision, and role benefits
function About() {
  return (
    <div className="space-y-20 pb-20 pt-28 bg-[#050508]">

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20">
          Empowering Aerial Innovation
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">DroneHub</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          DroneHub is designed to connect drone rental businesses with customers looking for specialized drones for photography, videography, agriculture, surveying, industrial inspection, and beyond.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Mission Card */}
          <div className="relative bg-gradient-to-br from-purple-900/60 to-purple-950/80 border border-purple-500/30 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 overflow-hidden glow-purple">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Target className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Our Core Mission</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              "Making drone technology more accessible through a simple and connected rental experience."
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We break down financial barriers by enabling pilots and companies to rent high-performance UAV equipment on demand rather than absorbing high upfront capital expenditures.
            </p>
          </div>

          {/* Vision Card */}
          <div className="relative bg-black/60 border border-cyan-500/20 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center">
              <Eye className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Our Future Vision</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              "To build a trusted and scalable digital ecosystem for drone rental and management."
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We envision a future where multi-tenant drone rental shops, fleet monitoring telemetry, and automated compliance come together in one smart unified hub.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Benefits Section for 3 Roles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Built For Everyone</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-slate-500">
            DroneHub bridges the gap between individual renters, certified host shop owners, and platform administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Benefit 1: Customers */}
          <div className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 text-purple-400 group-hover:text-cyan-400 group-hover:border-cyan-400/40 flex items-center justify-center transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.customers.title}</h3>
              <p className="text-sm text-slate-500">{roleBenefitsData.customers.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.customers.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/drones" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-cyan-400 pt-4 transition-colors">
              <span>Start Renting Drones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Benefit 2: Shop Owners */}
          <div className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 text-purple-400 group-hover:text-cyan-400 group-hover:border-cyan-400/40 flex items-center justify-center transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.shopOwners.title}</h3>
              <p className="text-sm text-slate-500">{roleBenefitsData.shopOwners.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.shopOwners.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-cyan-400 pt-4 transition-colors">
              <span>Register Your Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Benefit 3: Administrators */}
          <div className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 text-purple-400 group-hover:text-cyan-400 group-hover:border-cyan-400/40 flex items-center justify-center transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{roleBenefitsData.administrators.title}</h3>
              <p className="text-sm text-slate-500">{roleBenefitsData.administrators.subtitle}</p>
              <ul className="space-y-3 pt-2">
                {roleBenefitsData.administrators.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-cyan-400 pt-4 transition-colors">
              <span>Explore Platform Tech</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-purple-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Join the Network</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Want to join the DroneHub network?</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Whether you are looking to rent equipment or expand your rental store presence, DroneHub is here to assist.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 glow-purple"
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
