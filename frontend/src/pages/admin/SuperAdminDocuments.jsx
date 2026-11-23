import React, { useState } from 'react'
import { FileText, ShieldCheck, CheckCircle2, XCircle, Download } from 'lucide-react'

function SuperAdminDocuments() {
  const [activeTab, setActiveTab] = useState('Shop Documents') // Shop Documents, Customer Documents, Drone Documents
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const [documents, setDocuments] = useState([
    { id: 'doc-1', title: 'SkyRent Operating Clearance', type: 'Shop Documents', entity: 'SkyRent Bengaluru', file: 'skyrent_permit.pdf', date: '2026-08-10', status: 'Verified' },
    { id: 'doc-2', title: 'AeroTech Commercial Trade License', type: 'Shop Documents', entity: 'AeroTech Mumbai', file: 'aerotech_gst.pdf', date: '2026-08-15', status: 'Verified' },
    { id: 'doc-3', title: 'GeoSpatial Delhi Trade Permit', type: 'Shop Documents', entity: 'GeoSpatial Fleet Delhi', file: 'geodelhi_permit.pdf', date: '2026-08-20', status: 'Pending' },
    { id: 'doc-4', title: 'Aadhaar Card Photo Clearance', type: 'Customer Documents', entity: 'Rahul Sharma', file: 'rahul_aadhaar.pdf', date: '2026-08-28', status: 'Verified' },
    { id: 'doc-5', title: 'DGCA Remote Pilot License (RPC)', type: 'Customer Documents', entity: 'Vikram Malhotra', file: 'vikram_rpc.pdf', date: '2026-08-30', status: 'Pending' }
  ])

  const filteredDocs = documents.filter((d) => d.type === activeTab)

  const handleUpdateStatus = (id, newStatus) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    )
    showToast(`Document #${id} status changed to '${newStatus}'.`)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Platform Global Document Verification Desk
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Audit store trade permits, customer identification clearances, and drone insurance policies.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-bold">
        {['Shop Documents', 'Customer Documents', 'Drone Documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-surface text-muted hover:bg-surface-2 border border-line'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-4 px-4">Document Title</th>
                <th className="py-4 px-4">Associated Entity</th>
                <th className="py-4 px-4">File Name</th>
                <th className="py-4 px-4">Uploaded Date</th>
                <th className="py-4 px-4">Clearance Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-fg">{doc.title}</td>
                  <td className="py-3.5 px-4 font-bold text-accent-ink">{doc.entity}</td>
                  <td className="py-3.5 px-4 text-muted font-mono">{doc.file}</td>
                  <td className="py-3.5 px-4 text-muted">{doc.date}</td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    {doc.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'Verified')}
                          className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'Rejected')}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => alert(`Downloading file: ${doc.file}`)}
                        className="bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        Download
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

export default SuperAdminDocuments
