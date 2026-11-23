import React, { useState, useMemo } from 'react'
import { Users, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { initialAdminCustomers } from '../../data/adminData'

function SuperAdminCustomers() {
  const [customersList, setCustomersList] = useState(initialAdminCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      if (!searchTerm.trim()) return true
      const query = searchTerm.toLowerCase()
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
      )
    })
  }, [customersList, searchTerm])

  const handleUpdateStatus = (id, newStatus) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
    showToast(`Customer ID #${id} status updated to '${newStatus}'.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Global Customer Directory ({filteredCustomers.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Platform-wide customer accounts across all partner storefronts.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customer by Name, Email, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 focus:bg-surface rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Total Rentals</th>
                <th className="py-4 px-4">Total Spent</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-fg text-sm">{cust.name}</div>
                    <div className="text-[11px] text-subtle font-normal">{cust.email}</div>
                  </td>

                  <td className="py-3.5 px-4 text-muted">{cust.phone}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">{cust.city}</td>
                  <td className="py-3.5 px-4 font-bold text-fg">{cust.totalRentals} rentals</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">₹{cust.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-muted">{cust.joinedDate}</td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      cust.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}>
                      {cust.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    {cust.status === 'Active' ? (
                      <button
                        onClick={() => handleUpdateStatus(cust.id, 'Suspended')}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(cust.id, 'Active')}
                        className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default SuperAdminCustomers
