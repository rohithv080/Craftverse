import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./index.css";
import Layout from "./components/Layout.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import RoleSelect from "./pages/RoleSelect.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import EditProduct from "./pages/seller/EditProduct.jsx";
import SellerDashboard from "./pages/seller/Dashboard.jsx";
import ReceivedOrders from "./pages/seller/ReceivedOrders.jsx";
import Products from "./pages/buyer/Products.jsx";
import Cart from "./pages/buyer/Cart.jsx";
import Checkout from "./pages/buyer/Checkout.jsx";
import OrderConfirmation from "./pages/buyer/OrderConfirmation.jsx";
import Profile from "./pages/buyer/Profile.jsx";
import OrderHistory from "./pages/buyer/OrderHistory.jsx";
import Wishlist from "./pages/buyer/Wishlist.jsx";
import Home from "./pages/Home.jsx";
import Support from "./pages/Support.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import Returns from "./pages/Returns.jsx";
import Shipping from "./pages/Shipping.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-500">
        Loading...
      </div>
    );
  }
  return user ? children : <Navigate to="/auth/login" replace />;
}
function App() {
  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.init({
        duration: 800,
        offset: 100,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: false,
        startEvent: 'DOMContentLoaded'
      });
      console.log('🎬 AOS (Animate On Scroll) initialized!');
      
      // Force refresh after a short delay
      setTimeout(() => {
        AOS.refresh();
        console.log('🔄 AOS refreshed');
      }, 100);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="min-h-screen relative">
                {/* App Routes */}
                <Routes>
                  {/* Auth routes - no layout */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/signup" element={<Signup />} />
                  {/* Role selection - no layout */}
                  <Route path="/role-select" element={<ProtectedRoute><RoleSelect /></ProtectedRoute>}/>
                  {/* Public routes with layout */}
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    {/* Scroll to top on navigation helper */}
                    {/* Protected routes */}
                    <Route path="/support" element={<Support />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route
                      path="/seller/add"
                      element={
                        <ProtectedRoute>
                          <AddProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller/edit/:id"
                      element={
                        <ProtectedRoute>
                          <EditProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller/dashboard"
                      element={
                        <ProtectedRoute>
                          <SellerDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller/orders"
                      element={
                        <ProtectedRoute>
                          <ReceivedOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/products"
                      element={
                        <ProtectedRoute>
                          <Products />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/order-confirmation"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                  <Route
                    path="/buyer/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );  
}
export default App;
