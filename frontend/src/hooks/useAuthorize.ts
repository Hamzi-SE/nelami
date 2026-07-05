import customFetch from '@/lib/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type AuthCheckType = 'checkLogin' | 'checkSeller'

interface UseAuthorizeResult {
  showPage: boolean
  loading: boolean
}

function useAuthorize(props: AuthCheckType): UseAuthorizeResult {
  const [showPage, setShowPage] = useState(false)
  const [loading, setLoading] = useState(true)

  const accessPage = async () => {
    if (props === 'checkLogin') {
      const res = await customFetch('/api/v1/authorizeLogin', {
        method: 'GET',
      })

      try {
        const data = await res.json()
        if (res.status === 200) {
          setShowPage(true)
        } else {
          toast.error(data.message)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    } else if (props === 'checkSeller') {
      const res = await customFetch('/api/v1/authorizeRoleSeller', {
        method: 'GET',
      })

      try {
        const data = await res.json()
        if (res.status === 200) {
          setShowPage(true)
        } else {
          toast.error(data.message)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    accessPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  return { showPage, loading }
}

export default useAuthorize
