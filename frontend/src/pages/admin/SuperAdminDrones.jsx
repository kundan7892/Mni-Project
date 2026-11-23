import React, { useState, useMemo, useEffect } from 'react'
import { Navigation, Search, Filter, CheckCircle2, AlertTriangle, Eye, ShieldCheck } from 'lucide-react'
import { initialOwnerDrones } from '../../data/ownerData'
import droneService from '../../services/droneService'

function SuperAdminDrones() {
  const [dronesList, setDronesList] = useState(initialOwnerDrones)
  const [searchTerm, setSearchTerm] = useState('')
  const [shopFilter, setShopFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [toastMessage, setToastMessage] = useState(null)

  // Fetch all drones platform-wide from backend API
  useEffect(() => {
    let isMounted = true
    droneService
      .getDrones({ limit: 100 })
      .then((data) => {
        if (isMounted && data?.drones && data.drones.length > 0) {
          const formatted = data.drones.map((d) => ({
            ...d,
            id: d._id || d.id,
            pricePerDay: d.pricePerDay || (d.pricePerHour ? d.pricePerHour * 8 : 2500),
            status:
              d.availability ||
              (d.status
                ? d.status.charAt(0).toUpperCase() + d.status.slice(1)
                : 'Available')
          }))
          setDronesList(formatted)
        }
      })
      .catch((err) => {
        console.warn('Live API fetch unavailable for admin drones:', err.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredDrones = useMemo(() => {
    return dronesList
      .filter((d) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          d.name.toLowerCase().includes(query) ||
          d.model?.toLowerCase().includes(query) ||
          d.shopName?.toLowerCase().includes(query)
        )
      })
      .filter((d) => {
        if (shopFilter === 'All') return true
        return d.shopName === shopFilter
      })
      .filter((d) => {
        if (statusFilter === 'All') return true
        return d.status.toLowerCase() === statusFilter.toLowerCase()
      })
  }, [dronesList, searchTerm, shopFilter, statusFilter])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Rented': case 'Currently Rented': return 'bg-accent/10 text-accent-ink border-accent/25'
      case 'Maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available'
    setDronesList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    )

    try {
      await droneService.updateDrone(id, {
        status: nextStatus === 'Available' ? 'available' : 'maintenance',
        availability: nextStatus
      })
    } catch {
      // Keep local state update
    }

    showToast(`Drone status toggled to '${nextStatus}'.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Global Drone Fleet Audit ({filteredDrones.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Platform-wide inventory inspection across all registered partner storefronts.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by Drone Name, Model, Shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer max-w-[160px] truncate"
          >
            <option value="All">All Shops</option>
            <option value="SkyRent Bengaluru">SkyRent Bengaluru</option>
            <option value="AeroTech Mumbai">AeroTech Mumbai</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
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
                <th className="py-4 px-4">Assigned Shop</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price / Day</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Total Rentals</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredDrones.map((drone) => (
                <tr key={drone.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-fg flex items-center gap-3">
                    <img
                      src={drone.image}
                      alt={drone.name}
                      className="w-10 h-10 rounded-xl object-cover border border-line shrink-0"
                    />
                    <div>
                      <div className="font-bold text-fg text-sm">{drone.name}</div>
                      <div className="text-[10px] text-subtle font-normal">{drone.brand}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-accent-ink">{drone.shopName}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">{drone.category}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">₹{(drone.pricePerDay || drone.dailyRate)?.toLocaleString('en-IN')}/d</td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(drone.status)}`}>
                      {drone.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-fg">{drone.totalRentalsCount || 14} rentals</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleAvailability(drone.id, drone.status)}
                      className="bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {drone.status === 'Available' ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
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

export default SuperAdminDrones
