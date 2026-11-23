import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, Eye, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Trash2, Edit } from 'lucide-react'
import ShopFormModal from '../../components/admin/ShopFormModal'
import ShopDetailsModal from '../../components/admin/ShopDetailsModal'
import ConfirmationModal from '../../components/owner/ConfirmationModal'
import { initialAdminShops } from '../../data/adminData'

/*
  DEVELOPER NOTE:
  Super Admin shop deletion is a frontend demonstration prototype.
  In a production environment, database record cascades, active rental checks,
  and audit logs must be processed server-side.
*/

function SuperAdminShops() {
  const [shopsList, setShopsList] = useState(initialAdminShops)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [verificationFilter, setVerificationFilter] = useState('All')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [shopToEdit, setShopToEdit] = useState(null)

  const [selectedShopModal, setSelectedShopModal] = useState(null)
  const [shopToDelete, setShopToDelete] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredShops = useMemo(() => {
    return shopsList
      .filter((s) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          s.name.toLowerCase().includes(query) ||
          s.ownerName.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          s.ownerEmail.toLowerCase().includes(query)
        )
      })
      .filter((s) => {
        if (statusFilter === 'All') return true
        return s.status.toLowerCase() === statusFilter.toLowerCase()
      })
      .filter((s) => {
        if (verificationFilter === 'All') return true
        return s.verification.toLowerCase() === verificationFilter.toLowerCase()
      })
  }, [shopsList, searchTerm, statusFilter, verificationFilter])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Suspended': return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
      default: return 'bg-surface-2 text-fg-muted border-line'
    }
  }

  const getVerificationBadgeStyle = (ver) => {
    switch (ver) {
      case 'Verified': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  // Save Shop (Add / Edit)
  const handleSaveShop = (formData) => {
    if (shopToEdit) {
      setShopsList((prev) =>
        prev.map((s) => (s.shopId === shopToEdit.shopId ? { ...s, ...formData } : s))
      )
      showToast(`Shop '${formData.name}' updated successfully.`)
    } else {
      const newShop = {
        shopId: Date.now(),
        dronesCount: 0,
        activeRentalsCount: 0,
        customersCount: 0,
        revenue: 0,
        rating: 5.0,
        joinedDate: new Date().toISOString().split('T')[0],
        ...formData
      }
      setShopsList([newShop, ...shopsList])
      showToast(`Shop '${formData.name}' added successfully to platform.`)
    }
    setIsFormOpen(false)
    setShopToEdit(null)
  }

  // Update Status Handler (Approve / Reject / Suspend / Reactivate)
  const handleUpdateShopStatus = (shopId, newStatus, newVerification = 'Verified', reason = '') => {
    setShopsList((prev) =>
      prev.map((s) => (s.shopId === shopId ? { ...s, status: newStatus, verification: newVerification } : s))
    )
    showToast(`Shop ID #${shopId} status changed to '${newStatus}' (${newVerification}). ${reason ? `Reason: ${reason}` : ''}`)
  }

  // Delete Shop Handler
  const handleConfirmDelete = () => {
    if (!shopToDelete) return
    setShopsList((prev) => prev.filter((s) => s.shopId !== shopToDelete.shopId))
    showToast(`Shop '${shopToDelete.name}' removed from platform database.`)
    setShopToDelete(null)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            Shop Storefront Directory ({filteredShops.length})
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Approve partner applications, suspend policy violators, and manage platform shop listings.
          </p>
        </div>

        <button
          onClick={() => { setShopToEdit(null); setIsFormOpen(true); }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Partner Shop</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Shop Name, Owner, City, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 focus:bg-surface rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Approval</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Verifications</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

      </div>

      {/* SHOPS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Shop</th>
                <th className="py-4 px-4">Owner</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Drones</th>
                <th className="py-4 px-4">Active Rentals</th>
                <th className="py-4 px-4">Total Revenue</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Verification</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr key={shop.shopId} className="hover:bg-surface-2 transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-fg flex items-center gap-3">
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-10 h-10 rounded-xl object-cover border border-line shrink-0"
                      />
                      <div>
                        <div className="font-bold text-fg text-sm">{shop.name}</div>
                        <div className="text-[10px] text-subtle font-mono">ID: #{shop.shopId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-fg">{shop.ownerName}</div>
                      <div className="text-[11px] text-subtle font-normal">{shop.ownerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 text-muted">{shop.city}</td>
                    <td className="py-3.5 px-4 font-bold text-fg">{shop.dronesCount || 18}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{shop.activeRentalsCount || 4} live</td>
                    <td className="py-3.5 px-4 font-semibold text-fg">₹{((shop.revenue || 1420000)/1000).toFixed(0)}k</td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(shop.status)}`}>
                        {shop.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getVerificationBadgeStyle(shop.verification)}`}>
                        {shop.verification}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedShopModal(shop)}
                        className="p-1.5 text-muted hover:text-emerald-400 bg-surface-2 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer"
                        title="View Details & Clearances"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => { setShopToEdit(shop); setIsFormOpen(true); }}
                        className="p-1.5 text-muted hover:text-accent-ink bg-surface-2 hover:bg-accent/10 rounded-xl transition-colors cursor-pointer"
                        title="Edit Shop"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setShopToDelete(shop)}
                        className="p-1.5 text-muted hover:text-rose-400 bg-surface-2 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Shop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-subtle italic">
                    No shops found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add / Edit Shop Form Modal */}
      <ShopFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setShopToEdit(null); }}
        onSave={handleSaveShop}
        shopToEdit={shopToEdit}
      />

      {/* View Shop Details Modal */}
      {selectedShopModal && (
        <ShopDetailsModal
          shop={selectedShopModal}
          onClose={() => setSelectedShopModal(null)}
          onUpdateStatus={handleUpdateShopStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!shopToDelete}
        title="Delete Shop from Platform?"
        message={`Are you sure you want to permanently remove '${shopToDelete?.name}' from DroneHub? This action is simulated on the frontend.`}
        confirmText="Yes, Delete Shop"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShopToDelete(null)}
      />

    </div>
  )
}

export default SuperAdminShops
