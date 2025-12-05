import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                These Terms & Conditions ("Terms") govern the use of the Stone Connect website and services ("the Platform"). 
                By accessing or transacting on the Platform, you agree to be bound by these Terms.
              </p>
              <p>
                Stone Connect is owned and operated by RER Global Ventures (Pty) Ltd, a South African private company.
              </p>
              <p>
                Stone Connect provides an online marketplace that connects customers ("Buyers") with independent, verified 
                suppliers ("Sellers") who manufacture and install gravestones, tombstones, and memorial-related products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Nature of the Business</h2>
              <p><strong>Stone Connect:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitates online orders and secure payment processing</li>
                <li>Provides communication and coordination tools</li>
                <li>Oversees dispute mediation between Buyers and Sellers</li>
              </ul>
              <p>
                <strong>Stone Connect does not manufacture any products and is not the direct provider of workmanship 
                or installation services.</strong>
              </p>
              <p>
                All products are manufactured, delivered, and installed solely by independent Sellers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
              <p>To use the Platform, Buyers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete personal information</li>
                <li>Agree to and comply with these Terms</li>
              </ul>
              <p>
                Stone Connect reserves the right to verify identity information where required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Product Listings</h2>
              <p>Sellers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uploading accurate product descriptions, pricing, photos, and specifications</li>
                <li>Ensuring their listings comply with legal and cemetery regulations</li>
              </ul>
              <p>
                Stone Connect verifies supplier legitimacy but cannot guarantee that listings will always be error-free.
              </p>
              <p>
                Any errors, omissions, or inaccuracies in a listing are the responsibility of the Seller.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Custom Orders</h2>
              <p>Most products offered on the Platform are custom-made.</p>
              <p>Before confirming an order, Buyers must ensure that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All inscriptions (names, dates, wording) are correct</li>
                <li>Material types and colours are correct</li>
                <li>Dimensions and design choices are approved</li>
                <li>Cemetery or municipal requirements have been confirmed</li>
              </ul>
              <p>
                <strong>Once production begins, cancellations may not be possible, and fees may apply.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Payment Processing</h2>
              <p>
                All payments are processed securely through approved third-party payment gateways.
              </p>
              <p>
                RER Global Ventures (Pty) Ltd is the legal payment recipient on behalf of Sellers.
              </p>
              <p>
                The Platform does not store or have access to full card details.
              </p>
              <p>
                Funds are received by Stone Connect, relevant commissions and fees are deducted, and remaining 
                amounts are paid to Sellers.
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">6.1 Fraud Prevention & Verification</h3>
              <p>Stone Connect reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delay or withhold payments for fraud checks</li>
                <li>Request identity or order verification</li>
                <li>Cancel suspicious orders</li>
              </ul>
              <p>
                Failure to comply may result in cancellation or suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Production, Delivery & Installation</h2>
              <p>Production and installation timelines depend on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Supplier workload</li>
                <li>Material availability</li>
                <li>Weather conditions</li>
                <li>Municipality / cemetery approvals</li>
                <li>Site accessibility</li>
              </ul>
              <p>
                Estimated timelines are provided by Sellers and may be subject to delay. 
                Stone Connect is not liable for delays caused by Sellers or external factors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Seller Responsibilities</h2>
              <p>Sellers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate product information</li>
                <li>Deliver workmanship consistent with the approved design</li>
                <li>Meet agreed-upon timelines where reasonably possible</li>
                <li>Comply with cemetery and municipal regulations</li>
                <li>Communicate professionally with Buyers</li>
              </ul>
              <p>
                Sellers assume full responsibility for the manufacturing and installation of products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Buyer Responsibilities</h2>
              <p>Buyers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing correct inscription details</li>
                <li>Confirming cemetery rules before ordering</li>
                <li>Ensuring the grave or installation site is accessible</li>
                <li>Providing accurate contact details and responding to communication</li>
              </ul>
              <p>
                Failure to provide necessary information may lead to delays.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Marketplace Liability</h2>
              <p>Stone Connect acts solely as a facilitator.</p>
              <p>Therefore:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sellers are fully responsible for manufacturing quality, accuracy, and installation</li>
                <li>Stone Connect is not liable for workmanship issues, delays, miscommunication, 
                    incorrect installations, or quality disputes</li>
              </ul>
              <p>Stone Connect will, however, assist by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mediating disputes</li>
                <li>Facilitating communication</li>
                <li>Reviewing evidence</li>
                <li>Proposing fair resolutions</li>
              </ul>
              <p>
                Final responsibility for product quality lies with the Seller.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Cancellation Policy</h2>
              <p>
                Cancellations are only permitted before production begins.
              </p>
              <p>
                If production has started, the order may be partially refundable or non-refundable depending 
                on costs already incurred.
              </p>
              <p>
                Cancellation fees may apply at the Seller's discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Refunds & Disputes</h2>
              <p>Refunds will be considered when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Seller fails to deliver the approved design</li>
                <li>There is substantial deviation from product specifications</li>
                <li>Sellers fail to complete installation within a reasonable extended timeframe</li>
              </ul>
              <p>Refunds may be issued by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adjusting the Seller's payout</li>
                <li>Reversing the transaction (subject to gateway rules)</li>
              </ul>
              <p>
                Stone Connect will review all available evidence from both parties before making a decision.
              </p>
              <p>
                Chargebacks through banks may result in additional fees and extended resolution times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Limitation of Liability</h2>
              <p>To the maximum extent permitted by South African law:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stone Connect is not liable for indirect, incidental, or consequential damages</li>
                <li>Stone Connect is not responsible for Seller negligence, delays, errors, or poor workmanship</li>
                <li>Stone Connect's total liability is limited to the commission earned on the affected transaction</li>
              </ul>
              <p>
                Buyers acknowledge that all products are manufactured and installed by third-party Sellers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Termination & Account Suspension</h2>
              <p>Stone Connect may suspend or terminate access to the Platform at its discretion for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fraud</li>
                <li>Abuse</li>
                <li>Policy violations</li>
                <li>Non-cooperation during dispute investigations</li>
              </ul>
              <p>
                Sellers may also be removed from the Platform for non-compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
              <p>
                Stone Connect may update these Terms from time to time. 
                Continued use of the Platform constitutes acceptance of the latest version.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
              <p>
                Stone Connect / RER Global Ventures (Pty) Ltd<br/>
                Email: support@stoneconnect.co.za<br/>
                Phone: +27 83 574 7160<br/>
                Pretoria, South Africa
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}