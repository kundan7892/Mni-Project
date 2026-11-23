export const formatINR = (value) =>
  `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;

export const formatDate = (value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', opts);
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/** Bookings store an exclusive end (midnight after the last day); show the last rental day. */
export const lastRentalDay = (endDate) => {
  if (!endDate) return null;
  return new Date(new Date(endDate).getTime() - 1);
};

export const formatRange = (startDate, endDate) => {
  const end = lastRentalDay(endDate);
  const s = formatDate(startDate, { day: 'numeric', month: 'short' });
  const e = formatDate(end, { day: 'numeric', month: 'short', year: 'numeric' });
  return s === formatDate(end, { day: 'numeric', month: 'short' }) ? e : `${s} – ${e}`;
};

export const timeAgo = (value) => {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

/** Local-midnight ISO strings for a YYYY-MM-DD start and an inclusive YYYY-MM-DD end. */
export const toRentalRange = (startDay, endDay) => {
  const [sy, sm, sd] = startDay.split('-').map(Number);
  const [ey, em, ed] = endDay.split('-').map(Number);
  return {
    startDate: new Date(sy, sm - 1, sd).toISOString(),
    endDate: new Date(ey, em - 1, ed + 1).toISOString()
  };
};

export const toInputDate = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const BOOKING_STATUS = {
  pending: { label: 'Awaiting approval', short: 'Pending', tone: 'amber' },
  approved: { label: 'Confirmed', short: 'Confirmed', tone: 'accent' },
  confirmed: { label: 'Confirmed', short: 'Confirmed', tone: 'accent' },
  active: { label: 'With customer', short: 'Active', tone: 'emerald' },
  completed: { label: 'Returned', short: 'Completed', tone: 'neutral' },
  rejected: { label: 'Declined', short: 'Declined', tone: 'rose' },
  cancelled: { label: 'Cancelled', short: 'Cancelled', tone: 'neutral' }
};

export const PAYMENT_STATUS = {
  pending: { label: 'Unpaid', tone: 'amber' },
  paid: { label: 'Paid', tone: 'emerald' },
  refunded: { label: 'Refunded', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'rose' }
};

export const DRONE_STATUS = {
  available: { label: 'Available', tone: 'emerald' },
  rented: { label: 'Rented out', tone: 'accent' },
  maintenance: { label: 'Maintenance', tone: 'amber' },
  offline: { label: 'Offline', tone: 'neutral' }
};

/** Normalises a drone document from the API for catalogue / marketplace views. */
export const normalizeDrone = (d) => {
  if (!d) return null;
  const status = (d.status || 'available').toLowerCase();
  const images = [d.image, ...(d.images || [])].filter((u, i, arr) => u && arr.indexOf(u) === i);
  return {
    ...d,
    id: d._id || d.id,
    _id: d._id || d.id,
    status,
    images,
    image: images[0] || '',
    pricePerDay: d.pricePerDay || 0,
    pricePerHour: d.pricePerHour || 0,
    securityDeposit: d.securityDeposit ?? 0,
    rating: d.rating ?? 0,
    reviews: d.reviews ?? 0,
    camera: d.specifications?.camera || d.camera || '',
    flightTime: Number(d.specifications?.flightTime || d.flightTime || 0),
    gps: d.specifications?.gps ?? d.gps ?? true,
    availability:
      status === 'available' ? 'Available' : status === 'rented' ? 'Currently Rented' : status === 'maintenance' ? 'Maintenance' : 'Offline',
    isListed: d.isListed !== false
  };
};
