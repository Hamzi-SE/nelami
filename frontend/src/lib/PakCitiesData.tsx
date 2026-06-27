import nanoId from './randomId'

const defaultList = () => {
  return
}

const getAllCitiesDropList = (data: any) => {
  return data?.allCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getProvinceDropList = (data: any) => {
  return data?.provinceList?.map((province: string) => {
    return (
      <option key={nanoId()} value={province}>
        {province}
      </option>
    )
  })
}

const getPunjabCitiesDropList = (data: any) => {
  return data?.punjabCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getSindhCitiesDropList = (data: any) => {
  return data?.sindhCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getBalochistanCitiesDropList = (data: any) => {
  return data?.balochistanCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getKPKCitiesDropList = (data: any) => {
  return data?.kpkCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getAzadKashmirCitiesDropList = (data: any) => {
  return data?.azadKashmirCitiesList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getNorthernAreasCitiesDropList = (data: any) => {
  return data?.northernAreasList?.map((city: string) => {
    return (
      <option key={nanoId()} value={city}>
        {city}
      </option>
    )
  })
}

const getIslamabadSectorsDropList = (data: any) => {
  return data?.islamabadSectorsList?.map((sector: string) => {
    return (
      <option key={nanoId()} value={sector}>
        {sector}
      </option>
    )
  })
}

export default defaultList
export {
  getAllCitiesDropList,
  getAzadKashmirCitiesDropList,
  getBalochistanCitiesDropList,
  getIslamabadSectorsDropList,
  getKPKCitiesDropList,
  getNorthernAreasCitiesDropList,
  getProvinceDropList,
  getPunjabCitiesDropList,
  getSindhCitiesDropList,
}
