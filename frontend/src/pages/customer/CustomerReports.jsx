import React, { useState } from 'react'
import { FileText, Download, Calendar, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ReportCard from '../../components/reports/ReportCard'
import ReportPreview from '../../components/reports/ReportPreview'
import ReportGeneratorModal from '../../components/reports/ReportGeneratorModal'
import { exportToCSV } from '../../utils/exportCsv'

function CustomerReports() {
  const { currentUser } = useAuth()
  const [selectedReport, setSelectedReport] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  // Report Cards list for Customer
  const customerReports = [
    {
      id: "rep-booking-history",
      title: "Booking History Report",
      description: "Complete chronological log of all your drone bookings, reservations, amounts, and fulfilling shop hubs.",
      type: "Booking Log",
      date: "Updated Today",
      headers: ["Booking ID", "Drone Model", "Shop Hub", "Booking Date", "Rental Period", "Amount", "Status"],
      rows: [
        { "Booking ID": "DRN-10452", "Drone Model": "DJI Mavic 3 Pro", "Shop Hub": "SkyRent Bengaluru", "Booking Date": "12 Oct 2026", "Rental Period": "15 Oct - 18 Oct", "Amount": "₹7,500", "Status": "Active" },
        { "Booking ID": "DRN-10398", "Drone Model": "DJI Avata 2 FPV", "Shop Hub": "AeroTech Mumbai", "Booking Date": "25 Sep 2026", "Rental Period": "28 Sep - 30 Sep", "Amount": "₹4,800", "Status": "Completed" },
        { "Booking ID": "DRN-10214", "Drone Model": "DJI Phantom 4 RTK", "Shop Hub": "SkyRent Bengaluru", "Booking Date": "08 Aug 2026", "Rental Period": "12 Aug - 17 Aug", "Amount": "₹12,500", "Status": "Completed" },
        { "Booking ID": "DRN-10188", "Drone Model": "DJI Mini 4 Pro", "Shop Hub": "GeoSpatial Fleet Delhi", "Booking Date": "02 Aug 2026", "Rental Period": "04 Aug - 05 Aug", "Amount": "₹1,800", "Status": "Completed" }
      ],
      summaryCards: [
        { label: "Total Bookings", value: "12 Missions", sub: "All time" },
        { label: "Total Spent", value: "₹48,500", sub: "Verified payments" },
        { label: "Active Rental", value: "1 Mission", sub: "In flight" },
        { label: "Completed", value: "8 Missions", sub: "Returned safe" }
      ]
    },
    {
      id: "rep-rental-summary",
      title: "Rental Summary Report",
      description: "Aggregated flight hours, rental durations, drone model specifications, and usage breakdown.",
      type: "Usage Audit",
      date: "Updated Today",
      headers: ["Drone Model", "Category", "Rental Duration", "Start Date", "End Date", "Total Amount", "Status"],
      rows: [
        { "Drone Model": "DJI Mavic 3 Pro", "Category": "Camera Drone", "Rental Duration": "3 Days", "Start Date": "15 Oct 2026", "End Date": "18 Oct 2026", "Total Amount": "₹7,500", "Status": "Active" },
        { "Drone Model": "DJI Avata 2 FPV", "Category": "FPV & Cinematic", "Rental Duration": "2 Days", "Start Date": "28 Sep 2026", "End Date": "30 Sep 2026", "Total Amount": "₹4,800", "Status": "Completed" },
        { "Drone Model": "DJI Phantom 4 RTK", "Category": "Survey Drone", "Rental Duration": "5 Days", "Start Date": "12 Aug 2026", "End Date": "17 Aug 2026", "Total Amount": "₹12,500", "Status": "Completed" },
        { "Drone Model": "Autel EVO II Dual", "Category": "Survey Drone", "Rental Duration": "2 Days", "Start Date": "18 Jun 2026", "End Date": "20 Jun 2026", "Total Amount": "₹5,200", "Status": "Completed" }
      ],
      summaryCards: [
        { label: "Total Rental Days", value: "24 Days", sub: "Flight duration" },
        { label: "Avg Rental Duration", value: "3 Days", sub: "Per mission" },
        { label: "Top Category", value: "Camera Drone", sub: "50% usage" },
        { label: "Satisfaction", value: "5.0 / 5", sub: "User rating" }
      ]
    },
    {
      id: "rep-payment-statement",
      title: "Payment Statement Report",
      description: "Itemized billing statement of all payment transactions, transaction IDs, payment methods, and invoices.",
      type: "Billing Statement",
      date: "Updated Today",
      headers: ["Payment ID", "Booking ID", "Amount", "Payment Method", "Transaction Date", "Invoice Status"],
      rows: [
        { "Payment ID": "PAY-90412", "Booking ID": "DRN-10452", "Amount": "₹7,500", "Payment Method": "UPI / QR", "Transaction Date": "12 Oct 2026", "Invoice Status": "Paid" },
        { "Payment ID": "PAY-88219", "Booking ID": "DRN-10398", "Amount": "₹4,800", "Payment Method": "Credit Card", "Transaction Date": "25 Sep 2026", "Invoice Status": "Paid" },
        { "Payment ID": "PAY-76104", "Booking ID": "DRN-10214", "Amount": "₹12,500", "Payment Method": "Net Banking", "Transaction Date": "08 Aug 2026", "Invoice Status": "Paid" },
        { "Payment ID": "PAY-74911", "Booking ID": "DRN-10188", "Amount": "₹1,800", "Payment Method": "UPI / QR", "Transaction Date": "02 Aug 2026", "Invoice Status": "Paid" }
      ],
      summaryCards: [
        { label: "Total Billing", value: "₹48,500", sub: "Gross payments" },
        { label: "Payment Gateway", value: "100% Verified", sub: "PCI-DSS Compliant" },
        { label: "Primary Method", value: "UPI / QR", sub: "60% transactions" },
        { label: "Refunds", value: "₹0.00", sub: "Zero disputes" }
      ]
    }
  ]

  const handleOpenPreview = (report) => {
    setSelectedReport(report)
    setIsPreviewOpen(true)
  }

  const handleDownloadCSV = (report) => {
    exportToCSV(report.rows, `${report.id}.csv`)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              My Reports
            </h1>
            <span className="text-[10px] font-semibold text-accent-ink bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/25 uppercase">
              Official Statements
            </span>
          </div>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Download or view verified booking receipts, rental usage summaries, and billing statements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGeneratorOpen(true)}
          className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Custom Report Generator</span>
        </button>
      </div>

      {/* REPORT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerReports.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            description={report.description}
            type={report.type}
            date={report.date}
            onView={() => handleOpenPreview(report)}
            onDownload={() => handleDownloadCSV(report)}
          />
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedReport && (
        <ReportPreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          reportTitle={selectedReport.title}
          dateRange="All Time"
          summaryCards={selectedReport.summaryCards}
          tableHeaders={selectedReport.headers}
          tableRows={selectedReport.rows}
        />
      )}

      {/* REPORT GENERATOR MODAL */}
      <ReportGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        defaultRole="customer"
      />

    </div>
  )
}

export default CustomerReports
