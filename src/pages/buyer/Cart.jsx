import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Cart() {
  // Placeholder simple cart (in-memory for MVP). Consider moving to context/Firestore later.
  const loc = useLocation()
  const initialItem = loc.state?.product ? [{ ...loc.state.product, qty: 1 }] : []
  const [items, setItems] = useState(initialItem)

  const total = items.reduce((s, it) => s + it.price * it.qty, 0)

  function updateQty(id, qty) {
    setItems(items.map(i => i.id === id ? { ...i, qty } : i))
  }

  function remove(id) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'rgb(var(--primary))' }}>Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-gray-600">Cart is empty. <Link className="text-purple-700" to="/buyer/products">Browse products</Link></div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="rounded-lg p-4 flex items-center gap-4 card">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: 'rgb(var(--text))' }}>{item.name}</div>
                  <div className="font-bold" style={{ color: 'rgb(var(--primary))' }}>₹{item.price}</div>
                </div>
                <input type="number" min="1" value={item.qty} onChange={(e)=>updateQty(item.id, Number(e.target.value))} className="w-20 border rounded px-2 py-1" style={{ borderColor: 'rgb(var(--border))' }} />
                <button onClick={()=>remove(item.id)} className="text-red-600">Remove</button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: 'rgb(var(--border))' }}>
              <div className="text-gray-700" style={{ color: 'rgb(var(--muted))' }}>Total</div>
              <div className="text-xl font-bold" style={{ color: 'rgb(var(--text))' }}>₹{total}</div>
            </div>
            <Link to="/buyer/checkout" state={{ cart: items }} className="btn-primary px-4 py-2 rounded-md inline-block">Proceed to Checkout</Link>
          </div>
        )}
      </div>
    </div>
  )
}


