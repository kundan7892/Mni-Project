import React from 'react'
import { CreditCard, DollarSign, RefreshCw, ShieldCheck, Download, Sparkles } from 'lucide-react'
import AdminStatCard from '../../components/admin/AdminStatCard'

function SuperAdminPayments() {
  const platformPayments = [
    { txnId: "TXN-ADM-901", bookingId: "DRN-10452", customerName: "Rahul Sharma", shopName: "SkyRent Bengaluru", droneName: "Mavic 3 Pro", amount: 10000, commission: 1000, shopAmount: 9000, date: "2026-08-28", method: "UPI (Google Pay)", status: "Paid" },
    { txnId: "TXN-ADM-902", bookingId: "DRN-10453", customerName: "Priya Patel", shopName: "SkyRent Bengaluru", droneName: "Avata 2 FPV Kit", amount: 11200, commission: 1120, shopAmount: 10080, date: "2026-08-29", method: "Credit Card", status: "Paid" },
    { txnId: "TXN-ADM-903", bookingId: "DRN-20101", customerName: "Karan Verma", shopName: "AeroTech Mumbai", droneName: "Inspire 3 Cinema 8K", amount: 42500, commission: 4250, shopAmount: 38250, date: "2026-08-29", method: "UPI (PhonePe)", status: "Paid" },
    { txnId: "TXN-ADM-904", bookingId: "DRN-10454", customerName: "Vikram Malhotra", shopName: "SkyRent Bengaluru", droneName: "Mavic 3 Enterprise", amount: 11400, commission: 1140, shopAmount: 10260, date: "2026-08-30", method: "Net Banking", status: "Pending" }
  ]

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Platform Global Financial Ledger
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Platform-wide transaction processing, commission split audit, and shop payouts.
        </p>
      </div>

      {/* FINANCE CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <AdminStatCard
          title="Total Revenue"
          value="₹28.45L"
          label="Gross billing"
          icon={CreditCard}
          color="emerald"
        />
        <AdminStatCard
          title="Today's Revenue"
          value="₹1.26L"
          label="Daily settlements"
          icon={DollarSign}
          color="blue"
        />
        <AdminStatCard
          title="Pending Payments"
          value="₹11.4k"
          label="In escrow clearing"
          icon={RefreshCw}
          color="amber"
        />
        <AdminStatCard
          title="Refunds"
          value="₹15.0k"
          label="Returned deposits"
          icon={RefreshCw}
          color="rose"
        />
        <AdminStatCard
          title="Platform Commission"
          value="₹2.84L"
          label="10% Admin Fee"
          icon={Sparkles}
          color="emerald"
        />
        <AdminStatCard
          title="Security Deposits"
          value="₹45.0k"
          label="Escrow hold"
          icon={ShieldCheck}
          color="indigo"
        />
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">
            Platform Transactions Audit Log
          </h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
            10% Platform Commission Split Applied
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Fulfilling Shop</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Admin Fee (10%)</th>
                <th className="py-3.5 px-4">Shop Payout (90%)</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {platformPayments.map((p) => (
                <tr key={p.txnId} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-fg">{p.txnId}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{p.bookingId}</td>
                  <td className="py-3.5 px-4 font-bold text-fg">{p.customerName}</td>
                  <td className="py-3.5 px-4 font-bold text-accent-ink">{p.shopName}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₹{p.commission.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-bold text-accent-ink">₹{p.shopAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-muted">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                    }`}>
                      {p.status}
                    </span>
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

export default SuperAdminPayments
