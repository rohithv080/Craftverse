import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
  // Animated counters - all end at the same time
  const animatedSellers = useAnimatedCounter(1500, 3000)
  const animatedCustomers = useAnimatedCounter(15000, 3000)
  const animatedProducts = useAnimatedCounter(10000, 3000)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#ffedd5,#fecaca)' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-orange-100 text-orange-700">Welcome to</div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">KAITHIRAN</h1>
              <p className="mt-4 text-gray-700 md:text-lg">A marketplace for artisans. Discover authentic, unique, and handcrafted products made with love.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/buyer/products" className="btn-primary">Shop Now</Link>
                <Link to="/seller/dashboard" className="btn-secondary">Sell on Kaithiran</Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">{animatedSellers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Verified Sellers</div>
                </div>
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">{animatedCustomers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="card p-4">
                  <div className="text-2xl font-bold text-gray-900">{animatedProducts.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Unique Products</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl shadow-xl overflow-hidden border border-stone-200">
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

      {/* Feature Bar + Role CTA */}
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

        {/* Role shortcuts */}
        <div className="max-w-7xl mx-auto px-4 pb-8 grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">🧑‍💼</div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-1">I'm a Seller</div>
                <div className="text-gray-600 text-sm mb-3">Create listings, manage inventory, and track sales.</div>
                <Link to="/seller/dashboard" className="btn-secondary">Start Selling</Link>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">🛍️</div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 mb-1">I'm a Buyer</div>
                <div className="text-gray-600 text-sm mb-3">Discover amazing products from local sellers.</div>
                <Link to="/buyer/products" className="btn-primary">Start Shopping</Link>
              </div>
            </div>
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
      <section className="bg-stone-50">
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


