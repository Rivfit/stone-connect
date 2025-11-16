'use client'

'use client'

import { useState } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { useCart } from './CartContext'

interface Product {
  id: string
  type: string
  material: string
  colors: string[]
  base_price: number
  description: string
  reviews_count: number
  purchases_count: number
  views_count: number
  retailers: {
    business_name: string
    address: string
    rating: number
    is_premium: boolean
  } | null
}

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [deceasedName, setDeceasedName] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const { addToCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productType: product.type,
      material: product.material,
      basePrice: product.base_price,
      selectedColor,
      deceasedName,
      customMessage,
      retailerName: product.retailers?.business_name || 'Stone Connect Retailer',
    })
    
    alert('✅ Added to cart successfully!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center mb-4">
                <span className="text-9xl">🪦</span>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{product.reviews_count}</p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{product.purchases_count}</p>
                  <p className="text-sm text-gray-600">Sold</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{product.views_count}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
              </div>
            </div>

            {/* Right: Details & Form */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h3 className="text-3xl font-bold mb-2">{product.type}</h3>
                <p className="text-xl text-gray-600 font-semibold mb-4">{product.material}</p>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Retailer Info */}
              {product.retailers && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold text-lg mb-1">
                    {product.retailers.business_name}
                  </p>
                  <p className="text-sm text-gray-600">{product.retailers.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{product.retailers.rating}</span>
                    <span className="text-gray-500 text-sm">rating</span>
                  </div>
                </div>
              )}

              {/* Color Selection */}
              <div>
                <label className="block font-bold text-lg mb-3 text-gray-900">
                  Select Color
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name of Deceased */}
              <div>
                <label className="block font-bold text-lg mb-2 text-gray-900">
                  Name of Deceased (Optional)
                </label>
                <input
                  type="text"
                  value={deceasedName}
                  onChange={(e) => setDeceasedName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 outline-none text-lg"
                  maxLength={100}
                />
              </div>

              {/* Custom Message */}
              <div>
                <label className="block font-bold text-lg mb-2 text-gray-900">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Forever in our hearts..."
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 outline-none text-lg resize-none"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {customMessage.length}/200 characters
                </p>
              </div>

              {/* Price & Add to Cart */}
              <div className="border-t-2 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-700">Total Price:</span>
                  <span className="text-4xl font-bold text-green-600">
                    {formatPrice(product.base_price)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Free consultation • Secure payment • Expert craftsmanship
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}