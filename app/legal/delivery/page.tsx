import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">📦 Delivery & Installation Policy</h1>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
              <p>
                Stone Connect is an online marketplace that connects customers with independent gravestone 
                and tombstone suppliers ("Sellers"). Stone Connect does not manufacture, deliver, or install 
                any products.
              </p>
              <p>
                All delivery, transport, and installation services are handled directly by the Seller you 
                choose during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Delivery Responsibility</h2>
              <p>The Seller is solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Production timelines</li>
                <li>Transport of the gravestone or memorial product</li>
                <li>Installation at the cemetery</li>
                <li>Communication regarding delivery dates</li>
                <li>Compliance with cemetery regulations</li>
              </ul>
              <p>
                Stone Connect's role is to facilitate the ordering process and assist with communication if 
                issues arise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Delivery Areas</h2>
              <p>
                Delivery areas depend on each Seller. Some Sellers deliver and install only within certain 
                regions, while others may offer nationwide service.
              </p>
              <p>Delivery availability will be shown on each product listing.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Delivery Timeframes</h2>
              <p>Delivery and installation timelines vary by Seller and depend on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Production workload</li>
                <li>Material availability</li>
                <li>Weather conditions</li>
                <li>Cemetery access rules</li>
                <li>Permission from local authorities</li>
              </ul>
              <p>
                Estimated timelines will be provided by the Seller during the order process. 
                Stone Connect does not guarantee delivery dates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Delivery Costs</h2>
              <p>Delivery and installation fees are set by each Seller.</p>
              <p>Fees may depend on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Distance to site</li>
                <li>Stone size and weight</li>
                <li>Cemetery rules</li>
                <li>Required equipment (cranes, lifting tools, etc.)</li>
              </ul>
              <p>All costs will be displayed before checkout.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cemetery Access</h2>
              <p>Buyers are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing accurate cemetery details</li>
                <li>Ensuring necessary permits are approved</li>
                <li>Communicating access rules to the Seller</li>
              </ul>
              <p>
                If the cemetery denies or delays access, it may affect the delivery date. 
                Stone Connect is not responsible for such delays.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Delivery Issues</h2>
              <p>If you experience:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delayed delivery</li>
                <li>Incorrect product delivered</li>
                <li>Damage before installation</li>
                <li>No contact from the Seller</li>
              </ul>
              <p>
                Please contact Stone Connect support. We will assist by communicating with the Seller and 
                mediating the issue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Failed Delivery Attempts</h2>
              <p>A delivery/installation attempt may fail due to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Incorrect cemetery information</li>
                <li>No access to burial site</li>
                <li>Weather conditions</li>
                <li>Buyer unavailability (if required for access)</li>
              </ul>
              <p>
                If the Seller must return on another day, an additional fee may apply (determined by the Seller).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Stone Connect Limitation of Liability</h2>
              <p>Because Stone Connect is a marketplace:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do NOT deliver or install products</li>
                <li>We are NOT liable for delays, damage, or delivery failures</li>
                <li>We WILL assist in resolving disputes fairly</li>
              </ul>
              <p>The Seller is responsible for completing all delivery and installation services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p>
                Stone Connect / RER Global Ventures (Pty) Ltd<br/>
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