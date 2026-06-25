import { useAppSelector } from '@/store/typedHooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LocationSelectorProps {
  province?: string
  city?: string
  onProvinceChange?: (province: string) => void
  onCityChange?: (city: string) => void
  showLabel?: boolean
}

const provinceCityMap: Record<string, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Dera Ismail Khan'],
  Balochistan: ['Quetta', 'Turbat', 'Gwadar', 'Khuzdar', 'Sibi'],
  'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot'],
  'Northern Areas': ['Gilgit', 'Skardu', 'Hunza', 'Chilas'],
  Islamabad: ['F-6', 'F-7', 'F-8', 'G-9', 'G-10', 'G-11', 'I-8', 'I-9', 'I-10', 'Blue Area'],
}

const LocationSelector = ({
  province,
  city,
  onProvinceChange,
  onCityChange,
  showLabel = true,
}: LocationSelectorProps) => {
  const { data } = useAppSelector((state) => state.data)
  const provinces = data?.data?.provinceList || Object.keys(provinceCityMap)
  const cities = province ? (provinceCityMap[province] || []) : []

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

      {/* City Select */}
      <div>
        {showLabel && <label className="text-xs text-neutral-500 mb-1 block">City</label>}
        <Select value={city} onValueChange={onCityChange} disabled={!province}>
          <SelectTrigger>
            <SelectValue placeholder={province ? 'Select city' : 'Select province first'} />
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
