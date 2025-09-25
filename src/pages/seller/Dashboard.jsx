import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FaPlus, FaBox, FaChartLine, FaBoxes, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaDownload, FaSearch } from 'react-icons/fa'
import { useToast } from '../../contexts/ToastContext'
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
  const { show } = useToast()
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, remaining: 0 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [viewing, setViewing] = useState(null)

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

  const categories = useMemo(() => {
    const set = new Set()
    products.forEach(p => { if (p.category) set.add(p.category) })
    return Array.from(set)
  }, [products])

  const filteredAndSorted = useMemo(() => {
    let list = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      )
    }
    if (category !== 'all') {
      list = list.filter(p => (p.category || '') === category)
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'out') list = list.filter(p => (p.quantity || 0) <= 0)
      else list = list.filter(p => (p.status || 'active') === statusFilter)
    }
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      const av = sortBy === 'price' ? (a.price || 0)
        : sortBy === 'sales' ? (a.sales || 0)
        : sortBy === 'stock' ? (a.quantity || 0)
        : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0)
      const bv = sortBy === 'price' ? (b.price || 0)
        : sortBy === 'sales' ? (b.sales || 0)
        : sortBy === 'stock' ? (b.quantity || 0)
        : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0)
      if (av === bv) return 0
      return av > bv ? dir : -dir
    })
    return list
  }, [products, search, category, statusFilter, sortBy, sortDir])

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const totalProducts = filteredAndSorted.length
    const totalSales = filteredAndSorted.reduce((sum, p) => sum + (p.sales || 0), 0)
    const totalStock = filteredAndSorted.reduce((sum, p) => sum + (p.quantity || 0), 0)
    const remaining = Math.max(totalStock - totalSales, 0)
    return { totalProducts, totalSales, remaining }
  }, [filteredAndSorted])

  async function handleDelete(productId) {
    if (!confirm('Delete this product permanently?')) return
    try {
      await deleteDoc(doc(db, 'products', productId))
      show('Product deleted')
    } catch (err) {
      show(err.message || 'Failed to delete', 'error')
    }
  }

  async function handleToggleStatus(p) {
    const next = (p.status || 'active') === 'active' ? 'inactive' : 'active'
    try {
      await updateDoc(doc(db, 'products', p.id), { status: next })
      show(`Status set to ${next}`)
    } catch (err) {
      show(err.message || 'Failed to update status', 'error')
    }
  }

  function exportCsv() {
    const headers = ['id','name','category','price','quantity','sales','status','createdAt']
    const rows = filteredAndSorted.map(p => [
      p.id,
      JSON.stringify(p.name || ''),
      JSON.stringify(p.category || ''),
      p.price ?? '',
      p.quantity ?? '',
      p.sales ?? '',
      p.status || 'active',
      p.createdAt?.toDate ? p.createdAt.toDate().toISOString() : ''
    ].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-aos="fade-right">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2" data-aos="fade-right" data-aos-delay="100">Manage your products and track your business</p>
          </div>
          <Link 
            to="/seller/add" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
            data-aos="fade-left" 
            data-aos-delay="200"
          >
            <FaPlus />
            Add New Product
          </Link>
        </div>

        {/* Controls + Stats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-orange-500 text-lg">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out">Out of stock</option>
                </select>
                <div className="flex items-center gap-2">
                  <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
                    <option value="createdAt">Newest</option>
                    <option value="sales">Sales</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                  </select>
                  <button onClick={()=>setSortDir(d=> d==='asc'?'desc':'asc')} className="px-3 py-2 border border-gray-300 rounded-lg">
                    {sortDir === 'asc' ? 'Asc' : 'Desc'}
                  </button>
                </div>
                <button onClick={exportCsv} className="inline-flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <FaDownload />
                  Export CSV
                </button>
              </div>
              {(search.trim() || category !== 'all' || statusFilter !== 'all') && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {filteredStats.totalProducts} of {stats.totalProducts} products
                    {search.trim() && <span className="ml-2 text-orange-600">• Search: "{search}"</span>}
                    {category !== 'all' && <span className="ml-2 text-blue-600">• Category: {category}</span>}
                    {statusFilter !== 'all' && <span className="ml-2 text-green-600">• Status: {statusFilter}</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" data-aos="zoom-in" data-aos-delay="100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-2xl text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Products</div>
                    <div className="text-3xl font-bold text-gray-900">{filteredStats.totalProducts}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" data-aos="zoom-in" data-aos-delay="200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                    <div className="text-3xl font-bold text-gray-900">{filteredStats.totalSales}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" data-aos="zoom-in" data-aos-delay="300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaBoxes className="text-2xl text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Remaining Stock</div>
                    <div className="text-3xl font-bold text-gray-900">{filteredStats.remaining}</div>
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
                    labels: filteredAndSorted.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Sales',
                      data: filteredAndSorted.map(p => p.sales || 0),
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
                    labels: filteredAndSorted.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Stock',
                      data: filteredAndSorted.map(p => Math.max((p.quantity || 0) - (p.sales || 0), 0)),
                      backgroundColor: filteredAndSorted.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 55%)`)
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sales Trend</h3>
                <Line
                  data={{
                    labels: filteredAndSorted.map(p => p.name || p.id),
                    datasets: [{
                      label: 'Cumulative Sales',
                      data: filteredAndSorted.map((p, idx) => filteredAndSorted.slice(0, idx + 1).reduce((s, it) => s + (it.sales || 0), 0)),
                      borderColor: 'rgba(34,197,94,0.9)',
                      backgroundColor: 'rgba(34,197,94,0.2)',
                      tension: 0.3
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>

            {/* Products Section */
            }
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
                      {filteredAndSorted.map((product) => {
                        const remaining = product.quantity || 0
                        const low = remaining > 0 && remaining <= 5
                        return (
                        <tr key={product.id} className={`hover:bg-gray-50 ${low ? 'bg-yellow-50' : ''}`}>
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
                                <div className="text-xs text-gray-400">{product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center gap-2">
                              {remaining}
                              {low && <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-800">Low</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.sales || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (product.status || 'active') === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                            }`}>
                              {(product.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1" onClick={()=>setViewing(product)} title="View details"><FaEye /></button>
                              <Link 
                                to={`/seller/edit/${product.id}`} 
                                className="text-orange-600 hover:text-orange-900 p-1"
                              >
                                <FaEdit />
                              </Link>
                              <button onClick={()=>handleToggleStatus(product)} className="text-gray-700 hover:text-gray-900 p-1" title="Toggle status">
                                {(product.status || 'active') === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                              </button>
                              <button onClick={()=>handleDelete(product.id)} className="text-red-600 hover:text-red-900 p-1" title="Delete"><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* View Modal */}
            {viewing && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
                  <div className="relative">
                    <img src={viewing.imageUrl} alt={viewing.name} className="h-64 w-full object-cover" />
                    <button onClick={()=>setViewing(null)} className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full px-3 py-1">✕</button>
                  </div>
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{viewing.name}</div>
                      <div className="text-orange-600 font-semibold mb-3">₹{viewing.price}</div>
                      <div className="text-gray-700 whitespace-pre-line mb-4">{viewing.description}</div>
                      <div className="text-sm text-gray-600">Category: <span className="font-medium text-gray-800">{viewing.category || '-'}</span></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Stock</span><span className="font-medium">{viewing.quantity || 0}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Sales</span><span className="font-medium">{viewing.sales || 0}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Status</span><span className="font-medium">{(viewing.status || 'active')}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">UPI ID</span><span className="font-medium">{viewing.upiId || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Phone</span><span className="font-medium">{viewing.phone || '-'}</span></div>
                      <div className="text-gray-600">Address</div>
                      <div className="font-medium">{viewing.address || '-'}</div>
                      <div className="text-gray-600">Created</div>
                      <div className="font-medium">{viewing.createdAt?.toDate ? viewing.createdAt.toDate().toLocaleString() : '-'}</div>
                    </div>
                  </div>
                  <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={()=>setViewing(null)} className="px-4 py-2 rounded-lg border border-gray-300">Close</button>
                    <Link to={`/seller/edit/${viewing.id}`} className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Edit</Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}