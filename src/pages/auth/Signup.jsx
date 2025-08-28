import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', name: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signup({ email: form.email, password: form.password, name: form.name })
      show('Signup successful')
      // small delay so onAuthStateChanged updates before ProtectedRoute evaluation
      await new Promise(r => setTimeout(r, 300))
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign up')
      show(err.message || 'Failed to sign up', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'rgb(var(--primary))' }}>KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>Create your account</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e)=>setForm({...form, confirm:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: 'rgb(var(--border))' }} required />
            </div>
            <button disabled={loading} className="w-full btn-primary disabled:opacity-60">{loading ? 'Creating...' : 'Sign Up'}</button>
          </form>
          <p className="mt-4 text-sm" style={{ color: 'rgb(var(--muted))' }}>Already have an account? <Link to="/login" className="font-medium" style={{ color: 'rgb(var(--primary))' }}>Login</Link></p>
        </div>
      </div>
      <div className="hidden md:block" style={{ backgroundImage: 'linear-gradient(to bottom right, rgb(var(--primary-soft)), rgb(var(--card)))' }}>
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6" style={{ backgroundColor: 'rgb(var(--primary-soft))' }}></div>
            <p className="text-gray-700">Join KAITHIRAN to buy and sell locally with ease.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


