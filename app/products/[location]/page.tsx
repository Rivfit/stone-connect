import { Metadata } from 'next'
import LocationPageClient from './LocationPageClient'

type Props = {
  params: { location: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locationSlug = params?.location ?? ""
  const cityName = locationSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `Memorial Retailers in ${cityName} | Stone Connect`,
    description: `Find trusted memorial stone retailers in ${cityName}, South Africa. Compare prices, view designs, and order custom headstones from verified local suppliers.`,
    keywords: [
      `memorial retailers ${cityName}`,
      `headstone suppliers ${cityName}`,
      `tombstone ${cityName}`,
      `granite memorials ${cityName}`,
      `custom headstones ${cityName}`,
      `memorial services ${cityName}`,
    ],
    openGraph: {
      title: `Memorial Retailers in ${cityName} | Stone Connect`,
      description: `Browse verified memorial retailers in ${cityName}, South Africa. Quality headstones and custom memorials.`,
      url: `https://stoneconnect.co.za/products/${locationSlug}`,
      type: 'website',
    },
  }
}

// Generate static pages for major cities (improves SEO)
export async function generateStaticParams() {
  const majorLocations = [
    // Gauteng
    'johannesburg',
    'pretoria',
    'sandton',
    'soweto',
    'benoni',
    'boksburg',
    'germiston',
    'krugersdorp',
    'randburg',
    'roodepoort',
    'springs',
    'alberton',
    'kempton-park',
    'midrand',
    
    // Western Cape
    'cape-town',
    'stellenbosch',
    'paarl',
    'somerset-west',
    'bellville',
    'mitchells-plain',
    'george',
    'knysna',
    'mossel-bay',
    
    // KwaZulu-Natal
    'durban',
    'pietermaritzburg',
    'newcastle',
    'richards-bay',
    'port-shepstone',
    'ladysmith',
    'dundee',
    
    // Eastern Cape
    'port-elizabeth',
    'east-london',
    'mthatha',
    'grahamstown',
    'uitenhage',
    'queenstown',
    
    // Free State
    'bloemfontein',
    'welkom',
    'bethlehem',
    'kroonstad',
    'sasolburg',
    
    // Mpumalanga
    'nelspruit',
    'witbank',
    'middelburg',
    'secunda',
    'ermelo',
    
    // Limpopo
    'polokwane',
    'tzaneen',
    'phalaborwa',
    'mokopane',
    'thohoyandou',
    
    // North West
    'rustenburg',
    'klerksdorp',
    'potchefstroom',
    'mahikeng',
    'brits',
    
    // Northern Cape
    'kimberley',
    'upington',
    'kuruman',
    'springbok',
  ]
  
  return majorLocations.map((location) => ({
    location,
  }))
}

export default function LocationPage({ params }: Props) {
  return <LocationPageClient params={params} />
}