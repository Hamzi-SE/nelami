import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store/typedHooks'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react'
import customFetch from '@/utils/api'

const editProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  model: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bedrooms: z.string(),
  bathrooms: z.string(),
  noOfStoreies: z.string(),
  year: z.string(),
  kmsDriven: z.string(),
  floorLevel: z.string().optional(),
})

type EditProductFormData = z.infer<typeof editProductSchema>

interface ProductDetails {
  _id: string
  title: string
  model?: string
  description: string
  price: number
  bidStatus: string
  category: string
  subCategory?: string
  images?: { featuredImg?: { url: string } }
  furnished?: string
  bedrooms?: number
  bathrooms?: number
  noOfStoreys?: string
  constructionState?: string
  type?: string
  make?: string
  year?: string
  fuelType?: string
  kmsDriven?: string
  floorLevel?: string
  area?: number
  areaUnit?: string
  location?: { city: string; province: string }
  bidTime?: number
  endDate?: string
  user?: { _id: string }
}

const EditProductPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: '',
      model: '',
      description: '',
      bedrooms: undefined,
      bathrooms: undefined,
      noOfStoreies: undefined,
      year: undefined,
      kmsDriven: undefined,
      floorLevel: '',
    },
  })

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: 'LOAD_PRODUCT_REQUEST' })
      try {
        const res = await customFetch(`/api/v1/products/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'LOAD_PRODUCT_SUCCESS', payload: data.product })
          setProduct(data.product)
          reset({
            title: data.product.title || '',
            model: data.product.model || '',
            description: data.product.description || '',
            bedrooms: data.product.bedrooms ? String(data.product.bedrooms) : '',
            bathrooms: data.product.bathrooms ? String(data.product.bathrooms) : '',
            noOfStoreies: data.product.noOfStoreys ? String(data.product.noOfStoreys) : '',
            year: data.product.year ? String(data.product.year) : '',
            kmsDriven: data.product.kmsDriven ? String(data.product.kmsDriven) : '',
            floorLevel: data.product.floorLevel || '',
          })
        } else {
          dispatch({ type: 'LOAD_PRODUCT_FAIL', payload: data.message })
          toast.error(data.message || 'Product not found')
          navigate('/dashboard/products')
        }
      } catch (error) {
        dispatch({ type: 'LOAD_PRODUCT_FAIL', payload: 'Something went wrong' })
        toast.error('Failed to load product')
        navigate('/dashboard/products')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchProduct()
  }, [id, dispatch, navigate, reset])

  const onSubmit = async (formData: EditProductFormData) => {
    setLoading(true)
    dispatch({ type: 'UPDATE_PRODUCT_REQUEST' })
    try {
      // Convert string fields to numbers where applicable
      const payload = {
        title: formData.title,
        model: formData.model,
        description: formData.description,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        noOfStoreies: formData.noOfStoreies ? Number(formData.noOfStoreies) : undefined,
        year: formData.year ? Number(formData.year) : undefined,
        kmsDriven: formData.kmsDriven ? Number(formData.kmsDriven) : undefined,
        floorLevel: formData.floorLevel,
      }
      const res = await customFetch(`/api/v1/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: data.product })
        toast.success('Product Updated Successfully')
        navigate('/dashboard/products')
      } else {
        dispatch({ type: 'UPDATE_PRODUCT_FAIL', payload: data.message })
        toast.error(data.message || 'Failed to update product')
      }
    } catch (error) {
      dispatch({ type: 'UPDATE_PRODUCT_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return null
  }

  if (!isAuthenticated || user?._id !== product.user?._id) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">Not Authorized</h3>
          <p className="text-sm text-neutral-500 mb-4">You are not authorized to edit this product.</p>
          <Button onClick={() => navigate('/dashboard/products')}>Go Back</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">Edit Product</h1>
        </div>
        <Badge
          variant={product.bidStatus === 'Live' ? 'default' : 'secondary'}
          className={product.bidStatus === 'Live' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
        >
          {product.bidStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image & Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Product Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-3">
                <img
                  src={product.images?.featuredImg?.url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">{product.title}</h3>
              <p className="text-sm text-neutral-500">Rs. {product.price?.toLocaleString()}</p>
              <div className="mt-3 space-y-1 text-xs text-neutral-500">
                {product.location && (
                  <p>Location: {product.location.city}, {product.location.province}</p>
                )}
                {product.bidTime && <p>Auction Duration: {product.bidTime} Days</p>}
                {product.endDate && <p>End Date: {new Date(product.endDate).toLocaleDateString()}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input {...field} id="title" placeholder="Product title" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Property-specific editable fields */}
                {(product.bedrooms !== undefined || product.bathrooms !== undefined) && (
                  <div className="grid grid-cols-2 gap-4">
                    {product.bedrooms !== undefined && (
                      <Controller
                        name="bedrooms"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                            <Input {...field} id="bedrooms" type="number" placeholder="e.g. 3" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                    {product.bathrooms !== undefined && (
                      <Controller
                        name="bathrooms"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                            <Input {...field} id="bathrooms" type="number" placeholder="e.g. 2" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                  </div>
                )}

                {(product.noOfStoreys !== undefined || product.floorLevel !== undefined) && (
                  <div className="grid grid-cols-2 gap-4">
                    {product.noOfStoreys !== undefined && (
                      <Controller
                        name="noOfStoreies"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="noOfStoreies">Storeys</FieldLabel>
                            <Input {...field} id="noOfStoreies" type="number" placeholder="e.g. 2" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                    {product.floorLevel !== undefined && (
                      <Controller
                        name="floorLevel"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="floorLevel">Floor Level</FieldLabel>
                            <Input {...field} id="floorLevel" placeholder="e.g. Ground, 1st" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Vehicle-specific editable fields */}
                {product.model !== undefined && (
                  <Controller
                    name="model"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="model">Model</FieldLabel>
                        <Input {...field} id="model" placeholder="e.g. Corolla, Civic" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                )}

                {product.year !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="year"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="year">Year</FieldLabel>
                          <Input {...field} id="year" type="number" placeholder="e.g. 2020" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    {product.kmsDriven !== undefined && (
                      <Controller
                        name="kmsDriven"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="kmsDriven">Kilometers Driven</FieldLabel>
                            <Input {...field} id="kmsDriven" type="number" placeholder="e.g. 50000" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                  </div>
                )}

                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Describe your product in detail"
                        rows={6}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Read-only fields info */}
                <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Read-only Fields</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.make && (
                      <div>
                        <span className="text-neutral-400">Make:</span>{' '}
                        <span className="text-neutral-700">{product.make}</span>
                      </div>
                    )}
                    {product.fuelType && (
                      <div>
                        <span className="text-neutral-400">Fuel Type:</span>{' '}
                        <span className="text-neutral-700">{product.fuelType}</span>
                      </div>
                    )}
                    {product.furnished && (
                      <div>
                        <span className="text-neutral-400">Furnished:</span>{' '}
                        <span className="text-neutral-700">{product.furnished}</span>
                      </div>
                    )}
                    {product.constructionState && (
                      <div>
                        <span className="text-neutral-400">Construction:</span>{' '}
                        <span className="text-neutral-700">{product.constructionState}</span>
                      </div>
                    )}
                    {product.type && (
                      <div>
                        <span className="text-neutral-400">Type:</span>{' '}
                        <span className="text-neutral-700">{product.type}</span>
                      </div>
                    )}
                    {product.area && (
                      <div>
                        <span className="text-neutral-400">Area:</span>{' '}
                        <span className="text-neutral-700">{product.area} {product.areaUnit}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-400">Price:</span>{' '}
                      <span className="text-neutral-700">Rs. {product.price?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Category:</span>{' '}
                      <span className="text-neutral-700">{product.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/products')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
                  {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Product
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductPage
