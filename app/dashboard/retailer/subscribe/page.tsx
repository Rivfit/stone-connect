'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import RetailerNav from '../../../components/RetailerNav'
import { Check, Star, TrendingUp, Award, Zap } from 'lucide-react'

export default function SubscribePage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  const handleSubscribe = async () => {
    setLoading(true)
    
    try {
      // Create PayFast subscription
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: retailer?.id,
          email: retailer?.email,
          amount: 499
        })
      })

      const data = await response.json()
      
      if (data.payfastUrl) {
        // Redirect to PayFast for payment
        window.location.href = data.payfastUrl
      } else {
        alert('Error setting up subscription')
        setLoading(false)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to process subscription')
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <RetailerNav />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-2xl text-gray-300">
            Get featured, grow faster, earn more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border-2 border-white/20">
            <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
            <div className="text-4xl font-bold mb-6">R0<span className="text-xl">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                <span>Basic listing features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                <span>10% platform commission</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                <span>Standard support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                <span>Basic analytics</span>
              </li>
            </ul>

            <div className="text-center text-gray-300">
              Your current plan
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-gray-900 border-4 border-yellow-300 shadow-2xl transform scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <Star className="text-yellow-700" size={32} fill="currentColor" />
            </div>
            <div className="text-5xl font-bold mb-6">R499<span className="text-xl">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Featured on homepage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Priority in search results</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Only 8% commission (save 2%!)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Premium badge on profile</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Advanced analytics & insights</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Dedicated support line</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-700 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                <span className="font-semibold">Priority customer inquiries</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
              <Zap size={24} />
            </button>

            <p className="text-center text-sm mt-4 text-gray-800">
              Cancel anytime • No contracts • Instant activation
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <TrendingUp className="text-green-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Increase Sales</h3>
            <p className="text-gray-300">Premium retailers see 3x more customer inquiries on average</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Award className="text-yellow-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Build Trust</h3>
            <p className="text-gray-300">Premium badge increases customer confidence and conversions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Star className="text-purple-400 mb-4" size={40} fill="currentColor" />
            <h3 className="text-xl font-bold mb-2">Stand Out</h3>
            <p className="text-gray-300">Featured placement gets your products seen first</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">How does billing work?</h3>
              <p className="text-gray-300">Monthly subscription of R499 is debited on the 1st of each month via debit order from your registered bank account.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-300">Yes! Cancel anytime from your settings page. No contracts, no penalties.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">When do premium benefits start?</h3>
              <p className="text-gray-300">Immediately after your first payment is confirmed. You'll be featured within 24 hours.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">How much can I save with 8% commission?</h3>
              <p className="text-gray-300">If you make R25,000 in sales monthly, you save R500/month on commission fees - more than the subscription cost!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}