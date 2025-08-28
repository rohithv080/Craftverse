import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      show('Logged in successfully')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'rgb(var(--primary))' }}>KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>Welcome back</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <button disabled={loading} className="w-full btn-primary disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
          </form>
          <p className="mt-4 text-sm" style={{ color: 'rgb(var(--muted))' }}>No account? <Link to="/signup" className="font-medium" style={{ color: 'rgb(var(--primary))' }}>Sign up</Link></p>
        </div>
      </div>
      <div className="hidden md:block" style={{ backgroundImage: 'linear-gradient(to bottom right, rgb(var(--primary-soft)), rgb(var(--card)))' }}>
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6" style={{ backgroundColor: 'rgb(var(--primary-soft))' }}></div>
            <p className="text-gray-700">Secure access to your marketplace. Manage your products and orders efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


