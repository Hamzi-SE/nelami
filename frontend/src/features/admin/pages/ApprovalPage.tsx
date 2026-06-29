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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import customFetch from '@/lib/api'
import { useAppDispatch } from '@/store/typedHooks'
import { Check, ClipboardCheck, Eye, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface ApprovalProduct {
  _id: string
  title: string
  price: number
  category: string
  subCategory?: string
  images: { featuredImg: { url: string } }
  createdAt: string
  user?: { name: string; email: string }
}

const ApprovalPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [products, setProducts] = useState<ApprovalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const fetchProducts = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      dispatch({ type: 'ADMIN_APPROVAL_PRODUCTS_REQUEST' })
      try {
        const res = await customFetch('/api/v1/approvalProductsAdmin', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'ADMIN_APPROVAL_PRODUCTS_SUCCESS', payload: data.approvalProducts })
          setProducts(data.approvalProducts || [])
        } else {
          dispatch({ type: 'ADMIN_APPROVAL_PRODUCTS_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch (error) {
        dispatch({ type: 'ADMIN_APPROVAL_PRODUCTS_FAIL', payload: 'Something went wrong' })
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleApprove = async (product: ApprovalProduct) => {
    setApprovingId(product._id)
    dispatch({ type: 'ADMIN_APPROVE_PRODUCT_REQUEST' })
    try {
      const res = await customFetch(`/api/v1/approveProduct/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'ADMIN_APPROVE_PRODUCT_SUCCESS', payload: data.message })
        toast.success(data.message || 'Product approved successfully')
        setProducts((prev) => prev.filter((p) => p._id !== product._id))
      } else {
        dispatch({ type: 'ADMIN_APPROVE_PRODUCT_FAIL', payload: data.message })
        toast.error(data.message || 'Something went wrong')
      }
    } catch (error) {
      dispatch({ type: 'ADMIN_APPROVE_PRODUCT_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setApprovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-amber-500" />
          <h1 className="text-xl font-semibold text-neutral-900">Approval Products</h1>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            {products.length} Pending
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchProducts(true)} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Products Awaiting Approval</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No Pending Approvals</h3>
              <p className="text-sm text-neutral-500">All products have been reviewed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Seller</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="stagger-rows">
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-neutral-100">
                        <img
                          src={product.images?.featuredImg?.url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate">{product.title}</div>
                      {product.subCategory && <div className="text-xs text-neutral-400">{product.subCategory}</div>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-neutral-600">
                      {product.user?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="font-medium">Rs. {product.price?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(`/product/${product._id}`, '_blank')}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Approve"
                              disabled={approvingId === product._id}
                            >
                              {approvingId === product._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve &quot;{product.title}&quot;? It will become visible to
                                all users.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleApprove(product)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                          onClick={() => navigate(`/user/product/delete/${product._id}`)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ApprovalPage
