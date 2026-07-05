import customFetch from '@/lib/api'
import type { AppDispatch } from '@/store/typedHooks'

export const callProfile = async (dispatch: AppDispatch) => {
  dispatch({ type: 'LOAD_USER_REQUEST' })
  try {
    const res = await customFetch('/api/v1/me', {
      method: 'GET',
    })
    const data = await res.json()

    if (res.status === 200) {
      dispatch({ type: 'LOAD_USER_SUCCESS', payload: data.user })
    } else {
      dispatch({ type: 'LOAD_USER_FAIL', payload: data.message })
    }
  } catch (error) {
    dispatch({ type: 'LOAD_USER_FAIL', payload: error })
  }
}
