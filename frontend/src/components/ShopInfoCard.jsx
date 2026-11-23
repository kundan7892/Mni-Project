import React from 'react'
import { ShieldCheck, MapPin, Star, Clock, Grid, MessageSquare, ExternalLink } from 'lucide-react'

// ShopInfoCard Component: Reusable card showcasing the drone owner rental shop details
function ShopInfoCard({ shopInfo, onContactClick, onViewShopClick }) {
  if (!shopInfo) return null

  return (
    <div className="bg-surface rounded-2xl border border-line p-6 shadow-2xs space-y-6">
      
      {/* Header: Shop Avatar & Identity */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface-2 border border-line shrink-0">
          <img
            src={shopInfo.logo}
            alt={shopInfo.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-lg font-bold text-fg leading-snug">
              {shopInfo.name}
            </h3>
            {shopInfo.verified && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent-ink text-xs font-bold px-2 py-0.5 rounded-full border border-accent/25">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-ink" />
                Verified Shop
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-subtle" />
              <span>{shopInfo.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 font-semibold text-fg-muted">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{shopInfo.rating}</span>
              <span className="text-subtle font-normal">({shopInfo.reviewsCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Specs / Metadata */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line text-xs">
        <div className="bg-surface-2 p-3 rounded-xl border border-line space-y-0.5">
          <div className="text-subtle flex items-center gap-1 font-medium">
            <Grid className="w-3.5 h-3.5 text-accent-ink" />
            <span>Available Fleet</span>
          </div>
          <div className="text-sm font-bold text-fg">
            {shopInfo.dronesCount} Drones Listed
          </div>
        </div>

        <div className="bg-surface-2 p-3 rounded-xl border border-line space-y-0.5">
          <div className="text-subtle flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avg Response</span>
          </div>
          <div className="text-sm font-bold text-fg">
            {shopInfo.responseTime}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={onContactClick || (() => alert(`Contacting ${shopInfo.name}\nEmail: ${shopInfo.email}\nPhone: ${shopInfo.phone}`))}
          className="inline-flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface-3 text-fg font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-accent-ink" />
          <span>Contact Shop</span>
        </button>

        <button
          onClick={onViewShopClick || (() => alert(`Navigating to ${shopInfo.name} storefront page...`))}
          className="inline-flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/10 text-accent-ink font-bold py-2.5 px-4 rounded-xl text-xs border border-accent/25 transition-colors cursor-pointer"
        >
          <span>View Shop</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  )
}

export default ShopInfoCard
