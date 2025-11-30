'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../components/RetailerAuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function RetailerLoginPage() {
  const router = useRouter()
  const { login } = useRetailerAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push('/dashboard/retailer')
    } else {
      setError('Invalid credentials. Demo: any email ending with @retailer.com and password: demo123')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/stone-black.png" 
                alt="Stone Connect Logo" 
                width={120} 
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Retailer Login</h1>
            <p className="text-gray-600">Access your Stone Connect dashboard</p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">🎯 Demo Login:</p>
            <p className="text-sm text-blue-800">Email: yourname@retailer.com</p>
            <p className="text-sm text-blue-800">Password: demo123</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="you@retailer.com"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/retailer/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure retailer portal for Stone Connect</p>
        </div>
      </div>
    </div>
  )
}