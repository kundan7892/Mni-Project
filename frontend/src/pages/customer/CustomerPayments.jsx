import React from 'react'
import { CreditCard, DollarSign, RefreshCw, ShieldCheck, Download } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import { customerPayments, paymentSummaryStats } from '../../data/payments'

function CustomerPayments() {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
      case 'Refunded': return 'bg-accent/10 text-accent-ink border-accent/25'
      default: return 'bg-surface-2 text-fg-muted border-line'
    }
  }

  const handleDownloadInvoice = (txn) => {
    alert(`Downloading Official Payment Receipt for Transaction ID: ${txn.transactionId}\nBooking ID: ${txn.bookingId}\nAmount Paid: ₹${txn.amount}`)
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
          Payments & Billing History
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Track rental invoices, pending transactions, security deposit holds, and automated refunds.
        </p>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Rental Spent"
          value={`₹${paymentSummaryStats.totalSpent.toLocaleString('en-IN')}`}
          label="Lifetime transactions"
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Pending Payments"
          value={`₹${paymentSummaryStats.pendingPayments.toLocaleString('en-IN')}`}
          label="Awaiting bank settlement"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          title="Security Deposits Held"
          value={`₹${paymentSummaryStats.securityDepositsHeld.toLocaleString('en-IN')}`}
          label="Active rental holds"
          icon={ShieldCheck}
          color="purple"
        />
        <StatCard
          title="Refunds Processed"
          value={`₹${paymentSummaryStats.refundsProcessed.toLocaleString('en-IN')}`}
          label="Returned deposits"
          icon={RefreshCw}
          color="blue"
        />
      </div>

      {/* PAYMENT TRANSACTION HISTORY TABLE */}
      <div className="bg-surface rounded-2xl border border-line shadow-2xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">
            Transaction History Logs
          </h2>
          <span className="text-xs text-subtle font-medium">
            {customerPayments.length} Total Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted font-bold uppercase tracking-wider border-b border-line">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Drone</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line font-medium text-fg-muted">
              {customerPayments.map((txn) => (
                <tr key={txn.transactionId} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-fg">{txn.transactionId}</td>
                  <td className="py-3.5 px-4 font-mono text-accent-ink font-bold">{txn.bookingId}</td>
                  <td className="py-3.5 px-4 text-muted">{txn.date}</td>
                  <td className="py-3.5 px-4 font-bold text-fg">{txn.droneName}</td>
                  <td className="py-3.5 px-4 text-muted">{txn.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-semibold text-fg">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(txn)}
                      className="p-1.5 text-muted hover:text-accent-ink hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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

export default CustomerPayments
