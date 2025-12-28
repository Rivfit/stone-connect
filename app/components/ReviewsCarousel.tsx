'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  retailers?: {
    business_name: string
  } | null
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length, 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [reviews.length])

  const fetchReviews = async () => {
    try {
      // Fetch site reviews (no retailer_id) with high ratings
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          retailers (business_name)
        `)
        .gte('rating', 4) // Only 4 and 5 star reviews
        .not('comment', 'is', null) // Must have a comment
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Map the data to handle the retailers relationship properly
      const mappedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        retailers: Array.isArray(review.retailers) && review.retailers.length > 0 
          ? review.retailers[0] 
          : review.retailers || null
      }))

      setReviews(mappedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null // Don't show anything if no reviews
  }

  const currentReview = reviews[currentIndex]

  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="relative">
          {/* Review Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={
                    i < currentReview.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>

            {/* Comment */}
            <blockquote className="text-xl md:text-2xl text-gray-700 text-center italic mb-6 flex-grow">
              "{currentReview.comment}"
            </blockquote>

            {/* Customer Info */}
            <div className="text-center">
              {currentReview.retailers && (
                <p className="font-semibold text-gray-900">
                  Customer of {currentReview.retailers.business_name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {new Date(currentReview.created_at).toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Review Count */}
        <p className="text-center text-gray-600 mt-8">
          Based on <span className="font-bold">{reviews.length}+</span> verified reviews
        </p>
      </div>
    </div>
  )
}