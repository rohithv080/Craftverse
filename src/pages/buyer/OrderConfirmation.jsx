import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaShoppingBag, FaTruck } from 'react-icons/fa'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { cancelOrder } from '../../services/ordersService'
import { useToast } from '../../contexts/ToastContext'
import ConfirmModal from '../../components/ConfirmModal'

export default function OrderConfirmation() {
  const loc = useLocation()
  const total = loc.state?.total
  const address = loc.state?.address
  const orderId = loc.state?.orderId
  const { show } = useToast()
  const [status, setStatus] = useState('pending')
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (!orderId) return
    const unsub = onSnapshot(doc(db, 'orders', orderId), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setStatus(data.status || 'pending')
      }
    })
    return () => unsub()
  }, [orderId])

  const canCancel = status === 'pending' || status === 'confirmed'

  async function handleCancel() {
    if (!orderId) return
    if (!canCancel) return
    setShowCancelModal(true)
  }

  async function handleConfirmCancel() {
    try {
      setIsCancelling(true)
      await cancelOrder(orderId)
      show('Order cancelled successfully', { type: 'success' })
    } catch (err) {
      show(err.message || 'Failed to cancel order', { type: 'error' })
    } finally {
      setIsCancelling(false)
      setShowCancelModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaShoppingBag className="text-orange-500" />
              Order Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-semibold text-gray-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-900 text-sm">{orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'cancelled' ? 'bg-red-100 text-red-800' : status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium text-gray-900">3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {address && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTruck className="text-orange-500" />
                Delivery Address
              </h2>
              
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p className="text-gray-600">Phone: {address.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <FaTruck className="text-blue-500 text-xl" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <FaTruck className="text-yellow-500 text-xl" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Out for Delivery</h3>
              <p className="text-sm text-gray-600">Your order is on its way to you</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Delivered</h3>
              <p className="text-sm text-gray-600">Enjoy your purchase!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link 
            to="/buyer/products" 
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
          {orderId && (
            <button
              disabled={!canCancel || isCancelling}
              onClick={handleCancel}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium border ${canCancel ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
              title={canCancel ? 'Cancel this order' : 'Order can no longer be cancelled'}
            >
              {isCancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <FaHome />
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-2">If you have any questions, please contact our customer support.</p>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
          title="Cancel Order"
          message="Are you sure you want to cancel this order? The items will be restocked and this action cannot be undone."
          confirmText="Yes, Cancel Order"
          cancelText="Keep Order"
          type="danger"
        />
      </div>
    </div>
  )
}


