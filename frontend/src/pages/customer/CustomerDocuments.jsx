import React, { useState } from 'react'
import { FileText, ShieldCheck, Upload, Trash2, CheckCircle2, Clock, XCircle, Download, File, AlertCircle } from 'lucide-react'
import { customerDocuments } from '../../data/documents'

function CustomerDocuments() {
  const [docsList, setDocsList] = useState(customerDocuments)
  const [selectedFile, setSelectedFile] = useState(null)
  const [docCategory, setDocCategory] = useState('Identity Proof')
  const [notification, setNotification] = useState(null)

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25'
      default:
        return 'bg-surface-2 text-fg-muted border-line'
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSimulatedUpload = (e) => {
    e.preventDefault()
    if (!selectedFile) return

    const newDoc = {
      id: `doc-${Date.now()}`,
      type: docCategory,
      title: `${docCategory} Document`,
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: selectedFile.name.split('.').pop().toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      required: false,
      note: 'Under compliance verification review'
    }

    setDocsList([newDoc, ...docsList])
    setSelectedFile(null)
    setNotification('Document uploaded successfully for compliance review!')
    setTimeout(() => setNotification(null), 4000)
  }

  const handleAction = (actionName, doc) => {
    alert(`${actionName} action for document: ${doc.fileName}`)
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Document Management
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Upload and verify identification documents for commercial drone rental clearance.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* UPLOAD SIMULATION AREA */}
      <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-fg flex items-center gap-2">
            <Upload className="w-5 h-5 text-accent-ink" />
            <span>Upload New Verification Document</span>
          </h2>
          <p className="text-xs text-muted">
            Upload clear copies of Aadhaar, Passport, Utility Bill, or DGCA Drone License (PDF, JPG, PNG).
          </p>
        </div>

        <form onSubmit={handleSimulatedUpload} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider">
                Document Category
              </label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-2.5 px-3 text-xs font-semibold text-fg"
              >
                <option value="Identity Proof">Identity Proof (Aadhaar / Passport)</option>
                <option value="Address Proof">Address Proof (Utility Bill)</option>
                <option value="Drone Certification">Drone Certification (DGCA License)</option>
                <option value="Other Documents">Other Verification File</option>
              </select>
            </div>

            {/* File Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider">
                Select File (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="w-full bg-surface-2 border border-line focus:border-accent rounded-xl py-2 px-3 text-xs font-medium text-fg-muted cursor-pointer"
              />
            </div>

          </div>

          {selectedFile && (
            <div className="p-3 bg-accent/10 rounded-xl border border-accent/25 flex items-center justify-between text-xs text-accent-ink font-medium">
              <span>Selected: <strong className="text-fg">{selectedFile.name}</strong> ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-rose-400 font-bold hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!selectedFile}
              className={`inline-flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                selectedFile
                  ? 'bg-accent hover:bg-accent-hover text-white shadow-sm'
                  : 'bg-surface-3 text-subtle cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Submit Document</span>
            </button>
          </div>
        </form>
      </div>

      {/* VERIFIED DOCUMENTS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-fg">
          Your Document Clearance List
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docsList.map((doc) => (
            <div key={doc.id} className="bg-surface p-5 rounded-2xl border border-line shadow-2xs space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink bg-accent/10 px-2 py-0.5 rounded-md">
                    {doc.type}
                  </span>
                  <h3 className="font-bold text-fg text-sm">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-muted font-mono">
                    {doc.fileName} ({doc.fileSize})
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadgeStyle(doc.status)}`}>
                  {doc.status}
                </span>
              </div>

              <div className="text-[11px] text-muted flex items-center justify-between pt-2 border-t border-line">
                <span>Uploaded: {doc.uploadDate}</span>
                <span className="italic">{doc.note}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  onClick={() => handleAction('View', doc)}
                  className="flex-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={() => handleAction('Download', doc)}
                  className="flex-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  Download
                </button>
                <button
                  onClick={() => handleAction('Replace', doc)}
                  className="flex-1 bg-accent/10 hover:bg-accent/10 text-accent-ink font-bold py-2 rounded-xl text-center transition-colors cursor-pointer"
                >
                  Replace
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CustomerDocuments
