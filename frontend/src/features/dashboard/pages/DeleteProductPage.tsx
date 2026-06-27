import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, ArrowLeft, Package, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

interface ProductImage {
  featuredImg?: {
    url: string
  }
}

interface Product {
  _id: string
  title: string
  price: number
  bidStatus: string
  category: string
  subCategory?: string
  images?: ProductImage
  createdAt: string
}

const confirmSchema = z.object({
  confirmText: z.string().refine((val) => val === 'DELETE', {
    message: 'Type DELETE to confirm',
  }),
})

// Explicit type needed because .refine() changes the inferred output type
type ConfirmFormData = {
  confirmText: string
}

const DeleteProductPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAppSelector((state) => state.user)
  const { loading } = useAppSelector((state) => state.product)

  const [product, setProduct] = useState<Product | null>(null)
  const [productLoading, setProductLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      confirmText: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await customFetch(`/api/v1/products/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          setProduct(data.product)
        } else {
          toast.error(data.message || 'Product not found')
          navigate('/dashboard/products')
        }
      } catch (error) {
        toast.error('Failed to fetch product')
        navigate('/dashboard/products')
      } finally {
        setProductLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleDelete = async () => {
    setDeleting(true)
    dispatch({ type: 'DELETE_PRODUCT_REQUEST' })
    try {
      const res = await customFetch(`/api/v1/product/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: data.message })
        toast.success(data.message || 'Product deleted successfully')
        navigate('/dashboard/products')
      } else {
        dispatch({ type: 'DELETE_PRODUCT_FAIL', payload: data.message })
        toast.error(data.message || 'Failed to delete product')
      }
    } catch (error) {
      dispatch({ type: 'DELETE_PRODUCT_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setDeleting(false)
    }
  }

  const handleGoBack = () => {
    navigate('/dashboard/products')
  }

  if (productLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
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
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">Product Not Found</h3>
          <p className="text-sm text-neutral-500 mb-4">The product you are trying to delete does not exist.</p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">Delete Product</h1>
        </div>
      </div>

      {/* Product Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-neutral-700">Product Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
              <img
                src={product.images?.featuredImg?.url || '/placeholder.png'}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Details Table */}
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 text-neutral-500">Field</TableHead>
                    <TableHead className="text-neutral-900">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Title</TableCell>
                    <TableCell>{product.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Price</TableCell>
                    <TableCell>Rs. {product.price?.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Category</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Sub Category</TableCell>
                    <TableCell>{product.subCategory || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Status</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.bidStatus === 'Live' ? 'default' : 'secondary'}
                        className={
                          product.bidStatus === 'Live' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                        }
                      >
                        {product.bidStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-neutral-500">Created</TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base font-medium text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-sm text-neutral-700">
                This action is <span className="font-semibold text-destructive">permanent and cannot be undone</span>.
                All associated bids, images, and data for this product will be permanently removed.
              </p>
            </div>
          </div>

          {/* Confirmation Form */}
          <form onSubmit={handleSubmit(handleDelete)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Type <span className="font-semibold text-destructive">DELETE</span> to confirm
              </label>
              <Controller
                name="confirmText"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Type DELETE here"
                    className="max-w-xs"
                    disabled={deleting || loading}
                  />
                )}
              />
              {errors.confirmText && <p className="text-sm text-destructive mt-1">{errors.confirmText.message}</p>}
            </div>

            {/* AlertDialog Trigger + Content */}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button type="button" variant="destructive" disabled={!isValid || deleting || loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <span className="font-semibold">{product.title}</span> and remove all
                    associated data including bids, images, and history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </CardContent>
        <CardFooter className="bg-destructive/5 border-t border-destructive/20">
          <p className="text-xs text-neutral-500">
            Logged in as: <span className="font-medium text-neutral-700">{user?.name || 'Seller'}</span> | Product ID:{' '}
            <span className="font-mono text-neutral-700">{id}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DeleteProductPage
