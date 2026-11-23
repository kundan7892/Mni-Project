import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react'
import droneService from '../services/droneService'
import DroneCard from '../components/DroneCard'
import { Spinner, ErrorNote, Empty, Button, inputClass } from '../components/manage/ui'
import { normalizeDrone } from '../lib/format'

const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'flight-desc', label: 'Longest flight time' },
  { value: 'newest', label: 'Newest' }
]

const PRICE_STEPS = [0, 2000, 3000, 5000, 8000]

/** Public catalogue of drones available to rent. */
function DroneMarketplace() {
  const [drones, setDrones] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState(() => searchParams.get('category') || 'all')
  const [brand, setBrand] = useState('all')
  const [maxPrice, setMaxPrice] = useState(0)
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [sort, setSort] = useState('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    let alive = true
    droneService
      .getDrones({ limit: 200 })
      .then((res) => alive && setDrones((res?.drones || []).map(normalizeDrone)))
      .catch((err) => alive && setError(err.message))
    return () => {
      alive = false
    }
  }, [])

  const categories = useMemo(() => [...new Set((drones || []).map((d) => d.category))].filter(Boolean).sort(), [drones])
  const brands = useMemo(() => [...new Set((drones || []).map((d) => d.brand))].filter(Boolean).sort(), [drones])

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = (drones || []).filter(
      (d) =>
        (!q || [d.name, d.brand, d.model, d.category].some((v) => v?.toLowerCase().includes(q))) &&
        (category === 'all' || d.category === category) &&
        (brand === 'all' || d.brand === brand) &&
        (!maxPrice || d.pricePerDay <= maxPrice) &&
        (!onlyAvailable || d.status === 'available')
    )
    const sorters = {
      'price-asc': (a, b) => a.pricePerDay - b.pricePerDay,
      'price-desc': (a, b) => b.pricePerDay - a.pricePerDay,
      'flight-desc': (a, b) => b.flightTime - a.flightTime,
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      recommended: (a, b) =>
        Number(b.status === 'available') - Number(a.status === 'available') ||
        Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)) ||
        b.rating - a.rating
    }
    return [...list].sort(sorters[sort])
  }, [drones, search, category, brand, maxPrice, onlyAvailable, sort])

  const activeFilters = [category !== 'all', brand !== 'all', maxPrice > 0, onlyAvailable].filter(Boolean).length

  const reset = () => {
    setSearch('')
    setCategory('all')
    setBrand('all')
    setMaxPrice(0)
    setOnlyAvailable(false)
  }

  const filterControls = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs font-medium text-fg-muted">Category</div>
        <div className="flex flex-wrap lg:flex-col gap-1">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`text-left text-sm px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${category === c ? 'bg-surface-3 text-fg' : 'text-muted hover:text-fg hover:bg-surface-2'}`}
            >
              {c === 'all' ? 'All categories' : c}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-fg-muted">Brand</span>
        <select className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="all">All brands</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-fg-muted">Price per day</span>
        <select className={inputClass} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}>
          {PRICE_STEPS.map((p) => <option key={p} value={p}>{p ? `Up to ₹${p.toLocaleString('en-IN')}` : 'Any price'}</option>)}
        </select>
      </label>

      <label className="flex items-center gap-2.5 text-sm text-fg cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-accent" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
        Available now
      </label>

      {activeFilters > 0 && (
        <button type="button" onClick={reset} className="text-sm text-muted hover:text-fg cursor-pointer">Clear filters</button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
      <header className="space-y-2 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">Rent a drone</h1>
        <p className="text-muted">
          Professional drones for photography, film, survey and agriculture work. Pick your dates, send a request, and collect once it's confirmed.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input className={`${inputClass} h-10 pl-9`} placeholder="Search by name, brand or use" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button className="lg:hidden h-10" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="w-4 h-4" /> Filters{activeFilters ? ` (${activeFilters})` : ''}
          </Button>
          <select className={`${inputClass} h-10 sm:w-56`} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-8 items-start">
        <aside className="hidden lg:block sticky top-24">{filterControls}</aside>

        <section className="space-y-4">
          <ErrorNote>{error && `Couldn't load drones: ${error}`}</ErrorNote>
          {!drones && !error && <Spinner label="Loading drones…" />}
          {drones && (
            <>
              <div className="text-sm text-muted">
                {results.length} drone{results.length === 1 ? '' : 's'}
              </div>
              {results.length === 0 ? (
                <Empty
                  icon={PackageSearch}
                  title="No drones match"
                  description="Try removing a filter or searching for something else."
                  action={<Button onClick={reset}>Clear filters</Button>}
                />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((d) => <DroneCard key={d._id} drone={d} />)}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setFiltersOpen(false)} />
          <div className="relative w-80 max-w-full h-full bg-surface border-l border-line p-5 overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-medium text-fg">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="p-1 text-muted hover:text-fg cursor-pointer" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterControls}
            <Button variant="primary" className="w-full mt-8" onClick={() => setFiltersOpen(false)}>
              Show {results.length} drone{results.length === 1 ? '' : 's'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DroneMarketplace
