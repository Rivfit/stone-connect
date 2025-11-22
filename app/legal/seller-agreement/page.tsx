import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function SellerAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">Stone Connect Seller Agreement</h1>
          <p className="text-gray-600 mb-2"><strong>Between:</strong></p>
          <p className="text-gray-600 mb-2"><strong>Stone Connect (RER Global Ventures)</strong> – referred to as "Stone Connect", "we", "our", or "the Platform"</p>
          <p className="text-gray-600 mb-2"><strong>and</strong></p>
          <p className="text-gray-600 mb-8"><strong>The Supplier/Seller</strong> – referred to as "Seller" or "you"</p>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                This Seller Agreement outlines the terms under which Sellers may list, advertise, and sell 
                gravestones and related memorial products on the Stone Connect marketplace platform. By 
                registering as a Seller, you agree to comply with all terms contained in this Agreement.
              </p>
              <p>
                Stone Connect acts <strong>solely as an online marketplace</strong> that connects customers to 
                verified gravestone suppliers. Stone Connect does <strong>not</strong> manufacture, deliver, or 
                install gravestones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
              <p>To become a Seller on Stone Connect, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be a legally registered business or individual authorized to sell gravestones or memorial-related products.</li>
                <li>Have the capacity to fulfill orders within agreed timelines.</li>
                <li>Provide accurate business details and documentation upon request.</li>
                <li>Comply with South African laws and regulations relating to trade.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Seller Responsibilities</h2>
              <p>As a Seller on Stone Connect, you agree to:</p>

              <h3 className="text-xl font-bold mt-6 mb-3">3.1 Product Listings</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, clear, and honest product descriptions, images, and pricing.</li>
                <li>Ensure all listings represent the product delivered.</li>
                <li>Notify Stone Connect immediately if inventory, pricing, or product details change.</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3">3.2 Order Fulfilment</h3>
              <p>You are fully responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manufacturing the product.</li>
                <li>Delivering the product to the buyer.</li>
                <li>Installing the product (if applicable).</li>
                <li>Meeting the agreed delivery timelines.</li>
              </ul>
              <p><strong>Stone Connect does not accept responsibility for delivery delays or installation issues.</strong></p>

              <h3 className="text-xl font-bold mt-6 mb-3">3.3 Quality Standards</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products must meet normal quality expectations for the gravestone industry.</li>
                <li>Defects, errors, or incorrect engraving remain the Seller's responsibility.</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3">3.4 Customer Communication</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sellers must respond to customer queries within <strong>48 hours</strong>.</li>
                <li>Sellers must handle customer service related to their orders.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Payments and Fees</h2>

              <h3 className="text-xl font-bold mt-6 mb-3">4.1 Payment Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stone Connect collects payments from customers on your behalf.</li>
                <li>Payments are disbursed to Sellers <strong>after order confirmation</strong>, minus any Stone Connect platform fees.</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3">4.2 Fees</h3>
              <p>
                Sellers agree to pay a commission fee (percentage or fixed fee) as determined by Stone Connect. 
                The fee structure will be communicated separately.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-3">4.3 Chargebacks and Disputes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If a customer disputes a payment related to product non-delivery, wrong item, or quality issues, the Seller is fully responsible for resolving the matter.</li>
                <li>Stone Connect may withhold future payouts until disputes are resolved.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Refunds and Returns</h2>
              <p>Due to the custom nature of gravestones:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are only allowed if the Seller fails to deliver the product or delivers a product materially different from the listing.</li>
                <li>If a refund is issued due to a Seller error, the Seller is responsible for covering the refund amount.</li>
              </ul>
              <p>
                Stone Connect may intervene in disputes to protect the customer, but the Seller is ultimately 
                responsible for resolving order problems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Delivery and Installation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sellers must provide accurate delivery timelines.</li>
                <li>Sellers are responsible for arranging delivery and installation if applicable.</li>
                <li>Stone Connect does not handle logistics, transportation, or installation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Compliance and Documentation</h2>
              <p>Sellers may be required to submit:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Business registration documents</li>
                <li>Proof of physical address</li>
                <li>Portfolio of previous gravestone work</li>
                <li>Product warranties or guarantees</li>
              </ul>
              <p>Sellers must comply with all local laws, cemetery regulations, and industry requirements.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Prohibited Behaviour</h2>
              <p>Sellers may <strong>not</strong>:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>List fraudulent, inaccurate, or misleading products.</li>
                <li>Misuse customer data.</li>
                <li>Attempt to bypass the platform for offline transactions.</li>
                <li>Engage in unfair business practices.</li>
              </ul>
              <p>Violations may lead to suspension or removal from Stone Connect.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <p>
                All content uploaded by the Seller remains the Seller's property. However, the Seller grants 
                Stone Connect a license to display product images and descriptions for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
              <p>Stone Connect is not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery delays</li>
                <li>Installation issues</li>
                <li>Product quality problems</li>
                <li>Poor workmanship</li>
                <li>Cemetery access rules or refusal</li>
              </ul>
              <p>Stone Connect acts solely as a facilitator of introductions between Sellers and customers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
              <p>Stone Connect may suspend or terminate Seller accounts for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Non-compliance with this Agreement</li>
                <li>Excessive customer complaints</li>
                <li>Fraudulent activity</li>
                <li>Failure to fulfil orders</li>
              </ul>
              <p>Sellers may terminate their participation with 7 days written notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
              <p>This Agreement is governed by the laws of South Africa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Acceptance</h2>
              <p>
                By registering as a Seller on Stone Connect, you confirm that you have read, understood, and 
                agree to these terms.
              </p>
              <p className="mt-6 font-bold">
                <strong>RER Global Ventures (Stone Connect Marketplace)</strong>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}