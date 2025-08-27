import { Link } from 'react-router-dom'

export default function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">KAITHIRAN</h1>
        <p className="text-gray-700 mb-8">Choose your role to continue</p>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/seller/dashboard" className="p-8 rounded-xl border hover:shadow-lg transition bg-gradient-to-b from-purple-50 to-white">
            <div className="text-xl font-semibold text-gray-900 mb-2">Seller</div>
            <p className="text-gray-600">Add products, track sales, and manage inventory.</p>
          </Link>
          <Link to="/buyer/products" className="p-8 rounded-xl border hover:shadow-lg transition bg-gradient-to-b from-purple-50 to-white">
            <div className="text-xl font-semibold text-gray-900 mb-2">Buyer</div>
            <p className="text-gray-600">Browse products nearby and place orders.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}


