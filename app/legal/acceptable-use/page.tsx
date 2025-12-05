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
              This Acceptable Use Policy ("AUP") outlines the rules, restrictions, and prohibited activities 
              for all users, Sellers, and third-party service providers ("Sellers") using the platform. 
              By accessing or using the platform, Sellers agree to comply with this AUP, the Terms and Conditions, 
              and all applicable laws.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The purpose of this policy is to maintain a secure, compliant, and trustworthy environment for 
              customers, Sellers, and payment partners.
            </p>
          </section>

          {/* General Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. General Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Sellers must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide complete, accurate, and verifiable business and identity information</li>
              <li>Comply with all applicable laws relating to e-commerce, consumer protection, advertising, 
                  data protection (POPIA), and product safety</li>
              <li>Ensure all products or services listed are lawful, genuine, safe, and accurately described</li>
              <li>Fulfill orders promptly and maintain high customer service standards</li>
              <li>Use the platform solely for lawful commercial purposes</li>
              <li>Comply with this AUP, our payment providers' policies, and applicable financial regulations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The platform may request additional verification at any time, including ID, business registration, 
              invoices, or proof of inventory.
            </p>
          </section>

          {/* Prohibited Items */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prohibited Items and Activities</h2>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">3.1 Illegal or Restricted Products</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Sellers may not list, sell, promote, or distribute:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Illegal drugs, controlled substances, or drug paraphernalia</li>
              <li>Weapons, ammunition, explosives, or military-grade equipment</li>
              <li>Counterfeit, pirated, or stolen goods</li>
              <li>Medical or pharmaceutical products requiring licenses</li>
              <li>Hazardous or restricted materials</li>
              <li>Adult, pornographic, or sexually explicit content</li>
              <li>Hate, discriminatory, or violent materials</li>
              <li>Items infringing intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3.2 Fraudulent or Harmful Activities</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-red-900 text-sm font-semibold">
                Strictly prohibited:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Fraud, money laundering, or misuse of the payment system</li>
              <li>Transactions designed to artificially inflate revenue</li>
              <li>Misrepresentation of product quality, compliance, or origin</li>
              <li>Manipulating reviews, ratings, or customer feedback</li>
              <li>Attempting to access or disrupt platform systems (scraping, hacking, tampering)</li>
              <li>Abusive, threatening, or unprofessional conduct</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3.3 Misuse of Platform Systems</h3>
            <p className="text-gray-700 leading-relaxed mb-3">Sellers may not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Attempt to bypass platform fees, commissions, or payout processes</li>
              <li>Encourage customers to complete payment off-platform</li>
              <li>Open multiple or duplicate accounts for manipulation or avoidance</li>
              <li>Alter or interfere with analytics, reporting, or tracking systems</li>
            </ul>
          </section>

          {/* Shipping and Fulfillment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping, Fulfillment & Customer Service Standards</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Sellers must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate shipping times and stock availability</li>
              <li>Use reliable and trackable courier services where applicable</li>
              <li>Update order statuses promptly</li>
              <li>Respond to customer and platform inquiries within reasonable timeframes</li>
              <li>Provide proof of delivery when required</li>
              <li>Resolve customer complaints professionally and in good faith</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 italic">
              Repeated non-compliance may lead to penalties or account suspension.
            </p>
          </section>

          {/* Payment & Payout */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment & Payout Rules</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All customer payments are processed through the platform's approved payment providers.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The platform collects payment, deducts applicable fees, and applies a 10% commission 
              (or the commission agreed in writing).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Remaining funds are paid out to the Seller via their registered payout method.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sellers must ensure their banking details are accurate and up to date.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3 font-semibold">
              Payouts may be delayed or withheld for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Fraud review</li>
              <li>Risk assessment</li>
              <li>Chargeback investigations</li>
              <li>Legal or regulatory requirements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
              Sellers may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Request or accept off-platform payments</li>
              <li>Attempt to circumvent payout systems or commission structures</li>
              <li>Process or simulate fake orders to trigger payouts</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The platform reserves the right to reverse transactions, adjust balances, or issue refunds 
              where necessary for fraud prevention or customer protection.
            </p>
          </section>

          {/* Dispute Handling */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Dispute, Refund & Chargeback Handling</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Customers must submit disputes through the platform.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The platform will review all evidence provided by both the customer and the Seller.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              If the Seller is found at fault, refunds, partial refunds, or adjustments may be deducted 
              from the Seller's account balance or future payouts.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chargebacks initiated by customers may result in additional fees or penalties for Sellers.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sellers must fully cooperate with all dispute, refund, and chargeback investigations.
            </p>
            <p className="text-gray-700 leading-relaxed italic">
              Failure to comply may result in suspension or removal.
            </p>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Enforcement & Penalties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Violations of this AUP may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>A warning or mandatory corrective action</li>
              <li>Removal of product listings</li>
              <li>Temporary account restrictions</li>
              <li>Permanent account suspension</li>
              <li>Withholding or delaying payouts for investigation</li>
              <li>Reporting unlawful activity to authorities</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              The platform reserves the right to take any action necessary to protect customers, Sellers, 
              the business, and payment partners.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              This AUP may be updated periodically. Continued use of the platform constitutes acceptance 
              of the most recent version.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions or compliance inquiries, please contact:{' '}
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