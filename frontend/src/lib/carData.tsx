import nanoId from './randomId'

const defaultList = () => {
  return
}

const getCarMake = (data: any) => {
  return data?.carMakeList?.map((carMake: string) => {
    return (
      <option key={nanoId()} value={carMake}>
        {carMake}
      </option>
    )
  })
}

const getFuelDropList = (data: any) => {
  return data?.carFuelTypeList?.map((fuelType: string) => {
    return (
      <option key={nanoId()} value={fuelType}>
        {fuelType}
      </option>
    )
  })
}

export default defaultList
export { getCarMake, getFuelDropList }
