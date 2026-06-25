import Countdown from 'react-countdown'
import { Clock } from 'lucide-react'

interface BidTimerProps {
  endDate: string
  compact?: boolean
}

const BidTimer = ({ endDate, compact = false }: BidTimerProps) => {
  const endTime = new Date(endDate).getTime()
  const now = Date.now()
  const remaining = endTime - now
  const isUrgent = remaining > 0 && remaining < 3600000 // < 1 hour
  const isExpired = remaining <= 0

  const Completionist = () => (
    <span className={compact ? 'text-xs' : 'text-sm'}>Auction Ended!</span>
  )

  if (isExpired) {
    return (
      <span className={`inline-flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'} text-danger-500 font-medium`}>
        <Clock className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        Auction Ended
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${
        compact ? 'text-xs' : 'text-sm'
      } font-medium ${
        isUrgent ? 'text-danger-500' : 'text-warning-600'
      }`}
    >
      <Clock className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
      <Countdown date={Date.now() + remaining} renderer={({ days, hours, minutes, seconds }) => (
        <span>
          {days > 0 && `${days}d `}
          {hours > 0 && `${hours}h `}
          {minutes}m {seconds}s
        </span>
      )}>
        <Completionist />
      </Countdown>
    </span>
  )
}

export default BidTimer
