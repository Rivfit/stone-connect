import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Shield, Users, Heart, CheckCircle, TrendingUp, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-12 mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">About Stone Connect</h1>
          <p className="text-2xl mb-2">South Africa's Premier Memorial Marketplace</p>
          <p className="text-xl opacity-90">Operated by RER Global Ventures (Pty) Ltd</p>
        </div>

        {/* Who We Are */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700 mb-4">
            Stone Connect is South Africa's first dedicated online marketplace for gravestones, tombstones, 
            and memorial products. We connect families with trusted, verified suppliers, making it easy to 
            compare options, place orders, and arrange professional installation.
          </p>
          <p className="text-lg text-gray-700">
            Our platform is owned and operated by <strong>RER Global Ventures (Pty) Ltd</strong>, a registered 
            South African company committed to providing transparency, convenience, and peace of mind during 
            a sensitive time.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="text-blue-600" size={40} />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            To simplify the process of selecting, ordering, and installing gravestones by offering:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <span className="text-lg">A reliable platform connecting families with professional suppliers</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <span className="text-lg">Transparent pricing and product information</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <span className="text-lg">Secure online payment options</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <span className="text-lg">Assistance with dispute resolution if needed</span>
            </li>
          </ul>
          <p className="text-lg text-gray-700 mt-6">
            We aim to ensure that families can honour their loved ones without unnecessary stress or uncertainty.
          </p>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Users className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-xl mb-2">Access to Verified Suppliers</h3>
                <p className="text-gray-700">Multiple verified gravestone and memorial suppliers</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-xl mb-2">Clear Product Information</h3>
                <p className="text-gray-700">Detailed descriptions and images</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Heart className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-xl mb-2">Customisable Options</h3>
                <p className="text-gray-700">Personalised gravestones and inscriptions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-xl mb-2">Secure Payments</h3>
                <p className="text-gray-700">Trusted gateways such as PayFast</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="font-bold text-xl mb-2">Support & Mediation</h3>
                <p className="text-gray-700">Help with disputes and supplier communication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Stone Connect */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-6">Why Choose Stone Connect?</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Award className="text-green-600" size={28} />
                Verified Suppliers
              </h3>
              <p className="text-lg text-gray-700">
                Only screened and trustworthy suppliers are allowed to sell on the platform.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Shield className="text-blue-600" size={28} />
                Secure Transactions
              </h3>
              <p className="text-lg text-gray-700">
                All payments are processed securely through approved payment processors.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="text-purple-600" size={28} />
                Transparent Process
              </h3>
              <p className="text-lg text-gray-700">
                All costs, timelines, and product details are clearly displayed.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Users className="text-orange-600" size={28} />
                Assistance & Support
              </h3>
              <p className="text-lg text-gray-700">
                We help mediate disputes between Buyers and Sellers, ensuring fair resolution.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Heart className="text-red-600" size={28} />
                Convenience
              </h3>
              <p className="text-lg text-gray-700">
                Families can browse, compare, and order online, with delivery and installation handled by 
                professional suppliers.
              </p>
            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={40} />
            <h2 className="text-3xl font-bold">Our Vision</h2>
          </div>
          <p className="text-xl">
            To be the leading digital marketplace for gravestones and memorial products in South Africa, 
            empowering suppliers and helping families with a professional, transparent, and compassionate service.
          </p>
        </div>

        {/* Our Promise */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Promise</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Stone Connect operates with <strong>integrity, professionalism, and compassion</strong>. 
            We are committed to making the process of memorialising loved ones easier, fairer, and more 
            accessible for everyone.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}