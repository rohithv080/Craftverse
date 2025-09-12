import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export function subscribeToProducts(onUpdate) {
  const unsub = onSnapshot(collection(db, 'products'), (snap) => {
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    onUpdate(list)
  })
  return unsub
}
