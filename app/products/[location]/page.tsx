
import { Metadata } from 'next'

type Props = {
  params: { location: string }
}

// Generate metadata for each location page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = params?.location ?? ""
  const location = raw.replace(/-/g, " ") || "South Africa"

  return {
    title: `Memorial Retailers in ${location} | Stone Connect`,
    description: `Find trusted memorial stone retailers in ${location}.`,
    openGraph: {
      title: `Memorial Retailers in ${location}`,
      description: `Browse memorial retailers in ${location}, South Africa`,
      url: `https://stoneconnect.co.za/products/${params?.location ?? ""}`,
    }
  }
}


// Generate static pages for major cities (for SEO)
export async function generateStaticParams() {
  const majorCities = [
    'johannesburg',
    'cape-town',
    'durban',
    'pretoria',
    'port-elizabeth',
    'bloemfontein',
    'east-london',
    'polokwane',
    'nelspruit',
    'kimberley'
  ]
  
  return majorCities.map((city) => ({
    location: city,
  }))
}

export default function LocationPage({ params }: Props) {
  const raw = params?.location ?? ""
  const location = raw.replace(/-/g, " ") || "South Africa"
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Memorial Retailers in {location}
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Find Quality Memorial Services in {location}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Stone Connect connects you with verified memorial retailers in {location}, South Africa. 
            Compare prices, view designs, and order custom headstones and memorials from trusted local suppliers.
          </p>
        </div>

        {/* Add your LocationFilter and retailer listings here */}
        <p className="text-gray-600">
          Location-specific content and retailers will appear here...
        </p>
      </div>
    </main>
  )
}

// Additional: Add this to your sitemap.xml generation
// This helps Google find all your location pages
export const LOCATION_PAGES = [
  'johannesburg', 'cape-town', 'durban', 'pretoria', 
  'port-elizabeth', 'bloemfontein', 'east-london',
  'polokwane', 'nelspruit', 'kimberley', 'pietermaritzburg',
  'rustenburg', 'welkom', 'newcastle', 'springs'
]