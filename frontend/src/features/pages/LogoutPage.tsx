import { useSocket } from '@/hooks/useSocket'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LogoutPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const socket = useSocket()
  const { user } = useAppSelector((state: any) => state.user)

  useEffect(() => {
    const callLogout = async () => {
      dispatch({ type: 'LOGOUT_USER_REQUEST' })
      try {
        const res = await customFetch('/api/v1/logout', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()

        if (res.status === 200) {
          socket?.emit('removeUserFromLiveUsers', user?._id)
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          dispatch({ type: 'LOGOUT_USER_SUCCESS' })
          dispatch({ type: 'RESET_ACTIVE_COMPONENT' })
          toast.success(data.message)
          navigate('/')
        } else {
          dispatch({ type: 'LOGOUT_USER_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch {
        dispatch({ type: 'LOGOUT_USER_FAIL', payload: 'Something went wrong' })
        toast.error('Something went wrong')
      }
    }

    window.scrollTo(0, 0)
    callLogout()
  }, [dispatch, navigate, socket, user?._id])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-neutral-500">Logging out...</p>
      </div>
    </div>
  )
}

export default LogoutPage
