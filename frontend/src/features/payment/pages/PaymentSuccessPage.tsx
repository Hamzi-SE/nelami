import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import customFetch from '@/lib/api'
import { callProfile } from '@/lib/helpers/callProfile'
import MetaData from '@/lib/MetaData'
import { useAppDispatch } from '@/store/typedHooks'
import { CheckCircle, Loader2, PartyPopper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface SessionData {
  id: string
  status: string
  amount_total: number
  currency: string
  payment_status: string
}

const PaymentSuccessPage = () => {
  const [session, setSession] = useState<SessionData | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchSession = async () => {
      const query = new URLSearchParams(location.search)
      const sessionId = query.get('session_id')

      if (sessionId) {
        try {
          const res = await customFetch(`/api/v1/payment/stripe/session?session_id=${sessionId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          const data = await res.json()

          if (res.status === 200) {
            setSession(data.session)
            dispatch({ type: 'PLAN_PAYMENT_SUCCESS' })
            callProfile(dispatch)
            toast.success('Plan upgraded successfully')
          } else {
            toast.error(`Error fetching session details: ${data.message}`)
            navigate('/', { replace: true })
          }
        } catch {
          toast.error('Error fetching session details')
          navigate('/', { replace: true })
        }
      }
    }
    fetchSession()
  }, [location.search, navigate, dispatch])

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <MetaData title="Payment Successful - Nelami" />

      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          {session.status === 'complete' && (
            <div className="relative inline-block mb-6">
              <div className="h-20 w-20 rounded-full bg-success-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-success-500" />
              </div>
              <PartyPopper className="h-6 w-6 text-amber-500 absolute -top-1 -right-1" />
            </div>
          )}

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h1>
          <p className="text-neutral-500 mb-8">Thank you for your purchase. Your payment was processed successfully.</p>

          <Card className="text-left mb-6">
            <CardContent className="py-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Session ID</span>
                <span className="text-sm font-mono text-neutral-700 truncate max-w-[140px]">{session.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Amount</span>
                <span className="text-sm font-medium text-neutral-900">
                  {session.amount_total / 100} {session.currency.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Status</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {session.payment_status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </section>
    </>
  )
}

export default PaymentSuccessPage
