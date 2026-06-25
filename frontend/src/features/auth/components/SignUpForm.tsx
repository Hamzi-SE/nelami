import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { signupSchema, type SignUpFormData } from '@/lib/validations/auth'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const SignUpForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'buyer',
      phoneNo: '',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (formData: SignUpFormData) => {
    dispatch({ type: 'SIGNUP_USER_REQUEST' })

    try {
      const res = await customFetch('/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      })
      const result = await res.json()

      if (res.status === 201) {
        dispatch({ type: 'OTP_SENT_SUCCESS', payload: result })
        toast.success(result.message)
        navigate(`/user/validate?email=${formData.email}`, { replace: true })
      } else {
        dispatch({ type: 'SIGNUP_USER_FAIL', payload: result.message })
        toast.error(result.message)
      }
    } catch (error: any) {
      dispatch({ type: 'SIGNUP_USER_FAIL', payload: error.message })
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              placeholder="Enter your name"
              aria-invalid={fieldState.invalid}
              autoComplete="name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              placeholder="Enter your email"
              aria-invalid={fieldState.invalid}
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Phone */}
      <Controller
        name="phoneNo"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              placeholder="Enter your phone number"
              aria-invalid={fieldState.invalid}
              autoComplete="tel"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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
                placeholder="Confirm your password"
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

      {/* Role Selection */}
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>I want to</FieldLabel>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="buyer"
                  checked={field.value === 'buyer'}
                  onChange={() => field.onChange('buyer')}
                  className="h-4 w-4 text-primary-500"
                />
                <span className="text-sm">Buy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="seller"
                  checked={field.value === 'seller'}
                  onChange={() => field.onChange('seller')}
                  className="h-4 w-4 text-primary-500"
                />
                <span className="text-sm">Sell</span>
              </label>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/Login" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign In
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm
