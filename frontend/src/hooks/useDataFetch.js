import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function useDataFetch() {
    const { data } = useSelector(state => state.data)

    const getBidTimeDropList = () => {
        data?.data?.bidTimeList?.map((day) => {
            return <option value={day}>{day} Days</option>
        })

    }
    useEffect(() => {
        getBidTimeDropList()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return {
        getBidTimeDropList
    }
}

export default useDataFetch;