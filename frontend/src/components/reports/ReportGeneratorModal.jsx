import React, { useState } from 'react'
import { FileText, Download, Printer, X, CheckCircle2, RefreshCw, Calendar, Layers } from 'lucide-react'
import { exportToCSV } from '../../utils/exportCsv'
import { printReport } from '../../utils/printReport'

/**
 * ReportGeneratorModal Component
 * Interactive modal wizard for generating customized analytics reports.
 */
function ReportGeneratorModal({ isOpen, onClose, defaultRole = 'admin', onReportGenerated }) {
  const [step, setStep] = useState(1)
  const [reportType, setReportType] = useState('Revenue')
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [format, setFormat] = useState('CSV')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleGenerate = () => {
    setIsGenerating(true)
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setIsSuccess(true)

      // Execute format action
      if (format === 'CSV') {
        const dummyData = [
          { Report: `${reportType} Summary`, DateRange: dateRange, Generated: new Date().toLocaleDateString(), TotalRecords: 48, Status: "Verified" }
        ]
        exportToCSV(dummyData, `DroneHub-${reportType.toLowerCase()}-report.csv`)
      } else if (format === 'Print') {
        printReport(`${reportType} Executive Report`)
      }

      if (onReportGenerated) {
        onReportGenerated({ reportType, dateRange, format })
      }

      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1800)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface rounded-2xl max-w-lg w-full p-6 border border-line shadow-lg space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-subtle hover:text-fg-muted rounded-xl hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 text-accent-ink rounded-2xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-fg">Custom Report Generator</h3>
            <p className="text-xs text-muted">Configure parameters to compile executive analytics data</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-semibold text-fg">Report Generated Successfully</h4>
            <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/25">
              {reportType} Report ({dateRange}) formatted as {format}
            </p>
          </div>
        ) : isGenerating ? (
          <div className="text-center py-10 space-y-4">
            <RefreshCw className="w-10 h-10 text-accent-ink animate-spin mx-auto" />
            <h4 className="text-base font-semibold text-fg">Compiling Report Dataset...</h4>
            <p className="text-xs text-muted">Aggregating telemetry logs, bookings, and financial metrics.</p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Step 1 — Select Report Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fg-muted uppercase tracking-wider block">
                Step 1 — Select Report Module
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-3 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-bold text-fg cursor-pointer"
              >
                <option value="Revenue">Revenue & Gross Billing Report</option>
                <option value="Bookings">Booking & Rental History Report</option>
                <option value="Rentals">Drone Fleet Utilization Report</option>
                <option value="Customers">Customer Activity & Growth Report</option>
                <option value="Drones">Drone Catalog Performance Report</option>
                <option value="Payments">Payment Gateway Audit Report</option>
                {defaultRole === 'admin' && <option value="Shops">Partner Shops Performance Report</option>}
              </select>
            </div>

            {/* Step 2 — Select Date Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fg-muted uppercase tracking-wider block">
                Step 2 — Select Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-3 bg-surface-2 border border-line focus:border-accent rounded-xl text-xs font-bold text-fg cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="This Year">This Year</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>

            {/* Step 3 — Select Output Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fg-muted uppercase tracking-wider block">
                Step 3 — Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('CSV')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    format === 'CSV'
                      ? 'bg-accent/10 border-accent text-accent-ink shadow-2xs ring-2 ring-accent/40'
                      : 'bg-surface border-line text-muted hover:border-line'
                  }`}
                >
                  <Download className="w-4 h-4 text-accent-ink" />
                  <span>CSV Spreadsheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('Print')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    format === 'Print'
                      ? 'bg-accent/10 border-accent text-accent-ink shadow-2xs ring-2 ring-accent/40'
                      : 'bg-surface border-line text-muted hover:border-line'
                  }`}
                >
                  <Printer className="w-4 h-4 text-accent-ink" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default ReportGeneratorModal
