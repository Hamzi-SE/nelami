import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import MetaData from '@/utils/MetaData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const ForgotPasswordPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((state) => state.forgotPassword)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    dispatch({ type: 'FORGOT_PASSWORD_REQUEST' })

    try {
      const res = await customFetch('/api/v1/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      const result = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'FORGOT_PASSWORD_SUCCESS', payload: result.message })
        toast.success(result.message)
        navigate('/', { replace: true })
      } else {
        dispatch({ type: 'FORGOT_PASSWORD_FAIL', payload: result.message })
        toast.error(result.message)
      }
    } catch (error: any) {
      dispatch({ type: 'FORGOT_PASSWORD_FAIL', payload: error.message })
      toast.error(error.message)
    }
  }

  return (
    <>
      <MetaData title="Forgot Password - Nelami" />

      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Forgot Your Password?</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Enter your email and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  {...register('email')}
                  className={errors.email ? 'border-danger-500' : ''}
                />
                {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <p className="text-center text-sm text-neutral-500">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPasswordPage
