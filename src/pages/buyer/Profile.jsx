import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../contexts/AuthContext'
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, FaSave, FaTimes, FaExclamationCircle } from 'react-icons/fa'
import { validateName, validatePhone, validateAddress, validateCity, validateState, validatePincode } from '../../utils/validation'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!user) return
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProfile(docSnap.data())
      } else {
        // Initialize with user email if available
        setProfile(prev => ({ ...prev, email: user.email || '' }))
      }
    } catch (error) {
      // Error loading profile, use default values
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    if (!validateAllFields()) {
      return
    }
    
    setSaving(true)
    try {
      const docRef = doc(db, 'users', user.uid)
      await setDoc(docRef, profile, { merge: true })
      setIsEditing(false)
      setTouched({})
    } catch (error) {
      // Error saving profile, show error state
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    loadProfile() // Reload original data
    setIsEditing(false)
    setErrors({})
    setTouched({})
  }

  const handleProfileChange = (field, value) => {
    setProfile({...profile, [field]: value})
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  const handleBlur = (field) => {
    setTouched({...touched, [field]: true})
    validateField(field, profile[field])
  }

  const validateField = (field, value) => {
    let errorMsg = ''
    // Only validate if there's a value (profile fields are optional)
    if (value) {
      let result = { valid: true, message: '' }
      switch (field) {
        case 'fullName':
          result = validateName(value)
          break
        case 'phone':
          result = validatePhone(value)
          break
        case 'address':
          result = validateAddress(value)
          break
        case 'city':
          result = validateCity(value)
          break
        case 'state':
          result = validateState(value)
          break
        case 'pincode':
          result = validatePincode(value)
          break
        default:
          break
      }
      errorMsg = result.message
    }
    setErrors(prev => ({...prev, [field]: errorMsg}))
    return errorMsg
  }

  const validateAllFields = () => {
    const newErrors = {}
    // Only validate fields that have values
    if (profile.fullName) newErrors.fullName = validateName(profile.fullName).message
    if (profile.phone) newErrors.phone = validatePhone(profile.phone).message
    if (profile.address) newErrors.address = validateAddress(profile.address).message
    if (profile.city) newErrors.city = validateCity(profile.city).message
    if (profile.state) newErrors.state = validateState(profile.state).message
    if (profile.pincode) newErrors.pincode = validatePincode(profile.pincode).message
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-orange-500 text-lg">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaEdit className="text-sm" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60"
                >
                  <FaSave className="text-sm" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="text-sm" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.fullName && errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your full name"
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-xs" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.fullName || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter phone number"
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-xs" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {profile.email || user?.email || 'Not provided'}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  City
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => handleProfileChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.city && errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter city"
                    />
                    {touched.city && errors.city && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-xs" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.city || 'Not provided'}
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  State
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => handleProfileChange('state', e.target.value)}
                      onBlur={() => handleBlur('state')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.state && errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter state"
                    />
                    {touched.state && errors.state && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-xs" />
                        {errors.state}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.state || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Pincode
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={profile.pincode}
                      onChange={(e) => handleProfileChange('pincode', e.target.value)}
                      onBlur={() => handleBlur('pincode')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.pincode && errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter pincode"
                    />
                    {touched.pincode && errors.pincode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-xs" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile.pincode || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Full Address
              </label>
              {isEditing ? (
                <div>
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${touched.address && errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your complete address"
                  />
                  {touched.address && errors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="text-xs" />
                      {errors.address}
                    </p>
                  )}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[60px]">
                  {profile.address || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-2">0</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-500 mb-2">₹0</div>
            <div className="text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">0</div>
            <div className="text-gray-600">Wishlist Items</div>
          </div>
        </div>
      </div>
    </div>
  )
}
