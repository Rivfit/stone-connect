'use client'

import { useState } from 'react'
import { useCart } from '../components/CartContext'
import Navbar from '../components/Navbar'
import { ArrowLeft, CreditCard, Shield, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(price)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return alert('Your cart is empty!')

    // Check if terms are agreed
    if (!agreeToTerms) {
      alert('Please agree to the Terms & Conditions to proceed')
      return
    }

    setIsProcessing(true)

    try {
      // Call Ozow initiate endpoint
      const res = await fetch('/api/ozow/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          cartTotal,
          customer: {
            ...formData,
            agreedToTerms: true,
            agreedAt: new Date().toISOString()
          }
        }),
      })

      const data = await res.json()

      if (data.success && data.formData && data.ozowUrl) {
        console.log('Redirecting to Ozow payment:', data.orderId)
        
        // Clear cart before redirect
        clearCart()
        
        // Create a hidden form and submit it (Ozow requires POST)
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.ozowUrl
        
        // Add all form fields from Ozow
        Object.entries(data.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value as string
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
      } else {
        throw new Error(data.error || 'Failed to initiate payment')
      }
    } catch (err) {
      console.error('Payment error:', err)
      alert('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-xl text-gray-600 mb-8">Add some items before checking out</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Customer Info Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="bg-white rounded-xl p-8 shadow-lg">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">First Name *</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Last Name *</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="Doe" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <Mail size={18} /> Email *
                  </label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <Phone size={18} /> Phone *
                  </label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="+27 12 345 6789" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <MapPin size={18} /> Street Address *
                </label>
                <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="123 Main Street" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="Pretoria" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Postal Code *</label>
                  <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="0001" />
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="mb-6 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
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
                    {', '}
                    <Link href="/legal/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                      Privacy Policy
                    </Link>
                    {', and '}
                    <Link href="/legal/refund" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                      Refund Policy
                    </Link>
                    {' '}*
                  </span>
                </label>
              </div>

              {/* Payment Button */}
              <button 
                type="submit" 
                disabled={isProcessing || !agreeToTerms} 
                className="w-full mt-8 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Redirecting to Ozow...
                  </>
                ) : (
                  <>
                    <Shield size={24} />
                    Pay {formatPrice(cartTotal)} with Ozow
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
                <Shield size={16} className="text-green-600" />
                Secure instant payment processed by Ozow
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productType}</span>
                    <span className="font-semibold">{formatPrice(item.basePrice)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-600" />
                  <span>Instant bank payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span>Email confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}