'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Store, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Store customer session
        localStorage.setItem('customer', JSON.stringify(data.customer))
        router.push('/customer/dashboard')
      } else {
        alert('Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🪦</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-xl text-gray-600">Choose your account type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Login */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-600" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Login</h2>
                <p className="text-sm text-gray-600">Track orders & manage account</p>
              </div>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-4">
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
                  placeholder="your@email.com"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login as Customer'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 block">
                Forgot Password?
              </Link>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Customer Account Features:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>✓ Track current orders</li>
                <li>✓ View order history</li>
                <li>✓ Save favorite products</li>
                <li>✓ Manage delivery addresses</li>
              </ul>
            </div>
          </div>

          {/* Retailer Login */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <Store className="text-purple-600" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Retailer Login</h2>
                <p className="text-sm text-gray-600">Access your dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Are you a memorial retailer looking to access your dashboard?
              </p>

              <Link
                href="/retailer/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg text-center"
              >
                Go to Retailer Login
              </Link>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Retailer Dashboard Features:</strong>
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>✓ Manage product listings</li>
                  <li>✓ Process orders</li>
                  <li>✓ View analytics</li>
                  <li>✓ Update banking details</li>
                </ul>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Want to become a retailer?{' '}
                  <Link href="/retailer/signup" className="text-purple-600 hover:text-purple-800 font-semibold">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-2 text-gray-900">🔐 Demo Access</h3>
          <p className="text-sm text-gray-700 mb-3">
            For testing purposes, you can use these demo credentials:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold text-blue-600">Customer Demo:</p>
              <p>Email: customer@demo.com</p>
              <p>Password: demo123</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold text-purple-600">Retailer Demo:</p>
              <p>Email: retailer@demo.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}