import { useLocation, Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const loc = useLocation()
  const total = loc.state?.total
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ backgroundColor: 'rgb(var(--primary-soft))', color: 'rgb(var(--primary))' }}>✓</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>Order Confirmed</h1>
        <p className="mb-6" style={{ color: 'rgb(var(--muted))' }}>Thank you for your purchase. Total paid: ₹{total}</p>
        <Link to="/buyer/products" className="btn-primary px-4 py-2 rounded-md">Continue Shopping</Link>
      </div>
    </div>
  )
}


