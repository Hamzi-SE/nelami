import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppSelector } from '@/store/typedHooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import {
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Package,
  Loader2,
  X,
} from 'lucide-react'
import customFetch from '@/utils/api'

interface ProductImage {
  url: string
}

interface ApprovalProduct {
  _id: string
  title: string
  price: number
  category: string
  status: string
  bidTime: number
  endDate: string
  createdAt: string
  images: ProductImage[]
}

const categorySchema = z.object({
  search: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

const WaitingApprovalPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)

  const [products, setProducts] = useState<ApprovalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ApprovalProduct | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      search: '',
    },
  })

  const searchValue = watch('search')

  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    dispatch({ type: 'SELLER_APPROVAL_PRODUCTS_REQUEST' })
    try {
      const res = await customFetch('/api/v1/getApprovalProducts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'SELLER_APPROVAL_PRODUCTS_SUCCESS', payload: data.approvalProducts })
        setProducts(data.approvalProducts || [])
      } else {
        dispatch({ type: 'SELLER_APPROVAL_PRODUCTS_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'SELLER_APPROVAL_PRODUCTS_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [dispatch])

  const filteredProducts = products.filter((product) => {
    if (!searchValue) return true
    const query = searchValue.toLowerCase()
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })

  const handleViewDetails = (product: ApprovalProduct) => {
    setSelectedProduct(product)
    setDetailDialogOpen(true)
  }

  const handleDeleteClick = (product: ApprovalProduct) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return
    setDeleting(true)
    try {
      const res = await customFetch(`/api/v1/product/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        toast.success('Product deleted successfully')
        setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id))
        dispatch({ type: 'DELETE_PRODUCT_SUCCESS' })
      } else {
        toast.error(data.message)
        dispatch({ type: 'DELETE_PRODUCT_FAIL', payload: data.message })
      }
    } catch (error) {
      toast.error('Something went wrong')
      dispatch({ type: 'DELETE_PRODUCT_FAIL', payload: 'Something went wrong' })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('car') || cat.includes('bike') || cat.includes('vehicle')) {
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
    }
    if (cat.includes('house') || cat.includes('land') || cat.includes('property') || cat.includes('apartment')) {
      return 'bg-violet-100 text-violet-700 hover:bg-violet-100'
    }
    return 'bg-orange-100 text-orange-700 hover:bg-orange-100'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const onSubmit = () => {
    // Search is reactive via watch, so this is just for form compliance
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card>
          <CardContent className="py-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-500" />
          <h1 className="text-xl font-semibold text-neutral-900">Waiting Approval</h1>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            {products.length} Pending
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchProducts(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="search"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  {...field}
                  placeholder="Search by title or category..."
                  className="pl-9"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">
              {searchValue ? 'No Matching Products' : 'No Pending Approvals'}
            </h3>
            <p className="text-sm text-neutral-500">
              {searchValue
                ? 'Try adjusting your search terms.'
                : "You don't have any products waiting for admin approval."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Bid Time</TableHead>
                <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate max-w-[200px]">
                          {product.title}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Rs. {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="secondary"
                      className={getCategoryBadgeColor(product.category)}
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-neutral-600">{product.bidTime} days</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-neutral-600">
                      {formatDate(product.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(product)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(product)}
                        title="Delete Product"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Pending approval product information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {selectedProduct.images?.[0]?.url && (
                <div className="aspect-video rounded-lg overflow-hidden bg-neutral-100">
                  <img
                    src={selectedProduct.images[0].url}
                    alt={selectedProduct.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900">{selectedProduct.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getCategoryBadgeColor(selectedProduct.category)}
                  >
                    {selectedProduct.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
                  <div>
                    <span className="text-neutral-500">Price:</span>
                    <span className="ml-1 font-medium text-neutral-900">
                      Rs. {selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Bid Time:</span>
                    <span className="ml-1 font-medium text-neutral-900">
                      {selectedProduct.bidTime} days
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Submitted:</span>
                    <span className="ml-1 font-medium text-neutral-900">
                      {formatDate(selectedProduct.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">End Date:</span>
                    <span className="ml-1 font-medium text-neutral-900">
                      {formatDate(selectedProduct.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default WaitingApprovalPage
