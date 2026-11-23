import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import droneService from '../../services/droneService'
import DroneCard from '../../components/DroneCard'
import { useWishlist } from '../../hooks/useWishlist'
import { Button, Card, PageHeader, Empty, Spinner, ErrorNote } from '../../components/manage/ui'
import { normalizeDrone } from '../../lib/format'

/** Drones the customer saved with the heart button. */
function CustomerWishlist() {
  const { ids } = useWishlist()
  const [drones, setDrones] = useState(null)
  const [error, setError] = useState(null)

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

  const saved = useMemo(() => (drones || []).filter((d) => ids.includes(String(d._id))), [drones, ids])

  return (
    <>
      <PageHeader title="Wishlist" description="Drones you've saved for later." />
      <ErrorNote>{error}</ErrorNote>
      {!drones && !error ? (
        <Spinner />
      ) : saved.length === 0 ? (
        <Card>
          <Empty
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any drone to keep it here."
            action={<Link to="/drones"><Button variant="primary">Browse drones</Button></Link>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {saved.map((d) => <DroneCard key={d._id} drone={d} />)}
        </div>
      )}
    </>
  )
}

export default CustomerWishlist
