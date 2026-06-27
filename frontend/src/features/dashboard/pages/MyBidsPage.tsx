import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Eye, Gavel } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface Bidder {
  user: string
  price: number
}

interface BidItem {
  _id: string
  title: string
  price: number
  bidStatus: string
  images: { featuredImg: { url: string } }
}

interface UserBid {
  bidItem: BidItem
  bidders: Bidder[]
  createdAt: string
}

const MyBidsPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const [userBids, setUserBids] = useState<UserBid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBids = async () => {
      dispatch({ type: 'BUYER_ALL_BIDS_REQUEST' })
      try {
        const res = await customFetch('/api/v1/bids/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'BUYER_ALL_BIDS_SUCCESS', payload: data.bids })
          setUserBids(data.bids || [])
        } else {
          dispatch({ type: 'BUYER_ALL_BIDS_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch (error) {
        dispatch({ type: 'BUYER_ALL_BIDS_FAIL', payload: 'Something went wrong' })
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchBids()
  }, [dispatch])

  const getMyBidPrice = (bidders: Bidder[]) => {
    const myBid = bidders?.find((b) => b.user === user?._id)
    return myBid?.price
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
        <Gavel className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">My Bids</h1>
      </div>

      {userBids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gavel className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No Bids Yet</h3>
            <p className="text-sm text-neutral-500 mb-4">
              You haven't placed any bids yet. Browse products to start bidding!
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {userBids.map((bid) => {
            const myPrice = getMyBidPrice(bid.bidders)
            return (
              <Card key={bid.bidItem?._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <img
                        src={bid.bidItem?.images?.featuredImg?.url}
                        alt={bid.bidItem?.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">{bid.bidItem?.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-neutral-500">
                          Current Price:{' '}
                          <span className="font-medium text-neutral-700">
                            Rs. {bid.bidItem?.price?.toLocaleString()}
                          </span>
                        </span>
                        {myPrice && (
                          <span className="text-sm text-neutral-500">
                            Your Bid:{' '}
                            <span className="font-medium text-primary-600">Rs. {myPrice.toLocaleString()}</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <Badge
                          variant={bid.bidItem?.bidStatus === 'Live' ? 'default' : 'secondary'}
                          className={
                            bid.bidItem?.bidStatus === 'Live'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : ''
                          }
                        >
                          {bid.bidItem?.bidStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${bid.bidItem?._id}`)}
                      className="shrink-0"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBidsPage
