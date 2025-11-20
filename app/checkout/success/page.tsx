'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Mail, Download } from 'lucide-react'

export default function SuccessPage() {
  const [orderRef, setOrderRef] = useState('')

  useEffect(() => {
    // Generate order reference client-side only
    setOrderRef(`SC-${Date.now().toString(36).toUpperCase()}`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl p-12 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={64} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-bold text-lg mb-4">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Email Confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an order confirmation email within minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Retailer Notification</p>
                  <p className="text-sm text-gray-600">
                    The retailer has been notified and will contact you shortly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Production Begins</p>
                  <p className="text-sm text-gray-600">
                    Your custom memorial will be crafted with care
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Home
            </Link>
          </div>

          {orderRef && (
            <p className="text-sm text-gray-500 mt-8">
              Order reference: {orderRef}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
