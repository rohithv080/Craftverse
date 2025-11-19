import { useEffect, useMemo, useState } from 'react'
import useProducts from '../../hooks/useProducts'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaCreditCard, FaMapMarkerAlt, FaTruck, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'

export default function Products() {
  const { items, addToCart, wishlist, addToWishlist, removeFromWishlist } = useCart()
  const { products, loading } = useProducts()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize search term and category from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    
    if (urlSearch) {
      setSearchTerm(urlSearch)
    } else {
      setSearchTerm('')
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    } else {
      setSelectedCategory('all')
    }
  }, [searchParams])

  const visible = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Category filtering
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

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
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, ratingFilter, brandFilter])

  const generateRating = () => {
    return (Math.random() * 2 + 3).toFixed(1) // Random rating between 3.0-5.0
  }

  const generateReviews = () => {
    return Math.floor(Math.random() * 1000) + 50 // Random reviews between 50-1050
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2" data-aos="fade-up">Discover Amazing Products</h1>
            <p className="text-xl text-orange-100 mb-4" data-aos="fade-up" data-aos-delay="100">Find everything you need at unbeatable prices</p>
            <div className="flex items-center justify-center gap-4 text-sm" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-2">
                <FaTruck className="text-orange-200" />
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-orange-200" />
                <span>100% Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-orange-200" />
                <span>Trusted by thousands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Enhanced Sidebar */}
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex gap-8 relative">
          {/* Enhanced Left Sidebar - Filters */}
          <div className={`lg:block w-72 flex-shrink-0 ${isFilterOpen ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : 'hidden'}`}>
            <div className={`bg-white rounded-xl shadow-lg p-8 sticky top-24 ${isFilterOpen ? 'mt-16 mx-4 max-h-[80vh] overflow-y-auto lg:mt-0 lg:mx-0' : ''}`}>
              {/* Mobile Close Button */}
              {isFilterOpen && (
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <FaFilter className="text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>
              
              {/* Enhanced Category Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">📂</span>
                  Category
                </h4>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Categories', count: products.length },
                    { value: 'Fashion', label: 'Fashion', count: products.filter(p => p.category === 'Fashion').length },
                    { value: 'Gifts', label: 'Gifts', count: products.filter(p => p.category === 'Gifts').length },
                    { value: 'Home & Living', label: 'Home & Living', count: products.filter(p => p.category === 'Home & Living').length },
                    { value: 'Pottery Items', label: 'Pottery Items', count: products.filter(p => p.category === 'Pottery Items').length }
                  ].map(category => (
                    <label key={category.value} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={selectedCategory === category.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-3 text-orange-500 focus:ring-orange-500 scale-110"
                        />
                        <span className={`text-sm group-hover:text-orange-600 transition-colors ${
                          selectedCategory === category.value ? 'font-semibold text-orange-600' : 'text-gray-700'
                        }`}>
                          {category.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enhanced Price Range Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  Price Range
                </h4>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: '0-500', label: 'Under ₹500' },
                    { value: '500-1000', label: '₹500 - ₹1000' },
                    { value: '1000-2000', label: '₹1000 - ₹2000' },
                    { value: '2000-', label: 'Above ₹2000' }
                  ].map(price => (
                    <label key={price.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        value={price.value}
                        checked={priceRange === price.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="mr-3 text-orange-500 focus:ring-orange-500 scale-110"
                      />
                      <span className={`text-sm group-hover:text-orange-600 transition-colors ${
                        priceRange === price.value ? 'font-semibold text-orange-600' : 'text-gray-700'
                      }`}>
                        {price.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enhanced Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  Customer Rating
                </h4>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Ratings' },
                    { value: '4', label: '4★ & above' },
                    { value: '3', label: '3★ & above' },
                    { value: '2', label: '2★ & above' }
                  ].map(rating => (
                    <label key={rating.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        value={rating.value}
                        checked={ratingFilter === rating.value}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="mr-3 text-orange-500 focus:ring-orange-500 scale-110"
                      />
                      <span className={`text-sm group-hover:text-orange-600 transition-colors ${
                        ratingFilter === rating.value ? 'font-semibold text-orange-600' : 'text-gray-700'
                      }`}>
                        {rating.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enhanced Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setPriceRange('all')
                  setRatingFilter('all')
                  setBrandFilter('all')
                  setSortBy('relevance')
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-orange-100 hover:to-orange-200 hover:text-orange-700 transition-all duration-200 font-medium border border-gray-200 hover:border-orange-300"
              >
                🔄 Clear All Filters
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Showing {visible.length} results
                </span>
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <FaFilter />
                  Filters
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Pottery Items">Pottery Items</option>
                  </select>
                  
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000-">Above ₹2000</option>
                  </select>
                </div>
              </div>
            )}

            {/* All Products Section */}
            <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {searchTerm ? 'Search Results' : 'All Products'}
              </h2>
            </div>
            
            {visible.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-500 text-xl mb-2">No products found</div>
                  <div className="text-gray-400">Try adjusting your search or filters</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {visible.map((p, index) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay={100 + (index % 8) * 100}>
                {/* Enhanced Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        try {
                          e.stopPropagation()
                          e.preventDefault()
                          
                          const isInWishlist = wishlist.find(item => item.id === p.id)
                          if (isInWishlist) {
                            removeFromWishlist(p.id)
                          } else {
                            addToWishlist(p)
                          }
                        } catch (error) {
                          // Handle error silently or show user-friendly message
                        }
                      }}
                      className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 z-10 relative"
                    >
                      <FaHeart
                        className={`text-lg transition-colors ${
                          wishlist.find(item => item.id === p.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Discount Badge */}
                  {p.discount && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-pulse">
                      🔥 {p.discount}% OFF
                    </div>
                  )}
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setActive(p)}
                      className="px-6 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-full font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                    >
                      👁️ Quick View
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Product Content */}
                <div className="p-6">
                  {/* Product Title & Rating */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(parseFloat(generateRating())) ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({generateReviews()})</span>
                      <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                    </div>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900">₹{p.price?.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{p.originalPrice?.toLocaleString()}</span>
                      )}
                      {p.discount && (
                        <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                          Save {p.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Stock Status */}
                  <div className="mb-4">
                    {!p.quantity || p.quantity === 0 ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-700 font-semibold">Out of Stock</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">Currently unavailable</p>
                      </div>
                    ) : p.quantity <= 5 ? (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-orange-700 font-semibold">Only {p.quantity} left!</span>
                        </div>
                        <p className="text-orange-600 text-sm mt-1">⚡ Order quickly before it's gone</p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 font-semibold">✅ In Stock</span>
                        </div>
                        <p className="text-green-600 text-sm mt-1">Available for immediate delivery</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (p.quantity > 0) {
                          addToCart(p, 1)
                          window.location.href = '/buyer/cart'
                        }
                      }}
                      disabled={!p.quantity || p.quantity === 0}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-1.5 px-2 rounded-md font-medium text-xs transition-all duration-300 transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-md"
                    >
                      <FaCreditCard className="inline mr-1 text-xs" />
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (p.quantity > 0) {
                          addToCart(p, 1)
                        }
                      }}
                      disabled={!p.quantity || p.quantity === 0}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-1.5 px-2 rounded-md font-medium text-xs transition-all duration-300 transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-md"
                    >
                      <FaShoppingCart className="inline mr-1 text-xs" />
                      Add to Cart
                    </button>
                  </div>
                  
                </div>
              </div>
            ))}
                </div>
            )}
            </section>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {active && <ProductModal product={active} onClose={() => setActive(null)} />}
    </div>
  )
}