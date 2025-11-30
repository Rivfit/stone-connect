'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRetailerAuth } from '../../../components/RetailerAuthContext'
import { supabase } from '@/lib/supabase/client'
import RetailerNav from '../../../components/RetailerNav'
import { 
  User, Lock, CreditCard, Building2, Mail, Phone, 
  MapPin, Save, Eye, EyeOff, AlertCircle, CheckCircle,
  FileText, DollarSign
} from 'lucide-react'

interface RetailerData {
  business_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  province: string
  bank_name: string
  account_holder: string
  account_number: string
  branch_code: string
  account_type: string
  subscription_status: string
  is_premium: boolean
}

export default function RetailerSettingsPage() {
  const router = useRouter()
  const { retailer, isLoading } = useRetailerAuth()
  
  const [activeTab, setActiveTab] = useState<'account' | 'banking' | 'security' | 'subscription'>('account')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [retailerData, setRetailerData] = useState<RetailerData>({
    business_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    province: '',
    bank_name: '',
    account_holder: '',
    account_number: '',
    branch_code: '',
    account_type: 'cheque',
    subscription_status: 'free',
    is_premium: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [verifyPassword, setVerifyPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!isLoading && !retailer) {
      router.push('/retailer/login')
    }
  }, [retailer, isLoading, router])

  useEffect(() => {
    if (retailer) {
      fetchRetailerData()
    }
  }, [retailer])

  const fetchRetailerData = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', retailer?.id)
        .single()

      if (error) throw error
      
      setRetailerData({
        business_name: data.business_name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        province: data.province || '',
        bank_name: data.bank_name || '',
        account_holder: data.account_holder || '',
        account_number: data.account_number || '',
        branch_code: data.branch_code || '',
        account_type: data.account_type || 'cheque',
        subscription_status: data.subscription_status || 'free',
        is_premium: data.is_premium || false
      })
    } catch (error) {
      console.error('Error fetching retailer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPassword = async () => {
    // Since we're using demo auth with localStorage, we'll verify differently
    // In demo mode, any password "demo123" will work
    // In production, this should verify against your actual auth system
    
    if (verifyPassword === 'demo123' || verifyPassword.length >= 6) {
      setIsVerified(true)
      setMessage({ type: 'success', text: 'Password verified! You can now make changes.' })
    } else {
      setMessage({ type: 'error', text: 'Incorrect password. For demo, use: demo123' })
      setVerifyPassword('')
    }
  }

  const handleUpdateAccount = async () => {
    if (!isVerified) {
      setMessage({ type: 'error', text: 'Please verify your password first' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('retailers')
        .update({
          business_name: retailerData.business_name,
          phone: retailerData.phone,
          address: retailerData.address,
          city: retailerData.city,
          postal_code: retailerData.postal_code,
          province: retailerData.province
        })
        .eq('id', retailer?.id)

      if (error) throw error

      // Log change to admin
      await fetch('/api/admin/log-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: retailer?.id,
          retailer_email: retailerData.email,
          change_type: 'account_details',
          changes: retailerData,
          timestamp: new Date().toISOString()
        })
      })

      setMessage({ type: 'success', text: '✅ Account updated successfully!' })
      setIsVerified(false)
      setVerifyPassword('')
    } catch (error) {
      console.error('Error updating account:', error)
      setMessage({ type: 'error', text: '❌ Failed to update account' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateBanking = async () => {
    if (!isVerified) {
      setMessage({ type: 'error', text: 'Please verify your password first' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('retailers')
        .update({
          bank_name: retailerData.bank_name,
          account_holder: retailerData.account_holder,
          account_number: retailerData.account_number,
          branch_code: retailerData.branch_code,
          account_type: retailerData.account_type
        })
        .eq('id', retailer?.id)

      if (error) throw error

      // Log banking details to admin
      await fetch('/api/admin/log-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: retailer?.id,
          retailer_email: retailerData.email,
          change_type: 'banking_details',
          banking: {
            bank_name: retailerData.bank_name,
            account_holder: retailerData.account_holder,
            account_type: retailerData.account_type
          },
          timestamp: new Date().toISOString()
        })
      })

      setMessage({ type: 'success', text: '✅ Banking details updated!' })
      setIsVerified(false)
      setVerifyPassword('')
    } catch (error) {
      console.error('Error updating banking:', error)
      setMessage({ type: 'error', text: '❌ Failed to update banking details' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setSaving(true)
    try {
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: retailerData.email,
        password: passwordData.currentPassword
      })

      if (signInError) {
        setMessage({ type: 'error', text: 'Current password is incorrect' })
        setSaving(false)
        return
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage({ type: 'error', text: '❌ Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(retailerData.email, {
        redirectTo: `${window.location.origin}/retailer/reset-password`
      })

      if (error) throw error
      setMessage({ type: 'success', text: '📧 Password reset email sent!' })
    } catch (error) {
      console.error('Error sending reset email:', error)
      setMessage({ type: 'error', text: '❌ Failed to send reset email' })
    }
  }

  const handleSubscribe = () => {
    // Use Next.js router for navigation
    router.push('/retailer/subscribe')
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'account' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User size={20} />
            Account Details
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'banking' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard size={20} />
            Banking Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'security' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Lock size={20} />
            Security
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'subscription' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DollarSign size={20} />
            Subscription
          </button>
        </div>

        {/* Account Details Tab */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Business Name</label>
                  <input
                    type="text"
                    value={retailerData.business_name}
                    onChange={(e) => setRetailerData({...retailerData, business_name: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={retailerData.email}
                    className="w-full border-2 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={retailerData.phone}
                    onChange={(e) => setRetailerData({...retailerData, phone: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Province</label>
                  <select
                    value={retailerData.province}
                    onChange={(e) => setRetailerData({...retailerData, province: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  >
                    <option value="">Select Province</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="North West">North West</option>
                    <option value="Free State">Free State</option>
                    <option value="Northern Cape">Northern Cape</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Street Address</label>
                <input
                  type="text"
                  value={retailerData.address}
                  onChange={(e) => setRetailerData({...retailerData, address: e.target.value})}
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  disabled={!isVerified}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">City</label>
                  <input
                    type="text"
                    value={retailerData.city}
                    onChange={(e) => setRetailerData({...retailerData, city: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={retailerData.postal_code}
                    onChange={(e) => setRetailerData({...retailerData, postal_code: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
              </div>

              {/* Password Verification */}
              {!isVerified ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Verify Your Password to Make Changes
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="password"
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={handleVerifyPassword}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUpdateAccount}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Banking Details Tab */}
        {activeTab === 'banking' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Banking Information</h2>
            <p className="text-gray-600 mb-6">Add your banking details to receive payments from Stone Connect</p>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={retailerData.bank_name}
                    onChange={(e) => setRetailerData({...retailerData, bank_name: e.target.value})}
                    placeholder="e.g., ABSA, FNB, Standard Bank"
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your bank name</p>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Account Type</label>
                  <select
                    value={retailerData.account_type}
                    onChange={(e) => setRetailerData({...retailerData, account_type: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  >
                    <option value="">Select Account Type</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  value={retailerData.account_holder}
                  onChange={(e) => setRetailerData({...retailerData, account_holder: e.target.value})}
                  placeholder="Full name as it appears on bank account"
                  className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                  disabled={!isVerified}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Account Number</label>
                  <input
                    type="text"
                    value={retailerData.account_number}
                    onChange={(e) => setRetailerData({...retailerData, account_number: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Branch Code</label>
                  <input
                    type="text"
                    value={retailerData.branch_code}
                    onChange={(e) => setRetailerData({...retailerData, branch_code: e.target.value})}
                    className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!isVerified}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Payment Information
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Payments are processed weekly on Fridays</li>
                  <li>• 10% platform commission is deducted automatically</li>
                  <li>• Allow 2-3 business days for bank processing</li>
                  <li>• You'll receive an email notification before each payout</li>
                </ul>
              </div>

              {!isVerified ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Verify Your Password to Update Banking Details
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="password"
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={handleVerifyPassword}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUpdateBanking}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Banking Details'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

            {/* Change Password */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Password Reset */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Forgot Password?</h3>
              <p className="text-gray-600 mb-4">Send a password reset link to your email</p>
              <button
                onClick={handlePasswordReset}
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Subscription & Premium Features</h2>

            <div className="mb-8">
              <div className={`p-6 rounded-lg border-2 ${retailerData.is_premium ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Current Plan: {retailerData.is_premium ? '⭐ Premium' : '🆓 Free'}
                  </h3>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${
                    retailerData.is_premium ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {retailerData.subscription_status}
                  </span>
                </div>

                {retailerData.is_premium ? (
                  <div>
                    <p className="text-gray-700 mb-4">You're enjoying all premium benefits!</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✅ Featured listings on homepage</li>
                      <li>✅ Priority in search results</li>
                      <li>✅ Premium badge on your profile</li>
                      <li>✅ Advanced analytics</li>
                      <li>✅ Lower platform commission (8% vs 10%)</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-4">Upgrade to Premium and get:</p>
                    <ul className="space-y-2 text-gray-700 mb-6">
                      <li>⭐ Featured listings on homepage</li>
                      <li>⭐ Priority in search results</li>
                      <li>⭐ Premium badge on your profile</li>
                      <li>⭐ Advanced analytics dashboard</li>
                      <li>⭐ Lower commission (8% instead of 10%)</li>
                      <li>⭐ Dedicated support line</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {!retailerData.is_premium && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
                <h3 className="text-3xl font-bold mb-4">Premium Subscription</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-5xl font-bold">R1500</span>
                  <span className="text-xl mb-2">/month</span>
                </div>
                <button
                  onClick={handleSubscribe}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Upgrade to Premium
                </button>
                <p className="text-sm mt-4 opacity-90">Cancel anytime • No contracts • Instant activation</p>
              </div>
            )}

            {/* Debit Order Setup */}
            {retailerData.is_premium && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Debit Order Information
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Amount:</strong> R1500/month</p>
                  <p><strong>Debit Date:</strong> 1st of each month</p>
                  <p><strong>Method:</strong> Direct debit from registered bank account</p>
                  <p className="text-sm text-gray-600 mt-4">
                    Your subscription will automatically renew monthly. You can cancel anytime from this page.
                  </p>
                </div>
                <button
                  className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel your premium subscription?')) {
                      alert('Cancellation feature coming soon. Please contact rerglobalventures@gmail.com')
                    }
                  }}
                >
                  Cancel Subscription
                </button>
              </div>
            )}

            {/* Payment History */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Payment History</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <FileText size={40} className="mx-auto mb-3 text-gray-400" />
                <p>No payment history yet</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}