import nanoId from './randomId'

const getBidTimeDropList = (data: any) => {
  return data?.bidTimeList?.map((day: number) => {
    return (
      <option key={nanoId()} value={day}>
        {day} {day === 1 ? 'Day' : 'Days'}
      </option>
    )
  })
}

export default getBidTimeDropList
