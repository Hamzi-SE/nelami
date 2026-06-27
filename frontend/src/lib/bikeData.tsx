import nanoId from './randomId'

const defaultList = () => {
  return
}

const getBikeMake = (data: any) => {
  return data?.bikeMakeList?.map((bike: string) => {
    return (
      <option key={nanoId()} value={bike}>
        {bike}
      </option>
    )
  })
}

export default defaultList
export { getBikeMake }
