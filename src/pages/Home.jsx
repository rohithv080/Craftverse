import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../firebase/firebaseConfig'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

export default function Home() {
  const [arrivals, setArrivals] = useState([])
  const [loadingArrivals, setLoadingArrivals] = useState(true)
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8))
    const unsub = onSnapshot(q, (snap) => {
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      setArrivals(list)
      setLoadingArrivals(false)
    })
    return () => unsub()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#ffedd5,#fecaca)' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: 'rgb(var(--primary-soft))', color: 'rgb(var(--primary))' }}>Welcome to</div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">KAITHIRAN</h1>
              <p className="mt-4 text-gray-700 md:text-lg">A marketplace for artisans. Discover authentic, unique, and handcrafted products made with love.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/buyer/products" className="btn-primary">Shop Now</Link>
                <Link to="/seller/dashboard" className="btn-secondary">Sell on Kaithiran</Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">1500+</div>
                  <div className="text-sm text-gray-600">Verified Sellers</div>
                </div>
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">15000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">10000+</div>
                  <div className="text-sm text-gray-600">Unique Products</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl shadow-xl overflow-hidden border" style={{ borderColor: 'rgb(var(--border))' }}>
                <img src="/hero.png" alt="Kaithiran hero" className="w-full h-80 md:h-[420px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow card">
                <div className="text-sm font-semibold text-gray-900">Authentic & Unique</div>
                <div className="text-xs text-gray-600">Handcrafted by local artisans</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow card">
                <div className="text-sm font-semibold text-gray-900">Fast & Secure</div>
                <div className="text-xs text-gray-600">Payments and Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <div className="text-lg font-semibold text-gray-900">Fast Secure Payments</div>
            <div className="text-sm text-gray-600">Your transactions are protected</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-lg font-semibold text-gray-900">Authentic & Unique Products</div>
            <div className="text-sm text-gray-600">Curated by Kaithiran</div>
          </div>
          <div className="card p-5 text-center md:col-span-1 sm:col-span-2 md:col-auto">
            <div className="text-lg font-semibold text-gray-900">Free & Fast Delivery</div>
            <div className="text-sm text-gray-600">On eligible orders</div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {loadingArrivals ? (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="h-40 w-full bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : arrivals.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
              <Link to="/buyer/products" className="text-sm font-medium text-orange-600">Browse all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {arrivals.map(p => (
                <Link key={p.id} to={`/buyer/products?search=${encodeURIComponent(p.name || '')}`} className="group card overflow-hidden hover:shadow-md transition-shadow">
                  <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                    <div className="text-orange-600 font-bold mt-1">₹{p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="bg-[rgb(var(--bg))]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Categories</h2>
            <Link to="/buyer/products" className="text-sm font-medium text-orange-600">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { title: 'Fashion', local: '/categories/fashion.jpg', fallback: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop' },
              { title: 'Gifts', local: '/categories/gifts.jpg', fallback: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1200&auto=format&fit=crop' },
              { title: 'Home & Living', local: '/categories/home.jpg', fallback: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop' },
              { title: 'Stationery', local: '/categories/stationery.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop' },
            ].map(c => (
              <Link key={c.title} to={`/buyer/products?category=${encodeURIComponent(c.title)}`} className="group relative overflow-hidden rounded-2xl shadow-sm border" style={{ borderColor: 'rgb(var(--border))' }}>
                <img 
                  src={c.local}
                  onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=c.fallback; }}
                  alt={c.title} 
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block bg-white/90 backdrop-blur px-3 py-1 rounded-md text-sm font-semibold text-gray-900">{c.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Stay in the loop</h3>
          <p className="text-gray-600 mt-2">Join our newsletter to get updates about new arrivals and offers.</p>
          <form
            onSubmit={(e)=>{ e.preventDefault(); alert('Thanks for subscribing!'); }}
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input type="email" required placeholder="Enter your email" className="w-full sm:w-96 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <button className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[rgb(var(--bg))]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What customers say</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[ 
              { name: 'Anjali', text: 'Beautiful products and quick delivery. Love supporting local artisans!', rating: 5 },
              { name: 'Rahul', text: 'Quality is excellent. The marketplace is easy to use and trustworthy.', rating: 5 },
              { name: 'Meera', text: 'Found unique gifts I couldn\'t find elsewhere. Highly recommended!', rating: 4 },
            ].map(t => (
              <div key={t.name} className="card p-5">
                <div className="text-orange-500 mb-2">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className="text-gray-700">{t.text}</p>
                <div className="mt-3 text-sm text-gray-500">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


