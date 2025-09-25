export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">Contact Support</h1>
        <p className="text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="100">Have a question or need help? Reach out and we'll get back to you.</p>
        <div className="card p-6 space-y-4" data-aos="fade-up" data-aos-delay="200">
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <a className="text-orange-600 font-medium" href="mailto:support@kaithiran.com">support@kaithiran.com</a>
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <a className="text-orange-600 font-medium" href="tel:+919876543210">+91 98765 43210</a>
          </div>
        </div>
      </div>
    </div>
  )
}
