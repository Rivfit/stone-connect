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
                These Terms & Conditions govern the use of the Stone Connect website ("the Platform"). 
                By accessing or purchasing through the Platform, you agree to be bound by these Terms.
              </p>
              <p>
                Stone Connect is owned and operated by RER Global Ventures (Pty) Ltd, a private company 
                registered in South Africa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Nature of the Business</h2>
              <p>
                Stone Connect is an online marketplace that connects customers ("Buyers") with verified 
                independent suppliers ("Sellers") who manufacture and install gravestones, tombstones, 
                and memorial products.
              </p>
              <p><strong>Stone Connect:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitates orders and payment</li>
                <li>Supports communication between Buyers and Sellers</li>
                <li>Oversees dispute mediation</li>
              </ul>
              <p><strong>Stone Connect does not manufacture products directly.</strong></p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
              <p>To use the Platform, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be 18 years or older</li>
                <li>Provide accurate personal information</li>
                <li>Agree to these Terms & Conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Product Listings</h2>
              <p>
                All product descriptions, photos, pricing, and specifications are uploaded and provided 
                by Sellers. While Stone Connect verifies suppliers, we cannot guarantee that all listings 
                are error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Custom Orders</h2>
              <p>Most products offered are custom-made.</p>
              <p>Before confirming an order, Buyers must review and approve:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Spelling and details of inscriptions</li>
                <li>Selected materials</li>
                <li>Size and design</li>
                <li>Cemetery/municipality requirements</li>
              </ul>
              <p>
                <strong>Once a custom product enters production, cancellation may not be possible.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Payment Processing</h2>
              <p>
                All payments are processed securely via third-party payment gateways such as PayFast. 
                Stone Connect does not store or process credit card details.
              </p>
              <p>
                RER Global Ventures (Pty) Ltd is the legal recipient of payments on behalf of Sellers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Production & Delivery</h2>
              <p>Production and installation timelines vary depending on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Supplier workload</li>
                <li>Material availability</li>
                <li>Weather conditions</li>
                <li>Cemetery access and permissions</li>
              </ul>
              <p>
                Estimated delivery times will be communicated, but delays may occur due to factors 
                beyond the Seller's control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Seller Responsibilities</h2>
              <p>Sellers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurate product listings</li>
                <li>Quality workmanship</li>
                <li>Meeting agreed timelines</li>
                <li>Delivering products that match the Buyer-approved design</li>
                <li>Following cemetery regulations when installing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Buyer Responsibilities</h2>
              <p>Buyers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing correct inscription details</li>
                <li>Confirming cemetery rules before ordering</li>
                <li>Ensuring that the burial site is accessible</li>
                <li>Providing accurate contact information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Marketplace Liability</h2>
              <p>Because Stone Connect is a marketplace:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manufacturing and installation responsibilities rest with the Seller</li>
                <li>Stone Connect is not liable for workmanship issues, delays, or delivery errors</li>
                <li>Stone Connect will, however, mediate disputes to reach a fair resolution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Cancellation Policy</h2>
              <p>Cancellations are only possible before production begins.</p>
              <p>If production has already started:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The order may be non-refundable</li>
                <li>Or cancellation fees may apply</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Dispute Resolution</h2>
              <p>Stone Connect will:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review disputes between Buyers and Sellers</li>
                <li>Facilitate communication</li>
                <li>Recommend fair solutions</li>
              </ul>
              <p>Final responsibility for product quality lies with the Seller.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
              <p>
                Stone Connect reserves the right to update these Terms at any time. 
                Changes are effective once posted on the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p>
                Stone Connect / RER Global Ventures (Pty) Ltd<br/>
                Email: support@stoneconnect.co.za<br/>
                Phone: +27 12 345 6789
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}