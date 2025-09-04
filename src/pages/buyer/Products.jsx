import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'
import heroImg from '../../assets/react.svg'
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaEye, FaMapMarkerAlt, FaTruck, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { useCart } from "../../contexts/CartContext";

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
  const { items, addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [center, setCenter] = useState(null)
  const [active, setActive] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brown-50 to-brown-70 text-white h-full">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
                Welcome to <span className="text-orange-900">KAITHIRAN</span>
              </h1>
              <p className="text-black text-lg mb-6 opacity-90">
                Your trusted local marketplace connecting buyers and sellers nearby. 
                Discover curated products, support local businesses, and enjoy fast, reliable delivery.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FaTruck className="text-orange-900" />
                  <span className="text-sm text-orange-900">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FaShieldAlt className="text-orange-900" />
                  <span className="text-sm text-orange-900">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FaUsers className="text-orange-900" />
                  <span className="text-sm text-orange-900">Local Sellers</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#products" className="inline-flex items-center justify-center px-6 py-3 bg-orange-900 text-white font-medium rounded-lg shadow hover:bg-gray-100 transition">
                  Shop Now
                </a>
                <button className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
                  <img src={heroImg} alt="Marketplace visual" className="w-full h-64 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div id="products" className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Browse Products</h2>
            
            <div className="flex items-center gap-4">
              <Link to="/buyer/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <FaShoppingCart className="text-xl text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              </Link>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
            
            <div className={`${isFilterOpen ? 'flex' : 'hidden'} md:flex gap-3 flex-col md:flex-row`}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
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
          <div className="text-center py-16">
            <div className="text-gray-500 text-xl mb-2">No products found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => addToCart(p, 1)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <FaHeart className="text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  {p.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {p.discount}% OFF
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    <FaMapMarkerAlt className="inline mr-1" /> Nearby
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-sm ${
                              i < Math.floor(parseFloat(generateRating())) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">{generateRating()}</span>
                      <span className="text-xs text-gray-400 ml-1">({generateReviews()})</span>
                    </div>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{p.price?.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{p.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                    {p.discount && (
                      <span className="text-xs text-green-600 font-medium">You save ₹{(p.originalPrice - p.price)?.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActive(p)} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>
                    <button 
                      onClick={() => addToCart(p, 1)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                      <FaShoppingCart className="text-sm" />
                      Add to Cart
                    </button>
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