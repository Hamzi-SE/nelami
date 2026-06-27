import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import MetaData from '@/lib/MetaData'
import { Mail, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PaymentFailPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <MetaData title="Payment Failed - Nelami" />

      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="h-20 w-20 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-danger-500" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
          <p className="text-neutral-500 mb-8">
            Unfortunately, your payment could not be processed. Please try again or contact support if the issue
            persists.
          </p>

          <Card className="text-left mb-6">
            <CardContent className="py-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Need help?</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Contact us at{' '}
                    <a href="mailto:nelami@ihamza.dev" className="text-primary-500 hover:text-primary-600 font-medium">
                      nelami@ihamza.dev
                    </a>{' '}
                    for assistance.
                  </p>
                </div>
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

export default PaymentFailPage
