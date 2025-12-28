'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Star, Check, AlertCircle } from 'lucide-react'

interface ReviewPageProps {
  params: { orderId: string }
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [existingReview, setExistingReview] = useState<any>(null)
  
  const [retailerRating, setRetailerRating] = useState(0)
  const [retailerComment, setRetailerComment] = useState('')
  const [siteRating, setSiteRating] = useState(0)
  const [siteComment, setSiteComment] = useState('')
  const [hoverRetailerRating, setHoverRetailerRating] = useState(0)
  const [hoverSiteRating, setHoverSiteRating] = useState(0)

  useEffect(() => {
    fetchOrderAndReview()
  }, [params.orderId])

  const fetchOrderAndReview = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          products (type, material, images),
          retailers (business_name, id)
        `)
        .eq('id', params.orderId)
        .single()

      if (orderError) throw orderError
      setOrder(orderData)

      // Check if review already exists
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('order_id', params.orderId)
        .single()

      setExistingReview(reviewData)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (retailerRating === 0) {
      alert('Please rate the retailer')
      return
    }

    if (siteRating === 0) {
      alert('Please rate Stone Connect')
      return
    }

    setSubmitting(true)

    try {
      // Insert retailer review
      const { error: retailerError } = await supabase
        .from('reviews')
        .insert({
          order_id: params.orderId,
          customer_id: order.customer_id,
          retailer_id: order.retailer_id,
          product_id: order.product_id,
          rating: retailerRating,
          comment: retailerComment
        })

      if (retailerError) throw retailerError

      // Insert site review (no retailer_id or product_id)
      const { error: siteError } = await supabase
        .from('reviews')
        .insert({
          order_id: params.orderId,
          customer_id: order.customer_id,
          rating: siteRating,
          comment: siteComment
        })

      if (siteError) throw siteError

      alert('✅ Thank you for your reviews!')
      router.push('/')
    } catch (error) {
      console.error('Error submitting reviews:', error)
      alert('❌ Error submitting reviews. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ 
    rating, 
    setRating, 
    hoverRating, 
    setHoverRating 
  }: { 
    rating: number
    setRating: (r: number) => void
    hoverRating: number
    setHoverRating: (r: number) => void
  }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={40}
              className={
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-gray-600">This order doesn't exist or you don't have access to it.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (existingReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <Check className="mx-auto text-green-600 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-2">Review Already Submitted</h1>
          <p className="text-gray-600 mb-6">You've already reviewed this order. Thank you for your feedback!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Leave a Review</h1>
          <p className="text-gray-600">Share your experience with us</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">Your Order</h2>
          <div className="flex items-center gap-4">
            {order.products?.images?.[0] && (
              <img
                src={order.products.images[0]}
                alt={order.products.type}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <p className="font-semibold text-lg">
                {order.products?.type} - {order.products?.material}
              </p>
              <p className="text-gray-600">From: {order.retailers?.business_name}</p>
              <p className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Retailer Review */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Rate the Retailer</h2>
            <p className="text-gray-600 mb-4">
              How was your experience with <strong>{order.retailers?.business_name}</strong>?
            </p>
            
            <div className="mb-6">
              <label className="block font-semibold mb-3">Rating *</label>
              <StarRating
                rating={retailerRating}
                setRating={setRetailerRating}
                hoverRating={hoverRetailerRating}
                setHoverRating={setHoverRetailerRating}
              />
              {retailerRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {retailerRating === 1 && 'Poor'}
                  {retailerRating === 2 && 'Fair'}
                  {retailerRating === 3 && 'Good'}
                  {retailerRating === 4 && 'Very Good'}
                  {retailerRating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={retailerComment}
                onChange={(e) => setRetailerComment(e.target.value)}
                className="w-full border-2 p-4 rounded-lg focus:border-blue-500 outline-none resize-none"
                rows={4}
                placeholder="Tell us about the product quality, customer service, delivery, etc..."
              />
            </div>
          </div>

          {/* Site Review */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Rate Stone Connect</h2>
            <p className="text-gray-600 mb-4">
              How was your experience using our platform?
            </p>
            
            <div className="mb-6">
              <label className="block font-semibold mb-3">Rating *</label>
              <StarRating
                rating={siteRating}
                setRating={setSiteRating}
                hoverRating={hoverSiteRating}
                setHoverRating={setHoverSiteRating}
              />
              {siteRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {siteRating === 1 && 'Poor'}
                  {siteRating === 2 && 'Fair'}
                  {siteRating === 3 && 'Good'}
                  {siteRating === 4 && 'Very Good'}
                  {siteRating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Your Feedback (Optional)
              </label>
              <textarea
                value={siteComment}
                onChange={(e) => setSiteComment(e.target.value)}
                className="w-full border-2 p-4 rounded-lg focus:border-blue-500 outline-none resize-none"
                rows={4}
                placeholder="Tell us about your experience using Stone Connect..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || retailerRating === 0 || siteRating === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting Reviews...
              </span>
            ) : (
              'Submit Reviews'
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  )
}