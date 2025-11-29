import { useState, useEffect } from 'react'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])
  
  if (!product) return null
  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl shadow-xl max-w-lg w-full overflow-hidden card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className="h-56 w-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 rounded-full px-3 py-1" style={{ backgroundColor: 'rgb(var(--card))' }}>✕</button>
        </div>
        <div className="p-4">
          <div className="text-xl font-bold" style={{ color: 'rgb(var(--text))' }}>{product.name}</div>
          <div className="font-bold mb-2" style={{ color: 'rgb(var(--primary))' }}>₹{product.price}</div>
          
          {/* Stock Information */}
          <div className="mb-3">
            {product.quantity === 0 ? (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Out of Stock
              </span>
            ) : product.quantity <= 5 ? (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Only {product.quantity} left in stock
              </span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                In Stock
              </span>
            )}
          </div>
          
          <div className="text-gray-700 mb-4 whitespace-pre-line">{product.description}</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm">Qty</span>
            <input 
              type="number" 
              min="1" 
              max={product.quantity || 0}
              value={qty} 
              onChange={(e)=>setQty(Math.min(Number(e.target.value), product.quantity || 0))} 
              disabled={product.quantity === 0}
              className="w-20 border rounded px-2 py-1 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={()=>{ 
                if (product.quantity > 0) {
                  addToCart(product, qty); 
                  onClose();
                }
              }} 
              disabled={product.quantity === 0}
              className={`flex-1 rounded-md py-2 font-medium ${
                product.quantity === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'btn-secondary'
              }`}
            >
              Add to Cart
            </button>
            {product.quantity > 0 ? (
              <button 
                onClick={() => {
                  addToCart(product, qty);
                  navigate('/buyer/cart');
                }}
                className="flex-1 text-center btn-primary rounded-md py-2 font-medium"
              >
                Buy Now
              </button>
            ) : (
              <button 
                disabled 
                className="flex-1 text-center bg-gray-300 text-gray-500 cursor-not-allowed rounded-md py-2 font-medium"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


