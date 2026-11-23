import React, { useState, useMemo } from 'react'
import { AlertCircle, Search, CheckCircle2, ShieldAlert, Eye } from 'lucide-react'
import ComplaintDetailsModal from '../../components/admin/ComplaintDetailsModal'
import { initialAdminComplaints } from '../../data/adminData'

function SuperAdminComplaints() {
  const [complaintsList, setComplaintsList] = useState(initialAdminComplaints)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedComplaintModal, setSelectedComplaintModal] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredComplaints = useMemo(() => {
    return complaintsList
      .filter((c) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.toLowerCase()
        return (
          c.id.toLowerCase().includes(query) ||
          c.customerName.toLowerCase().includes(query) ||
          c.shopName.toLowerCase().includes(query) ||
          c.subject.toLowerCase().includes(query)
        )
      })
      .filter((c) => {
        if (statusFilter === 'All') return true
        return c.status.toLowerCase() === statusFilter.toLowerCase()
      })
  }, [complaintsList, searchTerm, statusFilter])

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/25 font-semibold animate-pulse'
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/25 font-bold'
      case 'Medium': return 'bg-accent/10 text-accent-ink border-accent/25 font-semibold'
      default: return 'bg-surface-2 text-fg-muted border-line font-medium'
    }
  }

  const handleResolveComplaint = (id, note) => {
    setComplaintsList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c))
    )
    showToast(`Complaint #${id} marked as Resolved. Admin note saved.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Platform Customer Complaints Desk ({filteredComplaints.length})
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Resolve escalated dispute tickets, equipment issues, and deposit refund claims.
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
            placeholder="Search by Ticket ID, Customer, Shop, Subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-fg transition-all"
          />
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-2 border border-line focus:border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-semibold text-fg-muted cursor-pointer"
        >
          <option value="All">All Ticket Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* COMPLAINTS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Ticket ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Shop</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{c.id}</td>
                  <td className="py-3.5 px-4 font-bold text-fg">{c.customerName}</td>
                  <td className="py-3.5 px-4 font-bold text-accent-ink">{c.shopName}</td>
                  <td className="py-3.5 px-4 text-fg font-semibold">{c.subject}</td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${getPriorityStyle(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-fg">{c.status}</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedComplaintModal(c)}
                      className="inline-flex items-center gap-1 bg-surface-2 hover:bg-emerald-500/10 text-fg-muted hover:text-emerald-400 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Modal */}
      {selectedComplaintModal && (
        <ComplaintDetailsModal
          complaint={selectedComplaintModal}
          onClose={() => setSelectedComplaintModal(null)}
          onResolveComplaint={handleResolveComplaint}
        />
      )}

    </div>
  )
}

export default SuperAdminComplaints
