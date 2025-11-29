// Form validation utilities

// Email validation
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }
  return { valid: true, message: '' }
}

// Password validation
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' }
  }
  if (password.length > 50) {
    return { valid: false, message: 'Password must be less than 50 characters' }
  }
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'Password must contain at least one letter and one number' }
  }
  return { valid: true, message: '' }
}

// Name validation
export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' }
  }
  if (name.trim().length > 50) {
    return { valid: false, message: 'Name must be less than 50 characters' }
  }
  // Only letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens and apostrophes' }
  }
  return { valid: true, message: '' }
}

// Phone validation (Indian format)
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, message: 'Phone number is required' }
  }
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '')
  // Indian phone: 10 digits, optionally starting with +91 or 91
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, message: 'Please enter a valid 10-digit Indian phone number' }
  }
  return { valid: true, message: '' }
}

// Pincode validation (Indian format)
export function validatePincode(pincode) {
  if (!pincode || !pincode.trim()) {
    return { valid: false, message: 'Pincode is required' }
  }
  const pincodeRegex = /^[1-9][0-9]{5}$/
  if (!pincodeRegex.test(pincode.trim())) {
    return { valid: false, message: 'Please enter a valid 6-digit pincode' }
  }
  return { valid: true, message: '' }
}

// Address validation
export function validateAddress(address) {
  if (!address || !address.trim()) {
    return { valid: false, message: 'Address is required' }
  }
  if (address.trim().length < 10) {
    return { valid: false, message: 'Please enter a complete address (at least 10 characters)' }
  }
  if (address.trim().length > 200) {
    return { valid: false, message: 'Address must be less than 200 characters' }
  }
  return { valid: true, message: '' }
}

// City validation
export function validateCity(city) {
  if (!city || !city.trim()) {
    return { valid: false, message: 'City is required' }
  }
  if (city.trim().length < 2) {
    return { valid: false, message: 'City name must be at least 2 characters' }
  }
  const cityRegex = /^[a-zA-Z\s'-]+$/
  if (!cityRegex.test(city.trim())) {
    return { valid: false, message: 'City name can only contain letters' }
  }
  return { valid: true, message: '' }
}

// State validation
export function validateState(state) {
  if (!state || !state.trim()) {
    return { valid: false, message: 'State is required' }
  }
  if (state.trim().length < 2) {
    return { valid: false, message: 'State name must be at least 2 characters' }
  }
  const stateRegex = /^[a-zA-Z\s'-]+$/
  if (!stateRegex.test(state.trim())) {
    return { valid: false, message: 'State name can only contain letters' }
  }
  return { valid: true, message: '' }
}

// Required field validation
export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` }
  }
  return { valid: true, message: '' }
}

// Price validation
export function validatePrice(price) {
  if (!price && price !== 0) {
    return { valid: false, message: 'Price is required' }
  }
  const numPrice = Number(price)
  if (isNaN(numPrice) || numPrice <= 0) {
    return { valid: false, message: 'Please enter a valid price greater than 0' }
  }
  if (numPrice > 10000000) {
    return { valid: false, message: 'Price cannot exceed ₹1,00,00,000' }
  }
  return { valid: true, message: '' }
}

// Quantity validation
export function validateQuantity(quantity) {
  if (!quantity && quantity !== 0) {
    return { valid: false, message: 'Quantity is required' }
  }
  const numQty = Number(quantity)
  if (isNaN(numQty) || !Number.isInteger(numQty) || numQty < 1) {
    return { valid: false, message: 'Please enter a valid quantity (at least 1)' }
  }
  if (numQty > 10000) {
    return { valid: false, message: 'Quantity cannot exceed 10,000' }
  }
  return { valid: true, message: '' }
}
