import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, storage } from '../../firebase/firebaseConfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export default function AddProduct() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const { show } = useToast()
  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    logistics: 'self-pickup',
    upiId: '',
    phone: '',
    quantity: 1,
    price: '',
    description: '',
    lat: '',
    lng: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!imageFile) { setError('Please upload product image'); return }
    try {
      setLoading(true)
      const fileRef = ref(storage, `products/${user.uid}/${Date.now()}-${imageFile.name}`)
      await uploadBytes(fileRef, imageFile)
      const imageUrl = await getDownloadURL(fileRef)
      await addDoc(collection(db, 'products'), {
        sellerId: user.uid,
        name: form.name,
        category: form.category,
        address: form.address,
        logistics: form.logistics,
        upiId: form.upiId,
        phone: form.phone,
        quantity: Number(form.quantity),
        price: Number(form.price),
        description: form.description,
        imageUrl,
        location: {
          lat: form.lat ? Number(form.lat) : null,
          lng: form.lng ? Number(form.lng) : null
        },
        createdAt: serverTimestamp(),
        sales: 0
      })
      show('Product added successfully')
      navigate('/buyer/products')
    } catch (err) {
      setError(err.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Add New Product</h1>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files?.[0] || null)} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logistics</label>
            <select value={form.logistics} onChange={(e)=>setForm({...form, logistics:e.target.value})} className="w-full border rounded-md px-3 py-2">
              <option value="self-pickup">Self Pickup</option>
              <option value="home-delivery">Home Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <input value={form.upiId} onChange={(e)=>setForm({...form, upiId:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input type="number" min="1" value={form.quantity} onChange={(e)=>setForm({...form, quantity:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" min="0" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full border rounded-md px-3 py-2" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (optional)</label>
            <input value={form.lat} onChange={(e)=>setForm({...form, lat:e.target.value})} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (optional)</label>
            <input value={form.lng} onChange={(e)=>setForm({...form, lng:e.target.value})} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-medium disabled:opacity-60">{loading ? 'Adding...' : 'Add New Product'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}


