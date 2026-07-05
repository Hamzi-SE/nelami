import { useAppSelector } from '@/store/typedHooks'
import { useEffect } from 'react'

interface RootState {
  data: {
    data: any
  }
}

function useDataFetch() {
  const { data } = useAppSelector((state: RootState) => state.data)

  const getBidTimeDropList = () => {
    data?.data?.bidTimeList?.map((day: number) => {
      return (
        <option key={day} value={day}>
          {day} Days
        </option>
      )
    })
  }

  useEffect(() => {
    getBidTimeDropList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    getBidTimeDropList,
  }
}

export default useDataFetch
