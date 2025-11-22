'use client'

import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'

// South African provinces and major cities
const SA_LOCATIONS = {
  'All South Africa': [],
  'Gauteng': ['Johannesburg', 'Pretoria', 'Centurion', 'Sandton', 'Midrand', 'Roodepoort', 'Kempton Park'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'Somerset West', 'Hermanus', 'George'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Ladysmith'],
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown', 'Queenstown'],
  'Mpumalanga': ['Nelspruit', 'Witbank', 'Middelburg', 'Secunda', 'Ermelo'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Musina', 'Phalaborwa', 'Mokopane'],
  'North West': ['Rustenburg', 'Mahikeng', 'Potchefstroom', 'Klerksdorp', 'Brits'],
  'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem', 'Kroonstad', 'Sasolburg'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar']
}

interface LocationFilterProps {
  onLocationChange: (province: string, city: string) => void
  selectedProvince?: string
  selectedCity?: string
}

export default function LocationFilter({ 
  onLocationChange, 
  selectedProvince = 'All South Africa',
  selectedCity = ''
}: LocationFilterProps) {
  const [province, setProvince] = useState(selectedProvince)
  const [city, setCity] = useState(selectedCity)
  const [searchQuery, setSearchQuery] = useState('')

  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince)
    setCity('')
    onLocationChange(newProvince, '')
  }

  const handleCityChange = (newCity: string) => {
    setCity(newCity)
    onLocationChange(province, newCity)
  }

  const cities = SA_LOCATIONS[province as keyof typeof SA_LOCATIONS] || []
  const filteredCities = cities.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Filter by Location</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Province Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province
          </label>
          <select
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {Object.keys(SA_LOCATIONS).map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City / Area
          </label>
          {province !== 'All South Africa' && cities.length > 0 ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All {province}</option>
                {filteredCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
              Select a province first
            </div>
          )}
        </div>
      </div>

      {/* Current Selection Display */}
      {(province !== 'All South Africa' || city) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Showing retailers in: </span>
            {city ? `${city}, ${province}` : province}
          </p>
        </div>
      )}
    </div>
  )
}