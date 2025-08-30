import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      // Always redirect to role selection after login
      navigate('/role-select', { replace: true })
    }
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      show('Logged in successfully')
      // Navigation will be handled by useEffect above
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
          <h1 className="text-3xl font-bold mb-6 text-orange-500">KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Welcome back</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e)=>setForm({...form, password:e.target.value})} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                required 
              />
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
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6 bg-orange-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <p className="text-gray-700 text-lg">Welcome Back</p>
                <p className="text-gray-600">Access your marketplace dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


