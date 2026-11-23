import React, { useCallback, useEffect, useState } from 'react'
import { Inbox, FileText, RefreshCw } from 'lucide-react'
import bookingService from '../../services/bookingService'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote } from '../../components/manage/ui'
import BookingDetail from '../../components/manage/BookingDetail'
import { formatINR, formatRange, timeAgo } from '../../lib/format'
import { notifyBookingsChanged } from '../../lib/events'

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

/** Pending rental requests waiting for a decision (admin: all shops, owner: own fleet). */
function RentalRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingService.getBookings({ status: 'pending', limit: 100 })
      // Oldest first: requests that have waited longest come first
      setRequests([...(res?.bookings || [])].reverse())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const removeIfDecided = (updated) => {
    if (updated.bookingStatus !== 'pending') {
      setRequests((list) => list.filter((b) => b._id !== updated._id))
      setSelected(null)
    }
  }

  const quickApprove = async (booking) => {
    setBusyId(booking._id)
    setError(null)
    try {
      const updated = await bookingService.updateBookingStatus(booking._id, 'approved')
      removeIfDecided(updated)
      notifyBookingsChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Rental requests"
        description="Approve or decline requests from customers. Approved dates are blocked for everyone else."
        actions={
          <Button variant="ghost" onClick={load}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        }
      />

      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <Card>
          <Empty icon={Inbox} title="No pending requests" description="New rental requests from customers will show up here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((b) => {
            const drone = typeof b.droneId === 'object' ? b.droneId : null
            return (
              <Card key={b._id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <button type="button" onClick={() => setSelected(b)} className="flex items-center gap-4 flex-1 min-w-0 text-left cursor-pointer">
                  {drone?.image ? (
                    <img src={drone.image} alt="" className="w-16 h-14 rounded-lg object-cover bg-surface-2 shrink-0" />
                  ) : (
                    <div className="w-16 h-14 rounded-lg bg-surface-2 shrink-0" />
                  )}
                  <div className="min-w-0 space-y-1">
                    <div className="text-sm text-fg">
                      <span className="font-medium">{b.customerName}</span>
                      <span className="text-muted"> wants </span>
                      <span className="font-medium">{b.droneName}</span>
                    </div>
                    <div className="text-sm text-muted">
                      {formatRange(b.startDate, b.endDate)} · {plural(b.durationDays, 'day')} · {formatINR(b.totalPrice)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-subtle">
                      <span>{b.bookingNumber}</span>
                      <span>{timeAgo(b.createdAt)}</span>
                      {(b.documents || []).length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {plural(b.documents.length, 'document')}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" onClick={() => setSelected(b)}>Review</Button>
                  <Button variant="primary" loading={busyId === b._id} onClick={() => quickApprove(b)}>Approve</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} onChange={removeIfDecided} />}
    </>
  )
}

export default RentalRequests
