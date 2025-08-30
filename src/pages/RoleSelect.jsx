import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaUserTie, FaShoppingCart, FaStore, FaHandshake, FaUsers, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'

export default function RoleSelect() {
  const { user, setUserRole, loading } = useAuth()
  const navigate = useNavigate()
  const [roleLoading, setRoleLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  // Debug logging
  useEffect(() => {
    console.log('RoleSelect: User state:', user)
  }, [user])

  const handleRoleSelect = async (role) => {
    if (!user) {
      alert('Please sign in to continue')
      return
    }
    
    console.log('Setting role:', role, 'for user:', user.uid)
    setSelectedRole(role)
    setRoleLoading(true)
    
    try {
      // Set the user role in the database
      const result = await setUserRole(role)
      console.log('Role set successfully:', result)
      
      // Navigate based on selected role
      if (role === 'seller') {
        navigate('/seller/dashboard', { replace: true })
      } else if (role === 'buyer') {
        navigate('/buyer/products', { replace: true })
      }
      
    } catch (error) {
      console.error('Error setting role:', error)
      alert('Failed to set role. Please try again.')
      setRoleLoading(false)
      setSelectedRole(null)
    }
  }

  // If auth finished and there's no user, redirect to login (do not navigate during render)
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found after auth resolved, redirecting to login')
      navigate('/auth/login', { replace: true })
    }
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">KAITHIRAN</h1>
          <p className="text-xl text-gray-700 mb-2">Welcome to your marketplace!</p>
          <p className="text-gray-600">Choose your role to start your journey with us</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">Welcome back, {user.name || user.email?.split('@')[0]}!</p>
          )}
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Seller Card */}
          <div className="group">
            <button 
              onClick={() => handleRoleSelect('seller')}
              disabled={roleLoading}
              className="w-full text-left block"
            >
              <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full border-2 ${
                selectedRole === 'seller' 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-transparent hover:border-orange-200'
              } ${roleLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {roleLoading && selectedRole === 'seller' ? (
                      <FaSpinner className="text-3xl text-orange-500 animate-spin" />
                    ) : (
                      <FaUserTie className="text-3xl text-orange-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Seller</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Start selling your products locally. Manage inventory, track sales, and grow your business with our platform.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaStore className="text-orange-500" />
                      <span>Create and manage product listings</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaHandshake className="text-orange-500" />
                      <span>Connect with local buyers</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaUsers className="text-orange-500" />
                      <span>Track orders and sales analytics</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <span className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedRole === 'seller' && roleLoading
                        ? 'bg-orange-400 text-white'
                        : 'bg-orange-500 text-white group-hover:bg-orange-600'
                    }`}>
                      {roleLoading && selectedRole === 'seller' ? 'Setting up...' : 'Start Selling'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Buyer Card */}
          <div className="group">
            <button 
              onClick={() => handleRoleSelect('buyer')}
              disabled={roleLoading}
              className="w-full text-left block"
            >
              <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full border-2 ${
                selectedRole === 'buyer' 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-transparent hover:border-blue-200'
              } ${roleLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {roleLoading && selectedRole === 'buyer' ? (
                      <FaSpinner className="text-3xl text-blue-500 animate-spin" />
                    ) : (
                      <FaShoppingCart className="text-3xl text-blue-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Buyer</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Discover amazing products from local sellers. Shop with convenience and support your community.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span>Find products near you</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaShoppingCart className="text-blue-500" />
                      <span>Easy shopping experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaHandshake className="text-blue-500" />
                      <span>Support local businesses</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <span className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedRole === 'buyer' && roleLoading
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-500 text-white group-hover:bg-blue-600'
                    }`}>
                      {roleLoading && selectedRole === 'buyer' ? 'Setting up...' : 'Start Shopping'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">You can change your role anytime from your profile settings</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span>🔒 Secure & Trusted</span>
            <span>🚚 Fast Local Delivery</span>
            <span>💳 Multiple Payment Options</span>
          </div>
        </div>
      </div>
    </div>
  )
}


