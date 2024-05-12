import nanoId from "./RandomIdGen";


const defaultList = () => {
  return;
};


const getCarMake = (data) => {
  return data?.carMakeList?.map((carMake) => {
    return <option key={nanoId()} value={carMake}>{carMake}</option>
  }
  )
}

const getFuelDropList = (data) => {
  return data?.carFuelTypeList?.map((fuelType) => {
    return <option key={nanoId()} value={fuelType}>{fuelType}</option>
  }
  )

};

export default defaultList;
export { getCarMake, getFuelDropList };
