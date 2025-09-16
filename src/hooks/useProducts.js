import { useEffect, useState } from 'react'
import { subscribeToProducts } from '../services/productsService'

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToProducts((list) => {
      setProducts(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { products, loading }
}
