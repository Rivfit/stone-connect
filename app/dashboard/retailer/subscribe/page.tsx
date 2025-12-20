'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '@/app/components/RetailerAuthContext'
import RetailerNav from '@/app/components/RetailerNav'
import { supabase } from '@/lib/supabase/client'
import { Check, Star, TrendingUp, Award, Zap } from 'lucide-react'

export default function SubscribePage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    } else if (retailer) {
      checkSubscription()
    }
  }, [retailer, isLoading, router])

  const checkSubscription = async () => {
    if (!retailer) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('retailer_id', retailer.id)
        .eq('status', 'active')
        .single()

      if (data) {
        setCurrentSubscription(data)
      }
    } catch (error) {
      // No active subscription
      console.log('No active subscription found')
    }
  }

  const handleSubscribe = async (plan: 'monthly' | 'annual' = 'monthly') => {
    if (!retailer) return
    
    setLoading(true)
    setProcessingPayment(true)
    
    try {
      // Calculate price
      const amount = plan === 'monthly' ? 1500 : 15000 // Annual = 10 months price
      
      // Create subscription record
      const subscriptionData = {
        retailer_id: retailer.id,
        retailer_email: retailer.email,
        retailer_name: retailer.business_name,
        plan_type: plan,
        plan_price: amount,
        status: 'pending',
        start_date: new Date().toISOString(),
        next_billing_date: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        auto_renew: true
      }

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
        .single()

      if (subError) {
        console.error('Subscription creation error:', subError)
        throw subError
      }

      // Send notification to admin
      await fetch('/api/subscription/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          retailer
        })
      })

      // Create PayFast payment
      const response = await fetch('/api/subscription/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          retailer,
          plan,
          amount
        })
      })

      const paymentData = await response.json()
      
      if (paymentData.payfastUrl && paymentData.payfastData) {
        // Create and submit form to PayFast
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = paymentData.payfastUrl

        Object.entries(paymentData.payfastData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value as string
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        throw new Error('Failed to generate payment URL')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to process subscription. Please try again.')
      setLoading(false)
      setProcessingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Processing Subscription...</h2>
          <p className="text-gray-300">Redirecting to payment gateway</p>
        </div>
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

        {/* Current Subscription Alert */}
        {currentSubscription && (
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center gap-3">
              <Check className="text-green-400" size={32} />
              <div>
                <h3 className="text-xl font-bold">Active Premium Subscription</h3>
                <p className="text-gray-300">
                  Plan: {currentSubscription.plan_type} • 
                  Next billing: {new Date(currentSubscription.next_billing_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

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
              {!currentSubscription && 'Your current plan'}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-gray-900 border-4 border-yellow-300 shadow-2xl transform scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <Star className="text-yellow-700" size={32} fill="currentColor" />
            </div>
            <div className="text-5xl font-bold mb-6">R1,500<span className="text-xl">/month</span></div>
            
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
              onClick={() => handleSubscribe('monthly')}
              disabled={loading || !!currentSubscription}
              className="w-full bg-gray-900 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {currentSubscription ? 'Already Subscribed' : loading ? 'Processing...' : 'Subscribe Now'}
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
              <p className="text-gray-300">Monthly subscription of R1,500 is automatically renewed via PayFast recurring billing.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-300">Yes! Cancel anytime from your dashboard. No contracts, no penalties.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">When do premium benefits start?</h3>
              <p className="text-gray-300">Immediately after your first payment is confirmed. You'll be featured within 24 hours.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">How much can I save with 8% commission?</h3>
              <p className="text-gray-300">If you make R25,000 in sales monthly, you save R500/month on commission fees - more than pays for itself!</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Is auto-renewal automatic?</h3>
              <p className="text-gray-300">Yes! PayFast handles automatic monthly renewals. You'll be notified before each billing cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}