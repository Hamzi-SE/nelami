import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import customFetch from '@/lib/api'
import MetaData from '@/lib/MetaData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { CreditCard, Loader2, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const orderPackage = useAppSelector((state) => state.package.package)
  const orderPrice = useAppSelector((state) => state.package.price)
  const orderId = useAppSelector((state) => state.package.packageId)
  const orderDescription = useAppSelector((state) => state.package.description)
  const { loading } = useAppSelector((state) => state.payment)
  const { isAuthenticated } = useAppSelector((state) => state.user)
  const userLoading = useAppSelector((state) => state.user.loading)

  const [checkoutReady, setCheckoutReady] = useState(false)

  useEffect(() => {
    if (userLoading) return
    if (!isAuthenticated) {
      toast.error('Please log in to upgrade your plan')
      navigate('/packages')
      return
    }
    if (!orderPackage || !orderPrice) {
      navigate('/packages')
      toast.error('Please select a package')
      return
    }
    setCheckoutReady(true)
  }, [userLoading, isAuthenticated, orderPackage, orderPrice, navigate])

  const submitHandler = async () => {
    dispatch({ type: 'PLAN_PAYMENT_REQUEST' })
    try {
      const res = await customFetch('/api/v1/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentData: { id: orderId } }),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch({ type: 'PLAN_PAYMENT_FAIL', payload: data.message })
        toast.error(data.message)
        return
      }
      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl
      }
    } catch (error: any) {
      dispatch({
        type: 'PLAN_PAYMENT_FAIL',
        payload: error?.message || "There's an issue while processing the payment",
      })
      toast.error(error?.message || 'Payment processing error')
    }
  }

  if (userLoading || !checkoutReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const descriptionItems = orderDescription ? orderDescription.split('\n').filter(Boolean) : []

  return (
    <>
      <MetaData title="Checkout - Nelami" />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>
          <p className="text-sm text-neutral-500 mt-1">Review your order and complete your purchase.</p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-500" />
                <CardTitle>Plan Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Plan</span>
                  <span className="font-semibold text-neutral-900">{orderPackage}</span>
                </div>

                {descriptionItems.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Includes:</p>
                    <ul className="space-y-1.5">
                      {descriptionItems.map((item, index) => (
                        <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                          <span className="text-primary-500 mt-0.5">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Total (PKR)</span>
                  <span className="text-xl font-bold text-neutral-900">Rs. {orderPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-success-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Secure Payment</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    You will be redirected to a secure payment page to complete your transaction.
                  </p>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={submitHandler} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage
