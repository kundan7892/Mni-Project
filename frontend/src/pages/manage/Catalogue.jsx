import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus, Search, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import droneService from '../../services/droneService'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote, Modal, inputClass } from '../../components/manage/ui'
import { Badge, DroneStatusBadge } from '../../components/manage/Badge'
import ProductForm from '../../components/manage/ProductForm'
import { formatINR, normalizeDrone } from '../../lib/format'

/** Product catalogue manager: add, edit, hide/show and delete drones (admin: all, owner: own). */
function Catalogue() {
  const [drones, setDrones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [editing, setEditing] = useState(null) // null | 'new' | drone
  const [deleting, setDeleting] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await droneService.getDrones({ limit: 200, includeUnlisted: true, sort: 'newest' })
      setDrones((res?.drones || []).map(normalizeDrone))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 3500)
    return () => clearTimeout(t)
  }, [flash])

  const categories = useMemo(() => [...new Set(drones.map((d) => d.category).filter(Boolean))].sort(), [drones])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return drones.filter(
      (d) =>
        (category === 'all' || d.category === category) &&
        (!q || [d.name, d.brand, d.model].some((v) => v?.toLowerCase().includes(q)))
    )
  }, [drones, search, category])

  const handleSaved = (saved) => {
    const item = normalizeDrone(saved)
    setDrones((list) => {
      const exists = list.some((d) => d._id === item._id)
      return exists ? list.map((d) => (d._id === item._id ? item : d)) : [item, ...list]
    })
    setFlash(editing === 'new' ? `${item.name} was added to the catalogue.` : `${item.name} was updated.`)
    setEditing(null)
  }

  const toggleListed = async (drone) => {
    setBusyId(drone._id)
    setError(null)
    try {
      const saved = await droneService.updateDrone(drone._id, { isListed: !drone.isListed })
      setDrones((list) => list.map((d) => (d._id === drone._id ? normalizeDrone(saved) : d)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const confirmDelete = async () => {
    const drone = deleting
    setBusyId(drone._id)
    setError(null)
    try {
      await droneService.deleteDrone(drone._id)
      setDrones((list) => list.filter((d) => d._id !== drone._id))
      setFlash(`${drone.name} was deleted.`)
      setDeleting(null)
    } catch (err) {
      setError(err.message)
      setDeleting(null)
    } finally {
      setBusyId(null)
    }
  }

  const listedCount = drones.filter((d) => d.isListed).length

  return (
    <>
      <PageHeader
        title="Catalogue"
        description={`${drones.length} products · ${listedCount} visible in the store`}
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> Add product
          </Button>
        }
      />

      {flash && (
        <div className="rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20 px-3 py-2 text-sm text-emerald-300">{flash}</div>
      )}
      <ErrorNote>{error}</ErrorNote>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input className={`${inputClass} pl-9`} placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={`${inputClass} sm:w-52`} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <Card>
          <Empty
            icon={Package}
            title={drones.length ? 'No products match' : 'Your catalogue is empty'}
            description={drones.length ? 'Try a different search or category.' : 'Add your first drone to start taking rental requests.'}
            action={!drones.length && <Button variant="primary" onClick={() => setEditing('new')}><Plus className="w-4 h-4" /> Add product</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((d) => (
            <Card key={d._id} className={`overflow-hidden flex flex-col ${d.isListed ? '' : 'opacity-70'}`}>
              <div className="relative aspect-[16/10] bg-surface-2 overflow-hidden">
                {d.image && <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {!d.isListed && <Badge tone="neutral" className="bg-black/70 ring-0">Hidden</Badge>}
                  {d.images.length > 1 && <Badge tone="neutral" className="bg-black/70 ring-0">{d.images.length} photos</Badge>}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-fg truncate">{d.name}</div>
                    <div className="text-xs text-muted truncate">{d.brand} · {d.category}{d.shopName ? ` · ${d.shopName}` : ''}</div>
                  </div>
                  <DroneStatusBadge status={d.status} />
                </div>
                <div className="flex items-baseline gap-1 text-sm">
                  <span className="text-fg font-medium tabular-nums">{formatINR(d.pricePerDay)}</span>
                  <span className="text-subtle">/ day</span>
                  {d.securityDeposit > 0 && <span className="ml-auto text-xs text-subtle">{formatINR(d.securityDeposit)} deposit</span>}
                </div>
                <div className="mt-auto flex items-center gap-1 pt-3 border-t border-line">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(d)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" loading={busyId === d._id && !deleting} onClick={() => toggleListed(d)}>
                    {d.isListed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {d.isListed ? 'Hide' : 'Show'}
                  </Button>
                  {d.isListed && (
                    <Link to={`/drones/${d._id}`} target="_blank" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-muted hover:text-fg hover:bg-surface-2">
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </Link>
                  )}
                  <Button size="sm" variant="danger-ghost" className="ml-auto" onClick={() => setDeleting(d)} aria-label={`Delete ${d.name}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <ProductForm drone={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={handleSaved} />}

      <Modal
        open={Boolean(deleting)}
        size="sm"
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="This removes the product permanently. Past orders keep their records. To take it off the store temporarily, use Hide instead."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" loading={busyId === deleting?._id} onClick={confirmDelete}>Delete product</Button>
          </>
        }
      />
    </>
  )
}

export default Catalogue
