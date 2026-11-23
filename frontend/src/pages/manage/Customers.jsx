import React, { useCallback, useEffect, useState } from 'react'
import { Users, Search } from 'lucide-react'
import adminService from '../../services/adminService'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote, inputClass } from '../../components/manage/ui'
import { Badge } from '../../components/manage/Badge'
import { formatINR, formatDate, timeAgo } from '../../lib/format'

/** Registered customers with their rental totals (admin only). */
function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await adminService.getUsers({ role: 'customer', search: query }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (u) => {
    setBusyId(u._id)
    setError(null)
    try {
      const updated = await adminService.setUserActive(u._id, !u.isActive)
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, isActive: updated.isActive } : x)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has signed up, with their rental history." />
      <ErrorNote>{error}</ErrorNote>

      <Card>
        <div className="p-4 border-b border-line">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputClass} pl-9`} placeholder="Search name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <Empty icon={Users} title="No customers found" description={query ? 'Try a different search.' : 'Customers appear here after they sign up.'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-subtle border-b border-line">
                  <th className="font-medium px-4 py-2.5">Customer</th>
                  <th className="font-medium px-4 py-2.5">Phone</th>
                  <th className="font-medium px-4 py-2.5 text-right">Rentals</th>
                  <th className="font-medium px-4 py-2.5 text-right">Spent</th>
                  <th className="font-medium px-4 py-2.5">Last booking</th>
                  <th className="font-medium px-4 py-2.5">Joined</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-fg">
                        {u.name}
                        {!u.isActive && <Badge tone="rose">Deactivated</Badge>}
                        {u.activeRentals > 0 && <Badge tone="emerald">Renting now</Badge>}
                      </div>
                      <div className="text-xs text-subtle">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-right text-fg-muted tabular-nums">{u.bookings}</td>
                    <td className="px-4 py-3 text-right text-fg tabular-nums">{formatINR(u.totalSpent)}</td>
                    <td className="px-4 py-3 text-fg-muted">{u.lastBookingAt ? timeAgo(u.lastBookingAt) : '—'}</td>
                    <td className="px-4 py-3 text-fg-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={u.isActive ? 'danger-ghost' : 'ghost'} loading={busyId === u._id} onClick={() => toggle(u)}>
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}

export default Customers
