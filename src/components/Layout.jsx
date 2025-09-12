import { Link, Outlet, useLocation } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import { useAuth } from '../contexts/AuthContext'
import { useTheme, themes } from '../contexts/ThemeContext'
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaStore, FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, setTheme, cycleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to products page with search term
      window.location.href = `/buyer/products?search=${encodeURIComponent(searchTerm)}`
    }
  }

  // Check if user is on buyer or seller pages
  const isBuyerPage = location.pathname.startsWith('/buyer')
  const isSellerPage = location.pathname.startsWith('/seller')

  const [elevated, setElevated] = useState(false)
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>Welcome to Kaithiran</span>
              <span>•</span>
              <span>Free delivery on orders above ₹500</span>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)} 
                className="bg-transparent border-none text-white focus:ring-0"
              >
                <option value={themes.light}>Light Theme</option>
                <option value={themes.sand}>Sand Theme</option>
                <option value={themes.cocoa}>Cocoa Theme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 ${elevated ? 'backdrop-blur bg-white/80 border-b shadow-sm' : 'bg-white border-b'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
              KAITHIRAN
            </Link>

            {/* Search Bar - Only show on buyer pages */}
            {isBuyerPage && (
              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <FaSearch className="text-sm" />
                  </button>
                </form>
              </div>
            )}

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {isBuyerPage && (
                <>
                  <Link to="/buyer/products" className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center gap-2">
                    <FaHome />
                    Products
                  </Link>
                  <Link to="/buyer/cart" className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center gap-2">
                    <FaShoppingCart />
                    Cart
                  </Link>
                </>
              )}
              
              {isSellerPage && (
                <>
                  <Link to="/seller/dashboard" className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center gap-2">
                    <FaStore />
                    Dashboard
                  </Link>
                  <Link to="/seller/add" className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center gap-2">
                    <FaStore />
                    Add Product
                  </Link>
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Icon - Only show on buyer pages */}
              {isBuyerPage && (
                <Link to="/buyer/cart" className="relative text-gray-700 hover:text-orange-500 transition-colors">
                  <FaShoppingCart className="text-2xl" />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </Link>
              )}
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                    <FaUser className="text-xl" />
                    <span className="hidden sm:block">{user.name || user.email?.split('@')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/auth/login" className="text-gray-700 hover:text-orange-500 transition-colors">
                  <FaUser className="text-xl" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="pt-4 space-y-3">
                {isBuyerPage && (
                  <>
                    <Link 
                      to="/buyer/products" 
                      className="block text-gray-700 hover:text-orange-500 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link 
                      to="/buyer/cart" 
                      className="block text-gray-700 hover:text-orange-500 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  </>
                )}
                
                {isSellerPage && (
                  <>
                    <Link 
                      to="/seller/dashboard" 
                      className="block text-gray-700 hover:text-orange-500 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/seller/add" 
                      className="block text-gray-700 hover:text-orange-500 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Add Product
                    </Link>
                  </>
                )}
                
                {user && (
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-gray-700 hover:text-orange-500 transition-colors font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">KAITHIRAN</h3>
              <p className="text-gray-400">
                Your trusted marketplace for quality products and seamless shopping experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/buyer/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/buyer/cart" className="hover:text-white transition-colors">Cart</Link></li>
                <li><Link to="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/support" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="text-gray-400">
                <p>Email: <a href="mailto:support@kaithiran.com" className="hover:text-white">support@kaithiran.com</a></p>
                <p>Phone: <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a></p>
                <p className="mt-4">Follow us on social media</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} KAITHIRAN. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg bg-orange-500 text-white hover:bg-orange-600"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  )
}


