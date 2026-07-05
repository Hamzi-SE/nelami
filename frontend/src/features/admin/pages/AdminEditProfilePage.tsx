import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import customFetch from '@/lib/api'
import { getAllCitiesDropList } from '@/lib/PakCitiesData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),
  city: z.string().min(1, 'Please select a city').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const AdminEditProfilePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const { data } = useAppSelector((state) => state.data)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phoneNo: '',
      address: '',
      city: '',
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customFetch('/api/v1/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const responseData = await res.json()

        if (res.status === 200) {
          reset({
            name: responseData.user.name || '',
            phoneNo: responseData.user.phoneNo || '',
            address: responseData.user.address || '',
            city: responseData.user.city || '',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchProfile()
  }, [reset])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (formData: ProfileFormData) => {
    setLoading(true)
    dispatch({ type: 'UPDATE_PROFILE_REQUEST' })

    try {
      const res = await customFetch('/api/v1/me/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          avatar,
        }),
      })

      const responseData = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'UPDATE_PROFILE_SUCCESS' })
        dispatch({ type: 'LOAD_USER_SUCCESS', payload: responseData.user })
        toast.success('Profile updated successfully')
        navigate('/admin/dashboard/profile')
      } else {
        dispatch({ type: 'UPDATE_PROFILE_FAIL', payload: responseData.message })
        toast.error(responseData.message)
      }
    } catch (error) {
      dispatch({ type: 'UPDATE_PROFILE_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard/profile')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-neutral-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : user?.avatar ? (
                  <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-semibold text-neutral-400">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <label className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                <p className="text-xs text-neutral-500 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input {...field} id="name" placeholder="Your name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" value={user?.email} disabled className="bg-neutral-50" />
                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
              </Field>

              <Controller
                name="phoneNo"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneNo">Phone Number</FieldLabel>
                    <Input {...field} id="phoneNo" placeholder="Phone number" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="city" className="h-9 w-full">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select City</SelectItem>
                        {getAllCitiesDropList(data).map((el: any) => (
                          <SelectItem key={el.props.value} value={el.props.value}>
                            {el.props.children}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input {...field} id="address" placeholder="Home address" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard/profile')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default AdminEditProfilePage
