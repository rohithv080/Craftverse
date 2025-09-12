import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-[72px] font-extrabold text-gray-900">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Page not found</h1>
        <p className="text-gray-600 mt-2">The page you are looking for doesn’t exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/buyer/products" className="btn-secondary">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}


