import { Link } from 'react-router-dom'

export default function Home() {
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
    </div>
  )
}


