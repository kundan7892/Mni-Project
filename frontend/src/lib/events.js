export const BOOKINGS_CHANGED_EVENT = 'dronehub:bookings-changed'

/** Notify listeners (e.g. the sidebar's pending badge) that booking data changed. */
export const notifyBookingsChanged = () => window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT))
