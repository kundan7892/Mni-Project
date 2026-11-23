import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

function ConfirmationModal({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-surface rounded-2xl p-6 sm:p-8 text-center space-y-5 border border-line shadow-lg animate-in zoom-in-95 duration-200">
        
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-fg">{title}</h3>
          <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-600 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConfirmationModal
