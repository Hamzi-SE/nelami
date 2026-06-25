import { useState, useCallback } from 'react'
import { useAppSelector } from '@/store/typedHooks'

const provinceCityMap: Record<string, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Dera Ismail Khan'],
  Balochistan: ['Quetta', 'Turbat', 'Gwadar', 'Khuzdar', 'Sibi'],
  'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot'],
  'Northern Areas': ['Gilgit', 'Skardu', 'Hunza', 'Chilas'],
  Islamabad: ['F-6', 'F-7', 'F-8', 'G-9', 'G-10', 'G-11', 'I-8', 'I-9', 'I-10', 'Blue Area'],
}

export function useLocationSelector() {
  const { data } = useAppSelector((state) => state.data)
  const provinces = data?.data?.provinceList || Object.keys(provinceCityMap)

  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  const cities = selectedProvince ? (provinceCityMap[selectedProvince] || []) : []

  const handleProvinceChange = useCallback((province: string) => {
    setSelectedProvince(province)
    setSelectedCity('')
  }, [])

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
  }, [])

  return {
    provinces,
    cities,
    selectedProvince,
    selectedCity,
    handleProvinceChange,
    handleCityChange,
  }
}
