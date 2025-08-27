import { useLocation, Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const loc = useLocation()
  const total = loc.state?.total
  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-700 mx-auto mb-4 flex items-center justify-center text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Total paid: ₹{total}</p>
        <Link to="/buyer/products" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Continue Shopping</Link>
      </div>
    </div>
  )
}


