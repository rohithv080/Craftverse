import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { FaCheckCircle, FaUserTie, FaShoppingCart } from 'react-icons/fa'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', name: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signup({ email: form.email, password: form.password, name: form.name });
      
      setShowSuccessPopup(true)
      show('Account created successfully!')
      
      // Show success message for 2 seconds then navigate to homepage
      setTimeout(() => {
        setShowSuccessPopup(false)
        navigate('/', { replace: true })
      }, 2000)
    } catch (err) {
      const errorMessage = err.code ? `${err.code}: ${err.message}` : (err.message || 'Failed to sign up');
      setError(errorMessage)
      show(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-orange-500" data-aos="fade-down">KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-900" data-aos="fade-up" data-aos-delay="100">Create your account</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e)=>setForm({...form, email:e.target.value})} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e)=>setForm({...form, name:e.target.value})} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e)=>setForm({...form, password:e.target.value})} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={form.confirm} 
                onChange={(e)=>setForm({...form, confirm:e.target.value})} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                required 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-60 font-medium"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account? <Link to="/auth/login" className="font-medium text-orange-500 hover:text-orange-600">Login</Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6 bg-orange-100 flex items-center justify-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="text-center">
                <div className="text-6xl mb-4" data-aos="bounce" data-aos-delay="600">🛍️</div>
                <p className="text-gray-700 text-lg" data-aos="fade-up" data-aos-delay="700">Join KAITHIRAN</p>
                <p className="text-gray-600" data-aos="fade-up" data-aos-delay="800">Buy and sell locally with ease</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Created Successfully!</h3>
            <p className="text-gray-600 mb-4">Welcome to KAITHIRAN! Now choose your role to continue.</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaUserTie className="text-orange-500" />
                <span>Seller</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShoppingCart className="text-orange-500" />
                <span>Buyer</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Redirecting to role selection...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


