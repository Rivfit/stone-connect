import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🪦</span>
              <span className="font-bold text-xl">Stone Connect</span>
            </div>
            <p className="text-gray-400 mb-4">
              South Africa's Premier Memorial Marketplace
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>rerglobalventures@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+27 83 574 7160</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Pretoria, South Africa</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Browse Memorials
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-white transition-colors">
                  Premium Retailers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Retailers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Retailers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/retailer/signup" className="hover:text-white transition-colors">
                  Become a Retailer
                </Link>
              </li>
              <li>
                <Link href="/retailer/login" className="hover:text-white transition-colors">
                  Retailer Login
                </Link>
              </li>
              <li>
                <Link href="/legal/seller-terms" className="hover:text-white transition-colors">
                  Seller Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/seller-agreement" className="hover:text-white transition-colors">
                  Seller Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/delivery" className="hover:text-white transition-colors">
                  Delivery & Installation
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-white transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 Stone Connect. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}