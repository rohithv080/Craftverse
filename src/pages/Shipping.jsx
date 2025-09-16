export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        <div className="card p-6 space-y-3 text-gray-700">
          <p>We ship across India with trusted partners. Delivery typically takes 2-6 business days depending on your location and the seller.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Free delivery on eligible orders above ₹500.</li>
            <li>Real-time updates will be sent to your email.</li>
            <li>Support for home delivery and self pickup where available.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


