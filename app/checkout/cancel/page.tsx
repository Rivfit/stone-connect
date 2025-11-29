'use client'

import Link from 'next/link'
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl p-12 shadow-2xl text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" size={64} />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was not completed. Your cart items are still saved.
          </p>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <p className="text-gray-700 mb-4">
              Don't worry! Your items are still in your cart. You can:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Return to your cart and try again</li>
              <li>• Continue shopping for more items</li>
              <li>• Contact us if you need assistance</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Need help? Contact us at rerglobalventures@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}