import { useEffect, useMemo, useState } from 'react'
import useProducts from '../../hooks/useProducts'
import { Link } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaEye, FaMapMarkerAlt, FaTruck, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'

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
  const { items, addToCart, wishlist, addToWishlist, removeFromWishlist } = useCart()
  const { products } = useProducts()
  const [center, setCenter] = useState(null)
  const [active, setActive] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // products come from useProducts

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

      {/* Amazon-style Search and Filters */}
      <div id="products" className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-r-md hover:bg-orange-600 transition-colors">
              Search
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-600 font-medium">Filters:</span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Prices</option>
              <option value="0-500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="2000-">Above ₹2000</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Results:</span>
              <span className="font-medium text-orange-600">{visible.length} products</span>
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
                      onClick={() => {
                        const isInWishlist = wishlist.find(item => item.id === p.id)
                        if (isInWishlist) {
                          removeFromWishlist(p.id)
                        } else {
                          addToWishlist(p)
                        }
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <FaHeart
                        className={`transition-colors ${
                          wishlist.find(item => item.id === p.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
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
        
      </div>

      {/* Product Modal */}
      {active && <ProductModal product={active} onClose={() => setActive(null)} />}
    </div>
  )
}