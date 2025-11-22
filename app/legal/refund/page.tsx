import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Refund & Return Policy</h1>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Custom Product Policy</h2>
              <p>Because gravestones and tombstones are custom-made, refunds are limited.</p>
              <p>No refunds are issued after production has started, except in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Incorrect product delivered</li>
                <li>Manufacturing defects</li>
                <li>Structural/material faults</li>
                <li>Damage caused before installation</li>
                <li>Major delays beyond the agreed timeline (not caused by cemetery or weather)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Refund Eligibility Before Production</h2>
              <p>Refund requests before production begins may be approved.</p>
              <p>If approved:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A full or partial refund will be processed within 3–7 business days</li>
                <li>Refunds are issued via the original payment method (PayFast, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Inscription Errors</h2>
              <p>
                If the Seller makes an inscription error that differs from the Buyer-approved form, the Seller 
                must correct or replace the product at no extra cost.
              </p>
              <p>
                If the Buyer submitted incorrect spelling or details, correction costs may apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Defects or Damage</h2>
              <p>If the product has legitimate defects, the Seller will:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Repair, replace, or</li>
                <li>Issue a refund (depending on the case)</li>
              </ul>
              <p>Proof (photos/videos) may be required.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Delivery & Installation Issues</h2>
              <p>Refunds may apply if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The incorrect product is delivered</li>
                <li>The product is damaged before installation</li>
                <li>Installation was not completed due to Seller fault</li>
              </ul>
              <p>Refunds do not apply to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cemetery denying access</li>
                <li>Buyer providing incorrect location information</li>
                <li>Weather delays</li>
                <li>Buyer changing their mind after production begins</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Non-Refundable Situations</h2>
              <p>No refunds will be granted for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind</li>
                <li>Incorrect details submitted by the Buyer</li>
                <li>Delays caused by cemetery permits</li>
                <li>Buyer dissatisfaction with a previously approved design</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Refund Request Process</h2>
              <p>To request a refund, Buyers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email support@stoneconnect.co.za</li>
                <li>Provide order number</li>
                <li>Submit photos/videos if applicable</li>
                <li>Provide a written explanation</li>
              </ul>
              <p>Dispute review time: 5–7 business days.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Marketplace Role</h2>
              <p>Stone Connect will:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Assist in resolving disputes</li>
                <li>Ensure Sellers follow fair business practices</li>
              </ul>
              <p>
                But because Stone Connect is a marketplace, responsibility ultimately lies with the Seller.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p>
                Stone Connect / RER Global Ventures (Pty) Ltd<br/>
                Email: rerglobalventures@gmail.coma<br/>
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