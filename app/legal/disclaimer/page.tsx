import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { AlertTriangle } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-600" size={40} />
            <h1 className="text-4xl font-bold">Disclaimer</h1>
          </div>
          <p className="text-gray-500 mb-2">Operated by RER Global Ventures (Pty) Ltd</p>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. General Information</h2>
              <p>
                The content provided on the Stone Connect website is for general informational purposes only. 
                While we strive for accuracy, Stone Connect does not guarantee that all information is complete, 
                accurate, or up to date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Marketplace Role</h2>
              <p>
                Stone Connect acts solely as an online marketplace connecting buyers to independent gravestone 
                and memorial suppliers. <strong>We do not manufacture, deliver, or install any products ourselves.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Product Descriptions</h2>
              <p>
                All product descriptions, images, prices, and specifications are provided by the individual Sellers. 
                Stone Connect is not responsible for any inaccuracies, errors, or omissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Custom Products</h2>
              <p>
                Most gravestones and memorial products are custom-made. Buyers are responsible for reviewing and 
                approving all designs, inscriptions, and specifications prior to production.
              </p>
              <p>
                <strong>Stone Connect is not liable for errors made by the Seller or the Buyer.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Delivery and Installation</h2>
              <p>
                Sellers are fully responsible for delivery, installation, and compliance with cemetery regulations. 
                Stone Connect is not responsible for delays, errors, or damages related to delivery or installation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p><strong>Stone Connect is not liable for:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any loss, damage, or dissatisfaction related to products or services provided by Sellers</li>
                <li>Delivery delays or installation issues</li>
                <li>Errors or omissions in product listings</li>
                <li>Any indirect, incidental, or consequential damages arising from the use of the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. External Links</h2>
              <p>
                The Stone Connect website may contain links to third-party websites. We do not control and are 
                not responsible for the content, accuracy, or practices of these external sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Agreement</h2>
              <p>
                By using Stone Connect, you agree to this Disclaimer. If you do not agree, you should refrain 
                from using the platform.
              </p>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="font-bold text-center text-lg">
                Stone Connect / RER Global Ventures (Pty) Ltd
              </p>
              <p className="text-center text-gray-600 mt-2">
                For questions or concerns, contact us at:<br/>
                Email: rerglobalventures@gmail.com<br/>
                Phone: +27 83 574 7160
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}