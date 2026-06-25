import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import MetaData from '@/utils/MetaData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const ResetPasswordPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useParams()
  const { loading } = useAppSelector((state) => state.forgotPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    dispatch({ type: 'RESET_PASSWORD_REQUEST' })

    try {
      const res = await customFetch(`/api/v1/password/reset/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })
      const result = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'RESET_PASSWORD_SUCCESS', payload: result.message })
        dispatch({ type: 'LOAD_USER_SUCCESS', payload: result.user })
        toast.success(result.message)
        navigate('/', { replace: true })
      } else {
        dispatch({ type: 'RESET_PASSWORD_FAIL', payload: result.message })
        toast.error(result.message)
      }
    } catch (error: any) {
      dispatch({ type: 'RESET_PASSWORD_FAIL', payload: error.message })
      toast.error(error.message)
    }
  }

  return (
    <>
      <MetaData title="Reset Password - Nelami" />

      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Reset Your Password</h2>
              <p className="text-sm text-neutral-500 mt-1">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <p className="text-center text-sm text-neutral-500">
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

export default ResetPasswordPage
