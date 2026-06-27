import { useAppSelector } from '@/store/typedHooks'
import { useCallback, useState } from 'react'

const cityListKeyMap: Record<string, string> = {
  Punjab: 'punjabCitiesList',
  Sindh: 'sindhCitiesList',
  'Khyber Pakhtunkhwa': 'kpkCitiesList',
  Balochistan: 'balochistanCitiesList',
  'Azad Kashmir': 'azadKashmirCitiesList',
  'Northern Areas': 'northernAreasList',
  Islamabad: 'islamabadSectorsList',
}

export function useLocationSelector() {
  const appData = useAppSelector((state) => state.data)
  const provinces = appData?.data?.provinceList || []

  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  const cityListKey = selectedProvince ? cityListKeyMap[selectedProvince] : null
  const cities = cityListKey ? (appData?.data as any)?.[cityListKey] || [] : []

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
