import React from 'react'

/**
 * ReportTable Component
 * Generic formatted data table for reports.
 */
function ReportTable({ headers = [], rows = [] }) {
  if (!rows || !rows.length) {
    return (
      <div className="p-8 text-center bg-surface-2 rounded-2xl border border-line text-xs font-bold text-subtle">
        No report records match the selected parameters.
      </div>
    )
  }

  // Derive headers from first row if headers prop is empty
  const tableHeaders = headers.length > 0 ? headers : Object.keys(rows[0])

  return (
    <div className="overflow-x-auto rounded-2xl border border-line shadow-2xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface text-white font-bold uppercase tracking-wider">
          <tr>
            {tableHeaders.map((header, idx) => (
              <th key={idx} className="py-3 px-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line font-medium text-fg-muted bg-surface">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-surface-2 transition-colors">
              {tableHeaders.map((header, colIdx) => {
                const val = row[header] !== undefined ? row[header] : row[colIdx]
                const isAmount = typeof val === 'string' && val.includes('₹')
                const isMono = isAmount || (typeof val === 'string' && (val.includes('DRN-') || val.includes('RNT-') || val.includes('PAY-')))

                return (
                  <td
                    key={colIdx}
                    className={`py-3 px-4 ${isMono ? 'font-mono font-bold text-fg' : ''}`}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable
