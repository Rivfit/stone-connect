'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Store, Mail, Lock, Phone, MapPin, Check, Building2, FileText, Globe } from 'lucide-react'

export default function RetailerSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'South Africa',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    isPremium: false
  })
  const [agreeToAgreement, setAgreeToAgreement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToAgreement) {
      alert('Please agree to the Seller Agreement to continue')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    if (!formData.businessType) {
      alert('Please select a business type')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/retailer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agreedToAgreement: true,
          agreedAt: new Date().toISOString(),
          verificationStatus: 'pending' // Documents need to be uploaded
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Account Created!\n\nBusiness: ${formData.businessName}\n\n⚠️ IMPORTANT: Please login and upload your verification documents to activate your account.\n\nRequired documents:\n- Owner's ID\n- Business registration certificate\n\nA confirmation email has been sent to ${formData.email}`)
        router.push('/retailer/login')
      } else {
        alert('Error creating account: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🪦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Verified Retailer</h1>
            <p className="text-gray-600">Join Stone Connect and reach customers across South Africa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 size={24} className="text-blue-600" />
                Business Information
              </h2>
              
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
                    <Building2 size={18} />
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Business Type</option>
                    <option value="Company">Company (Pty Ltd / Ltd)</option>
                    <option value="Sole Proprietor">Sole Proprietor</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Close Corporation">Close Corporation (CC)</option>
                    <option value="Trust">Trust</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <FileText size={18} />
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="e.g., 2021/123456/07"
                />
                <p className="text-xs text-gray-500 mt-1">Company/CC registration number (if applicable)</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              
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
                    placeholder="business@retailer.com"
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
            </div>

            {/* Security */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock size={24} className="text-green-600" />
                Account Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Business Location */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-red-600" />
                Business Location
              </h2>

              <div className="mb-6">
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Globe size={18} />
                  Country *
                </label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                >
                  <option value="South Africa">South Africa</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Eswatini">Eswatini</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Pretoria"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Province/State *</label>
                  <select
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Province</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="North West">North West</option>
                    <option value="Free State">Free State</option>
                    <option value="Northern Cape">Northern Cape</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="0001"
                  />
                </div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FileText className="text-yellow-600" size={24} />
                📄 Document Verification Required
              </h3>
              <p className="text-gray-700 mb-3">
                After registration, you must upload the following documents to verify your account:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">1.</span>
                  <span><strong>Owner's ID Document</strong> (South African ID, Passport, or Driver's License)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">2.</span>
                  <span><strong>Business Registration Certificate</strong> (CIPC certificate, CK1 form, or proof of incorporation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">3.</span>
                  <span><strong>Proof of Address</strong> (Utility bill or bank statement - not older than 3 months)</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                ⚠️ Your account will remain <strong>pending verification</strong> until documents are approved.
              </p>
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
                    <span className="font-bold text-xl">Premium Membership - R499/month</span>
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
                      <span>8% commission (vs 10%)</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Seller Agreement Checkbox */}
            <div className="border-2 border-red-200 bg-red-50 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToAgreement}
                  onChange={(e) => setAgreeToAgreement(e.target.checked)}
                  className="mt-1 w-5 h-5 flex-shrink-0"
                  required
                />
                <span className="text-gray-700">
                  I have read and agree to the{' '}
                  <Link 
                    href="/legal/seller-agreement" 
                    target="_blank" 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Seller Agreement
                  </Link>
                  {', '}
                  <Link 
                    href="/legal/seller-terms" 
                    target="_blank" 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Terms of Service
                  </Link>
                  {', and '}
                  <Link 
                    href="/legal/privacy" 
                    target="_blank" 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Privacy Policy
                  </Link>
                  {' '}*
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-2 ml-8">
                A copy of the Seller Agreement will be sent to your email upon registration.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeToAgreement}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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