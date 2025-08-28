import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme, themes } from '../contexts/ThemeContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, setTheme, cycleTheme } = useTheme()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b" style={{ backgroundColor: 'rgb(var(--card))' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold" style={{ color: 'rgb(var(--primary))' }}>KAITHIRAN</Link>
          <nav className="flex items-center gap-3">
            <Link to="/buyer/products" className="text-sm">Products</Link>
            <Link to="/seller/dashboard" className="text-sm">Dashboard</Link>
            <select aria-label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="text-sm border rounded-md px-2 py-1" style={{ backgroundColor: 'rgb(var(--card))', color: 'rgb(var(--text))', borderColor: 'rgb(var(--border))' }}>
              <option value={themes.light}>White</option>
              <option value={themes.sand}>Light Brown</option>
              <option value={themes.cocoa}>Dark Brown</option>
            </select>
            {user && (
              <button onClick={logout} className="btn-secondary text-sm">Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t" style={{ backgroundColor: 'rgb(var(--card))' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm" style={{ color: 'rgb(var(--muted))' }}>
          © {new Date().getFullYear()} KAITHIRAN. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


