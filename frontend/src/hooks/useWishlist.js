import { useCallback, useEffect, useState } from 'react'

const KEY = 'dronehub_wishlist'
const EVENT = 'dronehub:wishlist'

const read = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(ids) ? ids.map(String) : []
  } catch {
    return []
  }
}

/** Wishlist of drone ids, saved in this browser and shared across components. */
export function useWishlist() {
  const [ids, setIds] = useState(read)

  useEffect(() => {
    const sync = () => setIds(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((id) => {
    const key = String(id)
    const current = read()
    const next = current.includes(key) ? current.filter((x) => x !== key) : [...current, key]
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const has = useCallback((id) => ids.includes(String(id)), [ids])

  return { ids, has, toggle }
}

export default useWishlist
