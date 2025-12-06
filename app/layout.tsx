import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from './components/CartContext'
import { RetailerAuthProvider } from './components/RetailerAuthContext'
import { CompareProvider } from '@/app/components/CompareContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stone Connect - Memorial Marketplace South Africa',
  description: 'Find quality gravestones, tombstones and memorial products from verified suppliers across South Africa. Compare prices, materials and designs from trusted retailers.',
  keywords: 'gravestones South Africa, tombstones, headstones, memorial products, memorial stones, gravestone suppliers, tombstone prices, custom gravestones',
  authors: [{ name: 'Stone Connect' }],
  openGraph: {
    title: 'Stone Connect - Memorial Marketplace South Africa',
    description: 'Quality memorial products from verified suppliers across South Africa',
    url: 'https://stoneconnect.co.za',
    siteName: 'Stone Connect',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stone Connect - Memorial Marketplace',
    description: 'Quality memorial products from verified suppliers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'your-verification-code-here', // Add your Google verification code after you get it
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <RetailerAuthProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </RetailerAuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}