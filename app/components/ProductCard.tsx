'use client'

import { Star, TrendingUp, Eye, MapPin } from 'lucide-react'

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
    city: string
    province: string
    rating: number
    is_premium: boolean
  } | null
}

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price)
  }

  return (
    <div className={`border-2 rounded-xl overflow-hidden hover:shadow-2xl transition-all ${
      product.retailers?.is_premium ? 'border-yellow-400' : 'border-gray-200'
    }`}>
      {/* Premium Badge */}
      {product.retailers?.is_premium && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-1">
          <Star size={16} fill="currentColor" /> PREMIUM RETAILER
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.type}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">🪦</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{product.type}</h3>
        <p className="text-gray-600 mb-1 font-semibold">{product.material}</p>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
        <p className="text-3xl font-bold text-green-600 mb-4">{formatPrice(product.base_price)}</p>

        {/* Retailer Info */}
        <div className="border-t-2 pt-4 mb-4">
          <p className="font-semibold text-lg mb-1">
            {product.retailers?.business_name || 'Stone Connect Retailer'}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin size={14} />
            <span>
              {product.retailers?.address?.split(',').slice(1, 3).join(',') || 'South Africa'}
            </span>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500" size={16} fill="currentColor" />
              <span className="font-semibold">{product.retailers?.rating || 4.5}</span>
              <span className="text-gray-500">({product.reviews_count})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp size={16} />
              <span>{product.purchases_count} sold</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye size={16} />
              <span>{product.views_count}</span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button 
          onClick={() => onViewDetails(product)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
        >
          <span>View Details</span>
        </button>
      </div>
    </div>
  )
}