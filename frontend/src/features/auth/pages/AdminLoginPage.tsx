import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import MetaData from '@/utils/MetaData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const AdminLoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    dispatch({ type: 'LOGIN_USER_REQUEST' })

    try {
      const res = await customFetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          person: 'admin',
        }),
      })
      const result = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'LOGIN_USER_SUCCESS', payload: result.user })
        toast.success('Admin Logged In Successfully')
        navigate('/admin/Dashboard', { replace: true })
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
    <>
      <MetaData title="Admin Login - Nelami" />

      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-3">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Admin Login</h2>
              <p className="text-sm text-neutral-500 mt-1">Access the admin dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  {...register('email')}
                  className={errors.email ? 'border-danger-500' : ''}
                />
                {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
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

              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login as Admin
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminLoginPage
