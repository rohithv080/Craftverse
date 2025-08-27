import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  if (!product) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className="h-56 w-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white rounded-full px-3 py-1">✕</button>
        </div>
        <div className="p-4">
          <div className="text-xl font-bold text-gray-900">{product.name}</div>
          <div className="text-purple-700 font-bold mb-2">₹{product.price}</div>
          <div className="text-gray-700 mb-4 whitespace-pre-line">{product.description}</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm">Qty</span>
            <input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
          </div>
          <div className="flex gap-3">
            <button onClick={()=>{ addToCart(product, qty); onClose() }} className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md py-2 font-medium">Add to Cart</button>
            <Link to="/buyer/checkout" state={{ product, qty }} className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-medium">Buy Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


