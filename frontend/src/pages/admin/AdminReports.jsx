import React, { useState } from 'react'
import { FileText, Download, Building2, Calendar, ShieldCheck, Sparkles, Printer, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ReportCard from '../../components/reports/ReportCard'
import ReportPreview from '../../components/reports/ReportPreview'
import ReportGeneratorModal from '../../components/reports/ReportGeneratorModal'
import { exportToCSV } from '../../utils/exportCsv'

function AdminReports() {
  const { currentUser } = useAuth()
  const [selectedReport, setSelectedReport] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  // Super Admin Executive Reports Catalog
  const adminReports = [
    {
      id: "rep-admin-revenue",
      title: "Platform Revenue & Billing Report",
      description: "Complete 12-month nationwide billing audit, gross store revenues, platform commission share, and tax breakdown.",
      type: "Financial Audit",
      date: "Updated Today",
      headers: ["Month", "Total Bookings", "Gross Platform Billing", "Shop Payouts", "Platform Fee (10%)", "GST Tax (18%)"],
      rows: [
        { "Month": "December 2026", "Total Bookings": 115, "Gross Platform Billing": "₹4,50,000", "Shop Payouts": "₹4,05,000", "Platform Fee (10%)": "₹45,000", "GST Tax (18%)": "₹81,000" },
        { "Month": "November 2026", "Total Bookings": 102, "Gross Platform Billing": "₹4,12,000", "Shop Payouts": "₹3,70,800", "Platform Fee (10%)": "₹41,200", "GST Tax (18%)": "₹74,160" },
        { "Month": "October 2026", "Total Bookings": 94, "Gross Platform Billing": "₹3,85,000", "Shop Payouts": "₹3,46,500", "Platform Fee (10%)": "₹38,500", "GST Tax (18%)": "₹69,300" },
        { "Month": "September 2026", "Total Bookings": 86, "Gross Platform Billing": "₹3,50,000", "Shop Payouts": "₹3,15,000", "Platform Fee (10%)": "₹35,000", "GST Tax (18%)": "₹63,000" }
      ],
      summaryCards: [
        { label: "Gross Platform Billing", value: "₹24,85,000", sub: "12-Month Total" },
        { label: "Platform Commission", value: "₹2,48,500", sub: "Net Revenue" },
        { label: "Storefront Payouts", value: "₹22,36,500", sub: "Disbursed" },
        { label: "Tax Auditor", value: "100% Compliant", sub: "Verified" }
      ]
    },
    {
      id: "rep-admin-shops",
      title: "Partner Storefront Performance Report",
      description: "Ranked evaluation of all partner shops, fleet sizes, registered customers, total bookings, and billing volume.",
      type: "Store Audit",
      date: "Updated Today",
      headers: ["Rank", "Shop Name", "City", "Fleet Drones", "Registered Customers", "Total Bookings", "Gross Revenue", "Rating"],
      rows: [
        { "Rank": "#1", "Shop Name": "SkyRent Bengaluru", "City": "Bengaluru, KA", "Fleet Drones": 24, "Registered Customers": 142, "Total Bookings": 184, "Gross Revenue": "₹18,45,000", "Rating": "4.9 " },
        { "Rank": "#2", "Shop Name": "AeroTech Mumbai", "City": "Mumbai, MH", "Fleet Drones": 18, "Registered Customers": 118, "Total Bookings": 142, "Gross Revenue": "₹14,20,000", "Rating": "4.8 " },
        { "Rank": "#3", "Shop Name": "GeoSpatial Fleet Delhi", "City": "New Delhi, DL", "Fleet Drones": 15, "Registered Customers": 94, "Total Bookings": 98, "Gross Revenue": "₹9,80,000", "Rating": "4.6 " },
        { "Rank": "#4", "Shop Name": "SkyFleet Hyderabad", "City": "Hyderabad, TS", "Fleet Drones": 12, "Registered Customers": 76, "Total Bookings": 82, "Gross Revenue": "₹7,80,000", "Rating": "4.5 " }
      ],
      summaryCards: [
        { label: "Active Partner Shops", value: "24 Stores", sub: "Nationwide" },
        { label: "Top Shop Revenue", value: "₹18,45,000", sub: "SkyRent Bengaluru" },
        { label: "Avg Fleet / Shop", value: "16 Drones", sub: "Inventory size" },
        { label: "Platform Rating", value: "4.8 / 5", sub: "Avg store rating" }
      ]
    },
    {
      id: "rep-admin-users",
      title: "Customer Acquisition & Growth Report",
      description: "Monthly customer registration trajectories, active renter ratios, geographical distribution, and user retention rates.",
      type: "Growth Audit",
      date: "Updated Today",
      headers: ["Month", "New Registrations", "Active Renters", "Repeat Renters", "Total Base", "Growth Rate"],
      rows: [
        { "Month": "December 2026", "New Registrations": 270, "Active Renters": 1050, "Repeat Renters": 420, "Total Base": "1,620", "Growth Rate": "+20.0%" },
        { "Month": "November 2026", "New Registrations": 250, "Active Renters": 880, "Repeat Renters": 350, "Total Base": "1,350", "Growth Rate": "+22.7%" },
        { "Month": "October 2026", "New Registrations": 210, "Active Renters": 720, "Repeat Renters": 290, "Total Base": "1,100", "Growth Rate": "+23.6%" },
        { "Month": "September 2026", "New Registrations": 170, "Active Renters": 590, "Repeat Renters": 230, "Total Base": "890", "Growth Rate": "+23.6%" }
      ],
      summaryCards: [
        { label: "Total Customer Base", value: "2,840 Users", sub: "Registered accounts" },
        { label: "Monthly Growth", value: "+20.0%", sub: "Acquisition speed" },
        { label: "Repeat Renter Ratio", value: "42%", sub: "High retention" },
        { label: "Verified Accounts", value: "99.4%", sub: "KYC passed" }
      ]
    },
    {
      id: "rep-admin-drones",
      title: "Nationwide Drone Utilization Report",
      description: "Flight hours logging across camera, survey, agricultural, and FPV drones with utilization % and maintenance audits.",
      type: "Fleet Utilization",
      date: "Updated Today",
      headers: ["Drone Model", "Fulfilling Shop", "Category", "Total Rentals", "Flight Hours", "Gross Revenue", "Utilization %"],
      rows: [
        { "Drone Model": "DJI Mavic 3 Pro", "Fulfilling Shop": "SkyRent Bengaluru", "Category": "Camera Drone", "Total Rentals": 68, "Flight Hours": "410 hrs", "Gross Revenue": "₹6,80,000", "Utilization %": "94%" },
        { "Drone Model": "DJI Inspire 3 8K", "Fulfilling Shop": "AeroTech Mumbai", "Category": "FPV & Cinematic", "Total Rentals": 42, "Flight Hours": "320 hrs", "Gross Revenue": "₹10,50,000", "Utilization %": "89%" },
        { "Drone Model": "DJI Mini 4 Pro", "Fulfilling Shop": "SkyRent Bengaluru", "Category": "Camera Drone", "Total Rentals": 54, "Flight Hours": "290 hrs", "Gross Revenue": "₹5,40,000", "Utilization %": "91%" },
        { "Drone Model": "DJI Phantom 4 RTK", "Fulfilling Shop": "GeoSpatial Fleet Delhi", "Category": "Survey Drone", "Total Rentals": 32, "Flight Hours": "240 hrs", "Gross Revenue": "₹4,80,000", "Utilization %": "82%" }
      ],
      summaryCards: [
        { label: "Total Drone Inventory", value: "580 Drones", sub: "Platform catalog" },
        { label: "Avg Utilization", value: "88%", sub: "Optimal usage" },
        { label: "Total Airtime", value: "14,250 Hrs", sub: "Logged airtime" },
        { label: "Most Popular", value: "DJI Mavic 3 Pro", sub: "68 Rentals" }
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
              Platform Executive Reports
            </h1>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 uppercase">
              System Wide Audits
            </span>
          </div>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Generate, preview, and download nationwide revenue statements, store rankings, customer acquisition logs, and drone fleet audits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGeneratorOpen(true)}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* REPORT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminReports.map((report) => (
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
        defaultRole="admin"
      />

    </div>
  )
}

export default AdminReports
