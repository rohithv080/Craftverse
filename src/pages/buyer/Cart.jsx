import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaLock } from 'react-icons/fa'

export default function Cart() {
  // Placeholder simple cart (in-memory for MVP). Consider moving to context/Firestore later.
  const loc = useLocation()
  const initialItem = loc.state?.product ? [{ ...loc.state.product, qty: 1 }] : []
  const [items, setItems] = useState(initialItem)

  const total = items.reduce((s, it) => s + it.price * it.qty, 0)
  const subtotal = total
  const deliveryFee = items.length > 0 ? 40 : 0
  const finalTotal = subtotal + deliveryFee

  function updateQty(id, qty) {
    if (qty < 1) return
    setItems(items.map(i => i.id === id ? { ...i, qty } : i))
  }

  function remove(id) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/buyer/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <FaArrowLeft className="text-sm" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <div className="text-gray-500 text-xl mb-4">Your cart is empty</div>
            <div className="text-gray-400 mb-6">Add some products to get started</div>
            <Link 
              to="/buyer/products" 
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-lg" 
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">₹{item.originalPrice}</span>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button 
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.qty <= 1}
                              >
                                <FaMinus className="text-gray-500 text-xs" />
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                                {item.qty}
                              </span>
                              <button 
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                              >
                                <FaPlus className="text-gray-500 text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{item.price * item.qty}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₹{item.price} each
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => remove(item.id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash className="text-sm" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="text-sm text-green-600">
                      Free delivery on orders above ₹500
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Including all taxes
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link 
                  to="/buyer/checkout" 
                  state={{ cart: items }} 
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-center inline-block mb-4"
                >
                  Proceed to Checkout
                </Link>
                
                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaLock className="text-gray-400" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


