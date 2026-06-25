import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MetaData from '@/utils/MetaData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const OTPValidationPage = () => {
  const { loading, token } = useAppSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const email = searchParams.get('email')

  const [otp, setOtp] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !otp) {
      toast.error('Please Fill All Fields')
      return
    }

    try {
      const res = await customFetch('/api/v1/OTPValidation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, token }),
      })
      const data = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'SIGNUP_USER_SUCCESS', payload: data.user })
        toast.success('Email Verified Successfully')
        navigate('/dashboard', { replace: true })
        window.scrollTo(0, 0)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <MetaData title="OTP Validation - Nelami" />

      {/* Breadcrumb */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">OTP Validation</h1>
          <nav className="flex items-center gap-1.5 mt-1 text-sm text-neutral-500">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <span className="text-neutral-700">OTP Validation</span>
          </nav>
        </div>
      </section>

      {/* OTP Form */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Verify Your Email</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Enter the OTP sent to <span className="font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Validate
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default OTPValidationPage
