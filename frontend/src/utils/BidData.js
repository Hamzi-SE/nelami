import nanoId from "./RandomIdGen";

const getBidTimeDropList = (data) => {
  return data?.bidTimeList?.map((day) => {
    return <option key={nanoId()} value={day}>{day} {day === 1 ? "Day" : "Days"}</option>
  }
  )
}

export default getBidTimeDropList;

