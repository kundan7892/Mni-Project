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
    <div className="space-y-16 pb-20 pt-28 bg-canvas">

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-wide text-accent-ink bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
          Transparent Operational Blueprint
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
          How <span className="">DroneHub</span> Works
        </h1>
        <p className="text-lg text-subtle max-w-2xl mx-auto leading-relaxed">
          Learn how our three-role ecosystem coordinates renters, certified shop owners, and system administrators smoothly.
        </p>
      </section>

      {/* Role Selection Tabs */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Buttons */}
        <div className="flex justify-center">
          <div className="bg-black/60 border border-accent/20 p-1.5 rounded-2xl flex flex-wrap gap-2 max-w-2xl w-full justify-center backdrop-blur-sm">

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-accent   text-white shadow-lg '
                  : 'text-muted hover:text-fg-muted hover:bg-accent/15'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('shopOwners')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'shopOwners'
                  ? 'bg-accent   text-white shadow-lg '
                  : 'text-muted hover:text-fg-muted hover:bg-accent/15'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>For Shop Owners</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-accent   text-white shadow-lg '
                  : 'text-muted hover:text-fg-muted hover:bg-accent/15'
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
              <div className="bg-black/60 border border-accent/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Customer & Pilot Workflow</h3>
                  <p className="text-sm text-muted">6 simple steps to rent top-rated drones for your creative or industrial project.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold ">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-accent-ink group-hover:text-accent-ink transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHOP OWNER WORKFLOW */}
          {activeTab === 'shopOwners' && (
            <div className="space-y-8">
              <div className="bg-black/60 border border-accent/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shop Owner & Host Workflow</h3>
                  <p className="text-sm text-muted">Monetize your drone fleet with store management tools.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopOwnerSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold ">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-accent-ink group-hover:text-accent-ink transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN WORKFLOW */}
          {activeTab === 'admin' && (
            <div className="space-y-8">
              <div className="bg-black/60 border border-accent/20 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Super Admin Workflow</h3>
                  <p className="text-sm text-muted">Full operational oversight, shop verification, and system telemetry.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminSteps.map((step) => (
                  <div key={step.num} className="group bg-black/60 border border-accent/20 hover:border-accent/40 p-6 rounded-2xl backdrop-blur-sm space-y-3 relative transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold ">{step.num}</span>
                      <CheckCircle2 className="w-5 h-5 text-accent-ink group-hover:text-accent-ink transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-accent/30 p-8 sm:p-12 rounded-2xl text-center space-y-6 overflow-hidden ">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent-ink px-4 py-1.5 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4 text-accent-ink" />
              <span>Start Exploring</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">Ready to explore available rental drones?</h3>
            <p className="text-subtle text-sm max-w-xl mx-auto">
              Browse verified listings or reach out to our support team for specialized enterprise fleet requests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/drones" className="w-full sm:w-auto bg-accent text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg ">
                Browse Marketplace
              </Link>
              <Link to="/contact" className="w-full sm:w-auto border border-accent/40 hover:border-accent/50 text-fg-muted hover:text-accent-ink font-semibold px-6 py-3 rounded-xl transition-all backdrop-blur-sm hover:bg-accent/5">
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
