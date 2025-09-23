import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { db, storage } from '../../firebase/firebaseConfig'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { FaArrowLeft, FaUpload, FaSave } from 'react-icons/fa'

export default function EditProduct() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
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
    lng: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [error, setError] = useState('')

  // Load existing product data
  useEffect(() => {
    if (!id || !user) return
    
    const loadProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id))
        if (!productDoc.exists()) {
          setError('Product not found')
          return
        }
        
        const productData = productDoc.data()
        
        // Check if current user owns this product
        if (productData.sellerId !== user.uid) {
          setError('You can only edit your own products')
          return
        }
        
        // Populate form with existing data
        setForm({
          name: productData.name || '',
          category: productData.category || '',
          address: productData.address || '',
          logistics: productData.logistics || 'self-pickup',
          upiId: productData.upiId || '',
          phone: productData.phone || '',
          quantity: productData.quantity || 1,
          price: productData.price || '',
          description: productData.description || '',
          lat: productData.location?.lat || '',
          lng: productData.location?.lng || '',
          imageUrl: productData.imageUrl || ''
        })
      } catch (err) {
        setError('Failed to load product data')
      } finally {
        setLoadingProduct(false)
      }
    }
    
    loadProduct()
  }, [id, user])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    try {
      setLoading(true)
      let imageUrl = form.imageUrl // Keep existing image if no new image uploaded
      
      // Upload new image if selected
      if (imageFile) {
        const fileRef = ref(storage, `products/${user.uid}/${Date.now()}-${imageFile.name}`)
        await uploadBytes(fileRef, imageFile)
        imageUrl = await getDownloadURL(fileRef)
      }
      
      // Update product in Firestore
      await updateDoc(doc(db, 'products', id), {
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
        updatedAt: serverTimestamp()
      })
      
      show('Product updated successfully!')
      navigate('/seller/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to update product')
      show(err.message || 'Failed to update product', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <Link 
            to="/seller/dashboard" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <FaArrowLeft className="text-sm" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product listing details</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              {form.imageUrl && !imageFile && (
                <div className="mb-4">
                  <img 
                    src={form.imageUrl} 
                    alt="Current product" 
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-sm text-gray-500 mt-2">Current image (upload a new one to replace)</p>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e)=>setImageFile(e.target.files?.[0] || null)} 
                  className="hidden" 
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">
                    {imageFile ? (
                      <span className="text-orange-600 font-medium">{imageFile.name}</span>
                    ) : (
                      <>
                        <span className="font-medium text-orange-600">Click to upload new image</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB (optional)</p>
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
                  min="0" 
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
                    Updating Product...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Product
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