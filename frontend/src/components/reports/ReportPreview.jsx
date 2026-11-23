import React from 'react'
import { Printer, Download, X, Navigation, Building2, CheckCircle2, ShieldCheck, FileText } from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { printReport } from '../../utils/printReport'
import ReportTable from './ReportTable'
import ReportSummary from './ReportSummary'

/**
 * ReportPreview Component
 * Displays printable document modal preview of generated analytics reports.
 */
function ReportPreview({
  isOpen,
  onClose,
  reportTitle = "DroneHub Executive Analytics Report",
  dateRange = "This Month",
  generatedDate = new Date().toLocaleDateString(),
  summaryCards = [],
  tableHeaders = [],
  tableRows = []
}) {
  if (!isOpen) return null

  const handleDownloadCSV = () => {
    exportToCSV(tableRows, `${reportTitle.toLowerCase().replace(/\s+/g, '-')}.csv`)
  }

  const handlePrint = () => {
    printReport(reportTitle)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-4xl w-full p-6 sm:p-8 border border-line shadow-lg space-y-6 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-subtle hover:text-fg-muted rounded-xl hover:bg-surface-2 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header Bar (Hidden during printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line print:hidden">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-ink bg-accent/10 px-3 py-1 rounded-full border border-accent/25">
            <FileText className="w-3.5 h-3.5" />
            Document Preview Mode
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-surface-3 text-fg text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-muted" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="space-y-6">
          
          {/* BRAND HEADER */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-semibold shadow-md">
                <Navigation className="w-6 h-6 transform rotate-45" />
              </div>
              <div>
                <span className="text-2xl font-semibold tracking-tight text-fg">
                  DRONE<span className="text-accent-ink">HUB</span>
                </span>
                <p className="text-[10px] text-subtle font-bold uppercase tracking-wide">
                  Analytics & Reports Module
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-fg">{generatedDate}</div>
              <div className="text-subtle font-medium">Date Range: <strong className="text-fg-muted">{dateRange}</strong></div>
            </div>
          </div>

          {/* REPORT METADATA TITLE */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-fg">{reportTitle}</h2>
            <p className="text-xs text-muted">
              Verified platform analytics report compiled for multi-tenant monitoring.
            </p>
          </div>

          {/* SUMMARY METRICS GRID */}
          {summaryCards && summaryCards.length > 0 && (
            <ReportSummary cards={summaryCards} />
          )}

          {/* MAIN DATA TABLE */}
          <ReportTable headers={tableHeaders} rows={tableRows} />

          {/* DOCUMENT FOOTER */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between text-[11px] text-subtle font-mono gap-2">
            <div>DroneHub Analytics & Reports Module • System Verified</div>
            <div>Confidential & Proprietary Document</div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ReportPreview
