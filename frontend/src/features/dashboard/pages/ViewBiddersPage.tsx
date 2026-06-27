import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { ArrowLeft, Clock, Gavel, Loader2, MessageSquare, Phone, Search, Trophy, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// --- Types ---

interface BidderUser {
  _id: string
  name: string
  email: string
  phoneNo?: string
  avatar?: {
    url: string
    public_id: string
  }
}

interface BidderEntry {
  user: BidderUser
  price: number
  bidAt: string
}

interface ProductData {
  _id: string
  title: string
  price: number
  bidStatus: 'Live' | 'Pending' | 'Expired'
  bidTime: string
  endDate: string
  images: {
    featuredImg: {
      url: string
      public_id: string
    }
  }
  category: string
  subCategory: string
}

interface ChatFormValues {
  message: string
}

// --- Component ---

const ViewBiddersPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAppSelector((state) => state.user)

  const [product, setProduct] = useState<ProductData | null>(null)
  const [bidders, setBidders] = useState<BidderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [bidLoading, setBidLoading] = useState(true)
  const [chatTarget, setChatTarget] = useState<BidderUser | null>(null)
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [startingChat, setStartingChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChatFormValues>({
    defaultValues: {
      message: '',
    },
  })

  // --- Fetch product ---

  const fetchProduct = useCallback(async () => {
    dispatch({ type: 'SINGLE_PRODUCT_REQUEST' })
    try {
      const res = await customFetch(`/api/v1/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'SINGLE_PRODUCT_SUCCESS', payload: data.product })
        setProduct(data.product)
      } else {
        dispatch({ type: 'SINGLE_PRODUCT_FAIL', payload: data.message })
        toast.error(data.message)
        navigate('/dashboard/products')
      }
    } catch (error) {
      dispatch({ type: 'SINGLE_PRODUCT_FAIL', payload: 'Something went wrong' })
      toast.error('Failed to load product')
      navigate('/dashboard/products')
    } finally {
      setLoading(false)
    }
  }, [dispatch, id, navigate])

  // --- Fetch bidders ---

  const fetchBidders = useCallback(async () => {
    dispatch({ type: 'PRODUCT_BIDS_REQUEST' })
    try {
      const res = await customFetch(`/api/v1/bid/product/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'PRODUCT_BIDS_SUCCESS', payload: data.bids })
        if (data.bids?.[0]?.bidders) {
          const sorted = [...data.bids[0].bidders].sort((a: BidderEntry, b: BidderEntry) => b.price - a.price)
          setBidders(sorted)
        }
      } else {
        dispatch({ type: 'PRODUCT_BIDS_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'PRODUCT_BIDS_FAIL', payload: 'Something went wrong' })
      toast.error('Failed to load bidders')
    } finally {
      setBidLoading(false)
    }
  }, [dispatch, id])

  useEffect(() => {
    fetchProduct()
    fetchBidders()
  }, [fetchProduct, fetchBidders])

  // --- Start conversation ---

  const startConversation = async (receiverId: string) => {
    if (!currentUser?._id) return
    setStartingChat(true)
    dispatch({ type: 'CREATE_CONVERSATION_REQUEST' })
    try {
      const res = await customFetch('/api/v1/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId,
        }),
      })
      const data = await res.json()

      if (res.status === 201) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.savedConversation })
        toast.success(data.message)
        navigate('/messenger')
      } else if (res.status === 200) {
        dispatch({ type: 'CREATE_CONVERSATION_SUCCESS', payload: data.conversation })
        toast.info(data.message)
        navigate('/messenger')
      } else {
        dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: 'Something went wrong' })
      toast.error('Failed to start conversation')
    } finally {
      setStartingChat(false)
      setChatDialogOpen(false)
      setChatTarget(null)
    }
  }

  // --- Chat form submit ---

  const onChatSubmit = async (_values: ChatFormValues) => {
    if (!chatTarget?._id) return
    await startConversation(chatTarget._id)
  }

  // --- Helpers ---

  const openChatDialog = (bidder: BidderUser) => {
    setChatTarget(bidder)
    setChatDialogOpen(true)
    reset({ message: '' })
  }

  const filteredBidders = bidders.filter((b) => b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  const highestBid = bidders.length > 0 ? bidders[0].price : 0

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
      case 'Expired':
        return 'bg-neutral-100 text-neutral-600 hover:bg-neutral-100'
      case 'Pending':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
      default:
        return ''
    }
  }

  // --- Loading skeleton ---

  if (loading || bidLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">Product Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Gavel className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">
              The product you are looking for does not exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Users className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">Product Bidders</h1>
      </div>

      {/* Product Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <div className="h-20 w-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
              <img src={product.images?.featuredImg?.url} alt={product.title} className="h-full w-full object-cover" />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-neutral-900 truncate">{product.title}</h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                {product.category} &middot; {product.subCategory}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-sm font-medium text-neutral-700">{formatCurrency(product.price)}</span>
                <Badge className={getBidStatusColor(product.bidStatus)}>{product.bidStatus}</Badge>
              </div>
              {product.endDate && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Ends {formatDate(product.endDate)}</span>
                </div>
              )}
            </div>

            {/* Bid Summary */}
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-xs text-neutral-500">Total Bidders</p>
              <p className="text-2xl font-bold text-neutral-900">{bidders.length}</p>
              {highestBid > 0 && (
                <>
                  <p className="text-xs text-neutral-500 mt-1">Highest Bid</p>
                  <p className="text-sm font-semibold text-primary-600">{formatCurrency(highestBid)}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bidders List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Bidders Leaderboard
          </CardTitle>
          {bidders.length > 0 && (
            <div className="relative w-full max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <Input
                placeholder="Search bidders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {bidders.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No Bids Yet</h3>
              <p className="text-sm text-neutral-500">No one has placed a bid on this product yet. Check back later!</p>
            </div>
          ) : filteredBidders.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No bidders match &ldquo;{searchQuery}&rdquo;</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">#</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="text-right">Bid Amount</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Bid Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBidders.map((bidder, idx) => {
                  const isHighest = idx === 0 && bidders.length > 1
                  const rank = bidders.indexOf(bidder) + 1

                  return (
                    <TableRow key={bidder.user?._id || idx}>
                      {/* Rank */}
                      <TableCell className="text-center font-medium text-neutral-500">
                        {rank === 1 ? <Trophy className="h-4 w-4 text-amber-500 mx-auto" /> : rank}
                      </TableCell>

                      {/* User Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar size="default">
                            {bidder.user?.avatar?.url ? (
                              <AvatarImage src={bidder.user.avatar.url} alt={bidder.user.name} />
                            ) : null}
                            <AvatarFallback>{bidder.user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{bidder.user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate hidden sm:block">{bidder.user?.email}</p>
                          </div>
                          {isHighest && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5">
                              Highest
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="hidden sm:table-cell">
                        {bidder.user?.phoneNo ? (
                          <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                            <Phone className="h-3 w-3 text-neutral-400" />
                            {bidder.user.phoneNo}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">--</span>
                        )}
                      </TableCell>

                      {/* Bid Amount */}
                      <TableCell className="text-right">
                        <span
                          className={`text-sm font-semibold ${isHighest ? 'text-primary-600' : 'text-neutral-900'}`}
                        >
                          {formatCurrency(bidder.price)}
                        </span>
                      </TableCell>

                      {/* Bid Date */}
                      <TableCell className="hidden md:table-cell text-right">
                        <span className="text-xs text-neutral-500">
                          {bidder.bidAt ? formatDate(bidder.bidAt) : '--'}
                        </span>
                      </TableCell>

                      {/* Chat Action */}
                      <TableCell className="text-right">
                        {currentUser?._id !== bidder.user?._id ? (
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button variant="outline" size="sm" className="h-7 gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Chat</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogMedia>
                                  <Avatar className="h-12 w-12">
                                    {bidder.user?.avatar?.url ? (
                                      <AvatarImage src={bidder.user.avatar.url} alt={bidder.user.name} />
                                    ) : null}
                                    <AvatarFallback>{bidder.user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                                  </Avatar>
                                </AlertDialogMedia>
                                <AlertDialogTitle>Chat with {bidder.user?.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will open a conversation with {bidder.user?.name}. You can discuss the bid,
                                  negotiate terms, or ask questions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => startConversation(bidder.user?._id)}
                                  disabled={startingChat}
                                >
                                  {startingChat ? (
                                    <>
                                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                      Starting...
                                    </>
                                  ) : (
                                    'Start Chat'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Chat Dialog (alternative entry point via chat icon) */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar size="default">
                {chatTarget?.avatar?.url ? <AvatarImage src={chatTarget.avatar.url} alt={chatTarget.name} /> : null}
                <AvatarFallback>{chatTarget?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <span>Chat with {chatTarget?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Start a conversation to discuss the bid on &ldquo;{product.title}&rdquo;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onChatSubmit)} className="space-y-3">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Type a message (optional)..." disabled={startingChat} />
              )}
            />
            <DialogFooter>
              <DialogClose>
                <Button type="button" variant="outline" disabled={startingChat}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || startingChat}>
                {(isSubmitting || startingChat) && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Start Chat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Back Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            currentUser?.role === 'admin' ? navigate('/admin/dashboard') : navigate('/dashboard/products')
          }}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    </div>
  )
}

export default ViewBiddersPage
