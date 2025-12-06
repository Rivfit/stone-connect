'use client'

import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '@/app/components/Footer'
import ComparePageContent from './ComparePageContent'

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<LoadingState />}>
        <ComparePageContent />
      </Suspense>
      <Footer />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading comparison...</p>
    </div>
  )
}