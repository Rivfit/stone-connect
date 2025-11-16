'use client'

import { useState } from 'react'
import { useCart } from '../components/CartContext'
import Navbar from '../components/Navbar'
import { ArrowLeft, CreditCard, Shield, Mail, Phone, User, MapPin } from 'lucide-react'
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
  
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const commission = cartTotal * 0.1
  const retailerPayout = cartTotal - commission

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // In production, this would:
      // 1. Create order in database
      // 2. Generate PayFast payment form
      // 3. Redirect to PayFast
      // 4. Handle webhook response
      
      alert(`🎉 Payment Successful!\n\nTotal: ${formatPrice(cartTotal)}\nYour Commission: ${formatPrice(commission)}\nRetailer Payout: ${formatPrice(retailerPayout)}\n\nOrder confirmation sent to ${formData.email}`)
      
      clearCart()
      router.push('/checkout/success')
    }, 2000)
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
        {/* Back to Cart */}
        <Link href="/cart" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Customer Info Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User size={28} />
                Customer Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <Mail size={18} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <Phone size={18} />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="+27 12 345 6789"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <MapPin size={18} />
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Pretoria"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="0001"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={28} />
                  Payment Method
                </h2>
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="text-blue-600" size={48} />
                    <div>
                      <p className="font-bold text-lg">Secure Payment with PayFast</p>
                      <p className="text-sm text-gray-600">
                        You'll be redirected to PayFast to complete your payment securely
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white px-3 py-1 rounded text-sm font-semibold">Credit Card</span>
                    <span className="bg-white px-3 py-1 rounded text-sm font-semibold">Debit Card</span>
                    <span className="bg-white px-3 py-1 rounded text-sm font-semibold">Instant EFT</span>
                    <span className="bg-white px-3 py-1 rounded text-sm font-semibold">SnapScan</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatPrice(cartTotal)}`
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b">
                    <div className="bg-gray-100 rounded w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🪦</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.productType}</p>
                      <p className="text-xs text-gray-600">{item.selectedColor}</p>
                      <p className="text-sm font-bold text-green-600 mt-1">
                        {formatPrice(item.basePrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Platform Fee (10%):</span>
                    <span>{formatPrice(commission)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>To Retailers:</span>
                    <span>{formatPrice(retailerPayout)}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600" size={18} />
                  <span>Secure SSL encrypted payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-blue-600" size={18} />
                  <span>Email confirmation sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-purple-600" size={18} />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}