'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../components/RetailerAuthContext'
import RetailerNav from '../../components/RetailerNav'
import { Store, Mail, Phone, MapPin, Star, Check } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    console.log('🔍 Auth Debug:', { retailer, isLoading })
    if (!isLoading && !retailer) {
      console.log('❌ No retailer found, redirecting to login')
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  useEffect(() => {
    if (retailer?.is_premium !== undefined) {
      setIsPremium(retailer.is_premium)
    }
  }, [retailer])

  if (isLoading) {
    console.log('⏳ Loading retailer data...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!retailer) {
    return null
  }

  const handlePremiumToggle = () => {
    if (isPremium) {
      if (confirm('Are you sure you want to cancel your Premium membership?')) {
        setIsPremium(false)
        alert('Premium membership cancelled')
      }
    } else {
      if (confirm('Upgrade to Premium for R1,500/month?')) {
        setIsPremium(true)
        alert('✅ Welcome to Premium! Your account has been upgraded.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard Information</h1>

        {/* Business Info */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6">Business Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Store className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-semibold">{retailer.business_name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{retailer.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Membership */}
        <div className={`rounded-xl p-8 shadow-lg ${
          isPremium 
            ? 'bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 border-2 border-yellow-400'
            : 'bg-white'
        }`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Star className={isPremium ? 'text-yellow-600' : 'text-gray-400'} size={28} fill={isPremium ? 'currentColor' : 'none'} />
                Premium Membership
              </h2>
              <p className="text-gray-700">
                {isPremium ? 'You are currently on Premium' : 'Upgrade to get more visibility'}
              </p>
            </div>
            {isPremium && (
              <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                ACTIVE
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span className={isPremium ? 'font-semibold' : ''}>Priority search placement</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span className={isPremium ? 'font-semibold' : ''}>Homepage featured spot</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span className={isPremium ? 'font-semibold' : ''}>Premium badge on all listings</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span className={isPremium ? 'font-semibold' : ''}>Advanced analytics</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              <p className="text-3xl font-bold text-gray-900">R1,500 <span className="text-lg text-gray-600">/ month</span></p>
            </div>
            <button
              onClick={handlePremiumToggle}
              className={`px-8 py-3 rounded-lg font-bold transition-colors ${
                isPremium
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {isPremium ? 'Cancel Premium' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}