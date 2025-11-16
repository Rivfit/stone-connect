import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center text-white">
          <div className="text-8xl mb-6">🪦</div>
          <h1 className="text-6xl font-bold mb-6">Stone Connect</h1>
          <p className="text-2xl mb-8 text-gray-200">
            South Africa's Premier Memorial Marketplace
          </p>
          <p className="text-xl mb-12 text-gray-300">
            Connect with trusted memorial retailers. Compare prices, customize designs, order online.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/products"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Browse Memorials
            </Link>
            <Link 
              href="/become-retailer"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 border-2 border-white transition-all"
            >
              Become a Retailer
            </Link>
          </div>
          
          <div className="mt-20 grid md:grid-cols-4 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-xl mb-2">Wide Selection</h3>
              <p className="text-gray-300 text-sm">Browse hundreds of memorial designs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-xl mb-2">Best Prices</h3>
              <p className="text-gray-300 text-sm">Compare retailers easily</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-xl mb-2">Trusted Sellers</h3>
              <p className="text-gray-300 text-sm">Verified and rated retailers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="font-bold text-xl mb-2">Personalized</h3>
              <p className="text-gray-300 text-sm">Custom messages and designs</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-black/50 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Stone Connect. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">South Africa's Memorial Marketplace</p>
        </div>
      </footer>
    </main>
  )
}<Link 
  href="/products"
  className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all"
>
  Browse Memorials
</Link>