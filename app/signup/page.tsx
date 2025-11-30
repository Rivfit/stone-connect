'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function CustomerSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      alert('Please agree to the Terms & Conditions')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agreedToTerms: true,
          agreedAt: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Account created successfully! Please login.')
        router.push('/login')
      } else {
        alert('Error: ' + (data.error || 'Something went wrong'))
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">

            {/* 🔥 Added Black Logo */}
            <Image
              src="/stone-black.png"
              alt="Stone Connect Logo"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Customer Account</h1>
            <p className="text-gray-600">Join Stone Connect to track orders and save your preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-6">
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
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="+27 12 345 6789"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Lock size={18} />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Lock size={18} />
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Address */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Delivery Address (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={18} />
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="Pretoria"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="0001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  required
                />
                <span className="text-gray-700">
                  I agree to the{' '}
                  <Link href="/legal/terms" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                    Terms & Conditions
                  </Link>
                  {' and '}
                  <Link href="/legal/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                    Privacy Policy
                  </Link>
                  {' '}*
                </span>
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Login here
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <h3 className="font-bold text-lg mb-3">Why Create an Account?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Track your orders in real-time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                View complete order history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Save delivery addresses for faster checkout
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Receive order updates via email
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Contact support easily
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
