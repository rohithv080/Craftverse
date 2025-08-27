import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-purple-700">KAITHIRAN</Link>
          <nav className="flex items-center gap-3">
            <Link to="/buyer/products" className="text-sm">Products</Link>
            <Link to="/seller/dashboard" className="text-sm">Dashboard</Link>
            {user && (
              <button onClick={logout} className="btn-secondary text-sm">Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} KAITHIRAN. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


