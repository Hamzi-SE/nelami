import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/store/typedHooks'

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Vehicles', value: 'Vehicles' },
  { label: 'Properties', value: 'Property' },
  { label: 'Miscellaneous', value: 'MiscProducts' },
]

const cityListKeyMap: Record<string, string> = {
  Punjab: 'punjabCitiesList',
  Sindh: 'sindhCitiesList',
  'Khyber Pakhtunkhwa': 'kpkCitiesList',
  Balochistan: 'balochistanCitiesList',
  'Azad Kashmir': 'azadKashmirCitiesList',
  'Northern Areas': 'northernAreasList',
  Islamabad: 'islamabadSectorsList',
}

const HeroSearch = () => {
  const navigate = useNavigate()
  const appData = useAppSelector((state) => state.data)
  const provinces = appData?.data?.provinceList || []

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')

  const cityListKey = province ? cityListKeyMap[province] : null
  const cities = cityListKey ? (appData?.data as any)?.[cityListKey] || [] : []

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (category) params.set('category', category)
    if (province) params.set('province', province)
    if (city) params.set('city', city)

    navigate(`/products?${params.toString()}`)
  }

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setCity('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Input */}
          <div className="md:col-span-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Province Select */}
          <div className="md:col-span-2">
            <select
              value={province}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Province</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* City / Sector Select */}
          <div className="md:col-span-2">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!province}
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{province === 'Islamabad' ? 'Sector' : 'City'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <Button onClick={handleSearch} className="h-11 w-full" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSearch
