import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../firebase/firebaseConfig'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useToast } from '../contexts/ToastContext'
import { FaShippingFast, FaShieldAlt, FaUndo, FaHeadset, FaStar, FaStore, FaUsers, FaBoxOpen, FaHeart, FaPaintBrush, FaGem, FaHome as FaHomeIcon } from 'react-icons/fa'

// Animated counter hook
function useAnimatedCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime = null
    const startValue = 0
    
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [target, duration])
  
  return count
}

export default function Home() {
  const { show } = useToast()
  // Animated counters - all end at the same time
  const animatedSellers = useAnimatedCounter(1500, 3000)
  const animatedCustomers = useAnimatedCounter(15000, 3000)
  const animatedProducts = useAnimatedCounter(10000, 3000)

  // New Arrivals state
  const [arrivals, setArrivals] = useState([])
  const [loadingArrivals, setLoadingArrivals] = useState(true)

  // Newsletter state
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Fetch New Arrivals
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(6))
    const unsub = onSnapshot(q, (snap) => {
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setArrivals(list)
      setLoadingArrivals(false)
    })
    return () => unsub()
  }, [])

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      show('Please enter a valid email address', { type: 'error' })
      return
    }

    setIsSubscribing(true)
    
    try {
      // Simulate API call for newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success feedback
      show('🎉 Thank you for subscribing! You\'ll receive updates about new arrivals and offers.', { 
        type: 'success',
        duration: 5000 
      })
      
      // Clear the form
      setEmail('')
      
    } catch (error) {
      show('Failed to subscribe. Please try again later.', { type: 'error' })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white shadow-md border border-orange-100">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-orange-700">Welcome to Kaithiran</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  KAITHIRAN
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                Where tradition meets marketplace. Discover authentic, handcrafted treasures made with passion by skilled artisans.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/buyer/products" className="group btn-primary text-lg px-8 py-4 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                  Shop Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/seller/dashboard" className="btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg transition-all">
                  Start Selling
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-orange-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-3">
                    <FaStore className="text-orange-600 text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{animatedSellers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600 mt-1">Verified Sellers</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-rose-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center w-10 h-10 bg-rose-100 rounded-full mb-3">
                    <FaUsers className="text-rose-600 text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{animatedCustomers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-3">
                    <FaBoxOpen className="text-amber-600 text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{animatedProducts.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600 mt-1">Unique Products</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-white transform hover:scale-105 transition-transform duration-500">
                <img src="/hero.png" alt="Kaithiran hero" className="w-full h-80 md:h-[480px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-5 py-4 shadow-xl border border-orange-100 animate-bounce hover:animate-none">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaPaintBrush className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Authentic & Unique</div>
                    <div className="text-xs text-gray-600">Handcrafted by artisans</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl px-5 py-4 shadow-xl border border-green-100 animate-bounce hover:animate-none" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">100% Secure</div>
                    <div className="text-xs text-gray-600">Payments & Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar + Role CTA */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group card p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaShippingFast className="text-orange-600 text-3xl" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">Free Shipping</div>
              <div className="text-sm text-gray-600">On orders over ₹500</div>
            </div>
            
            <div className="group card p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaShieldAlt className="text-green-600 text-3xl" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">Secure Payment</div>
              <div className="text-sm text-gray-600">100% protected transactions</div>
            </div>
            
            <div className="group card p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaUndo className="text-blue-600 text-3xl" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">Easy Returns</div>
              <div className="text-sm text-gray-600">7-day return policy</div>
            </div>
            
            <div className="group card p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaHeadset className="text-purple-600 text-3xl" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">24/7 Support</div>
              <div className="text-sm text-gray-600">Always here to help</div>
            </div>
          </div>

          {/* Role shortcuts */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="group card p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🧑‍💼
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-gray-900 mb-2">I'm a Seller</div>
                  <div className="text-gray-600 mb-4">Create listings, manage inventory, and grow your business with us.</div>
                  <Link to="/seller/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                    Start Selling
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group card p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🛍️
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-gray-900 mb-2">I'm a Buyer</div>
                  <div className="text-gray-600 mb-4">Discover amazing handcrafted products from talented local artisans.</div>
                  <Link to="/buyer/products" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    Start Shopping
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="bg-gradient-to-b from-white to-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our curated collection of handcrafted masterpieces</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Fashion', icon: <FaGem className="text-2xl" />, local: '/categories/fashion.jpg', fallback: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', color: 'from-pink-500 to-rose-500' },
              { title: 'Gifts', icon: <FaHeart className="text-2xl" />, local: '/categories/gifts.jpg', fallback: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1200&auto=format&fit=crop', color: 'from-purple-500 to-indigo-500' },
              { title: 'Home & Living', icon: <FaHomeIcon className="text-2xl" />, local: '/categories/home.jpg', fallback: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop', color: 'from-blue-500 to-cyan-500' },
              { title: 'Pottery Items', icon: <FaPaintBrush className="text-2xl" />, local: '/categories/pottery.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop', color: 'from-amber-500 to-orange-500' },
            ].map(c => (
              <Link 
                key={c.title} 
                to={`/buyer/products?category=${encodeURIComponent(c.title)}`}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={c.local}
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=c.fallback; }}
                    alt={c.title} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-40 group-hover:opacity-50 transition-opacity`} />
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {c.icon}
                  </div>
                  <h3 className="text-xl font-bold drop-shadow-lg">{c.title}</h3>
                  <span className="mt-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loadingArrivals ? (
            <div>
              <div className="text-center mb-12">
                <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
                <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="h-64 w-full bg-gray-200 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : arrivals.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fresh Arrivals</h2>
                <p className="text-gray-600 text-lg mb-6">Discover the latest handcrafted treasures from our artisans</p>
                <Link 
                  to="/buyer/products" 
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-lg group"
                >
                  View All Products
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {arrivals.map(p => (
                  <Link 
                    key={p.id} 
                    to={`/buyer/products?search=${encodeURIComponent(p.name || '')}`}
                    className="group card overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden h-64">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full shadow-lg">
                          <span>✨</span> New
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                        <FaHeart className="text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {p.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-orange-600 font-bold text-2xl">₹{p.price?.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <FaStar className="text-sm" />
                          <span className="text-gray-600 text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {p.quantity === 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            <span>⚠️</span> Out of Stock
                          </span>
                        ) : p.quantity <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            <span>⏰</span> Only {p.quantity} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <span>✓</span> In Stock
                          </span>
                        )}
                        
                        <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-orange-500 to-rose-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✉️</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the Loop</h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and artisan stories.
            </p>
            
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto"
            >
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isSubscribing}
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] shadow-lg"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
            
            <p className="text-white/70 text-sm mt-4">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-stone-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real experiences from our valued community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[ 
              { name: 'Anjali Sharma', role: 'Art Collector', avatar: '👩', text: 'Beautiful products and quick delivery. Love supporting local artisans! The quality is outstanding.', rating: 5, color: 'orange' },
              { name: 'Rahul Verma', role: 'Business Owner', avatar: '👨', text: 'Quality is excellent. The marketplace is easy to use and trustworthy. Great platform for artisans!', rating: 5, color: 'blue' },
              { name: 'Meera Patel', role: 'Home Designer', avatar: '👩‍🎨', text: 'Found unique gifts I couldn\'t find elsewhere. Highly recommended! Amazing handcrafted items.', rating: 5, color: 'purple' },
            ].map(t => (
              <div key={t.name} className="group card p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-${t.color}-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < t.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">"{t.text}"</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>✓</span>
                    <span>Verified Purchase</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


