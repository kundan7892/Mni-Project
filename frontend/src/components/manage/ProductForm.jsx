import React, { useRef, useState } from 'react'
import { ImagePlus, X, Star, Link2, Loader2 } from 'lucide-react'
import { Modal, Button, Field, ErrorNote, inputClass } from './ui'
import { uploadFiles } from '../../services/uploadService'
import droneService from '../../services/droneService'

const CATEGORIES = ['Photography', 'Videography', 'Surveying', 'Industrial Inspection', 'Agriculture', 'Thermal', 'Beginner']

const EMPTY = {
  name: '',
  brand: '',
  model: '',
  category: 'Photography',
  description: '',
  images: [],
  pricePerDay: '',
  pricePerHour: '',
  securityDeposit: '',
  status: 'available',
  isListed: true,
  location: '',
  shopName: '',
  camera: '',
  flightTime: '',
  maxRange: '',
  weight: ''
}

const fromDrone = (d) => ({
  ...EMPTY,
  name: d.name || '',
  brand: d.brand || '',
  model: d.model || '',
  category: d.category || 'Photography',
  description: d.description || '',
  images: d.images?.length ? d.images : d.image ? [d.image] : [],
  pricePerDay: d.pricePerDay ?? '',
  pricePerHour: d.pricePerHour ?? '',
  securityDeposit: d.securityDeposit ?? '',
  status: d.status || 'available',
  isListed: d.isListed !== false,
  location: d.location || '',
  shopName: d.shopName || '',
  camera: d.specifications?.camera || '',
  flightTime: d.specifications?.flightTime ?? '',
  maxRange: d.specifications?.maxRange ?? '',
  weight: d.specifications?.weight || ''
})

/** Add / edit a catalogue product, including image upload. */
function ProductForm({ drone, onClose, onSaved }) {
  const isEdit = Boolean(drone)
  const [form, setForm] = useState(() => (drone ? fromDrone(drone) : EMPTY))
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const addFiles = async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    const tooBig = list.find((f) => f.size > 5 * 1024 * 1024)
    if (tooBig) {
      setError(`${tooBig.name} is larger than 5 MB.`)
      return
    }
    setUploading(true)
    setError(null)
    try {
      const uploaded = await uploadFiles(list)
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded.map((u) => u.url)] }))
      setErrors((er) => ({ ...er, images: undefined }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!/^https?:\/\//i.test(url)) {
      setError('Image links must start with http:// or https://')
      return
    }
    setForm((f) => ({ ...f, images: [...f.images, url] }))
    setUrlInput('')
    setError(null)
  }

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }))
  const makeCover = (url) => setForm((f) => ({ ...f, images: [url, ...f.images.filter((u) => u !== url)] }))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter a product title.'
    if (!form.brand.trim()) e.brand = 'Enter the brand.'
    if (!(Number(form.pricePerDay) > 0)) e.pricePerDay = 'Enter a daily price.'
    if (form.images.length === 0) e.images = 'Add at least one image.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim() || form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      image: form.images[0],
      images: form.images,
      pricePerDay: Number(form.pricePerDay),
      ...(form.pricePerHour !== '' && { pricePerHour: Number(form.pricePerHour) }),
      securityDeposit: form.securityDeposit === '' ? 0 : Number(form.securityDeposit),
      status: form.status,
      isListed: form.isListed,
      ...(form.location.trim() && { location: form.location.trim() }),
      ...(form.shopName.trim() && { shopName: form.shopName.trim() }),
      specifications: {
        ...(drone?.specifications || {}),
        camera: form.camera.trim() || drone?.specifications?.camera || '4K',
        flightTime: Number(form.flightTime) || drone?.specifications?.flightTime || 30,
        maxRange: Number(form.maxRange) || drone?.specifications?.maxRange || 10,
        weight: form.weight.trim() || drone?.specifications?.weight || ''
      }
    }

    try {
      const saved = isEdit ? await droneService.updateDrone(drone._id, payload) : await droneService.createDrone(payload)
      onSaved(saved)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={isEdit ? `Edit ${drone.name}` : 'Add product'}
      description={isEdit ? 'Changes appear in the store immediately.' : 'New products appear in the store as soon as they are saved and visible.'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} disabled={uploading} onClick={handleSubmit}>
            {isEdit ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorNote>{error}</ErrorNote>

        {/* Images */}
        <section className="space-y-2">
          <div className="text-xs font-medium text-fg-muted">Images</div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            className={`grid grid-cols-3 sm:grid-cols-4 gap-3 rounded-lg p-3 ring-1 ring-inset transition-colors ${dragOver ? 'ring-accent bg-accent/5' : 'ring-line bg-surface-2/50'}`}
          >
            {form.images.map((url, i) => (
              <div key={url} className="group relative aspect-[4/3] rounded-md overflow-hidden bg-surface-3">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">Cover</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  {i !== 0 && (
                    <button type="button" onClick={() => makeCover(url)} title="Use as cover" className="p-1 rounded bg-black/60 text-white hover:bg-black cursor-pointer">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(url)} title="Remove" className="p-1 rounded bg-black/60 text-white hover:bg-rose-600 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-[4/3] rounded-md border border-dashed border-line-strong flex flex-col items-center justify-center gap-1.5 text-xs text-muted hover:text-fg hover:border-subtle cursor-pointer disabled:cursor-wait"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            multiple
            hidden
            onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className={`${inputClass} pl-9`}
                placeholder="…or paste an image link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }}
              />
            </div>
            <Button onClick={addUrl} disabled={!urlInput.trim()}>Add</Button>
          </div>
          <p className={`text-xs ${errors.images ? 'text-rose-300' : 'text-subtle'}`}>
            {errors.images || 'Drag images here or upload. JPG, PNG or WEBP up to 5 MB. The first image is the cover.'}
          </p>
        </section>

        {/* Basics */}
        <section className="grid sm:grid-cols-2 gap-4">
          <Field label="Product title" error={errors.name} className="sm:col-span-2">
            <input className={inputClass} value={form.name} onChange={set('name')} placeholder="e.g. Mavic 3 Pro" />
          </Field>
          <Field label="Brand" error={errors.brand}>
            <input className={inputClass} value={form.brand} onChange={set('brand')} placeholder="e.g. DJI" />
          </Field>
          <Field label="Model" hint="Optional">
            <input className={inputClass} value={form.model} onChange={set('model')} placeholder="e.g. Mavic 3 Pro Hasselblad" />
          </Field>
          <Field label="Category">
            <input className={inputClass} list="product-categories" value={form.category} onChange={set('category')} />
            <datalist id="product-categories">
              {CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field label="Pickup location" hint="Optional">
            <input className={inputClass} value={form.location} onChange={set('location')} placeholder="e.g. Bengaluru" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea rows={3} className={`${inputClass} h-auto py-2 resize-y`} value={form.description} onChange={set('description')} placeholder="What is it good for? What's in the box?" />
          </Field>
        </section>

        {/* Pricing */}
        <section className="grid sm:grid-cols-3 gap-4">
          <Field label="Price per day (₹)" error={errors.pricePerDay}>
            <input type="number" min="0" className={inputClass} value={form.pricePerDay} onChange={set('pricePerDay')} />
          </Field>
          <Field label="Price per hour (₹)" hint="Blank = day price ÷ 8">
            <input type="number" min="0" className={inputClass} value={form.pricePerHour} onChange={set('pricePerHour')} />
          </Field>
          <Field label="Refundable deposit (₹)">
            <input type="number" min="0" className={inputClass} value={form.securityDeposit} onChange={set('securityDeposit')} />
          </Field>
        </section>

        {/* Specs */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Camera">
            <input className={inputClass} value={form.camera} onChange={set('camera')} placeholder="4K" />
          </Field>
          <Field label="Flight time (min)">
            <input type="number" min="0" className={inputClass} value={form.flightTime} onChange={set('flightTime')} />
          </Field>
          <Field label="Range (km)">
            <input type="number" min="0" className={inputClass} value={form.maxRange} onChange={set('maxRange')} />
          </Field>
          <Field label="Weight">
            <input className={inputClass} value={form.weight} onChange={set('weight')} placeholder="958 g" />
          </Field>
        </section>

        {/* Availability */}
        <section className="grid sm:grid-cols-2 gap-4 items-end">
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={set('status')}>
              <option value="available">Available</option>
              <option value="rented">Rented out</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </Field>
          <label className="flex items-center gap-3 h-9 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-accent" checked={form.isListed} onChange={set('isListed')} />
            <span className="text-sm text-fg">Visible in the store</span>
          </label>
        </section>
      </form>
    </Modal>
  )
}

export default ProductForm
