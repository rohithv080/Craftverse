import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

/**
 * Cancels an order if it is still cancellable and restocks products.
 * Rules:
 * - Allowed statuses to cancel: 'pending', 'confirmed'
 * - Disallowed: 'shipped', 'delivered', 'cancelled'
 * Effects:
 * - order.status -> 'cancelled', order.cancelledAt = serverTimestamp()
 * - For each item: products.sales -= qty (not below 0), products.quantity += qty
 */
export async function cancelOrder(orderId) {
  if (!orderId) throw new Error('Missing order ID')

  const orderRef = doc(db, 'orders', orderId)

  await runTransaction(db, async (tx) => {
    const orderSnap = await tx.get(orderRef)
    if (!orderSnap.exists()) {
      throw new Error('Order not found')
    }
    const order = orderSnap.data()

    const status = (order.status || 'pending').toLowerCase()
    if (['shipped', 'delivered', 'cancelled'].includes(status)) {
      throw new Error(`Order cannot be cancelled (current status: ${status})`)
    }

    // Restock products and adjust sales
    const items = Array.isArray(order.items) ? order.items : []
    for (const item of items) {
      if (!item?.id || !item?.qty) continue
      const productRef = doc(db, 'products', item.id)
      const productSnap = await tx.get(productRef)
      if (!productSnap.exists()) continue
      const product = productSnap.data()

      const newSales = Math.max((product.sales || 0) - item.qty, 0)
      const newQty = (product.quantity || 0) + item.qty

      tx.update(productRef, {
        sales: newSales,
        quantity: newQty,
        updatedAt: serverTimestamp()
      })
    }

    tx.update(orderRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  })
}
