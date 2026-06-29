import EmptyState from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import customFetch from '@/lib/api'
import { useAppDispatch } from '@/store/typedHooks'
import { Eye, Package, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface Product {
  _id: string
  title: string
  price: number
  bidStatus: string
  category: string
  subCategory?: string
  images: { featuredImg: { url: string } }
  createdAt: string
}

const AllProductsPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'ADMIN_PRODUCTS_REQUEST' })
      try {
        const res = await customFetch('/api/v1/productsAdmin', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'ADMIN_PRODUCTS_SUCCESS', payload: data.products })
          setProducts(data.products || [])
          setFilteredProducts(data.products || [])
        } else {
          dispatch({ type: 'ADMIN_PRODUCTS_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch (error) {
        dispatch({ type: 'ADMIN_PRODUCTS_FAIL', payload: 'Something went wrong' })
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [dispatch])

  useEffect(() => {
    let result = [...products]

    if (statusFilter === 'live') {
      result = result.filter((p) => p.bidStatus === 'Live')
    } else if (statusFilter === 'expired') {
      result = result.filter((p) => p.bidStatus === 'Expired')
    } else if (statusFilter === 'vehicles') {
      result = result.filter((p) => p.category === 'Vehicles')
    } else if (statusFilter === 'property') {
      result = result.filter((p) => p.category === 'Property')
    } else if (statusFilter === 'misc') {
      result = result.filter((p) => p.category === 'MiscProducts')
    }

    if (search) {
      result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    }

    setFilteredProducts(result)
  }, [search, statusFilter, products])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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
      <div className="flex items-center gap-3">
        <Package className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">All Products</h1>
        <Badge variant="secondary">{filteredProducts.length}</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-base">Product Management</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'live', label: 'Live' },
                { key: 'expired', label: 'Expired' },
                { key: 'vehicles', label: 'Vehicles' },
                { key: 'property', label: 'Property' },
                { key: 'misc', label: 'Misc' },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={statusFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="h-12 w-12" />}
              title="No Products Found"
              description={
                search || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'No products posted yet.'
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="stagger-rows">
                {filteredProducts.map((product) => (
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
                    <TableCell className="font-medium">Rs. {product.price?.toLocaleString()}</TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/user/product/bids/all/${product._id}`)}
                          title="View Bidders"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
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

export default AllProductsPage
