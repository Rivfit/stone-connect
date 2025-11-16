'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Store, Mail, Lock, Phone, MapPin, Check } from 'lucide-react'

export default function RetailerSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    isPremium: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup
    setTimeout(() => {
      alert(`✅ Account Created!\n\nBusiness: ${formData.businessName}\nEmail: ${formData.email}\n\nYou can now login with:\nEmail: ${formData.email}\nPassword: demo123`)
      router.push('/retailer/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🪦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Retailer</h1>
            <p className="text-gray-600">Join Stone Connect and reach customers across South Africa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Store size={18} />
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Memorial Stones SA"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="business@retailer.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Lock size={18} />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="+27 12 345 6789"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Business Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="123 Main Street, Pretoria, 0001"
              />
            </div>

            {/* Premium Option */}
            <div className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="isPremium"
                  id="premium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5"
                />
                <label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold text-xl">Premium Membership - R1,500/month</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="text-green-600" size={16} />
                      <span>Priority in search results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-green-600" size={16} />
                      <span>Featured homepage placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-green-600" size={16} />
                      <span>Premium badge on listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="text-green-600" size={16} />
                      <span>Advanced analytics</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Retailer Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/retailer/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}