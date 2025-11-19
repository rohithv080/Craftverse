export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">Help Center</h1>
        <div className="space-y-4">
          <details className="card p-4" data-aos="fade-up" data-aos-delay="100">
            <summary className="font-medium cursor-pointer">How do I place an order?</summary>
            <p className="mt-2 text-gray-600">Browse products, add to cart, and complete checkout with your address and payment method.</p>
          </details>
          <details className="card p-4" data-aos="fade-up" data-aos-delay="200">
            <summary className="font-medium cursor-pointer">Can I track my order?</summary>
            <p className="mt-2 text-gray-600">We'll email updates as your order is packed and shipped. Tracking links appear in your order history.</p>
          </details>
          <details className="card p-4" data-aos="fade-up" data-aos-delay="300">
            <summary className="font-medium cursor-pointer">How do I contact a seller?</summary>
            <p className="mt-2 text-gray-600">Use the Contact Support form and mention the product; we'll connect you with the seller.</p>
          </details>
        </div>
      </div>
    </div>
  )
}
