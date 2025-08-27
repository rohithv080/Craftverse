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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-gray-600">Cart is empty. <Link className="text-purple-700" to="/buyer/products">Browse products</Link></div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-purple-700 font-bold">₹{item.price}</div>
                </div>
                <input type="number" min="1" value={item.qty} onChange={(e)=>updateQty(item.id, Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
                <button onClick={()=>remove(item.id)} className="text-red-600">Remove</button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-gray-700">Total</div>
              <div className="text-xl font-bold text-gray-900">₹{total}</div>
            </div>
            <Link to="/buyer/checkout" state={{ cart: items }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-block">Proceed to Checkout</Link>
          </div>
        )}
      </div>
    </div>
  )
}


