import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'
import { useToast } from '../../contexts/ToastContext'
import { FaExclamationCircle, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { validateEmail } from '../../utils/validation'

export default function ForgotPassword() {
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  function handleEmailChange(value) {
    setEmail(value)
    if (emailError) setEmailError('')
    if (error) setError('')
  }

  function handleBlur() {
    const result = validateEmail(email)
    if (!result.valid) {
      setEmailError(result.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setEmailError('')

    const result = validateEmail(email)
    if (!result.valid) {
      setEmailError(result.message)
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setEmailSent(true)
      show('Password reset email sent!', 'success')
    } catch (err) {
      let errorMessage = 'Failed to send reset email'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later'
      }
      setError(errorMessage)
      show(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setEmailSent(false)} 
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                try again
              </button>
            </p>
            <Link 
              to="/auth/login" 
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <FaArrowLeft className="text-sm" />
              Back to Login
            </Link>
          </div>
        </div>
        <div className="hidden md:block bg-gradient-to-br from-orange-100 to-orange-200">
          <div className="h-full w-full flex items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="w-72 h-72 rounded-3xl mx-auto mb-6 bg-orange-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📧</div>
                  <p className="text-gray-700 text-lg">Email Sent!</p>
                  <p className="text-gray-600">Check your inbox</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <FaArrowLeft className="text-sm" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-orange-500">KAITHIRAN</h1>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Forgot your password?</h2>
          <p className="text-gray-600 mb-6">
            No worries! Enter your email and we'll send you a reset link.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <FaExclamationCircle />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleBlur}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  emailError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                autoFocus
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationCircle className="text-xs" />
                  {emailError}
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-60 font-medium"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-gray-600 text-center">
            Remember your password?{' '}
            <Link to="/auth/login" className="font-medium text-orange-500 hover:text-orange-600">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-72 h-72 rounded-3xl mx-auto mb-6 bg-orange-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔑</div>
                <p className="text-gray-700 text-lg">Reset Password</p>
                <p className="text-gray-600">We'll help you recover access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
