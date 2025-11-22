'use client'
import Link from 'next/link'
import RetailerNav from '../../../components/RetailerNav'
import { XCircle } from 'lucide-react'

export default function SubscriptionCancelled() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <XCircle className="mx-auto text-orange-500 mb-6" size={100} />
        <h1 className="text-4xl font-bold mb-4">Subscription Cancelled</h1>
        <p className="text-xl text-gray-600 mb-8">No charges were made</p>
        <Link href="/retailer/subscribe" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
          Try Again
        </Link>
      </div>
    </div>
  )
}
