import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function SellerTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Terms of Service for Sellers</h1>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                These Terms of Service ("Terms") govern the participation of suppliers ("Sellers") on the 
                Stone Connect platform ("the Platform"). By registering as a Seller, you agree to abide by 
                these Terms and all applicable South African laws.
              </p>
              <p>Stone Connect is owned and operated by RER Global Ventures (Pty) Ltd.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Marketplace Role</h2>
              <p>Stone Connect provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A platform for Sellers to list products</li>
                <li>Access to customers</li>
                <li>Payment processing services via third parties</li>
                <li>Dispute mediation</li>
              </ul>
              <p>
                Stone Connect does not manufacture, deliver, or install products. 
                Sellers are independent contractors responsible for fulfilling orders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Seller Eligibility Requirements</h2>
              <p>To join Stone Connect, Sellers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be a registered business or valid sole proprietor</li>
                <li>Provide accurate documentation (ID, business registration, address, bank details)</li>
                <li>Offer genuine, quality products</li>
                <li>Agree to maintain professionalism, honesty, and clear communication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Product Listings</h2>
              <p>Sellers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate descriptions, images, prices, and specifications</li>
                <li>Declare all delivery/installation fees upfront</li>
                <li>Update listings immediately when products or pricing change</li>
                <li>Ensure compliance with cemetery regulations and local laws</li>
              </ul>
              <p>Misleading or false listings may result in suspension.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Order Fulfilment</h2>
              <p>Sellers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Producing high-quality gravestones/tombstones</li>
                <li>Meeting agreed production and installation timelines</li>
                <li>Communicating promptly with the Buyer</li>
                <li>Notifying Stone Connect of any expected delays</li>
                <li>Ensuring correct installation at the burial site</li>
              </ul>
              <p>Failure to fulfil orders may result in refunds, penalties, or removal from the platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cancellation & Refund Obligations</h2>
              <p>
                If a Buyer cancels before production begins, Seller must issue a full refund.
              </p>
              <p>
                If an error or defect is caused by the Seller (e.g., incorrect inscription, poor workmanship), 
                the Seller must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Repair, replace, or</li>
                <li>Refund the Buyer</li>
              </ul>
              <p>
                If the Buyer is at fault (wrong details, no cemetery access, etc.), the Seller may charge 
                appropriate fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Delivery and Installation</h2>
              <p>Sellers are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Transport</li>
                <li>Delivery</li>
                <li>Installation</li>
                <li>Compliance with cemetery access rules</li>
                <li>Communicating installation dates</li>
              </ul>
              <p>Stone Connect is not liable for delivery failures or delays.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Payment & Payouts</h2>
              <p>
                Payments are processed through PayFast or other approved gateways.
              </p>
              <p>Stone Connect may:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deduct platform fees</li>
                <li>Hold payouts temporarily in cases of disputes or fraud risk</li>
                <li>Release funds once orders are confirmed as completed</li>
              </ul>
              <p>Sellers must supply accurate banking details.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Fees</h2>
              <p>Sellers agree to pay:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform commission (10% for free accounts, 8% for premium)</li>
                <li>Transaction fees (from PayFast or others)</li>
                <li>Any penalties for breach of Terms</li>
              </ul>
              <p>Fee structures are provided during onboarding.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Dispute Resolution</h2>
              <p>
                Stone Connect will mediate disputes but final responsibility lies with the Seller.
              </p>
              <p>
                If a Seller consistently receives complaints or fails to resolve legitimate issues, their 
                account may be suspended or terminated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Prohibited Conduct</h2>
              <p>Sellers may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>List illegal or unverified products</li>
                <li>Circumvent the platform by taking customers off-site</li>
                <li>Misuse customer information</li>
                <li>Engage in fraud, deliberate delays, or unethical behavior</li>
              </ul>
              <p>Such actions may lead to legal consequences.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Use of Stone Connect Branding</h2>
              <p>
                Sellers may not use the Stone Connect name, logo, or branding without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <p>Stone Connect reserves the right to suspend or terminate a Seller account if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Terms are violated</li>
                <li>Fraud is suspected</li>
                <li>Quality standards are not met</li>
                <li>Multiple disputes remain unresolved</li>
              </ul>
              <p>
                Sellers may also close their account at any time, provided all pending orders are fulfilled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact</h2>
              <p>For Seller support:</p>
              <p>
                Email: rerglobalventures@gmail.com<br/>
                Phone: +27 83 574 7160
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}