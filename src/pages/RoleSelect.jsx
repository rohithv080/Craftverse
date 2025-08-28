import { Link } from 'react-router-dom'

export default function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(var(--primary))' }}>KAITHIRAN</h1>
        <p className="text-gray-700 mb-8">Choose your role to continue</p>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/seller/dashboard" className="p-8 rounded-xl border hover:shadow-lg transition" style={{ backgroundImage: 'linear-gradient(to bottom, rgb(var(--primary-soft)), rgb(var(--card)))' }}>
            <div className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--text))' }}>Seller</div>
            <p style={{ color: 'rgb(var(--muted))' }}>Add products, track sales, and manage inventory.</p>
          </Link>
          <Link to="/buyer/products" className="p-8 rounded-xl border hover:shadow-lg transition" style={{ backgroundImage: 'linear-gradient(to bottom, rgb(var(--primary-soft)), rgb(var(--card)))' }}>
            <div className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--text))' }}>Buyer</div>
            <p style={{ color: 'rgb(var(--muted))' }}>Browse products nearby and place orders.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}


