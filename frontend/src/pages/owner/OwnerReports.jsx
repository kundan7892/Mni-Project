import React, { useState } from 'react'
import { FileText, Download, Building2, Calendar, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ReportCard from '../../components/reports/ReportCard'
import ReportPreview from '../../components/reports/ReportPreview'
import ReportGeneratorModal from '../../components/reports/ReportGeneratorModal'
import { exportToCSV } from '../../utils/exportCsv'

function OwnerReports() {
  const { currentUser } = useAuth()
  const shopId = currentUser?.shopId || 101

  const [selectedReport, setSelectedReport] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  // Shop Owner Reports Template Catalog
  const ownerReports = [
    {
      id: "rep-owner-revenue",
      title: "Revenue & Financial Audit Report",
      description: "Monthly gross billing, category breakdown, tax estimates, and fulfilling storefront earnings.",
      type: "Financial Audit",
      date: "Updated Today",
      headers: ["Month", "Bookings", "Gross Revenue", "Tax Deductions", "Net Earnings", "Growth"],
      rows: [
        { "Month": "October 2026", "Bookings": 25, "Gross Revenue": "₹54,000", "Tax Deductions": "₹9,720", "Net Earnings": "₹44,280", "Growth": "+12.5%" },
        { "Month": "September 2026", "Bookings": 22, "Gross Revenue": "₹48,000", "Tax Deductions": "₹8,640", "Net Earnings": "₹39,360", "Growth": "+14.2%" },
        { "Month": "August 2026", "Bookings": 19, "Gross Revenue": "₹42,000", "Tax Deductions": "₹7,560", "Net Earnings": "₹34,440", "Growth": "+16.6%" },
        { "Month": "July 2026", "Bookings": 16, "Gross Revenue": "₹36,000", "Tax Deductions": "₹6,480", "Net Earnings": "₹29,520", "Growth": "+12.5%" }
      ],
      summaryCards: [
        { label: "Total Gross Revenue", value: "₹3,85,000", sub: "YTD Storefront" },
        { label: "Net Earnings", value: "₹3,15,700", sub: "After platform fee" },
        { label: "Avg Ticket Size", value: "₹4,250", sub: "Per rental" },
        { label: "Tax Collected", value: "₹69,300", sub: "GST 18%" }
      ]
    },
    {
      id: "rep-owner-bookings",
      title: "Booking & Mission Log Report",
      description: "Detailed register of all customer reservations, mission status, start/end dates, and fulfilling drones.",
      type: "Operations Log",
      date: "Updated Today",
      headers: ["Booking ID", "Customer Name", "Drone Model", "Start Date", "End Date", "Billing Amount", "Status"],
      rows: [
        { "Booking ID": "DRN-10452", "Customer Name": "Rahul Sharma", "Drone Model": "DJI Mavic 3 Pro", "Start Date": "15 Oct 2026", "End Date": "18 Oct 2026", "Billing Amount": "₹7,500", "Status": "Active" },
        { "Booking ID": "DRN-10454", "Customer Name": "Vikram Malhotra", "Drone Model": "DJI Mavic 3 Multispectral", "Start Date": "14 Oct 2026", "End Date": "17 Oct 2026", "Billing Amount": "₹12,800", "Status": "Active" },
        { "Booking ID": "DRN-10499", "Customer Name": "Ananya Deshmukh", "Drone Model": "DJI Inspire 3 Cinema", "Start Date": "10 Oct 2026", "End Date": "12 Oct 2026", "Billing Amount": "₹18,500", "Status": "Completed" },
        { "Booking ID": "DRN-10320", "Customer Name": "Priya Patel", "Drone Model": "DJI Mini 4 Pro", "Start Date": "02 Oct 2026", "End Date": "04 Oct 2026", "Billing Amount": "₹3,600", "Status": "Completed" }
      ],
      summaryCards: [
        { label: "Total Missions", value: "186 Bookings", sub: "All time" },
        { label: "Completed", value: "168 Missions", sub: "Successfully returned" },
        { label: "Active", value: "14 Missions", sub: "In flight" },
        { label: "Cancel Rate", value: "1.2%", sub: "Industry low" }
      ]
    },
    {
      id: "rep-owner-drones",
      title: "Drone Fleet Utilization Report",
      description: "Flight hours audit, maintenance intervals, battery cycle wear, and utilization percentage per drone model.",
      type: "Fleet Performance",
      date: "Updated Today",
      headers: ["Drone ID", "Model Name", "Category", "Flight Hours", "Rentals Count", "Utilization %", "Maintenance Status"],
      rows: [
        { "Drone ID": "DRN-101", "Model Name": "DJI Mavic 3 Pro", "Category": "Camera Drone", "Flight Hours": "410 hrs", "Rentals Count": 68, "Utilization %": "94%", "Maintenance Status": "Passed" },
        { "Drone ID": "DRN-102", "Model Name": "DJI Inspire 3 Cinema 8K", "Category": "FPV & Cinematic", "Flight Hours": "320 hrs", "Rentals Count": 42, "Utilization %": "89%", "Maintenance Status": "Passed" },
        { "Drone ID": "DRN-103", "Model Name": "DJI Mini 4 Pro", "Category": "Camera Drone", "Flight Hours": "290 hrs", "Rentals Count": 54, "Utilization %": "91%", "Maintenance Status": "Passed" },
        { "Drone ID": "DRN-105", "Model Name": "DJI Matrice 300 RTK", "Category": "Survey & Mapping", "Flight Hours": "180 hrs", "Rentals Count": 22, "Utilization %": "72%", "Maintenance Status": "Scheduled" }
      ],
      summaryCards: [
        { label: "Total Fleet Drones", value: "24 Drones", sub: "In inventory" },
        { label: "Avg Utilization", value: "87%", sub: "High demand" },
        { label: "Total Flight Hours", value: "1,410 Hrs", sub: "Logged airtime" },
        { label: "Fleet Health", value: "98% Optimal", sub: "Passed checks" }
      ]
    },
    {
      id: "rep-owner-customers",
      title: "Customer Directory & Activity Report",
      description: "Registered renters directory, repeat customer frequency, average spend per customer, and rating scores.",
      type: "Customer Insights",
      date: "Updated Today",
      headers: ["Customer Name", "Total Bookings", "Total Spent", "Last Active", "User Rating", "Customer Status"],
      rows: [
        { "Customer Name": "Rahul Sharma", "Total Bookings": 12, "Total Spent": "₹48,500", "Last Active": "Today", "User Rating": "5.0 ", "Customer Status": "VIP Renter" },
        { "Customer Name": "Vikram Malhotra", "Total Bookings": 8, "Total Spent": "₹38,200", "Last Active": "Yesterday", "User Rating": "4.9 ", "Customer Status": "Repeat Renter" },
        { "Customer Name": "Ananya Deshmukh", "Total Bookings": 5, "Total Spent": "₹28,600", "Last Active": "3 Days ago", "User Rating": "4.8 ", "Customer Status": "Active" },
        { "Customer Name": "Siddharth Mehta", "Total Bookings": 6, "Total Spent": "₹31,400", "Last Active": "1 Week ago", "User Rating": "4.7 ", "Customer Status": "Active" }
      ],
      summaryCards: [
        { label: "Total Customers", value: "92 Renters", sub: "Storefront users" },
        { label: "Repeat Rate", value: "48%", sub: "High loyalty" },
        { label: "Customer Rating", value: "4.9 / 5", sub: "Storefront avg" },
        { label: "New Customers", value: "+12 this month", sub: "Growth" }
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
              Shop Reports
            </h1>
            <span className="text-[10px] font-semibold text-accent-ink bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/25 uppercase">
              Storefront Audit
            </span>
          </div>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Generate and export store financial audits, booking logs, customer directories, and drone utilization reports.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ownerReports.map((report) => (
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
        defaultRole="owner"
      />

    </div>
  )
}

export default OwnerReports
