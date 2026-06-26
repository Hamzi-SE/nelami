import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, MapPin, Clock, DollarSign, FileText, Image as ImageIcon, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAppSelector } from '@/store/typedHooks'
import { toast } from 'sonner'
import PostProduct from '@/helpers/PostProduct'
import {
  getProvinceDropList,
  getPunjabCitiesDropList,
  getSindhCitiesDropList,
  getKPKCitiesDropList,
  getBalochistanCitiesDropList,
  getAzadKashmirCitiesDropList,
  getNorthernAreasCitiesDropList,
  getIslamabadSectorsDropList,
} from '@/utils/PakCitiesData'

// Helper to get city dropdown based on province
const getCityDropList = (province: string, data: any) => {
  const cityMap: Record<string, (data: any) => React.ReactNode[]> = {
    Punjab: getPunjabCitiesDropList,
    Sindh: getSindhCitiesDropList,
    'Khyber Pakhtunkhwa': getKPKCitiesDropList,
    Balochistan: getBalochistanCitiesDropList,
    'Azad Kashmir': getAzadKashmirCitiesDropList,
    'Northern Areas': getNorthernAreasCitiesDropList,
    Islamabad: getIslamabadSectorsDropList,
  }
  const getter = cityMap[province]
  return getter ? getter(data) : []
}
import { getCarMake, getFuelDropList } from '@/utils/carData'
import getBidTimeDropList from '@/utils/BidData'

// Base schema for all product types
const baseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  province: z.string().min(1, 'Please select a province'),
  city: z.string().min(1, 'Please select a city'),
  bidTime: z.coerce.number().min(1, 'Bid time must be at least 1 day').max(30, 'Bid time must be at most 30 days'),
})

interface BaseProductFormProps {
  category: string
  subCategory: string
  additionalFields?: (control: any) => React.ReactNode
  additionalSchema?: z.ZodObject<any>
  additionalFieldNames?: string[] // names of additional required fields for progress calculation
}

const BaseProductForm = ({ category, subCategory, additionalFields, additionalSchema, additionalFieldNames = [] }: BaseProductFormProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data } = useAppSelector((state) => state.data)
  const { user, isAuthenticated, loading: userLoading } = useAppSelector((state) => state.user)
  const productLoading = useAppSelector((state) => state.product.loading)

  const [featuredImg, setFeaturedImg] = useState('')
  const [imageOne, setImageOne] = useState('')
  const [imageTwo, setImageTwo] = useState('')
  const [imageThree, setImageThree] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const schema = additionalSchema ? baseSchema.extend(additionalSchema.shape) : baseSchema

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      province: '',
      city: '',
      bidTime: undefined,
    },
    mode: 'onChange',
  })

  const selectedProvince = watch('province')

  // Reset city when province changes
  useEffect(() => {
    setValue('city', '')
  }, [selectedProvince, setValue])

  // Auto-save to localStorage every 30 seconds
  const watchedValues = watch()
  useEffect(() => {
    const interval = setInterval(() => {
      const hasData = watchedValues.title || watchedValues.description || watchedValues.price
      if (hasData) {
        setAutoSaveStatus('saving')
        localStorage.setItem(
          `draft-${category}-${subCategory}`,
          JSON.stringify({ ...watchedValues, images, timestamp: Date.now() })
        )
        setTimeout(() => setAutoSaveStatus('saved'), 500)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [watchedValues, category, subCategory, images])

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(`draft-${category}-${subCategory}`)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (Date.now() - parsed.timestamp < 86400000) {
          Object.entries(parsed).forEach(([key, value]) => {
            if (key !== 'images' && key !== 'timestamp') {
              setValue(key as any, value as any)
            }
          })
          if (parsed.images) {
            setImages(parsed.images)
            setFeaturedImg(parsed.images[0] || '')
            setImageOne(parsed.images[1] || '')
            setImageTwo(parsed.images[2] || '')
            setImageThree(parsed.images[3] || '')
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [category, subCategory, setValue])

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages.filter(Boolean))
    if (index === 0) setFeaturedImg(value)
    if (index === 1) setImageOne(value)
    if (index === 2) setImageTwo(value)
    if (index === 3) setImageThree(value)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => handleImageChange(index, reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => handleImageChange(index, reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = ''
    setImages(newImages.filter(Boolean))
    if (index === 0) setFeaturedImg('')
    if (index === 1) setImageOne('')
    if (index === 2) setImageTwo('')
    if (index === 3) setImageThree('')
  }

  const handleFormSubmit = (formData: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to post a product')
      return
    }
    if (user?.role !== 'seller') {
      toast.error(`Role ${user?.role} cannot post a product`)
      return
    }
    const productData = { ...formData, category, subCategory }
    PostProduct(dispatch, navigate, featuredImg, imageOne, imageTwo, imageThree, productData)
    localStorage.removeItem(`draft-${category}-${subCategory}`)
  }

  // Calculate form progress accurately
  const requiredBaseFields = ['title', 'description', 'price', 'province', 'city', 'bidTime']
  const allRequiredFields = [...requiredBaseFields, ...additionalFieldNames]
  const filledFields = allRequiredFields.filter((field) => {
    const val = watchedValues[field]
    return val !== undefined && val !== null && val !== '' && val !== 0
  }).length
  const progress = Math.round((filledFields / allRequiredFields.length) * 100)

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-danger-500 text-lg font-bold">Please login to view this page!</p>
      </div>
    )
  }

  if (isAuthenticated && user?.role !== 'seller') {
    return (
      <div className="text-center py-16">
        <p className="text-danger-500 text-lg font-bold">Role {user?.role} cannot post a Product</p>
      </div>
    )
  }

  return (
    <>
      {productLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Progress & Auto-save */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Progress</span>
            <Progress value={progress} className="w-32" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          {autoSaveStatus && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              {autoSaveStatus === 'saving' ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-3 w-3" /> Draft saved</>
              )}
            </span>
          )}
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Product Title</FieldLabel>
                  <Input {...field} id="title" placeholder="Enter product title" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea {...field} id="description" placeholder="Describe your product in detail" rows={4} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Starting Price (Rs.)</FieldLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input {...field} id="price" type="number" placeholder="Enter starting price" className="pl-9" />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="province"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="province">Province</FieldLabel>
                    <select {...field} id="province" className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                      <option value="">Select Province</option>
                      {getProvinceDropList(data)}
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* City dropdown - shown when province is selected */}
              {selectedProvince && (
                <Controller
                  name="city"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="city">
                        {selectedProvince === 'Islamabad' ? 'Sector' : 'City'}
                      </FieldLabel>
                      <select {...field} id="city" className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                        <option value="">Select {selectedProvince === 'Islamabad' ? 'Sector' : 'City'}</option>
                        {getCityDropList(selectedProvince, data)}
                      </select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bid Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-500" />
              Auction Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="bidTime"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bidTime">Bid Time (Days)</FieldLabel>
                  <select {...field} id="bidTime" className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                    <option value="">Select Bid Time</option>
                    {getBidTimeDropList(data).map((el: any) => (
                      <option key={el.props.value} value={el.props.value}>{el.props.children}</option>
                    ))}
                  </select>
                  <FieldDescription>How many days should the auction last? (1-30 days)</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Image Upload with Drag & Drop */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary-500" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-1">
                  <label className="text-xs text-neutral-500">{index === 0 ? 'Featured' : `Image ${index + 1}`}</label>
                  <div
                    className={`relative aspect-square rounded-lg border-2 border-dashed overflow-hidden transition-colors ${
                      dragOverIndex === index ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 bg-neutral-50'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index) }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {images[index] ? (
                      <div className="relative group h-full w-full">
                        <img src={images[index]} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                        {/* Overlay with replace/remove buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="h-8 w-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-neutral-100">
                            <Upload className="h-4 w-4 text-neutral-700" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileInput(index, e)}
                            />
                          </label>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-full bg-white flex items-center justify-center hover:bg-neutral-100"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4 text-danger-500" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors">
                        <Upload className="h-6 w-6 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400 mt-1">Drop or click</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileInput(index, e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Category-Specific Fields */}
        {additionalFields && additionalFields(control)}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || productLoading}>
            {(isSubmitting || productLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Product
          </Button>
        </div>
      </form>
    </>
  )
}

export default BaseProductForm
