import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Countdown from 'react-countdown'
import { MapPin, Share2, ArrowLeft, Loader2, Crown } from 'lucide-react'
import MetaData from '@/utils/MetaData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useSocket } from '@/hooks/useSocket'
import { useAppSelector } from '@/store/typedHooks'
import customFetch from '@/utils/api'
import ImageGallery from '@/components/shared/ImageGallery'
import BidPlacement from '../components/BidPlacement'
import BidLeaderboard from '../components/BidLeaderboard'
import SellerInfo from '../components/SellerInfo'
import ProductFeatures from '../components/ProductFeatures'
import { toast } from 'sonner'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const socket = useSocket()

  const { loading, product, error } = useAppSelector((state) => state.singleProduct)
  const { user } = useAppSelector((state) => state.user)
  const conversationLoading = useAppSelector((state) => state.conversation.loading)

  const [seller, setSeller] = useState<any>({})
  const [bidders, setBidders] = useState<any[]>([])
  const [biddersLoading, setBiddersLoading] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [auctionTimeRemaining, setAuctionTimeRemaining] = useState<number>(0)

  const getSingleProduct = async () => {
    dispatch({ type: 'SINGLE_PRODUCT_REQUEST' })
    try {
      const res = await customFetch(`/api/v1/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      if (data?.product) {
        dispatch({ type: 'SINGLE_PRODUCT_SUCCESS', payload: data.product })
        setSeller(data.product.user)
        setProductImages(
          [
            data.product.images?.featuredImg?.url,
            data.product.images?.imageOne?.url,
            data.product.images?.imageTwo?.url,
            data.product.images?.imageThree?.url,
          ].filter(Boolean)
        )
        const endDate = new Date(data.product.endDate).getTime()
        const currentTime = new Date().getTime()
        setAuctionTimeRemaining(endDate - currentTime)
      } else {
        dispatch({ type: 'SINGLE_PRODUCT_FAIL', payload: 'Product not found' })
      }
    } catch (err: any) {
      dispatch({ type: 'SINGLE_PRODUCT_FAIL', payload: err.message || 'An error occurred' })
    }
  }

  const getBidders = async () => {
    setBiddersLoading(true)
    try {
      const res = await customFetch(`/api/v1/bid/product/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      try {
        const data = await res.json()
        setBidders(data.bids || [])
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setBiddersLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getBidders()
      getSingleProduct()
    }
  }, [id])

  // Real-time notifications when outbid
  useEffect(() => {
    if (socket && id) {
      socket.on('getNotification', (notification: any) => {
        if (notification?.link?.includes(`/product/${id}`)) {
          getSingleProduct()
          getBidders()
        }
      })
    }
    return () => {
      socket?.off('getNotification')
    }
  }, [socket, id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleChatWithSeller = async () => {
    if (!user) {
      toast.error('Please login to chat with seller')
      return
    }
    dispatch({ type: 'CREATE_CONVERSATION_REQUEST' })
    try {
      const res = await customFetch('/api/v1/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user?._id, receiverId: product?.user?._id }),
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.conversation })
        toast(data.message, { icon: '🤝' })
      } else if (res.status === 201) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.savedConversation })
        toast.success(data.message)
      } else {
        dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: data.message })
        window.location.reload()
      }
      navigate('/messenger')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleRetractBid = async () => {
    try {
      const res = await customFetch(`/api/v1/bid/product/retract/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        toast.success(data.message)
        getBidders()
      } else {
        toast.error(data.message)
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  let highestBid = 0
  let highestBidder: any = null

  const getHighestBidder = () => {
    if (!bidders || bidders.length === 0) return null
    bidders.forEach((bidderGroup: any) => {
      bidderGroup.bidders.forEach((bid: any) => {
        if (bid?.price > highestBid) {
          highestBid = bid?.price
          highestBidder = bid?.user
        }
      })
    })
    return highestBidder
  }

  if (product?.bidStatus === 'Expired') {
    highestBidder = getHighestBidder()
  }

  if (loading || conversationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-neutral-500 text-lg">Product not found.</p>
        {error && <p className="text-danger-500">Reason: {error}</p>}
        <Link to="/">
          <Button>Go to Home Page</Button>
        </Link>
      </div>
    )
  }

  const isExpired = product.bidStatus === 'Expired'
  const isUrgent = !isExpired && auctionTimeRemaining > 0 && auctionTimeRemaining < 3600000
  const isBidder = bidders?.some((bidderGroup: any) =>
    bidderGroup?.bidders?.some((bid: any) => bid?.user?._id === user?._id)
  )

  return (
    <>
      <MetaData
        title={product?.title ? `${product.title} - Nelami` : 'Product Not Found'}
        description={product?.description}
      />

      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <ImageGallery images={productImages.map((url) => ({ url }))} alt={product.title} />
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={isExpired ? 'destructive' : 'default'}>{product.bidStatus}</Badge>
                    <span className="text-sm text-neutral-500">{product.category}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900">{product.title}</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5 text-neutral-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {product.location?.city}, {product.location?.province}
                </span>
              </div>

              <p className="text-neutral-700 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500">Current Price</p>
                <p className="text-3xl font-bold text-neutral-900">Rs. {product.price?.toLocaleString()}</p>
              </div>

              {/* Timer */}
              {!isExpired && auctionTimeRemaining > 0 && (
                <div
                  className={`rounded-lg p-4 ${isUrgent ? 'bg-danger-50 border border-danger-200' : 'bg-primary-50 border border-primary-200'}`}
                >
                  <p className="text-sm text-neutral-500 mb-1">Time Remaining</p>
                  <div className={`text-xl font-bold ${isUrgent ? 'text-danger-600' : 'text-primary-700'}`}>
                    <Countdown
                      date={Date.now() + auctionTimeRemaining}
                      renderer={({ days, hours, minutes, seconds }) => (
                        <span>
                          {days > 0 && `${days}d `}
                          {hours > 0 && `${hours}h `}
                          {minutes}m {seconds}s
                        </span>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Features */}
              {product?.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature: string, index: number) => (
                      <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <ProductFeatures product={product} />

              {/* Location & Map */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Location</h3>
                {product.location && (
                  <p className="text-neutral-600 mb-3">
                    {product.location.province} - {product.location.city}
                  </p>
                )}
                {product.location && (
                  <div className="rounded-xl overflow-hidden border border-neutral-200">
                    <iframe
                      title="map"
                      width="100%"
                      height="350"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(product.location?.province + ' ' + product.location?.city)}&output=embed`}
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen
                      aria-hidden="false"
                      tabIndex={0}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bid Status / Winner */}
            {isExpired ? (
              <Card className="p-4 text-center">
                {bidders?.length > 0 && highestBidder && highestBid ? (
                  <div className="space-y-2">
                    <Crown className="h-8 w-8 text-warning-500 mx-auto" />
                    <p className="text-warning-600 font-semibold">Highest Bidder Won!</p>
                    <p className="text-lg font-bold">{highestBidder.name}</p>
                    <p className="text-xl font-bold text-neutral-900">Rs. {highestBid.toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-warning-600 font-medium">This bidding has been expired with no bidders</p>
                )}
              </Card>
            ) : (
              <div className={`text-center p-3 rounded-lg ${isUrgent ? 'bg-danger-50' : 'bg-success-50'}`}>
                <p className={`font-bold ${isUrgent ? 'text-danger-600' : 'text-success-600'}`}>
                  Bid Status: {product.bidStatus}
                </p>
              </div>
            )}

            {/* Bid Placement / Retract */}
            {!isExpired && (
              <>
                <BidPlacement
                  productId={product._id}
                  currentPrice={product.price}
                  isExpired={isExpired}
                  onBidPlaced={() => {
                    getSingleProduct()
                    getBidders()
                  }}
                />
                {isBidder && (
                  <Button variant="destructive" className="w-full" onClick={handleRetractBid}>
                    Retract Bid
                  </Button>
                )}
              </>
            )}

            {/* Bid Leaderboard */}
            <BidLeaderboard bidders={bidders} loading={biddersLoading} />

            {/* Seller Info */}
            {seller && (
              <SellerInfo
                seller={seller}
                onChatClick={handleChatWithSeller}
                onViewProfile={() => navigate(`/user/${seller._id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
