import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaTrash, FaHeartBroken } from 'react-icons/fa'
import { useCart } from '../../contexts/CartContext'

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart()
  const [addingId, setAddingId] = useState(null)

  const handleAddToCart = (product) => {
    setAddingId(product.id)
    addToCart(product, 1)
    setTimeout(() => setAddingId(null), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">💔</div>
            <div className="text-gray-500 text-xl mb-4">Your wishlist is empty</div>
            <div className="text-gray-400 mb-6">Add products you love to your wishlist</div>
            <Link
              to="/buyer/products"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                  <div className="text-xl font-bold text-gray-900 mb-2">₹{product.price?.toLocaleString()}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-60"
                    >
                      <FaShoppingCart className="text-sm" />
                      {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <FaHeartBroken className="text-sm" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
