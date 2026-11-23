import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, Camera, MapPin } from 'lucide-react'
import { useWishlist } from '../hooks/useWishlist'
import { formatINR } from '../lib/format'

const STATUS = {
  available: { label: 'Available', dot: 'bg-emerald-400' },
  rented: { label: 'Rented out', dot: 'bg-amber-400' },
  maintenance: { label: 'In maintenance', dot: 'bg-subtle' },
  offline: { label: 'Unavailable', dot: 'bg-subtle' }
}

/** Product card used across the storefront. */
function DroneCard({ drone }) {
  const { has, toggle } = useWishlist()
  const id = drone._id || drone.id
  const saved = has(id)
  const status = STATUS[(drone.status || 'available').toLowerCase()] || STATUS.available
  const price = drone.pricePerDay || drone.price || 0
  const location = drone.location?.city || drone.location || ''

  return (
    <article className="group relative flex flex-col rounded-xl bg-surface border border-line hover:border-line-strong transition-colors overflow-hidden">
      <Link to={`/drones/${id}`} className="block aspect-[4/3] bg-surface-2 overflow-hidden">
        {drone.image && (
          <img src={drone.image} alt={drone.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggle(id)}
        aria-label={saved ? `Remove ${drone.name} from wishlist` : `Save ${drone.name} to wishlist`}
        className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 cursor-pointer"
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-rose-400 text-rose-400' : ''}`} />
      </button>

      <div className="flex-1 flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs text-muted">
            <span>{drone.brand} · {drone.category}</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <Link to={`/drones/${id}`} className="block text-[15px] font-medium text-fg hover:underline underline-offset-2 truncate">
            {drone.name}
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
          {drone.flightTime > 0 && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{drone.flightTime} min</span>}
          {drone.camera && <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" />{drone.camera}</span>}
          {location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{location}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-line">
          <div className="text-sm">
            <span className="font-medium text-fg tabular-nums">{formatINR(price)}</span>
            <span className="text-subtle"> / day</span>
          </div>
          <Link to={`/booking/${id}`} className="text-sm font-medium text-accent-ink hover:text-fg transition-colors">
            Rent
          </Link>
        </div>
      </div>
    </article>
  )
}

export default DroneCard
