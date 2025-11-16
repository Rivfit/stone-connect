'use client'

import { useCart } from '../components/CartContext'
import Navbar from '../components/Navbar'
import { ShoppingCart, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const commission = cartTotal * 0.1
  const retailerPayout = cartTotal - commission

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart */}
        {cart.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <ShoppingCart className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
            <p className="text-xl text-gray-500 mb-8">
              Browse our collection and add memorials to your cart
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Memorials
              <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg w-32 h-32 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">🪦</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{item.productType}</h3>
                          <p className="text-gray-600">{item.material}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      {/* Customizations */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">Color:</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.selectedColor}
                          </span>
                        </div>
                        {item.deceasedName && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">Name:</span>
                            <span className="text-sm text-gray-800">{item.deceasedName}</span>
                          </div>
                        )}
                        {item.customMessage && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Custom Message:</p>
                            <p className="text-sm text-gray-800 italic">"{item.customMessage}"</p>
                          </div>
                        )}
                      </div>

                      {/* Retailer & Price */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm text-gray-500">Retailer</p>
                          <p className="font-semibold text-gray-900">{item.retailerName}</p>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                          {formatPrice(item.basePrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Platform Commission (10%):</span>
                      <span>{formatPrice(commission)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>To Retailers:</span>
                      <span>{formatPrice(retailerPayout)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={24} />
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Secure payment • Email notifications • Expert support
                </p>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block text-center text-blue-600 hover:text-blue-800 font-semibold mt-6"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Stone Connect. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">South Africa's Memorial Marketplace</p>
        </div>
      </footer>
    </div>
  )
}