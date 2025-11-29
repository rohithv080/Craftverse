import { createContext, useContext, useEffect, useState } from 'react'


const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart-items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('wishlist-items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('wishlist-items', JSON.stringify(wishlist))
  }, [wishlist])

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      }
      // Ensure sellerId is preserved when adding to cart
      return [...prev, { 
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        category: product.category,
        quantity: product.quantity, // available stock
        qty 
      }]
    })
  }

  function removeFromCart(id) { setItems(prev => prev.filter(i => i.id !== id)) }
  function updateQty(id, qty) { setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i)) }
  function clearCart() { setItems([]) }

  // Wishlist functions
  function addToWishlist(product) {
    setWishlist(prev => {
      if (prev.find(i => i.id === product.id)) return prev
      return [...prev, product]
    })
  }

  function removeFromWishlist(id) {
    setWishlist(prev => prev.filter(i => i.id !== id))
  }

  function clearWishlist() {
    setWishlist([])
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}