import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import customFetch from '@/lib/api'
import { callProfile } from '@/lib/helpers/callProfile'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Flame, Heart, MapPin, MessageCircle, Timer, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface ProductCardProps {
  product: any
  index: number
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)

  const [added, setAdded] = useState(user?.wishlist?.includes(product?._id) || false)
  const [bidCount, setBidCount] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const getBidsCount = async () => {
      try {
        const res = await customFetch(`/api/v1/bid/product/${product?._id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (data?.bids?.[0]?.bidders?.length) {
          setBidCount(data.bids[0].bidders.length)
        }
      } catch {
        // silently fail
      }
    }
    getBidsCount()
  }, [product?._id])

  const startConversation = async () => {
    if (!user) {
      toast.error('Please login to chat with seller')
      return
    }
    dispatch({ type: 'CREATE_CONVERSATION_REQUEST' })
    try {
      const res = await customFetch('/api/v1/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?._id,
          receiverId: product?.user._id,
        }),
      })
      const data = await res.json()

      if (res.status === 201) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.savedConversation })
        toast.success(data.message)
      } else if (res.status === 200) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.conversation })
        toast(data.message, { icon: '🤝' })
      } else {
        dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: data.message })
        toast.error(data.message)
      }
      navigate('/messenger', { replace: true })
    } catch (error: any) {
      dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: error?.message || 'Something went wrong' })
      toast.error(error?.message || 'Something went wrong')
    }
  }

  const addToWishlistHandler = async () => {
    if (!user) {
      toast.error('Login to add products to your wishlist')
      return
    }

    try {
      const res = await customFetch('/api/v1/addToWishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      })
      const data = await res.json()

      if (res.status === 200) {
        setAdded(false)
        toast.success('Removed from wishlist')
      } else if (res.status === 201) {
        setAdded(true)
        toast.success('Added to wishlist')
      } else {
        toast.error(data?.message || 'Something went wrong')
      }

      callProfile(dispatch)
    } catch {
      toast.error('Something went wrong')
    }
  }

  if (!product) return null

  const endTime = new Date(product.endDate).getTime()
  const now = Date.now()
  const remaining = endTime - now
  const isExpired = product.bidStatus === 'Expired' || remaining <= 0
  const isUrgent = !isExpired && remaining < 3600000 // < 1 hour

  return (
    <Card className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {!imageLoaded && <div className="absolute inset-0 bg-neutral-200 animate-pulse" />}
          <img
            src={product.images?.featuredImg?.url}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={isExpired ? 'destructive' : 'default'}
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isExpired
                  ? 'bg-danger-500 text-white'
                  : isUrgent
                    ? 'bg-warning-500 text-white'
                    : 'bg-success-500 text-white'
              }`}
            >
              {product.bidStatus}
            </Badge>
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className="text-xs font-medium bg-white/90 backdrop-blur-sm text-neutral-700 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Wishlist button */}
          {user?.role !== 'seller' && (
            <button
              onClick={(e) => {
                e.preventDefault()
                addToWishlistHandler()
              }}
              className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label={added ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {added ? (
                <Heart className="h-4 w-4 fill-danger-500 text-danger-500" />
              ) : (
                <Heart className="h-4 w-4 text-neutral-600" />
              )}
            </button>
          )}

          {/* Countdown timer overlay for live auctions */}
          {!isExpired && (
            <div className="absolute bottom-3 left-3">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isUrgent ? 'bg-danger-500/90 text-white' : 'bg-black/60 text-white backdrop-blur-sm'
                }`}
              >
                {isUrgent ? <Flame className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
                <Countdown
                  date={Date.now() + remaining}
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
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors duration-200 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {product.location?.city}, {product.location?.province}
          </span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Action Buttons */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={startConversation}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
                  aria-label="Chat with seller"
                >
                  <MessageCircle className="h-4 w-4 text-neutral-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Chat with seller</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button
                  className="h-8 px-2 rounded-full flex items-center gap-1 hover:bg-neutral-100 transition-colors"
                  aria-label={`${bidCount} bids`}
                >
                  <Users className="h-4 w-4 text-neutral-500" />
                  <span className="text-xs text-neutral-600 font-medium">{bidCount > 0 ? bidCount : ''}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{bidCount <= 1 ? `${bidCount} bid` : `${bidCount} bids`}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-neutral-900">Rs. {product.price?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
