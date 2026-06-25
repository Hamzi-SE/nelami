import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useSocket } from '@/hooks/useSocket'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useSocket()
  const { loading } = useAppSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    dispatch({ type: 'LOGIN_USER_REQUEST' })

    try {
      const res = await customFetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'LOGIN_USER_SUCCESS', payload: result.user })
        socket?.emit('addUser', result.user?._id)
        toast.success('Logged In Successfully')
        navigate('/', { replace: true })
        window.scrollTo(0, 0)
      } else {
        dispatch({ type: 'LOGIN_USER_FAIL', payload: result.message })
        toast.error(result.message)
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_USER_FAIL', payload: error.message })
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <FieldDescription>Enter your registered email address.</FieldDescription>
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
                placeholder="Enter your password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
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

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm cursor-pointer">Remember me</label>
        </div>
        <Link to="/user/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link to="/Signup" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
