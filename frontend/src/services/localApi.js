/**
 * In-browser stand-in for the DroneHub REST API.
 *
 * Used automatically when the Express + MongoDB backend is not reachable (see api.js),
 * so the whole site — catalogue, renting, admin panel — works with just `npm run dev`
 * or a static deploy. Data is kept in this browser's localStorage, which means the
 * admin and the customer must use the same browser to see each other's changes.
 *
 * Mirrors the backend's endpoints, response envelope ({ success, message, data })
 * and business rules (pricing, overlap checks, booking lifecycle, role scoping).
 */
import { dronesData } from '../data/drones'
import { ADDONS } from '../components/booking/addons'

const DB_KEY = 'dronehub_local_db_v1'
const DAY = 24 * 60 * 60 * 1000
const BLOCKING = ['approved', 'confirmed', 'active']
const REVENUE = ['approved', 'confirmed', 'active', 'completed']
const TRANSITIONS = {
  pending: ['approved', 'rejected', 'cancelled'],
  approved: ['active', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed'],
  completed: [],
  rejected: [],
  cancelled: []
}

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const SEED_USERS = [
  { _id: 'u-admin', name: 'Platform Admin', email: 'admin@dronehub.com', password: 'admin123', role: 'super-admin', phone: '+91 99999 00001' },
  { _id: 'u-owner1', name: 'SkyRent Owner', email: 'owner@dronehub.com', password: 'owner123', role: 'shop-owner', phone: '+91 98765 43210', shopName: 'SkyRent Bengaluru' },
  { _id: 'u-owner2', name: 'AeroRent Owner', email: 'owner2@dronehub.com', password: 'owner123', role: 'shop-owner', phone: '+91 98123 45678', shopName: 'AeroTech Mumbai' },
  { _id: 'u-customer', name: 'Demo Customer', email: 'user@dronehub.com', password: 'user123', role: 'customer', phone: '+91 98765 12345' },
  { _id: 'u-aarav', name: 'Aarav Mehta', email: 'aarav@example.com', password: 'customer123', role: 'customer', phone: '9876500011' },
  { _id: 'u-priya', name: 'Priya Nair', email: 'priya@example.com', password: 'customer123', role: 'customer', phone: '9876500022' },
  { _id: 'u-rohan', name: 'Rohan Kapoor', email: 'rohan@example.com', password: 'customer123', role: 'customer', phone: '9876500033' }
]

const SHOP_OWNERS = { 'SkyRent Bengaluru': 'u-owner1', 'AeroTech Mumbai': 'u-owner2' }
const STATUS_FROM_AVAILABILITY = { Available: 'available', 'Currently Rented': 'rented', Maintenance: 'maintenance' }

// [customer, drone index, start offset (days), length (days), status, payment, add-ons]
const SEED_PLAN = [
  ['u-aarav', 0, -150, 3, 'completed', 'paid', ['addon-battery']],
  ['u-priya', 1, -128, 2, 'completed', 'paid', []],
  ['u-customer', 2, -110, 4, 'completed', 'paid', ['addon-insurance']],
  ['u-rohan', 3, -95, 1, 'completed', 'paid', []],
  ['u-aarav', 4, -80, 5, 'completed', 'paid', ['addon-battery', 'addon-case']],
  ['u-priya', 0, -66, 2, 'rejected', 'pending', []],
  ['u-customer', 5, -52, 3, 'completed', 'paid', ['addon-memory']],
  ['u-rohan', 1, -40, 2, 'cancelled', 'refunded', []],
  ['u-aarav', 6, -30, 4, 'completed', 'paid', ['addon-insurance']],
  ['u-customer', 0, -18, 3, 'completed', 'paid', ['addon-battery']],
  ['u-priya', 7, -9, 2, 'completed', 'paid', []],
  ['u-rohan', 2, -1, 4, 'active', 'paid', ['addon-propellers']],
  ['u-customer', 1, 3, 3, 'approved', 'pending', ['addon-battery', 'addon-insurance']],
  ['u-aarav', 3, 6, 2, 'pending', 'pending', []],
  ['u-priya', 4, 9, 5, 'pending', 'pending', ['addon-case']],
  ['u-customer', 6, 14, 2, 'pending', 'pending', []]
]

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

const newBookingNumber = () => {
  const stamp = Date.now().toString(36).slice(-4).toUpperCase()
  const rand = Math.floor(Math.random() * 1296).toString(36).padStart(2, '0').toUpperCase()
  return `DRN-${stamp}${rand}`
}

function buildSeed() {
  const now = Date.now()
  const users = SEED_USERS.map((u, i) => ({ ...u, isActive: true, createdAt: new Date(now - (200 - i * 10) * DAY).toISOString() }))

  const drones = dronesData.map((d, i) => {
    const status = STATUS_FROM_AVAILABILITY[d.availability] || 'available'
    return {
      _id: `drn-${String(d.id).padStart(2, '0')}`,
      name: d.name,
      brand: d.brand,
      model: d.model,
      category: d.category,
      description: `${d.name} by ${d.brand} for ${d.category.toLowerCase()} work, with a ${d.camera} camera and up to ${d.flightTime} minutes of flight time.`,
      image: d.image,
      images: [],
      isListed: true,
      pricePerDay: d.pricePerDay,
      pricePerHour: Math.round(d.pricePerDay / 8),
      securityDeposit: d.securityDeposit,
      batteryLevel: 100,
      status,
      availability: status.charAt(0).toUpperCase() + status.slice(1),
      ownerId: SHOP_OWNERS[d.shopName] || 'u-admin',
      shopName: d.shopName,
      location: d.location,
      rating: d.rating,
      reviews: d.reviews,
      popular: Boolean(d.popular),
      recommended: Boolean(d.recommended),
      specifications: { camera: d.camera, flightTime: d.flightTime, gps: d.gps !== false },
      createdAt: new Date(now - (60 - i) * DAY).toISOString()
    }
  })

  const today = startOfToday().getTime()
  const bookings = SEED_PLAN.map(([cid, di, offset, length, status, payment, addons], i) => {
    const customer = users.find((u) => u._id === cid)
    const drone = drones[di]
    const start = new Date(today + offset * DAY)
    const end = new Date(start.getTime() + length * DAY)
    const quote = calculateQuote(drone, start, end, addons)
    const createdAt = new Date(offset < 0 ? start.getTime() - Math.min(7, -offset) * DAY : now - (offset * 7 + 2) * 3600 * 1000)
    if (status === 'active') {
      drone.status = 'rented'
      drone.availability = 'Rented'
    }
    const history = [{ status: 'pending', at: createdAt.toISOString(), by: customer.name, note: 'Request submitted' }]
    if (status !== 'pending') history.push({ status, at: new Date(createdAt.getTime() + DAY).toISOString(), by: 'Shop' })
    return {
      _id: `bkg-seed-${i}`,
      bookingNumber: `DRN-S${String(1000 + i * 37).slice(-4)}`,
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      droneId: drone._id,
      droneName: drone.name,
      ownerId: drone.ownerId,
      shopName: drone.shopName,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      durationDays: quote.durationDays,
      durationHours: quote.durationHours,
      totalPrice: quote.totalPrice,
      addonsTotal: quote.addonsTotal,
      securityDeposit: quote.securityDeposit,
      selectedAddons: quote.selectedAddons,
      customerInfo: { fullName: customer.name, email: customer.email, phone: customer.phone, city: 'Bengaluru', purpose: 'Aerial photography' },
      documents: [],
      bookingStatus: status,
      paymentStatus: payment,
      rejectionReason: status === 'rejected' ? 'Drone reserved for servicing on those dates.' : '',
      cancellationReason: status === 'cancelled' ? 'Plans changed' : '',
      notes: '',
      statusHistory: history,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString()
    }
  })

  return { version: 1, users, drones, bookings }
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

let cache = null

function db() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(DB_KEY)
    cache = raw ? JSON.parse(raw) : null
  } catch {
    cache = null
  }
  if (!cache || cache.version !== 1) {
    cache = buildSeed()
    persist()
  }
  return cache
}

function persist() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(cache))
  } catch (err) {
    cache = null // drop the unsaved change so memory matches storage
    if (err?.name === 'QuotaExceededError') {
      throw httpError(507, 'Browser storage is full. Remove some product images or use smaller ones.')
    }
    throw err
  }
}

/** Wipe local data back to the starting catalogue and demo bookings. */
export function resetLocalData() {
  localStorage.removeItem(DB_KEY)
  cache = null
  db()
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

const ok = (data, message = 'Success', status = 200) => ({ status, body: { success: true, message, data } })

const publicUser = (u) => {
  if (!u) return null
  const { password: _password, ...rest } = u
  return { ...rest, id: u._id, profileImage: u.profileImage || '' }
}

const userRef = (id) => {
  const u = db().users.find((x) => x._id === id)
  return u ? { _id: u._id, id: u._id, name: u.name, email: u.email, phone: u.phone } : id
}

const droneOut = (d) => ({ ...d, id: d._id, ownerId: userRef(d.ownerId) })

const bookingOut = (b) => {
  const d = db().drones.find((x) => x._id === b.droneId)
  return {
    ...b,
    id: b._id,
    bookingId: b.bookingNumber,
    amount: b.totalPrice,
    status: b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1),
    customerId: userRef(b.customerId),
    ownerId: userRef(b.ownerId),
    droneId: d
      ? {
          _id: d._id,
          id: d._id,
          name: d.name,
          brand: d.brand,
          model: d.model,
          image: d.image,
          images: d.images,
          category: d.category,
          pricePerDay: d.pricePerDay,
          pricePerHour: d.pricePerHour,
          status: d.status,
          location: d.location,
          specifications: d.specifications
        }
      : b.droneId
  }
}

const isAdmin = (u) => u && (u.role === 'super-admin' || u.role === 'admin')
const isOwner = (u) => u && (u.role === 'shop-owner' || u.role === 'owner')

function currentUser(headers) {
  const auth = headers?.Authorization || headers?.authorization || ''
  const token = String(auth).replace(/^Bearer\s+/i, '')
  if (!token.startsWith('local.')) return null
  const u = db().users.find((x) => x._id === token.slice(6))
  return u && u.isActive !== false ? u : null
}

function requireUser(ctx) {
  if (!ctx.user) throw httpError(401, 'Please sign in to continue.')
  return ctx.user
}

function requireStaff(ctx) {
  const u = requireUser(ctx)
  if (!isAdmin(u) && !isOwner(u)) throw httpError(403, 'Only shop owners and admins can do this.')
  return u
}

function requireAdmin(ctx) {
  const u = requireUser(ctx)
  if (!isAdmin(u)) throw httpError(403, 'Only admins can do this.')
  return u
}

function calculateQuote(drone, start, end, selected = []) {
  const diff = end.getTime() - start.getTime()
  const durationHours = Math.max(1, Math.ceil(diff / 3600000))
  const durationDays = Math.max(1, Math.ceil(diff / DAY))
  const baseCost = durationHours < 24 && drone.pricePerHour > 0 ? durationHours * drone.pricePerHour : durationDays * drone.pricePerDay
  const valid = [...new Set(selected)].filter((id) => ADDONS.some((a) => a.id === id))
  const addonsTotal = valid.reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id)
    return sum + (a.priceType === 'perDay' ? a.price * durationDays : a.price)
  }, 0)
  return { durationHours, durationDays, baseCost, addonsTotal, selectedAddons: valid, totalPrice: baseCost + addonsTotal, securityDeposit: drone.securityDeposit ?? 0 }
}

function parseRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start) || isNaN(end)) throw httpError(400, 'Invalid start or end date format.')
  if (end <= start) throw httpError(400, 'Rental end date must be after the start date.')
  if (start < new Date(Date.now() - DAY)) throw httpError(400, 'Booking start date cannot be in the past.')
  return { start, end }
}

const findConflict = (droneId, start, end, excludeId) =>
  db().bookings.find(
    (b) =>
      b._id !== excludeId &&
      b.droneId === droneId &&
      BLOCKING.includes(b.bookingStatus) &&
      new Date(b.startDate) < end &&
      new Date(b.endDate) > start
  )

// Bookings end at midnight after the last rental day; show the last day, in local time
const day = (d, isEnd = false) =>
  new Date(new Date(d).getTime() - (isEnd ? 1 : 0)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const canManage = (b, u) => isAdmin(u) || b.ownerId === u._id

const findBooking = (id) => db().bookings.find((b) => b._id === id || b.bookingNumber === id)

const matches = (q, ...fields) => {
  const needle = String(q || '').trim().toLowerCase()
  return !needle || fields.some((f) => String(f || '').toLowerCase().includes(needle))
}

/* ------------------------------------------------------------------ */
/* Uploads: images are downscaled and stored as data URLs              */
/* ------------------------------------------------------------------ */

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(httpError(400, `Could not read ${file.name}.`))
    r.readAsDataURL(file)
  })

async function compressImage(file, maxSide = 1400, quality = 0.82) {
  const url = await readAsDataURL(file)
  if (file.type === 'image/gif') return url
  const img = await new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(httpError(400, `${file.name} is not a valid image.`))
    i.src = url
  })
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * scale))
  canvas.height = Math.max(1, Math.round(img.height * scale))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const keepAlpha = file.type === 'image/png'
  const out = canvas.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', quality)
  // Fall back to JPEG if a PNG came out larger than the original
  return keepAlpha && out.length > url.length ? canvas.toDataURL('image/jpeg', quality) : out
}

async function handleUpload(ctx, formData) {
  requireUser(ctx)
  const files = formData?.getAll ? formData.getAll('files') : []
  if (!files.length) throw httpError(400, 'No files were uploaded.')
  const result = []
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) throw httpError(400, 'Each file must be 5 MB or smaller.')
    let url
    if (file.type.startsWith('image/')) url = await compressImage(file)
    else if (file.type === 'application/pdf') {
      if (file.size > 1.5 * 1024 * 1024) throw httpError(400, 'PDFs must be 1.5 MB or smaller when running without the server.')
      url = await readAsDataURL(file)
    } else throw httpError(400, 'Only JPG, PNG, WEBP, GIF, AVIF images or PDF documents are allowed.')
    result.push({ name: file.name, size: file.size, mimeType: file.type, url })
  }
  return ok({ files: result }, 'Upload complete.', 201)
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                      */
/* ------------------------------------------------------------------ */

function listDrones(ctx, q) {
  const staff = ctx.user && (isAdmin(ctx.user) || isOwner(ctx.user))
  const unlisted = q.includeUnlisted === 'true' && staff
  let list = db().drones.filter((d) => (unlisted ? true : d.isListed !== false))
  if (unlisted && isOwner(ctx.user)) list = list.filter((d) => d.ownerId === ctx.user._id)
  if (q.search) list = list.filter((d) => matches(q.search, d.name, d.model, d.brand))
  const notAll = (v) => v && !/^all/i.test(v)
  if (notAll(q.brand)) list = list.filter((d) => d.brand.toLowerCase() === q.brand.toLowerCase())
  if (notAll(q.category)) list = list.filter((d) => d.category.toLowerCase() === q.category.toLowerCase())
  if (notAll(q.status)) list = list.filter((d) => d.status === q.status.toLowerCase())
  if (q.ownerId) list = list.filter((d) => d.ownerId === q.ownerId)
  if (q.minPrice) list = list.filter((d) => d.pricePerDay >= Number(q.minPrice))
  if (q.maxPrice) list = list.filter((d) => d.pricePerDay <= Number(q.maxPrice))

  const sorters = {
    'price-low': (a, b) => a.pricePerDay - b.pricePerDay,
    price_asc: (a, b) => a.pricePerDay - b.pricePerDay,
    'price-high': (a, b) => b.pricePerDay - a.pricePerDay,
    price_desc: (a, b) => b.pricePerDay - a.pricePerDay,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    recommended: (a, b) => Number(b.recommended) - Number(a.recommended) || Number(b.popular) - Number(a.popular) || b.rating - a.rating
  }
  list = [...list].sort(sorters[q.sort] || ((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

  const limit = Math.min(200, Math.max(1, parseInt(q.limit, 10) || 12))
  const page = Math.max(1, parseInt(q.page, 10) || 1)
  const total = list.length
  return ok({
    drones: list.slice((page - 1) * limit, page * limit).map(droneOut),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page * limit < total }
  })
}

function getDrone(id) {
  const d = db().drones.find((x) => x._id === id || x.model === id)
  if (!d) throw httpError(404, `Drone not found with identifier '${id}'.`)
  return d
}

function saveDrone(ctx, body, existing) {
  const user = requireStaff(ctx)
  if (existing && !isAdmin(user) && existing.ownerId !== user._id) throw httpError(403, 'You can only modify drones belonging to your shop fleet.')

  const d = existing ? { ...existing } : { _id: newId('drn'), ownerId: user._id, createdAt: new Date().toISOString(), rating: 0, reviews: 0, batteryLevel: 100, popular: false, recommended: false }
  const fields = ['name', 'model', 'brand', 'category', 'description', 'image', 'location', 'shopName', 'isListed']
  fields.forEach((f) => body[f] !== undefined && (d[f] = body[f]))
  if (Array.isArray(body.images)) d.images = body.images.filter((u) => typeof u === 'string' && u)
  if (!d.image && d.images?.length) d.image = d.images[0]
  if (body.pricePerDay !== undefined) d.pricePerDay = Number(body.pricePerDay)
  if (body.pricePerHour !== undefined) d.pricePerHour = Number(body.pricePerHour)
  else if (body.pricePerDay !== undefined) d.pricePerHour = Math.round(d.pricePerDay / 8)
  if (body.securityDeposit !== undefined && body.securityDeposit !== '') d.securityDeposit = Number(body.securityDeposit)
  if (body.status) {
    d.status = String(body.status).toLowerCase()
    d.availability = d.status.charAt(0).toUpperCase() + d.status.slice(1)
  }
  if (body.specifications) d.specifications = { ...(d.specifications || {}), ...body.specifications }

  if (!existing) {
    if (!d.name || d.name.trim().length < 2) throw httpError(400, 'Drone name is required.')
    if (!d.brand) throw httpError(400, 'Manufacturer/Brand name is required.')
    d.model = d.model || d.name
    d.category = d.category || 'Photography'
    d.status = d.status || 'available'
    d.availability = d.availability || 'Available'
    d.securityDeposit = d.securityDeposit ?? 5000
    d.pricePerDay = d.pricePerDay || 2400
    d.pricePerHour = d.pricePerHour || Math.round(d.pricePerDay / 8)
    d.isListed = body.isListed !== false
    d.shopName = d.shopName || user.shopName || 'DroneHub'
    d.location = d.location || 'Bengaluru'
    d.images = d.images || []
    d.description = d.description || ''
    d.specifications = d.specifications || { camera: '4K', flightTime: 30, gps: true }
    db().drones.unshift(d)
  } else {
    db().drones = db().drones.map((x) => (x._id === d._id ? d : x))
  }
  persist()
  return ok({ drone: droneOut(d) }, existing ? 'Drone updated successfully.' : 'Drone added to fleet inventory successfully.', existing ? 200 : 201)
}

function deleteDrone(ctx, id) {
  const user = requireStaff(ctx)
  const d = getDrone(id)
  if (!isAdmin(user) && d.ownerId !== user._id) throw httpError(403, 'You can only remove drones belonging to your shop fleet.')
  if (d.status === 'rented') throw httpError(400, 'Cannot delete a drone that is currently rented out.')
  const upcoming = db().bookings.filter((b) => b.droneId === d._id && BLOCKING.includes(b.bookingStatus) && new Date(b.endDate) > new Date()).length
  if (upcoming) throw httpError(400, `This drone has ${upcoming} upcoming confirmed rental(s). Hide it from the catalogue instead, or cancel those rentals first.`)
  db().drones = db().drones.filter((x) => x._id !== d._id)
  persist()
  return ok(null, `Drone '${d.name}' was successfully removed from the fleet.`)
}

function availability(id) {
  getDrone(id)
  const reserved = db()
    .bookings.filter((b) => b.droneId === id && BLOCKING.includes(b.bookingStatus) && new Date(b.endDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map((b) => ({ startDate: b.startDate, endDate: b.endDate, status: b.bookingStatus }))
  return ok({ reserved }, 'Availability retrieved.')
}

function quote(ctx, body) {
  requireUser(ctx)
  const { start, end } = parseRange(body.startDate, body.endDate)
  const drone = getDrone(body.droneId)
  const conflict = findConflict(drone._id, start, end)
  return ok({
    quote: calculateQuote(drone, start, end, body.selectedAddons),
    available: !conflict,
    conflict: conflict ? { startDate: conflict.startDate, endDate: conflict.endDate } : null
  })
}

function createBooking(ctx, body) {
  const user = requireUser(ctx)
  const { start, end } = parseRange(body.startDate, body.endDate)
  const drone = getDrone(body.droneId)
  if (drone.isListed === false) throw httpError(404, 'The requested drone was not found.')
  if (drone.status === 'maintenance' || drone.status === 'offline') throw httpError(400, `${drone.name} is currently ${drone.status} and cannot be reserved.`)
  const conflict = findConflict(drone._id, start, end)
  if (conflict) throw httpError(409, `${drone.name} is already booked from ${day(conflict.startDate)} to ${day(conflict.endDate, true)}. Please choose other dates.`)

  const q = calculateQuote(drone, start, end, body.selectedAddons)
  const ci = body.customerInfo || {}
  const info = {
    fullName: ci.fullName || user.name,
    email: ci.email || user.email,
    phone: ci.phone || user.phone || '',
    address: ci.address || '',
    city: ci.city || '',
    state: ci.state || '',
    pinCode: ci.pinCode || '',
    purpose: ci.purpose || '',
    experience: ci.experience || ''
  }
  const now = new Date().toISOString()
  const booking = {
    _id: newId('bkg'),
    bookingNumber: newBookingNumber(),
    customerId: user._id,
    customerName: info.fullName,
    customerEmail: info.email,
    customerPhone: info.phone,
    droneId: drone._id,
    droneName: drone.name,
    ownerId: drone.ownerId,
    shopName: drone.shopName,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    durationHours: q.durationHours,
    durationDays: q.durationDays,
    totalPrice: q.totalPrice,
    addonsTotal: q.addonsTotal,
    securityDeposit: q.securityDeposit,
    selectedAddons: q.selectedAddons,
    customerInfo: info,
    documents: (body.documents || []).filter((d) => d?.url).slice(0, 8).map((d) => ({ type: d.type || 'document', name: d.name || '', url: d.url })),
    bookingStatus: 'pending',
    paymentStatus: 'pending',
    rejectionReason: '',
    cancellationReason: '',
    notes: body.notes || '',
    statusHistory: [{ status: 'pending', at: now, by: user.name, note: 'Request submitted' }],
    createdAt: now,
    updatedAt: now
  }
  db().bookings.unshift(booking)
  persist()
  return ok({ booking: bookingOut(booking) }, 'Rental request submitted. You will be notified once it is approved.', 201)
}

function scopedBookings(user) {
  const all = db().bookings
  if (isAdmin(user)) return all
  if (isOwner(user)) return all.filter((b) => b.ownerId === user._id)
  return all.filter((b) => b.customerId === user._id)
}

function listBookings(ctx, q) {
  const user = requireUser(ctx)
  let list = scopedBookings(user)
  if (isAdmin(user) && q.customerId) list = list.filter((b) => b.customerId === q.customerId)
  if (isAdmin(user) && q.ownerId) list = list.filter((b) => b.ownerId === q.ownerId)
  if (q.droneId) list = list.filter((b) => b.droneId === q.droneId)
  const counts = list.reduce((acc, b) => ({ ...acc, [b.bookingStatus]: (acc[b.bookingStatus] || 0) + 1 }), {})

  if (q.status && !/^all$/i.test(q.status)) {
    const statuses = String(q.status).split(',').map((s) => s.trim().toLowerCase())
    list = list.filter((b) => statuses.includes(b.bookingStatus))
  }
  if (q.paymentStatus && q.paymentStatus !== 'all') list = list.filter((b) => b.paymentStatus === q.paymentStatus)
  if (q.search) list = list.filter((b) => matches(q.search, b.bookingNumber, b.customerName, b.customerEmail, b.droneName, b.shopName))

  list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const limit = Math.min(200, Math.max(1, parseInt(q.limit, 10) || 20))
  const page = Math.max(1, parseInt(q.page, 10) || 1)
  const total = list.length
  return ok({
    bookings: list.slice((page - 1) * limit, page * limit).map(bookingOut),
    counts,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page * limit < total }
  })
}

function getBookingRoute(ctx, id) {
  const user = requireUser(ctx)
  const b = findBooking(id)
  if (!b) throw httpError(404, `Booking '${id}' not found.`)
  if (b.customerId !== user._id && !canManage(b, user)) throw httpError(403, 'You do not have access to this booking.')
  return ok({ booking: bookingOut(b) }, 'Booking retrieved.')
}

function updateStatus(ctx, id, body) {
  const user = requireStaff(ctx)
  let next = String(body.status || '').trim().toLowerCase()
  if (next === 'confirmed') next = 'approved'
  const b = findBooking(id)
  if (!b) throw httpError(404, 'Booking not found.')
  if (!canManage(b, user)) throw httpError(403, 'You can only manage bookings for your own fleet.')
  if (!(TRANSITIONS[b.bookingStatus] || []).includes(next)) throw httpError(400, `A ${b.bookingStatus} booking cannot be changed to ${next}.`)

  const drone = db().drones.find((d) => d._id === b.droneId)
  if (next === 'approved') {
    const conflict = findConflict(b.droneId, new Date(b.startDate), new Date(b.endDate), b._id)
    if (conflict) throw httpError(409, `Cannot approve: it overlaps approved booking #${conflict.bookingNumber}.`)
  }
  const note = body.rejectionReason || body.note || ''
  if (next === 'rejected') b.rejectionReason = note
  if (next === 'cancelled') {
    b.cancellationReason = note || 'Cancelled by shop'
    if (b.paymentStatus === 'paid') b.paymentStatus = 'refunded'
  }
  if (next === 'active' && drone) Object.assign(drone, { status: 'rented', availability: 'Rented' })
  if (next === 'completed') {
    const otherActive = db().bookings.some((x) => x._id !== b._id && x.droneId === b.droneId && x.bookingStatus === 'active')
    if (drone && !otherActive && drone.status === 'rented') Object.assign(drone, { status: 'available', availability: 'Available' })
    if (b.paymentStatus === 'pending') b.paymentStatus = 'paid'
  }
  b.bookingStatus = next
  b.updatedAt = new Date().toISOString()
  b.statusHistory = [...(b.statusHistory || []), { status: next, at: b.updatedAt, by: user.name, note }]
  persist()
  return ok({ booking: bookingOut(b) }, `Booking #${b.bookingNumber} is now ${next}.`)
}

function updatePayment(ctx, id, body) {
  const user = requireStaff(ctx)
  const status = String(body.paymentStatus || '').toLowerCase()
  if (!['pending', 'paid', 'refunded', 'failed'].includes(status)) throw httpError(400, 'Invalid payment status.')
  const b = findBooking(id)
  if (!b) throw httpError(404, 'Booking not found.')
  if (!canManage(b, user)) throw httpError(403, 'You cannot manage this booking.')
  b.paymentStatus = status
  b.statusHistory = [...(b.statusHistory || []), { status: b.bookingStatus, at: new Date().toISOString(), by: user.name, note: `Payment marked ${status}` }]
  persist()
  return ok({ booking: bookingOut(b) }, `Payment marked as ${status}.`)
}

function cancelBooking(ctx, id, body) {
  const user = requireUser(ctx)
  const b = findBooking(id)
  if (!b) throw httpError(404, 'Booking not found.')
  if (b.customerId !== user._id && !canManage(b, user)) throw httpError(403, 'You cannot cancel this booking.')
  if (!['pending', 'approved', 'confirmed'].includes(b.bookingStatus)) {
    throw httpError(400, b.bookingStatus === 'active' ? 'This rental is in progress and cannot be cancelled. Please contact the shop.' : `A ${b.bookingStatus} booking cannot be cancelled.`)
  }
  const reason = body.reason || 'Cancelled by customer'
  b.bookingStatus = 'cancelled'
  b.cancellationReason = reason
  if (b.paymentStatus === 'paid') b.paymentStatus = 'refunded'
  b.statusHistory = [...(b.statusHistory || []), { status: 'cancelled', at: new Date().toISOString(), by: user.name, note: reason }]
  persist()
  return ok({ booking: bookingOut(b) }, `Booking #${b.bookingNumber} cancelled.`)
}

function analytics(ctx, q) {
  const user = requireStaff(ctx)
  const months = Math.min(24, Math.max(1, parseInt(q.months, 10) || 6))
  const bookings = scopedBookings(user)
  const drones = isAdmin(user) ? db().drones : db().drones.filter((d) => d.ownerId === user._id)
  const revenueList = bookings.filter((b) => REVENUE.includes(b.bookingStatus))

  const now = new Date()
  const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
  const monthly = Array.from({ length: months }, (_, i) => {
    const d = new Date(since.getFullYear(), since.getMonth() + i, 1)
    const inMonth = bookings.filter((b) => {
      const c = new Date(b.createdAt)
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
    })
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      bookings: inMonth.length,
      revenue: inMonth.filter((b) => REVENUE.includes(b.bookingStatus)).reduce((s, b) => s + b.totalPrice, 0)
    }
  })

  const byStatus = bookings.reduce((acc, b) => ({ ...acc, [b.bookingStatus]: (acc[b.bookingStatus] || 0) + 1 }), {})
  const fleet = drones.reduce((acc, d) => ({ ...acc, [d.status]: (acc[d.status] || 0) + 1 }), {})

  const top = {}
  revenueList.forEach((b) => {
    top[b.droneId] = top[b.droneId] || { id: b.droneId, name: b.droneName, bookings: 0, revenue: 0, days: 0 }
    top[b.droneId].bookings++
    top[b.droneId].revenue += b.totalPrice
    top[b.droneId].days += b.durationDays
  })
  const cat = {}
  revenueList.forEach((b) => {
    const c = db().drones.find((d) => d._id === b.droneId)?.category || 'Other'
    cat[c] = cat[c] || { category: c, revenue: 0, bookings: 0 }
    cat[c].revenue += b.totalPrice
    cat[c].bookings++
  })

  const decided = (byStatus.approved || 0) + (byStatus.active || 0) + (byStatus.completed || 0) + (byStatus.rejected || 0)
  const customers = isAdmin(user) ? db().users.filter((u) => u.role === 'customer').length : new Set(bookings.map((b) => b.customerId)).size

  return ok({
    totals: {
      revenue: revenueList.reduce((s, b) => s + b.totalPrice, 0),
      collected: revenueList.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalPrice, 0),
      rentalDays: revenueList.reduce((s, b) => s + b.durationDays, 0),
      bookings: bookings.length,
      pending: byStatus.pending || 0,
      active: byStatus.active || 0,
      completed: byStatus.completed || 0,
      customers,
      drones: drones.length,
      listedDrones: drones.filter((d) => d.isListed !== false).length,
      rentedDrones: fleet.rented || 0,
      approvalRate: decided ? Math.round(((decided - (byStatus.rejected || 0)) / decided) * 100) : 0,
      utilization: drones.length ? Math.round(((fleet.rented || 0) / drones.length) * 100) : 0
    },
    byStatus,
    fleet,
    monthly,
    topDrones: Object.values(top).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    byCategory: Object.values(cat).sort((a, b) => b.revenue - a.revenue),
    recentBookings: [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(bookingOut)
  }, 'Analytics computed.')
}

function listUsers(ctx, q) {
  requireAdmin(ctx)
  const role = q.role || 'customer'
  const roles = role === 'owner' || role === 'shop-owner' ? ['owner', 'shop-owner'] : role === 'all' ? null : [role]
  const users = db()
    .users.filter((u) => (!roles || roles.includes(u.role)) && matches(q.search, u.name, u.email, u.phone))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return ok({
    users: users.map((u) => {
      const mine = db().bookings.filter((b) => (u.role === 'customer' ? b.customerId : b.ownerId) === u._id)
      return {
        ...publicUser(u),
        bookings: mine.length,
        activeRentals: mine.filter((b) => b.bookingStatus === 'active').length,
        totalSpent: mine.filter((b) => REVENUE.includes(b.bookingStatus)).reduce((s, b) => s + b.totalPrice, 0),
        lastBookingAt: mine.length ? mine.map((b) => b.createdAt).sort().pop() : null
      }
    })
  }, 'Users retrieved.')
}

function setUserActive(ctx, id, body) {
  const admin = requireAdmin(ctx)
  if (id === admin._id) throw httpError(400, 'You cannot deactivate your own account.')
  const u = db().users.find((x) => x._id === id)
  if (!u) throw httpError(404, 'User not found.')
  u.isActive = Boolean(body.isActive)
  persist()
  return ok({ user: publicUser(u) }, `${u.name} is now ${u.isActive ? 'active' : 'deactivated'}.`)
}

function login(body) {
  const email = String(body.email || '').trim().toLowerCase()
  const u = db().users.find((x) => x.email.toLowerCase() === email)
  if (!u || u.password !== body.password) throw httpError(401, 'Invalid email or password.')
  if (u.isActive === false) throw httpError(403, 'Your account is currently deactivated. Please contact support.')
  const group = (r) => (r === 'owner' || r === 'shop-owner' ? 'owner' : r === 'admin' || r === 'super-admin' ? 'admin' : r)
  if (body.role && group(body.role) !== group(u.role)) {
    throw httpError(400, `Role mismatch: This account is registered as a '${u.role}'. Please select the matching role option.`)
  }
  return ok({ token: `local.${u._id}`, user: publicUser(u) }, 'Logged in successfully.')
}

function register(body) {
  const email = String(body.email || '').trim().toLowerCase()
  if (!body.name || String(body.name).trim().length < 2) throw httpError(400, 'Full name is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, 'Please provide a valid email address.')
  if (!body.password || body.password.length < 6) throw httpError(400, 'Password must be at least 6 characters long.')
  if (body.role === 'admin' || body.role === 'super-admin') throw httpError(403, 'Administrator accounts cannot be created via public registration.')
  if (db().users.some((u) => u.email.toLowerCase() === email)) throw httpError(409, 'An account with this email address already exists.')
  const u = {
    _id: newId('u'),
    name: String(body.name).trim(),
    email,
    password: body.password,
    phone: body.phone || '',
    role: body.role === 'shop-owner' || body.role === 'owner' ? 'shop-owner' : 'customer',
    isActive: true,
    createdAt: new Date().toISOString()
  }
  db().users.push(u)
  persist()
  return ok({ token: `local.${u._id}`, user: publicUser(u) }, 'Account created successfully.', 201)
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const ROUTES = [
  ['GET', /^\/health$/, () => ok({ service: 'DroneHub (in-browser)', database: { status: 'local', connected: false } }, 'Running without the server')],
  ['POST', /^\/auth\/login$/, (ctx) => login(ctx.body)],
  ['POST', /^\/auth\/register$/, (ctx) => register(ctx.body)],
  ['GET', /^\/auth\/me$/, (ctx) => ok({ user: publicUser(requireUser(ctx)) })],
  ['POST', /^\/auth\/logout$/, () => ok(null, 'Logged out.')],

  ['GET', /^\/drones$/, (ctx) => listDrones(ctx, ctx.query)],
  ['POST', /^\/drones$/, (ctx) => saveDrone(ctx, ctx.body, null)],
  ['GET', /^\/drones\/([^/]+)\/availability$/, (ctx, id) => availability(id)],
  ['GET', /^\/drones\/([^/]+)$/, (ctx, id) => ok({ drone: droneOut(getDrone(id)) }, 'Drone details retrieved successfully.')],
  ['PUT', /^\/drones\/([^/]+)$/, (ctx, id) => saveDrone(ctx, ctx.body, getDrone(id))],
  ['DELETE', /^\/drones\/([^/]+)$/, (ctx, id) => deleteDrone(ctx, id)],

  ['POST', /^\/bookings\/quote$/, (ctx) => quote(ctx, ctx.body)],
  ['POST', /^\/bookings$/, (ctx) => createBooking(ctx, ctx.body)],
  ['GET', /^\/bookings$/, (ctx) => listBookings(ctx, ctx.query)],
  ['GET', /^\/bookings\/([^/]+)$/, (ctx, id) => getBookingRoute(ctx, id)],
  ['PATCH', /^\/bookings\/([^/]+)\/status$/, (ctx, id) => updateStatus(ctx, id, ctx.body)],
  ['PATCH', /^\/bookings\/([^/]+)\/payment$/, (ctx, id) => updatePayment(ctx, id, ctx.body)],
  ['PATCH', /^\/bookings\/([^/]+)\/cancel$/, (ctx, id) => cancelBooking(ctx, id, ctx.body)],

  ['POST', /^\/uploads$/, (ctx) => handleUpload(ctx, ctx.rawBody)],

  ['GET', /^\/admin\/analytics$/, (ctx) => analytics(ctx, ctx.query)],
  ['GET', /^\/admin\/users$/, (ctx) => listUsers(ctx, ctx.query)],
  ['PATCH', /^\/admin\/users\/([^/]+)\/status$/, (ctx, id) => setUserActive(ctx, id, ctx.body)]
]

/**
 * Handle one API request locally.
 * Returns { status, body } like an HTTP response; throws errors with `.status` for failures.
 */
export async function handleLocalRequest({ method = 'GET', url = '', params, data, headers }) {
  const [path, qs = ''] = url.split('?')
  const query = { ...Object.fromEntries(new URLSearchParams(qs)), ...(params || {}) }
  Object.keys(query).forEach((k) => query[k] === undefined && delete query[k])

  let body = data
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      /* not JSON */
    }
  }
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData

  const ctx = { query, body: isForm ? {} : body || {}, rawBody: data, user: currentUser(headers) }
  const verb = method.toUpperCase()

  for (const [m, pattern, handler] of ROUTES) {
    if (m !== verb) continue
    const match = path.match(pattern)
    if (match) return handler(ctx, ...match.slice(1).map(decodeURIComponent))
  }
  throw httpError(404, `${verb} ${path} is not available without the server.`)
}

export default handleLocalRequest
