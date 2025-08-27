import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'

function distanceKm(a, b) {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return Infinity
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180
  const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2
  const d = 2 * R * Math.asin(Math.min(1, Math.sqrt(x)))
  return d
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [center, setCenter] = useState(null)
  const [radiusKm, setRadiusKm] = useState(20)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setProducts(list)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }, [])

  const visible = useMemo(() => {
    if (!center) return products
    return products.filter(p => distanceKm(center, p.location) <= radiusKm)
  }, [products, center, radiusKm])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Products Nearby</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Radius</span>
            <select value={radiusKm} onChange={(e)=>setRadiusKm(Number(e.target.value))} className="border rounded-md px-2 py-1">
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
            </select>
            <Link to="/buyer/cart" className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Cart</Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visible.map(p => (
            <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white">
              <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold text-gray-900">{p.name}</div>
                <div className="text-purple-700 font-bold">₹{p.price}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>setActive(p)} className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-md">View</button>
                  <Link to={`/buyer/checkout`} state={{ product: p }} className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md">Buy Now</Link>
                </div>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="col-span-full text-gray-600">No products within selected radius.</div>
          )}
        </div>
        {active && <ProductModal product={active} onClose={()=>setActive(null)} />}
      </div>
    </div>
  )
}


