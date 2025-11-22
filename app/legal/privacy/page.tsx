import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-2">POPIA-Compliant</p>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                Stone Connect ("we", "us", "our") respects your right to privacy and is committed to protecting 
                your personal information in accordance with the Protection of Personal Information Act (POPIA).
              </p>
              <p>This policy explains:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>What personal information we collect</li>
                <li>How we use and store it</li>
                <li>Your rights under South African law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. What Personal Information We Collect</h2>
              <p>We may collect the following information when you use the platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Physical address</li>
                <li>Cemetery location details</li>
                <li>Order and payment information</li>
                <li>Communication records</li>
                <li>Website usage information (via cookies)</li>
              </ul>
              <p>
                <strong>Payment information (card details) is NOT stored by us</strong> and is handled securely 
                by third-party processors (e.g., PayFast).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p>We use your personal information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process your orders</li>
                <li>Connect you with Sellers</li>
                <li>Facilitate communication between you and the Seller</li>
                <li>Verify identity for fraud prevention</li>
                <li>Provide customer support</li>
                <li>Improve the platform and user experience</li>
                <li>Comply with legal requirements</li>
              </ul>
              <p><strong>We do not sell or rent your personal information.</strong></p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Sharing of Personal Information</h2>
              <p>Your information may be shared with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sellers fulfilling your order</li>
                <li>Payment processors (e.g., PayFast)</li>
                <li>Delivery/installation partners (through Sellers)</li>
                <li>Service providers that help us operate the platform</li>
                <li>Authorities if legally required</li>
              </ul>
              <p>All third-party partners are required to handle your information safely and lawfully.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Cookies & Tracking</h2>
              <p>We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve website performance</li>
                <li>Analyse website usage</li>
                <li>Personalise user experience</li>
              </ul>
              <p>
                You may disable cookies in your browser settings, but some features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Storage & Protection</h2>
              <p>Your information is stored securely and protected from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unauthorised access</li>
                <li>Loss or damage</li>
                <li>Misuse or disclosure</li>
              </ul>
              <p>We keep data only for as long as necessary for legal, operational, or customer-service reasons.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Your Rights Under POPIA</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion where legally allowed</li>
                <li>Object to your information being processed</li>
                <li>Withdraw consent</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
              <p>To exercise these rights, contact us at the details below.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Marketing Communication</h2>
              <p>
                We may send marketing emails or messages only if you consent. 
                You may unsubscribe at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
              <p>
                The platform may link to external sites. 
                We are not responsible for their content or privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. 
                Updated versions will be posted on the website with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p>For privacy questions or requests, contact:</p>
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