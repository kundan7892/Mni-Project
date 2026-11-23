import React from 'react'

/**
 * ReportSummary Component
 * Summary cards grid for report document previews.
 */
function ReportSummary({ cards = [] }) {
  if (!cards || !cards.length) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, idx) => (
        <div key={idx} className="p-3.5 bg-surface-2 rounded-2xl border border-line space-y-1">
          <span className="text-[10px] font-bold uppercase text-subtle block">
            {card.label}
          </span>
          <div className="text-lg font-semibold text-fg font-mono tracking-tight">
            {card.value}
          </div>
          {card.sub && (
            <div className="text-[10px] text-muted font-medium">
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReportSummary
