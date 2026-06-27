import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import customFetch from '@/lib/api'
import { Eye, Heart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface WishlistProduct {
  _id: string
  title: string
  price: number
  images: { featuredImg: { url: string } }
}

const MyWishlistPage = () => {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      const res = await customFetch('/api/v1/getWishlist', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        setWishlist(data.products || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await customFetch('/api/v1/addToWishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (res.status === 200 || res.status === 201) {
        toast.success(data.message || 'Removed from wishlist')
        setWishlist((prev) => prev.filter((p) => p._id !== productId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">Your Wishlist is Empty</h3>
            <p className="text-sm text-neutral-500 mb-4">Save products you're interested in to find them later.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {wishlist.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={product.images?.featuredImg?.url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 truncate">{product.title}</h3>
                    <span className="text-sm font-semibold text-primary-600 mt-1 block">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/product/${product._id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyWishlistPage
