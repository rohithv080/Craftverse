import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import RoleSelect from './pages/RoleSelect.jsx'
import AddProduct from './pages/seller/AddProduct.jsx'
import SellerDashboard from './pages/seller/Dashboard.jsx'
import Products from './pages/buyer/Products.jsx'
import Cart from './pages/buyer/Cart.jsx'
import Checkout from './pages/buyer/Checkout.jsx'
import OrderConfirmation from './pages/buyer/OrderConfirmation.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ color: 'rgb(var(--primary))' }}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
        <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute><RoleSelect /></ProtectedRoute>} />
                <Route path="/seller/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
                <Route path="/buyer/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/buyer/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/buyer/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/buyer/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
        </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
