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
      show('Account created successfully')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Create your account</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e)=>setForm({...form, confirm:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 font-medium disabled:opacity-60">{loading ? 'Creating...' : 'Sign Up'}</button>
          </form>
          <p className="mt-4 text-sm text-gray-600">Already have an account? <Link to="/login" className="text-purple-700 font-medium">Login</Link></p>
        </div>
      </div>
      <div className="hidden md:block bg-gradient-to-br from-purple-100 to-white">
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 bg-purple-200 rounded-3xl mx-auto mb-6"></div>
            <p className="text-gray-700">Join KAITHIRAN to buy and sell locally with ease.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


