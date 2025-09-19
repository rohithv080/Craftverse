import { useLocation, useNavigate, Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { useState } from 'react'
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaLock, FaShieldAlt, FaTruck } from 'react-icons/fa'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const product = location.state?.product
  const cart = location.state?.cart
  const items = cart || (product ? [{ ...product, qty: 1 }] : [])
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const subtotal = total
  const deliveryFee = items.length > 0 && subtotal < 500 ? 40 : 0
  const finalTotal = subtotal + deliveryFee

  async function handlePay() {
    if (!user) {
      setError('Please log in to complete your order')
      return
    }
    
    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      setError('Please fill in all delivery address fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Validate stock availability
      for (const item of items) {
        const productRef = doc(db, 'products', item.id)
        const productSnap = await getDoc(productRef)
        if (!productSnap.exists()) {
          throw new Error(`Product ${item.name} does not exist`)
        }
        const productData = productSnap.data()
        const availableStock = productData.quantity || 0
        if (availableStock < item.qty) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${availableStock}, Requested: ${item.qty}`)
        }
      }

      // Update product sales and stock
      for (const item of items) {
        const productRef = doc(db, 'products', item.id)
        const productSnap = await getDoc(productRef)
        const productData = productSnap.data()
        await updateDoc(productRef, {
          sales: (productData.sales || 0) + item.qty,
          quantity: Math.max((productData.quantity || 0) - item.qty, 0)
        })
      }

      // Create order in database
      const orderData = {
        buyerId: user?.uid || 'anonymous',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          imageUrl: item.imageUrl
        })),
        total: finalTotal,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        deliveryAddress: {
          fullName: deliveryAddress.fullName,
          phone: deliveryAddress.phone,
          address: deliveryAddress.address,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode
        },
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, 'orders'), orderData)

      // Send email via EmailJS if environment variables are configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              total: finalTotal,
              items: items.map(i => `${i.name} x${i.qty}`).join(', '),
              fullName: deliveryAddress.fullName,
              email: deliveryAddress.email || 'N/A'
            },
            { publicKey }
          )
        } catch (emailError) {
          // Non-fatal
        }
      }

      // Clear cart after successful order
      clearCart()
      navigate('/buyer/order-confirmation', { state: { total: finalTotal, address: deliveryAddress } })
    } catch (err) {
      setError(err.message || 'An error occurred while processing your order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/buyer/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <FaArrowLeft className="text-sm" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="text-orange-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={deliveryAddress.fullName}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={deliveryAddress.address}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCreditCard className="text-orange-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive your order</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Online Payment</div>
                    <div className="text-sm text-gray-500">Credit/Debit card, UPI, Net Banking</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(i => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={i.imageUrl} alt={i.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{i.name}</div>
                      <div className="text-sm text-gray-500">Qty: {i.qty}</div>
                    </div>
                    <div className="font-semibold text-gray-900">₹{i.price * i.qty}</div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Including all taxes</div>
                </div>
              </div>

              {/* Place Order Button */}
              <button 
                disabled={loading} 
                onClick={handlePay} 
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {loading ? 'Processing...' : `Place Order - ₹${finalTotal}`}
              </button>
              
              {/* Security & Trust */}
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaLock className="text-gray-400" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-gray-400" />
                  <span>100% secure payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-gray-400" />
                  <span>Fast delivery guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}