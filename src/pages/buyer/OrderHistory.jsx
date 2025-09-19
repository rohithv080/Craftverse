import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../contexts/AuthContext'
import { FaShoppingBag, FaEye, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, 
      (snapshot) => {
        const orderList = []
        snapshot.forEach(doc => {
          orderList.push({ id: doc.id, ...doc.data() })
        })
        setOrders(orderList)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching orders:', error)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [user])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />
      case 'confirmed':
        return <FaCheckCircle className="text-blue-500" />
      case 'shipped':
        return <FaTruck className="text-orange-500" />
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-orange-500 text-lg">Loading order history...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <div className="text-gray-500 text-xl mb-4">Please log in to view your orders</div>
          <a href="/auth/login" className="text-orange-500 hover:text-orange-600 underline">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <div className="text-gray-500 text-xl mb-4">No orders yet</div>
            <div className="text-gray-400 mb-6">Your order history will appear here once you make your first purchase</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">{orders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">
                  {orders.filter(o => o.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Order #{order.id.slice(-8)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">₹{order.total}</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {order.items?.[0]?.name}
                          {order.items?.length > 1 && ` and ${order.items.length - 1} other item${order.items.length > 2 ? 's' : ''}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} • Quantity: {order.items?.reduce((sum, item) => sum + item.qty, 0)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        <FaEye className="text-sm" />
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          <FaShoppingBag className="text-sm" />
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Order Details #{selectedOrder.id.slice(-8)}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Order Status */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ordered on {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Quantity: {item.qty}</div>
                        </div>
                        <div className="font-semibold text-gray-900">₹{item.price * item.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal || selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee || 0}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div>{selectedOrder.deliveryAddress.fullName}</div>
                      <div>{selectedOrder.deliveryAddress.phone}</div>
                      <div>{selectedOrder.deliveryAddress.address}</div>
                      <div>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.pincode}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
