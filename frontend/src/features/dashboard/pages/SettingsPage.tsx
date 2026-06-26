import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store/typedHooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import { Loader2, Lock, Crown, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import customFetch from '@/utils/api'

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

const SettingsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (formData: PasswordFormData) => {
    setLoading(true)
    dispatch({ type: 'UPDATE_PASSWORD_REQUEST' })
    try {
      const res = await customFetch('/api/v1/password/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'UPDATE_PASSWORD_SUCCESS', payload: 'Password Updated Successfully' })
        toast.success('Password Updated Successfully')
        reset()
      } else {
        dispatch({ type: 'UPDATE_PASSWORD_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'UPDATE_PASSWORD_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>

      {/* Package Upgrade (Seller only) */}
      {user?.role === 'seller' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <CardTitle>Package</CardTitle>
            </div>
            <Link to="/packages">
              <Button variant="outline" size="sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-neutral-500">Current Package</p>
                <p className="text-lg font-semibold text-neutral-900 capitalize">{user?.userPackage || 'Free'}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.userPackage === 'Platinum'
                  ? 'bg-violet-100 text-violet-700'
                  : user?.userPackage === 'Gold'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-neutral-100 text-neutral-700'
              }`}>
                {user?.userPackage || 'Free'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-500" />
            <CardTitle>Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <Field data-invalid={!!errors.oldPassword}>
              <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
              <Input
                {...register('oldPassword')}
                id="oldPassword"
                type="password"
                placeholder="Enter current password"
              />
              {errors.oldPassword && <FieldError errors={[errors.oldPassword]} />}
            </Field>

            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
              {errors.newPassword && <FieldError errors={[errors.newPassword]} />}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
            </Field>

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
