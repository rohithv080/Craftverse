import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { db, storage } from '../../firebase/firebaseConfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { FaArrowLeft, FaUpload, FaPlus } from 'react-icons/fa'

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
    // Ensure user is signed in and we have a UID before uploading
    if (!user || !user.uid) {
      const msg = 'You must be signed in to add a product.'
      setError(msg)
      show(msg, 'error')
      return
    }
    try {
      setLoading(true)
      const path = `products/${user.uid}/${Date.now()}-${imageFile.name}`
      console.log('=== UPLOAD DEBUG INFO ===')
      console.log('User object:', user)
      console.log('User UID:', user.uid)
      console.log('User auth state:', user ? 'authenticated' : 'not authenticated')
      console.log('Storage path:', path)
      console.log('File name:', imageFile.name)
      console.log('File size:', imageFile.size)
      console.log('Storage bucket:', storage.app.options.storageBucket)
      console.log('========================')
      
      const fileRef = ref(storage, path)
      console.log('Storage reference created:', fileRef.toString())
      
      await uploadBytes(fileRef, imageFile)
      console.log('Upload successful, getting download URL...')
      const imageUrl = await getDownloadURL(fileRef)
      
      // Add product to Firestore
      await addDoc(collection(db, 'products'), {
        sellerId: user.uid,
        sellerName: user.name || user.email?.split('@')[0],
        sellerEmail: user.email,
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
        sales: 0,
        status: 'active'
      })
      
      show('Product added successfully!')
      navigate('/seller/dashboard')
    } catch (err) {
      console.error('AddProduct upload error:', err)
      const msg = err?.message || 'Failed to add product'
      setError(msg)
      show(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/seller/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="text-sm" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product listing for your customers</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e)=>setImageFile(e.target.files?.[0] || null)} 
                  className="hidden" 
                  id="image-upload"
                  required 
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">
                    {imageFile ? (
                      <span className="text-orange-600 font-medium">{imageFile.name}</span>
                    ) : (
                      <>
                        <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input 
                  value={form.name} 
                  onChange={(e)=>setForm({...form, name:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select 
                  value={form.category} 
                  onChange={(e)=>setForm({...form, category:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  required 
                >
                  <option value="">Select a category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Pottery Items">Pottery Items</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea 
                  value={form.description} 
                  onChange={(e)=>setForm({...form, description:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  rows={4} 
                  placeholder="Describe your product in detail..."
                  required 
                />
              </div>
            </div>

            {/* Pricing and Quantity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={form.price} 
                  onChange={(e)=>setForm({...form, price:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="0.00"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available *</label>
                <input 
                  type="number" 
                  min="1" 
                  value={form.quantity} 
                  onChange={(e)=>setForm({...form, quantity:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  required 
                />
              </div>
            </div>

            {/* Location and Contact */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input 
                  value={form.address} 
                  onChange={(e)=>setForm({...form, address:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="Enter your business address"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input 
                  value={form.phone} 
                  onChange={(e)=>setForm({...form, phone:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="+91 98765 43210"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                <input 
                  value={form.upiId} 
                  onChange={(e)=>setForm({...form, upiId:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="username@upi"
                  required 
                />
              </div>
            </div>

            {/* Delivery Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Option</label>
                <select 
                  value={form.logistics} 
                  onChange={(e)=>setForm({...form, logistics:e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="self-pickup">Self Pickup</option>
                  <option value="home-delivery">Home Delivery</option>
                  <option value="both">Both Options</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                disabled={loading} 
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add New Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}