import React, { useState, useMemo } from 'react'
import { FileText, ShieldCheck, CheckCircle2, XCircle, Download, Eye, RefreshCw, Upload } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { initialOwnerDocuments } from '../../data/ownerData'

function ShopOwnerDocuments() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  const [shopDocs, setShopDocs] = useState(() =>
    initialOwnerDocuments.filter((d) => d.shopId === shopId)
  )

  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Customer verification documents list simulation
  const [customerDocs, setCustomerDocs] = useState([
    { id: 'cd-1', customerName: 'Rahul Sharma', docType: 'Aadhaar Photo ID', uploadDate: '2026-08-28', status: 'Verified', fileName: 'aadhaar_rahul.pdf' },
    { id: 'cd-2', customerName: 'Priya Patel', docType: 'Utility Address Proof', uploadDate: '2026-08-29', status: 'Verified', fileName: 'utility_priya.jpg' },
    { id: 'cd-3', customerName: 'Vikram Malhotra', docType: 'DGCA Pilot License (RPC)', uploadDate: '2026-08-30', status: 'Pending', fileName: 'dgca_license_vikram.pdf' }
  ])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      default: return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
  }

  const handleAction = (action, docName) => {
    showToast(`Executed '${action}' action for ${docName}`)
  }

  const handleVerifyCustomerDoc = (id, newStatus) => {
    setCustomerDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    )
    showToast(`Customer document status set to '${newStatus}'.`)
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Shop Operations & Clearance Documents
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Manage trade licenses, operating permits, and verify customer identification files.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: SHOP OPERATING PERMITS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-fg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent-ink" />
          <span>Shop Operating Permits & Certificates</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopDocs.map((doc) => (
            <div key={doc.id} className="bg-surface p-5 rounded-2xl border border-line shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink bg-accent/10 px-2 py-0.5 rounded-md">
                    {doc.type}
                  </span>
                  <h3 className="font-bold text-fg text-sm mt-1">{doc.title}</h3>
                  <div className="text-xs text-muted font-mono mt-0.5">{doc.fileName}</div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadgeStyle(doc.status)}`}>
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-line text-xs">
                <button
                  onClick={() => handleAction('View', doc.fileName)}
                  className="flex-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  View File
                </button>
                <button
                  onClick={() => handleAction('Download', doc.fileName)}
                  className="flex-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  Download
                </button>
                <button
                  onClick={() => handleAction('Replace', doc.fileName)}
                  className="flex-1 bg-accent/10 hover:bg-accent/10 text-accent-ink font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CUSTOMER RENTAL CLEARANCE DOCUMENTS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-fg flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-ink" />
          <span>Customer ID Verification Clearance</span>
        </h2>

        <div className="bg-surface rounded-2xl border border-line shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
                <tr>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Document Type</th>
                  <th className="py-4 px-4">File Name</th>
                  <th className="py-4 px-4">Uploaded Date</th>
                  <th className="py-4 px-4">Clearance Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium text-fg-muted">
                {customerDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-fg">{doc.customerName}</td>
                    <td className="py-3.5 px-4 font-semibold text-fg">{doc.docType}</td>
                    <td className="py-3.5 px-4 text-muted font-mono">{doc.fileName}</td>
                    <td className="py-3.5 px-4 text-muted">{doc.uploadDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {doc.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleVerifyCustomerDoc(doc.id, 'Verified')}
                            className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyCustomerDoc(doc.id, 'Rejected')}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAction('Download', doc.fileName)}
                          className="bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
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

    </div>
  )
}

export default ShopOwnerDocuments
