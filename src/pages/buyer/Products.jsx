import { useEffect, useMemo, useState } from 'react'
import useProducts from '../../hooks/useProducts'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductModal from '../../components/ProductModal'
import { FaFilter, FaStar, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'

export default function Products() {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useCart()
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

  // Generate stable ratings based on product ID (won't change on re-render)
  const productRatings = useMemo(() => {
    const ratings = {}
    products.forEach(p => {
      // Use product ID to generate consistent rating
      const seed = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ratings[p.id] = {
        rating: (3 + (seed % 20) / 10).toFixed(1), // Rating between 3.0-5.0
        reviews: 50 + (seed % 950) // Reviews between 50-1000
      }
    })
    return ratings
  }, [products])

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((p, index) => {
              const rating = productRatings[p.id] || { rating: '4.0', reviews: 100 }
              return (
              <div 
                key={p.id} 
                onClick={() => setActive(p)}
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer" 
                data-aos="fade-up" 
                data-aos-delay={80 + (index % 8) * 80}
              >
                {/* Product Image with Square Aspect Ratio */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  {/* Wishlist Button - Fixed */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const isInWishlist = wishlist.find(item => item.id === p.id)
                      if (isInWishlist) {
                        removeFromWishlist(p.id)
                      } else {
                        addToWishlist(p)
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 z-10"
                  >
                    <FaHeart
                      className={`text-base ${
                        wishlist.find(item => item.id === p.id)
                          ? 'text-rose-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  
                  {/* Stock Badge */}
                  {(!p.quantity || p.quantity === 0) ? (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  ) : p.quantity <= 5 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Only {p.quantity} left
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                      {p.category || 'Handicraft'}
                    </span>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-sm font-medium text-gray-700">{rating.rating}</span>
                      <span className="text-xs text-gray-500">({rating.reviews})</span>
                    </div>
                  </div>
                  
                  {/* Product Title */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {p.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">₹{p.price?.toLocaleString()}</span>
                    {p.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{p.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {/* Stock Status - Compact */}
                  <div className="mb-3">
                    {!p.quantity || p.quantity === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        Out of Stock
                      </span>
                    ) : p.quantity <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></span>
                        Only {p.quantity} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                        In Stock
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (p.quantity > 0) {
                        setActive(p)
                      }
                    }}
                    disabled={!p.quantity || p.quantity === 0}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    <FaShoppingCart className="text-sm" />
                    Buy Now
                  </button>
                  
                </div>
              </div>
            )})
            }
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