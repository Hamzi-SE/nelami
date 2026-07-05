import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Gavel, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import ConfirmationDialog from '@/components/shared/ConfirmationDialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import customFetch from '@/lib/api'
import { toast } from 'sonner'

interface BidPlacementProps {
  productId: string
  currentPrice: number
  isExpired?: boolean
  onBidPlaced?: () => void
}

const BidPlacement = ({ productId, currentPrice, isExpired = false, onBidPlaced }: BidPlacementProps) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { loading } = useAppSelector((state) => state.bid)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<number | null>(null)

  const minBid = currentPrice + 1

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { amount: minBid },
  })

  const onSubmit = (data: { amount: number }) => {
    if (data.amount <= currentPrice) {
      toast.error(`Bid must be higher than current price (Rs. ${currentPrice.toLocaleString()})`)
      return
    }
    setPendingAmount(data.amount)
    setShowConfirm(true)
  }

  const confirmBid = async () => {
    if (!pendingAmount) return

    dispatch({ type: 'BID_REQUEST' })

    try {
      const res = await customFetch(`/api/v1/bid/product/new/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: pendingAmount }),
      })
      const data = await res.json()

      if (res.status === 201) {
        dispatch({ type: 'BID_SUCCESS', payload: data.newPresentBid })
        toast.success('Bid Added Successfully')
        setShowConfirm(false)
        setPendingAmount(null)
        onBidPlaced?.()
      } else {
        dispatch({ type: 'BID_FAIL', payload: data.message })
        toast.error(data.message || 'Failed to place bid')
      }
    } catch (error: any) {
      dispatch({ type: 'BID_FAIL', payload: error.message })
      toast.error(error.message)
    }
  }

  if (isExpired) {
    return (
      <div className="bg-neutral-50 rounded-xl p-6 text-center">
        <p className="text-neutral-500 font-medium">This auction has ended.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-neutral-50 rounded-xl p-6 text-center">
        <p className="text-neutral-500 font-medium">Please login to place a bid.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900">Place Your Bid</h3>
        </div>

        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-sm text-neutral-500">Current Price</p>
          <p className="text-2xl font-bold text-neutral-900">Rs. {currentPrice?.toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-1">Minimum bid: Rs. {minBid.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.amount}>
                <FieldLabel htmlFor="bid-amount">Your Bid (Rs.)</FieldLabel>
                <Input
                  id="bid-amount"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder={`Min Rs. ${minBid.toLocaleString()}`}
                  className="text-lg font-semibold"
                />
                {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || loading}>
            {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Bid
          </Button>
        </form>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Your Bid"
        description={`Are you sure you want to place a bid of Rs. ${pendingAmount?.toLocaleString()}? This action cannot be undone.`}
        confirmLabel={`Bid Rs. ${pendingAmount?.toLocaleString()}`}
        variant="default"
        onConfirm={confirmBid}
      />
    </>
  )
}

export default BidPlacement
