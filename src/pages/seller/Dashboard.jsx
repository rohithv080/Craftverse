import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FaPlus, FaBox, FaChartLine, FaBoxes, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
// Charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function SellerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, remaining: 0 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'products'), where('sellerId', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const productList = []
      let total = 0
      let sales = 0
      snap.forEach(doc => {
        const d = doc.data()
        productList.push({ id: doc.id, ...d })
        total += (d.quantity || 0)
        sales += (d.sales || 0)
      })
      setProducts(productList)
      setStats({ totalProducts: snap.size, totalSales: sales, remaining: Math.max(total - sales, 0) })
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products and track your business</p>
          </div>
          <Link 
            to="/seller/add" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            <FaPlus />
            Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-orange-500 text-lg">Loading dashboard...</div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-2xl text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Products</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalSales}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaBoxes className="text-2xl text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Remaining Stock</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.remaining}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sales by Product</h3>
                <Bar
                  data={{
                    labels: products.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Sales',
                      data: products.map(p => p.sales || 0),
                      backgroundColor: 'rgba(34,197,94,0.6)'
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { ticks: { maxRotation: 45, minRotation: 0 } } }
                  }}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Stock Distribution</h3>
                <Doughnut
                  data={{
                    labels: products.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Stock',
                      data: products.map(p => Math.max((p.quantity || 0) - (p.sales || 0), 0)),
                      backgroundColor: products.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 55%)`)
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sales Trend</h3>
                <Line
                  data={{
                    labels: products.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Cumulative Sales',
                      data: products.map((p, idx) => products.slice(0, idx + 1).reduce((s, it) => s + (it.sales || 0), 0)),
                      borderColor: 'rgba(34,197,94,0.9)',
                      backgroundColor: 'rgba(34,197,94,0.2)',
                      tension: 0.3
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your product listings</p>
              </div>
              
              {products.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <div className="text-gray-500 text-lg mb-4">No products yet</div>
                  <div className="text-gray-400 mb-6">Start by adding your first product to the marketplace</div>
                  <Link 
                    to="/seller/add" 
                    className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-12 h-12 rounded-lg object-cover mr-4" 
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.quantity || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.sales || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (product.quantity || 0) > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(product.quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <FaEye />
                              </button>
                              <Link 
                                to={`/seller/edit/${product.id}`} 
                                className="text-orange-600 hover:text-orange-900 p-1"
                              >
                                <FaEdit />
                              </Link>
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}