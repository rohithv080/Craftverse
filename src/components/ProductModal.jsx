import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  if (!product) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl shadow-xl max-w-lg w-full overflow-hidden card">
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className="h-56 w-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 rounded-full px-3 py-1" style={{ backgroundColor: 'rgb(var(--card))' }}>✕</button>
        </div>
        <div className="p-4">
          <div className="text-xl font-bold" style={{ color: 'rgb(var(--text))' }}>{product.name}</div>
          <div className="font-bold mb-2" style={{ color: 'rgb(var(--primary))' }}>₹{product.price}</div>
          <div className="text-gray-700 mb-4 whitespace-pre-line">{product.description}</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm">Qty</span>
            <input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
          </div>
          <div className="flex gap-3">
            <button onClick={()=>{ addToCart(product, qty); onClose() }} className="flex-1 btn-secondary rounded-md py-2 font-medium">Add to Cart</button>
            <Link to="/buyer/checkout" state={{ product, qty }} className="flex-1 text-center btn-primary rounded-md py-2 font-medium">Buy Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


