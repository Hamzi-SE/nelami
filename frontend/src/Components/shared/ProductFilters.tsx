import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/store/typedHooks'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Vehicles', value: 'Vehicles' },
  { label: 'Properties', value: 'Property' },
  { label: 'Miscellaneous', value: 'MiscProducts' },
]

const sortOptions = [
  { label: 'Latest', value: '1' },
  { label: 'Oldest', value: '2' },
  { label: 'Price: Low to High', value: '3' },
  { label: 'Price: High to Low', value: '4' },
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

interface ProductFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void
}

const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const appData = useAppSelector((state) => state.data)
  const provinces = appData?.data?.provinceList || []
  const [searchParams, setSearchParams] = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [province, setProvince] = useState(searchParams.get('province') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [fromPrice, setFromPrice] = useState(searchParams.get('price[gte]') || '')
  const [toPrice, setToPrice] = useState(searchParams.get('price[lte]') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '1')

  const cityListKey = province ? cityListKeyMap[province] : null
  const cities = cityListKey ? (appData?.data as any)?.[cityListKey] || [] : []

  useEffect(() => {
    const filters: Record<string, string> = {}
    if (keyword) filters.keyword = keyword
    if (category) filters.category = category
    if (province) filters.province = province
    if (city) filters.city = city
    if (fromPrice) filters['price[gte]'] = fromPrice
    if (toPrice) filters['price[lte]'] = toPrice
    if (sortBy) filters.sortBy = sortBy
    onFiltersChange(filters)
  }, [keyword, category, province, city, fromPrice, toPrice, sortBy])

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setCity('')
  }

  const clearFilters = () => {
    setKeyword('')
    setCategory('')
    setProvince('')
    setCity('')
    setFromPrice('')
    setToPrice('')
    setSortBy('1')
    setSearchParams({})
  }

  const hasFilters = keyword || category || province || city || fromPrice || toPrice

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs gap-1">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Keyword */}
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Province */}
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">Province</label>
        <select
          value={province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* City / Sector */}
      {province && (
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">
            {province === 'Islamabad' ? 'Sector' : 'City'}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{province === 'Islamabad' ? 'All Sectors' : 'All Cities'}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={fromPrice}
            onChange={(e) => setFromPrice(e.target.value)}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Max"
            value={toPrice}
            onChange={(e) => setToPrice(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProductFilters
