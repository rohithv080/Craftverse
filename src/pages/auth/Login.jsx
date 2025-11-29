import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { FaExclamationCircle } from 'react-icons/fa'
import { validateEmail } from '../../utils/validation'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  function handleChange(field, value) {
    setForm({ ...form, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  function handleBlur(field) {
    if (field === 'email') {
      const result = validateEmail(form.email)
      if (!result.valid) {
        setErrors({ ...errors, email: result.message })
      }
    }
  }

  function validateForm() {
    const newErrors = {}
    
    const emailResult = validateEmail(form.email)
    if (!emailResult.valid) newErrors.email = emailResult.message
    
    if (!form.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      await login(form)
      show('Logged in successfully')
    } catch (err) {
      setError(err.message || 'Failed to login')
      show(err.message || 'Failed to login', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-orange-500" data-aos="fade-down">KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-900" data-aos="fade-up" data-aos-delay="100">Welcome back</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                required 
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationCircle className="text-xs" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                required 
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationCircle className="text-xs" />
                  {errors.password}
                </p>
              )}
              <div className="mt-1 text-right">
                <Link to="/auth/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-60 font-medium"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            No account? <Link to="/auth/signup" className="font-medium text-orange-500 hover:text-orange-600">Sign up</Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6 bg-orange-100 flex items-center justify-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="text-center">
                <div className="text-6xl mb-4" data-aos="bounce" data-aos-delay="600">🔐</div>
                <p className="text-gray-700 text-lg" data-aos="fade-up" data-aos-delay="700">Welcome Back</p>
                <p className="text-gray-600" data-aos="fade-up" data-aos-delay="800">Access your marketplace dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


