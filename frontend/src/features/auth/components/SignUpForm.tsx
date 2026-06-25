import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signupSchema, type SignUpFormData } from '@/lib/validations/auth'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const SignUpForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((state) => state.user)
  const { data } = useAppSelector((state) => state.data)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          {...register('name')}
          className={errors.name ? 'border-danger-500' : ''}
        />
        {errors.name && <p className="text-xs text-danger-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-danger-500' : ''}
        />
        {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phoneNo">Phone Number</Label>
        <Input
          id="phoneNo"
          type="tel"
          placeholder="Enter your phone number"
          {...register('phoneNo')}
          className={errors.phoneNo ? 'border-danger-500' : ''}
        />
        {errors.phoneNo && <p className="text-xs text-danger-500">{errors.phoneNo.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            {...register('password')}
            className={`pr-10 ${errors.password ? 'border-danger-500' : ''}`}
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
        {errors.password && <p className="text-xs text-danger-500">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className={`pr-10 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
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
        {errors.confirmPassword && <p className="text-xs text-danger-500">{errors.confirmPassword.message}</p>}
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <Label>I want to</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="buyer"
              {...register('role')}
              className="h-4 w-4 text-primary-500"
            />
            <span className="text-sm">Buy</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="seller"
              {...register('role')}
              className="h-4 w-4 text-primary-500"
            />
            <span className="text-sm">Sell</span>
          </label>
        </div>
        {errors.role && <p className="text-xs text-danger-500">{errors.role.message}</p>}
      </div>

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
