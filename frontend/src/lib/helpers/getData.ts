import customFetch from '@/lib/api'
import type { AppDispatch } from '@/store/typedHooks'

export const getData = async (dispatch: AppDispatch) => {
  dispatch({ type: 'LOAD_DATA_REQUEST' })
  try {
    const res = await customFetch('/api/v1/getData/all', {
      method: 'GET',
    })
    const data = await res.json()

    if (res.status === 200) {
      dispatch({ type: 'LOAD_DATA_SUCCESS', payload: data.data })
    } else {
      dispatch({ type: 'LOAD_DATA_FAIL', payload: 'Data Fetching Failed' })
    }
  } catch (error) {
    dispatch({ type: 'LOAD_DATA_FAIL', payload: error })
  }
}
