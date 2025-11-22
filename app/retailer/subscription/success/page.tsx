'use client'
import Link from 'next/link'
import RetailerNav from '../../../components/RetailerNav'
import { CheckCircle } from 'lucide-react'

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-6" size={100} />
        <h1 className="text-4xl font-bold mb-4">Welcome to Premium! 🎉</h1>
        <p className="text-xl text-gray-600 mb-8">Your subscription is now active</p>
        <Link href="/dashboard/retailer" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}