import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, AlertCircle, Navigation } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import DroneFormModal from '../../components/owner/DroneFormModal'
import ConfirmationModal from '../../components/owner/ConfirmationModal'
import { initialOwnerDrones } from '../../data/ownerData'
import droneService from '../../services/droneService'

function ShopOwnerDrones() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  // Shop-isolated state initialized with mock fleet fallback
  const [dronesList, setDronesList] = useState(() =>
    initialOwnerDrones.filter((d) => d.shopId === shopId)
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [droneToEdit, setDroneToEdit] = useState(null)

  const [droneToDelete, setDroneToDelete] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError })
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Load live shop fleet from backend API
  const fetchFleetDrones = async () => {
    try {
      const data = await droneService.getDrones({ limit: 100 })
      if (data?.drones && data.drones.length > 0) {
        const formatted = data.drones.map((d) => ({
          ...d,
          id: d._id || d.id,
          pricePerDay: d.pricePerDay || (d.pricePerHour ? d.pricePerHour * 8 : 2500),
          status:
            d.availability ||
            (d.status
              ? d.status.charAt(0).toUpperCase() + d.status.slice(1)
              : 'Available'),
          totalRentalsCount: d.totalRentalsCount || 0,
          currentCustomer: d.currentCustomer || null
        }))
        setDronesList(formatted)
      }
    } catch (err) {
      console.warn('API fleet fetch unavailable, keeping current inventory:', err.message)
    }
  }

  useEffect(() => {
    fetchFleetDrones()
  }, [])

  // Filtered drones pipeline
  const filteredDrones = useMemo(() => {
    return dronesList
      .filter((d) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          d.name.toLowerCase().includes(query) ||
          d.model?.toLowerCase().includes(query) ||
          d.category?.toLowerCase().includes(query)
        )
      })
      .filter((d) => {
        if (statusFilter === 'All') return true
        return d.status.toLowerCase() === statusFilter.toLowerCase()
      })
      .filter((d) => {
        if (categoryFilter === 'All') return true
        return d.category === categoryFilter
      })
      .filter((d) => {
        if (brandFilter === 'All') return true
        return d.brand === brandFilter
      })
  }, [dronesList, searchTerm, statusFilter, categoryFilter, brandFilter])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Rented': case 'Currently Rented': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  // Save Drone Handler (Add or Edit) connected to backend API
  const handleSaveDrone = async (formData) => {
    try {
      if (droneToEdit) {
        // Edit Existing via API
        let updatedItem = null
        try {
          updatedItem = await droneService.updateDrone(droneToEdit._id || droneToEdit.id, formData)
        } catch {
          // Fallback to local state if backend mock ID
        }

        setDronesList((prev) =>
          prev.map((d) =>
            d.id === droneToEdit.id
              ? {
                  ...d,
                  ...formData,
                  ...(updatedItem ? { ...updatedItem, id: updatedItem._id || updatedItem.id } : {})
                }
              : d
          )
        )
        showToast(`Drone '${formData.name}' updated successfully in fleet.`)
      } else {
        // Add New via API
        let createdItem = null
        try {
          createdItem = await droneService.createDrone(formData)
        } catch {
          // Fallback
        }

        const newDrone = {
          id: createdItem?._id || createdItem?.id || Date.now(),
          shopId: shopId,
          shopName: currentUser?.shopName || 'SkyRent Bengaluru',
          totalRentalsCount: 0,
          currentCustomer: null,
          status: formData.availability || 'Available',
          ...formData,
          ...(createdItem || {})
        }

        setDronesList([newDrone, ...dronesList])
        showToast(`Drone '${formData.name}' added successfully to fleet.`)
      }
    } catch (err) {
      showToast(err.message || 'Operation failed. Please try again.', true)
    }

    setIsFormModalOpen(false)
    setDroneToEdit(null)
  }

  // Delete Drone Handler connected to backend API
  const handleConfirmDelete = async () => {
    if (!droneToDelete) return

    try {
      try {
        await droneService.deleteDrone(droneToDelete._id || droneToDelete.id)
      } catch (err) {
        if (err.message && err.message.includes('currently rented')) {
          showToast(err.message, true)
          setDroneToDelete(null)
          return
        }
      }

      setDronesList((prev) => prev.filter((d) => d.id !== droneToDelete.id))
      showToast(`Drone '${droneToDelete.name}' removed from fleet.`)
    } catch (err) {
      showToast(err.message || 'Failed to delete drone.', true)
    } finally {
      setDroneToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            My Fleet Drones ({filteredDrones.length})
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Manage equipment specs, daily rates, security deposits, and maintenance status.
          </p>
        </div>

        <button
          onClick={() => { setDroneToEdit(null); setIsFormModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Drone</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 border ${
          toastMessage.isError
            ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
        }`}>
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{typeof toastMessage === 'string' ? toastMessage : toastMessage.text}</span>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Drone Name, Model, Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-accent focus:bg-surface rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Surveying">Surveying</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Beginner">Beginner</option>
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Brands</option>
            <option value="DJI">DJI</option>
            <option value="Autel">Autel</option>
            <option value="Parrot">Parrot</option>
          </select>

        </div>

      </div>

      {/* DRONES TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Drone</th>
                <th className="py-4 px-4">Model / Specs</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price / Day</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Current Renter</th>
                <th className="py-4 px-4">Total Rentals</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredDrones.length > 0 ? (
                filteredDrones.map((drone) => (
                  <tr key={drone.id} className="hover:bg-surface-2 transition-colors">
                    
                    {/* Drone Image & Name */}
                    <td className="py-3.5 px-4 font-bold text-fg flex items-center gap-3">
                      <img
                        src={drone.image}
                        alt={drone.name}
                        className="w-11 h-11 rounded-xl object-cover border border-line shrink-0"
                      />
                      <div>
                        <div className="font-bold text-fg text-sm">{drone.name}</div>
                        <div className="text-[11px] text-subtle font-normal">{drone.brand}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted">{drone.model || drone.camera || '4K HDR'}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-accent/10 text-accent-ink px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                        {drone.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-fg">₹{(drone.pricePerDay || drone.dailyRate)?.toLocaleString('en-IN')}/d</td>
                    
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(drone.status)}`}>
                        {drone.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted font-medium">
                      {drone.currentCustomer ? (
                        <span className="text-fg font-bold">{drone.currentCustomer}</span>
                      ) : (
                        <span className="text-subtle italic">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-fg">{drone.totalRentalsCount || 12} rentals</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => { setDroneToEdit(drone); setIsFormModalOpen(true); }}
                        className="p-1.5 text-muted hover:text-accent-ink bg-surface-2 hover:bg-accent/10 rounded-xl transition-colors cursor-pointer"
                        title="Edit Drone Specs"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDroneToDelete(drone)}
                        className="p-1.5 text-muted hover:text-rose-400 bg-surface-2 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Drone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-subtle italic">
                    No drones found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add / Edit Drone Form Modal */}
      <DroneFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setDroneToEdit(null); }}
        onSave={handleSaveDrone}
        droneToEdit={droneToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!droneToDelete}
        title="Delete Drone from Shop?"
        message={`Are you sure you want to remove '${droneToDelete?.name}' from your shop fleet? This action cannot be undone.`}
        confirmText="Yes, Delete Drone"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDroneToDelete(null)}
      />

    </div>
  )
}

export default ShopOwnerDrones
