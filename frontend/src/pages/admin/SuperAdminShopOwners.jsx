import React, { useState, useMemo } from 'react'
import { UserCheck, Search, ShieldCheck, CheckCircle2, AlertTriangle, Eye } from 'lucide-react'
import { initialAdminShopOwners } from '../../data/adminData'

function SuperAdminShopOwners() {
  const [ownersList, setOwnersList] = useState(initialAdminShopOwners)
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredOwners = useMemo(() => {
    return ownersList.filter((o) => {
      if (!searchTerm.trim()) return true
      const query = searchTerm.toLowerCase()
      return (
        o.name.toLowerCase().includes(query) ||
        o.shopName.toLowerCase().includes(query) ||
        o.email.toLowerCase().includes(query)
      )
    })
  }, [ownersList, searchTerm])

  const handleUpdateStatus = (id, newStatus) => {
    setOwnersList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    showToast(`Owner ID #${id} status updated to '${newStatus}'.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Shop Owner Partner Directory ({filteredOwners.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Platform-wide partner account management and owner credentials audit log.
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
            placeholder="Search by Owner Name, Shop, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 focus:bg-surface rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* OWNERS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Shop Owner</th>
                <th className="py-4 px-4">Assigned Storefront</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Total Revenue</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-fg">
                    <div className="font-bold text-fg text-sm">{owner.name}</div>
                    <div className="text-[11px] text-subtle font-normal">{owner.email}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-accent-ink">{owner.shopName}</td>
                  <td className="py-3.5 px-4 text-muted">{owner.phone}</td>
                  <td className="py-3.5 px-4 text-muted">{owner.joinedDate}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">₹{(owner.totalRevenue/1000).toFixed(0)}k</td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      owner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}>
                      {owner.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    {owner.status === 'Active' ? (
                      <button
                        onClick={() => handleUpdateStatus(owner.id, 'Suspended')}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(owner.id, 'Active')}
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

export default SuperAdminShopOwners
