import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
    register,
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

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
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
