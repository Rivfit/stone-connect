'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

interface RetailerReviewsProps {
  retailerId: string
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RetailerReviews({ 
  retailerId, 
  showCount = true,
  size = 'sm' 
}: RetailerReviewsProps) {
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRetailerReviews()
  }, [retailerId])

  const fetchRetailerReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('retailer_id', retailerId)

      if (error) throw error

      if (data && data.length > 0) {
        const total = data.reduce((sum, review) => sum + review.rating, 0)
        const average = total / data.length
        setAverageRating(average)
        setReviewCount(data.length)
      }
    } catch (error) {
      console.error('Error fetching retailer reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <div className="animate-pulse flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="w-8 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (reviewCount === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <Star size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
          No reviews yet
        </span>
      </div>
    )
  }

  const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  return (
    <div className="flex items-center gap-1">
      <Star 
        size={starSize} 
        className="fill-yellow-400 text-yellow-400" 
      />
      <span className={`font-bold ${textSize}`}>
        {averageRating.toFixed(1)}
      </span>
      {showCount && (
        <span className={`text-gray-600 ${textSize}`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

// Separate component to show all reviews for a retailer
export function RetailerReviewsList({ retailerId }: { retailerId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [retailerId])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          products (type, material)
        `)
        .eq('retailer_id', retailerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-32"></div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Star className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-600">No reviews yet for this retailer</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border-2 rounded-xl p-6 shadow-sm">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {new Date(review.created_at).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Product Info */}
          {review.products && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Product:</strong> {review.products.type} - {review.products.material}
            </p>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
          )}
        </div>
      ))}
    </div>
  )
}