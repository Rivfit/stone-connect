'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import { X, ShoppingCart, AlertTriangle } from 'lucide-react'

interface Product {
  id: string
  type: string
  material: string
  colors: string[]
  base_price: number
  images?: string[]
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
  product: any
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [deceasedName, setDeceasedName] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [cemeteryName, setCemeteryName] = useState('')
  const [plotNumber, setPlotNumber] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')

  const handleAddToCart = () => {
    if (!deceasedName.trim()) {
      alert('Please enter the name for the memorial')
      return
    }

    if (!cemeteryName.trim()) {
      alert('Please enter the cemetery name')
      return
    }

    addToCart({
      productId: product.id,
      productType: product.type,
      material: product.material,
      selectedColor,
      basePrice: product.base_price,
      deceasedName,
      customMessage,
      cemeteryName,
      plotNumber,
      customerNotes,
      retailerName: product.retailers?.business_name || 'Unknown',
      retailerEmail: product.retailers?.email || ''
    })

    alert('✅ Added to cart!')
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-start overflow-y-auto p-4 z-50">
       <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{product.type}</h2>
            <p className="text-xl text-gray-600 mb-1">{product.material}</p>
            <p className="text-3xl font-bold text-green-600">{formatPrice(product.base_price)}</p>
          </div>

          {/* Retailer Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-semibold text-blue-900">
              Sold by: {product.retailers?.business_name}
            </p>
            {product.retailers?.is_premium && (
              <p className="text-sm text-yellow-700 flex items-center gap-1 mt-1">
                ⭐ Premium Verified Retailer
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block font-bold text-lg mb-3">Select Color</label>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedColor === color
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Customization Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-bold text-lg mb-2">
                Name for Memorial *
              </label>
              <input
                type="text"
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder="Full name to be engraved"
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-lg mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g., Forever in our hearts, Beloved mother and wife"
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none h-24"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {customMessage.length}/200 characters
              </p>
            </div>
          </div>

          {/* Cemetery Information */}
          <div className="border-t-2 pt-6 mb-6">
            <h3 className="font-bold text-xl mb-4">Cemetery Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">
                  Cemetery Name *
                </label>
                <input
                  type="text"
                  value={cemeteryName}
                  onChange={(e) => setCemeteryName(e.target.value)}
                  placeholder="e.g., Rebecca Street Cemetery, Pretoria"
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">
                  Plot Number (if applicable)
                </label>
                <input
                  type="text"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="e.g., Section A, Row 12, Plot 45"
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank if not applicable or unknown
                </p>
              </div>
            </div>

            {/* Cemetery Disclaimer */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-sm text-gray-800">
                  <p className="font-bold text-yellow-800 mb-2">⚠️ Important Cemetery Notice</p>
                  <ul className="space-y-1">
                    <li>• Retailer will confirm cemetery compliance before manufacturing and/or installation</li>
                    <li>• Cemetery requirements differ by municipality</li>
                    <li>• Retailers may adjust installation price or require additional documents</li>
                    <li>• Some cemeteries have specific size, material, or design restrictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="border-t-2 pt-6 mb-6">
            <label className="block font-bold text-lg mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Any special requests or additional information for the retailer..."
              className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none h-32"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {customerNotes.length}/500 characters - Examples: preferred installation date, access restrictions, special design requests
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart size={24} />
            Add to Cart - {formatPrice(product.base_price)}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Final price may vary based on customization and cemetery requirements
          </p>
        </div>
      </div>
    </div>
  )
}