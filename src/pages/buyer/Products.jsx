import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaEye, FaMapMarkerAlt, FaTruck, FaShieldAlt, FaUsers } from 'react-icons/fa'

function distanceKm(a, b) {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return Infinity
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - b.lng) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180
  const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2
  const d = 2 * R * Math.asin(Math.min(1, Math.sqrt(x)))
  return d
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [center, setCenter] = useState(null)
  const [active, setActive] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')

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
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Price filtering
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max
        } else {
          return p.price >= min
        }
      })
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for relevance
        break
    }

    return filtered
  }, [products, searchTerm, sortBy, priceRange])

  const generateRating = () => {
    return (Math.random() * 2 + 3).toFixed(1) // Random rating between 3.0-5.0
  }

  const generateReviews = () => {
    return Math.floor(Math.random() * 1000) + 50 // Random reviews between 50-1050
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Website Introduction */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to KAITHIRAN</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your trusted local marketplace connecting buyers and sellers in your community. 
              Discover amazing products from local businesses and support your local economy.
            </p>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-orange-200" />
                <h3 className="text-lg font-semibold mb-2">Local Products</h3>
                <p className="text-orange-100">Find products from sellers in your area</p>
              </div>
              <div className="text-center">
                <FaTruck className="text-4xl mx-auto mb-4 text-orange-200" />
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-orange-100">Quick local delivery and pickup options</p>
              </div>
              <div className="text-center">
                <FaShieldAlt className="text-4xl mx-auto mb-4 text-orange-200" />
                <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                <p className="text-orange-100">Secure transactions and verified sellers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse Products</h2>
            <div className="flex items-center gap-4">
              <Link to="/buyer/cart" className="relative">
                <FaShoppingCart className="text-2xl text-gray-700 hover:text-orange-500 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-">Above ₹2000</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {visible.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visible.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                {/* Product Image */}
                <div className="relative">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  {p.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {p.discount}% OFF
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600">{generateRating()}</span>
                      <span className="text-xs text-gray-400">({generateReviews()})</span>
                    </div>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                    {p.discount && (
                      <span className="text-sm text-green-600 font-medium">{p.discount}% off</span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActive(p)} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>
                    <Link 
                      to={`/buyer/checkout`} 
                      state={{ product: p }} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                      <FaShoppingCart className="text-sm" />
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Results Count */}
        <div className="mt-8 text-center text-gray-500">
          Showing {visible.length} of {products.length} products
        </div>
      </div>

      {/* Product Modal */}
      {active && <ProductModal product={active} onClose={() => setActive(null)} />}
    </div>
  )
}


