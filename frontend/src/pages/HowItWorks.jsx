import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Store, ShieldCheck, CheckCircle2, ArrowRight, Zap } from 'lucide-react'

// HowItWorks Component: Visual step-by-step workflow guide for Customers, Shop Owners & Admins
function HowItWorks() {
  const [activeTab, setActiveTab] = useState('customers')

  const customerSteps = [
    { num: '01', title: 'Browse Drones', desc: 'Filter catalog by payload specs, flight time, camera resolution, and location.' },
    { num: '02', title: 'Compare Options', desc: 'Evaluate daily pricing, verified shop ratings, included batteries, and accessories.' },
    { num: '03', title: 'Select Rental Dates', desc: 'Choose precise pickup and return slots using instant store availability calendars.' },
    { num: '04', title: 'Submit Booking Request', desc: 'Confirm request details with transparent daily rate calculations.' },
    { num: '05', title: 'Receive Confirmation', desc: 'Get digital approval from the verified shop host along with dispatch code.' },
    { num: '06', title: 'Manage Rental Dashboard', desc: 'Track active rental timers, request extension windows, and download compliance invoices.' }
  ]

  const shopOwnerSteps = [
    { num: '01', title: 'Register Shop', desc: 'Apply with commercial credentials and set up your store profile location.' },
    { num: '02', title: 'Add Drones', desc: 'Upload fleet specs, serial numbers, camera sensor details, and custom daily rates.' },
    { num: '03', title: 'Manage Bookings', desc: 'Accept or decline customer rental requests with automated schedule conflict checks.' },
    { num: '04', title: 'Manage Customers', desc: 'Verify renter identity compliance, check-in equipment, and track check-out logs.' },
    { num: '05', title: 'Monitor Rental Activity', desc: 'Access revenue reports, fleet utilization stats, and scheduled maintenance alerts.' }
  ]

  const adminSteps = [
    { num: '01', title: 'Manage Rental Shops', desc: 'Review, verify, and approve new drone rental store onboarding applications.' },
    { num: '02', title: 'Monitor Users', desc: 'Enforce platform flight safety policies, identity verification, and dispute resolution.' },
    { num: '03', title: 'View Platform Analytics', desc: 'Track nationwide rental volume, active fleet distribution, and commission revenues.' },
    { num: '04', title: 'Manage Operations', desc: 'Maintain platform uptime, update global categories, and supervise compliance logs.' }
  ]

  return (
    <div className="space-y-16 pb-20 pt-28 bg-[#050508]">

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20">
          Transparent Operational Blueprint
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">DroneHub</span> Works
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Learn how our three-role ecosystem coordinates renters, certified shop owners, and system administrators smoothly.
        </p>
      </section>

      {/* Role Selection Tabs */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Buttons */}
        <div className="flex justify-center">
          <div className="bg-black/60 border border-purple-500/20 p-1.5 rounded-2xl flex flex-wrap gap-2 max-w-2xl w-full justify-center backdrop-blur-sm">

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-purple-900/20'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('shopOwners')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'shopOwners'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-purple-900/20'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>For Shop Owners</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-purple-900/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>For Admins</span>
            </button>

          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-12">

          {/* CUSTOMER WORKFLOW */}
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="bg-black/60 border border-purple-500/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 text-white flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Customer & Pilot Workflow</h3>
                  <p className="text-sm text-slate-500">6 simple steps to rent top-rated drones for your creative or industrial project.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-purple-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHOP OWNER WORKFLOW */}
          {activeTab === 'shopOwners' && (
            <div className="space-y-8">
              <div className="bg-black/60 border border-purple-500/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 text-white flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shop Owner & Host Workflow</h3>
                  <p className="text-sm text-slate-500">Monetize your drone fleet with store management tools.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopOwnerSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-purple-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN WORKFLOW */}
          {activeTab === 'admin' && (
            <div className="space-y-8">
              <div className="bg-black/60 border border-purple-500/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Super Admin Workflow</h3>
                  <p className="text-sm text-slate-500">Full operational oversight, shop verification, and system telemetry.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-purple-500/20 hover:border-cyan-400/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-purple-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-purple-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-6 overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Start Exploring</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to explore available rental drones?</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Browse verified listings or reach out to our support team for specialized enterprise fleet requests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/drones" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25">
                Browse Marketplace
              </Link>
              <Link to="/contact" className="w-full sm:w-auto border border-purple-500/40 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 font-semibold px-6 py-3 rounded-xl transition-all backdrop-blur-sm hover:bg-cyan-400/5">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HowItWorks
