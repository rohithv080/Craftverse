import { useLocation, useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { useState } from 'react'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product
  const cart = location.state?.cart
  const items = cart || (product ? [{ ...product, qty: 1 }] : [])
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      // Placeholder payment success.
      // Send email via EmailJS (configure your serviceId/templateId/publicKey)
      try {
        await emailjs.send(
          'your_service_id',
          'your_template_id',
          { total, items: items.map(i => `${i.name} x${i.qty}`).join(', ') },
          { publicKey: 'your_public_key' }
        )
      } catch {}
      navigate('/buyer/order-confirmation', { state: { total } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Checkout</h1>
        <div className="space-y-3 mb-4">
          {items.map(i => (
            <div key={i.id} className="flex items-center justify-between border rounded p-3">
              <div>{i.name} x{i.qty}</div>
              <div className="font-semibold">₹{i.price * i.qty}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-lg font-semibold mb-6">
          <div>Total</div>
          <div>₹{total}</div>
        </div>
        <button disabled={loading} onClick={handlePay} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-medium disabled:opacity-60">{loading ? 'Processing...' : 'Pay Now'}</button>
      </div>
    </div>
  )
}


