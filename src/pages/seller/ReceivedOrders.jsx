import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../contexts/AuthContext'
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaClock, FaEye, FaFilter } from 'react-icons/fa'
import { useToast } from '../../contexts/ToastContext'

export default function ReceivedOrders() {
  const { user } = useAuth()
  const { show } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    // Query orders that contain products from this seller using sellerIds array
    const q = query(
      collection(db, 'orders'),
      where('sellerIds', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, 
      (snapshot) => {
        const orderList = []
        snapshot.forEach(docSnap => {
          const orderData = { id: docSnap.id, ...docSnap.data() }
          // Filter to show only this seller's items
          const sellerItems = orderData.items?.filter(item => item.sellerId === user.uid)
          if (sellerItems && sellerItems.length > 0) {
            orderList.push({
              ...orderData,
              sellerItems, // Only items from this seller
              sellerTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
            })
          }
        })
        setOrders(orderList)
        setLoading(false)
      },
      (error) => {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId)
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      })
      show(`Order status updated to ${newStatus}`, { type: 'success' })
    } catch (error) {
      show('Failed to update order status', { type: 'error' })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true
    return order.status === statusFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-orange-500 text-lg">Loading orders...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <div className="text-gray-500 text-xl mb-4">Please log in to view orders</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Received Orders</h1>
          <p className="text-gray-600 mt-2">Manage orders for your products</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {orders.filter(o => o.status === 'shipped').length}
            </div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">
              ₹{orders.reduce((sum, o) => sum + (o.sellerTotal || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <FaFilter className="text-gray-500" />
            <span className="font-medium text-gray-700">Filter by Status:</span>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <div className="text-gray-500 text-xl mb-4">No orders found</div>
            <div className="text-gray-400">
              {statusFilter === 'all' 
                ? "You haven't received any orders yet" 
                : `No ${statusFilter} orders`}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Orders ({filteredOrders.length})</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
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
                      <div className="text-sm text-gray-600">
                        Customer: {order.deliveryAddress?.fullName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">₹{order.sellerTotal?.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Your Revenue</div>
                    </div>
                  </div>

                  {/* Seller's Items */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Your Products in this order:</div>
                    <div className="space-y-2">
                      {order.sellerItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</div>
                          </div>
                          <div className="font-semibold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                      <FaEye className="text-sm" />
                      View Details
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        disabled={updatingStatus === order.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <FaCheckCircle className="text-sm" />
                        Confirm Order
                      </button>
                    )}

                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        disabled={updatingStatus === order.id}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <FaTruck className="text-sm" />
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        disabled={updatingStatus === order.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <FaCheckCircle className="text-sm" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
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

                {/* Your Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Your Products in this Order</h4>
                  <div className="space-y-3">
                    {selectedOrder.sellerItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Quantity: {item.qty}</div>
                          <div className="text-sm text-gray-500">Price: ₹{item.price}</div>
                        </div>
                        <div className="font-semibold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Your Revenue from this order</span>
                    <span>₹{selectedOrder.sellerTotal?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer Details */}
                {selectedOrder.deliveryAddress && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium">{selectedOrder.deliveryAddress.fullName}</div>
                      <div>{selectedOrder.deliveryAddress.phone}</div>
                      <div className="mt-2">
                        <div className="font-medium text-gray-700">Delivery Address:</div>
                        <div>{selectedOrder.deliveryAddress.address}</div>
                        <div>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.pincode}</div>
                      </div>
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
