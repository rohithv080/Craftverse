import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, remaining: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'products'), where('sellerId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      let total = 0
      let sales = 0
      snap.forEach(doc => {
        const d = doc.data()
        total += (d.quantity || 0)
        sales += (d.sales || 0)
      })
      setStats({ totalProducts: snap.size, totalSales: sales, remaining: Math.max(total - sales, 0) })
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Seller Dashboard</h1>
          <Link to="/seller/add" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Add Product</Link>
        </div>
        {loading ? (
          <div className="text-purple-600">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-purple-50">
              <div className="text-sm text-gray-600">Products</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
            </div>
            <div className="border rounded-lg p-4 bg-purple-50">
              <div className="text-sm text-gray-600">Total Sales</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSales}</div>
            </div>
            <div className="border rounded-lg p-4 bg-purple-50">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="text-3xl font-bold text-gray-900">{stats.remaining}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


