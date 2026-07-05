import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppSelector } from '@/store/typedHooks'

interface LocationSelectorProps {
  province?: string
  city?: string
  onProvinceChange?: (province: string) => void
  onCityChange?: (city: string) => void
  showLabel?: boolean
}

const cityListKeyMap: Record<string, string> = {
  Punjab: 'punjabCitiesList',
  Sindh: 'sindhCitiesList',
  'Khyber Pakhtunkhwa': 'kpkCitiesList',
  Balochistan: 'balochistanCitiesList',
  'Azad Kashmir': 'azadKashmirCitiesList',
  'Northern Areas': 'northernAreasList',
  Islamabad: 'islamabadSectorsList',
}

const LocationSelector = ({
  province,
  city,
  onProvinceChange,
  onCityChange,
  showLabel = true,
}: LocationSelectorProps) => {
  const appData = useAppSelector((state) => state.data)
  const provinces = appData?.data?.provinceList || []
  const cityListKey = province ? cityListKeyMap[province] : null
  const cities = cityListKey ? (appData?.data as any)?.[cityListKey] || [] : []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {showLabel && <div className="sm:col-span-2 text-sm font-medium text-neutral-700">Location</div>}

      {/* Province Select */}
      <div>
        {showLabel && <label className="text-xs text-neutral-500 mb-1 block">Province</label>}
        <Select value={province} onValueChange={onProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City / Sector Select */}
      <div>
        {showLabel && (
          <label className="text-xs text-neutral-500 mb-1 block">{province === 'Islamabad' ? 'Sector' : 'City'}</label>
        )}
        <Select value={city} onValueChange={onCityChange} disabled={!province}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                province ? (province === 'Islamabad' ? 'Select sector' : 'Select city') : 'Select province first'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default LocationSelector
