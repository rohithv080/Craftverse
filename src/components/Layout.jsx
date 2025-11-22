import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import Chatbot from './chatbot.jsx'
import { useAuth } from '../contexts/AuthContext'
import { useTheme, themes } from '../contexts/ThemeContext'
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaStore, FaHome, FaHeart, FaBox, FaInfoCircle, FaEnvelope, FaPhone, FaShippingFast, FaUndoAlt, FaQuestionCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useCart } from '../contexts/CartContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, setTheme, cycleTheme } = useTheme()
  const { items: cartItems } = useCart()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/buyer/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  // Check if user is on buyer or seller pages
  const isBuyerPage = location.pathname.startsWith('/buyer')
  const isSellerPage = location.pathname.startsWith('/seller')
  const isHomePage = location.pathname === '/'
  
  const cartItemCount = cartItems.length

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
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top Row - Logo, Search, User Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap">
              KAITHIRAN
            </Link>

            {/* Search Bar - Desktop Only */}
            {!isHomePage && (
              <div className="hidden md:flex flex-1 max-w-2xl">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Wishlist Icon */}
              {user && (
                <Link 
                  to="/buyer/wishlist" 
                  className="hidden lg:block text-gray-700 hover:text-orange-500 transition-colors relative"
                  title="Wishlist"
                >
                  <FaHeart className="text-xl" />
                </Link>
              )}
              
              {/* Cart Icon with Badge */}
              {user && (
                <Link 
                  to="/buyer/cart" 
                  className="hidden lg:block text-gray-700 hover:text-orange-500 transition-colors relative"
                  title="Shopping Cart"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                    <FaUser className="text-xl" />
                    <span className="hidden xl:block">{user.name || user.email?.split('@')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/buyer/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaUser className="text-sm" />
                        My Profile
                      </Link>
                      <Link
                        to="/buyer/orders"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaBox className="text-sm" />
                        My Orders
                      </Link>
                      <Link
                        to="/buyer/wishlist"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
                      >
                        <FaHeart className="text-sm" />
                        Wishlist
                      </Link>
                      <Link
                        to="/buyer/cart"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
                      >
                        <FaShoppingCart className="text-sm" />
                        Cart {cartItemCount > 0 && `(${cartItemCount})`}
                      </Link>
                      <hr className="my-2" />
                      {user.role === 'seller' && (
                        <Link
                          to="/seller/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FaStore className="text-sm" />
                          Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaTimes className="text-sm" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/auth/login" 
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
                >
                  <FaUser />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Bottom Row - Navigation Menu (Desktop Only) */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm">
              Home
            </Link>
            
            <Link to="/buyer/products" className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm">
              Shop
            </Link>
            
            <Link to="/help" className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm">
              Help
            </Link>
            
            <Link to="/support" className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm">
              Contact
            </Link>
            
            {isSellerPage && (
              <>
                <Link to="/seller/dashboard" className="text-gray-700 hover:text-orange-500 transition-colors font-medium flex items-center gap-2 text-sm">
                  <FaStore className="text-xs" />
                  Dashboard
                </Link>
                <Link to="/seller/add" className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm">
                  Add Product
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="pt-4 space-y-3">
                {/* Mobile Search */}
                {!isHomePage && (
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </form>
                )}
                
                {/* Main Navigation */}
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHome />
                  Home
                </Link>
                
                <Link 
                  to="/buyer/products" 
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaStore />
                  Shop
                </Link>
                
                <Link 
                  to="/help" 
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaQuestionCircle />
                  Help
                </Link>
                
                <Link 
                  to="/support" 
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaEnvelope />
                  Contact
                </Link>
                
                {user && (
                  <>
                    <hr className="my-2" />
                    <Link 
                      to="/buyer/wishlist" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaHeart />
                      Wishlist
                    </Link>
                    <Link 
                      to="/buyer/cart" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaShoppingCart />
                      Cart {cartItemCount > 0 && `(${cartItemCount})`}
                    </Link>
                    <Link 
                      to="/buyer/orders" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaBox />
                      My Orders
                    </Link>
                    <Link 
                      to="/buyer/profile" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser />
                      Profile
                    </Link>
                  </>
                )}
                
                {isSellerPage && (
                  <>
                    <hr className="my-2" />
                    <Link 
                      to="/seller/dashboard" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaStore />
                      Seller Dashboard
                    </Link>
                    <Link 
                      to="/seller/add" 
                      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaStore />
                      Add Product
                    </Link>
                  </>
                )}
                
                {user && (
                  <>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full text-left text-red-600 hover:text-red-700 transition-colors font-medium py-2"
                    >
                      <FaTimes />
                      Logout
                    </button>
                  </>
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

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}


