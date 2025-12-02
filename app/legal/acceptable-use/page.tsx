import Link from 'next/link'
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react'

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Acceptable Use Policy</h1>
          </div>
          <p className="text-gray-600 mt-2">Last updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Acceptable Use Policy ("AUP") outlines the rules, restrictions, and prohibited activities for all users and third-party vendors ("Sellers") using the platform. By accessing or using the platform, Sellers agree to comply with this policy in full.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The purpose of this policy is to maintain a secure, lawful, and trustworthy marketplace for customers and sellers.
            </p>
          </section>

          {/* General Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. General Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Sellers must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and complete business and identity information</li>
              <li>Comply with all applicable laws and regulations related to e-commerce, consumer protection, product safety, and data protection</li>
              <li>Ensure all listed products are genuine, safe, and accurately described</li>
              <li>Fulfill all orders in a timely manner and maintain a high standard of customer service</li>
              <li>Only use the platform for lawful commercial purposes</li>
            </ul>
          </section>

          {/* Prohibited Items */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prohibited Items and Activities</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-red-900 text-sm">
                Sellers are strictly prohibited from listing, selling, promoting, or engaging in any of the following:
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3.1 Illegal or Restricted Products</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Illegal drugs or controlled substances</li>
              <li>Weapons, ammunition, explosives</li>
              <li>Counterfeit, pirated, or stolen goods</li>
              <li>Medical products or pharmaceuticals requiring licenses</li>
              <li>Hazardous materials</li>
              <li>Adult or pornographic content</li>
              <li>Hate materials or discriminatory items</li>
              <li>Products violating intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3.2 Fraudulent or Harmful Activities</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Money laundering or fraudulent transactions</li>
              <li>Misrepresentation of product quality, origin, or condition</li>
              <li>Fake reviews or manipulating ratings</li>
              <li>Data scraping, hacking attempts, or security breaches</li>
              <li>Abusive behavior towards customers or staff</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3.3 Misuse of Platform Systems</h3>
            <p className="text-gray-700 leading-relaxed mb-4">Sellers may not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Circumvent platform fees or commission structures</li>
              <li>Attempt to conduct off-platform payments with customers</li>
              <li>Interfere with automated systems or analytics</li>
              <li>Create multiple accounts for abuse or evasion</li>
            </ul>
          </section>

          {/* Shipping and Fulfillment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping, Fulfillment, and Customer Service Standards</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Sellers must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate shipping times</li>
              <li>Use reliable courier methods</li>
              <li>Update order statuses promptly</li>
              <li>Respond to support inquiries within reasonable timeframes</li>
              <li>Provide proof of delivery when needed</li>
              <li>Resolve customer issues professionally and without delay</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 italic">
              Repeated failure to meet service standards may result in penalties, including account suspension.
            </p>
          </section>

          {/* Payment & Payout */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment & Payout Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Payments for customer orders are received by the platform</li>
              <li>The platform deducts applicable fees and a 10% commission</li>
              <li>Remaining funds are disbursed to Sellers via their registered payout method</li>
              <li>Sellers must provide accurate banking information and are responsible for ensuring it remains updated</li>
              <li>Any attempt to bypass the payment system is considered a violation of this policy</li>
            </ul>
          </section>

          {/* Dispute Handling */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Dispute Handling</h2>
            <p className="text-gray-700 leading-relaxed mb-4">In the event of a dispute:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>The customer submits a complaint through the platform</li>
              <li>The platform reviews evidence from both customer and Seller</li>
              <li>If the Seller is at fault, refunds or adjustments may be made from the Seller's balance</li>
              <li>Sellers must cooperate fully with investigations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 italic">
              Non-cooperative behavior may result in suspension or removal.
            </p>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Enforcement & Penalties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Violations of this AUP may result in one or more of the following actions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Warning notice</li>
              <li>Removal of product listings</li>
              <li>Temporarily limiting account functionality</li>
              <li>Permanent account suspension</li>
              <li>Withholding payouts in cases of fraud or legal requests</li>
              <li>Reporting unlawful activities to authorities</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The platform reserves the right to take action at its discretion to protect buyers and the marketplace.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              This Acceptable Use Policy may be updated from time to time. Continued use of the platform constitutes acceptance of the latest version.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions regarding this Acceptable Use Policy, Sellers may contact platform support at{' '}
              <a href="mailto:rerglobalventures@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                rerglobalventures@gmail.com
              </a>
            </p>
          </section>

        </div>

        {/* Back to Footer Links */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}