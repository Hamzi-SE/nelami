import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Users } from 'lucide-react'

interface BidLeaderboardProps {
  bidders?: any
  loading?: boolean
}

const medals = [
  { emoji: '🥇', bg: 'bg-yellow-50 ring-yellow-200' },
  { emoji: '🥈', bg: 'bg-neutral-50 ring-neutral-200' },
  { emoji: '🥉', bg: 'bg-amber-50 ring-amber-200' },
]

const BidLeaderboard = ({ bidders, loading = false }: BidLeaderboardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-primary-500" />
            Bidders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Flatten all bidders from all bidder groups and sort by price
  const allBidders = bidders?.[0]?.bidders || []
  const sortedBidders = [...allBidders].sort((a, b) => b.price - a.price)

  if (sortedBidders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-primary-500" />
            Bidders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500 text-center py-2">No bids yet. Be the first!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-primary-500" />
          Bidders ({sortedBidders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {sortedBidders.map((bidder, index) => {
          const isTopThree = index < 3
          const medal = medals[index]
          return (
            <div
              key={bidder.user?._id || index}
              className={`flex items-center gap-3 p-2.5 rounded-lg ring-1 transition-all ${
                isTopThree ? medal.bg : 'bg-white ring-neutral-100'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {isTopThree ? (
                  <span className="text-lg">{medal.emoji}</span>
                ) : (
                  <span className="text-xs font-bold text-neutral-400">#{index + 1}</span>
                )}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={bidder.user?.avatar?.url} alt={bidder.user?.name} />
                <AvatarFallback className="text-xs">
                  {bidder.user?.name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{bidder.user?.name || 'Anonymous'}</p>
              </div>
              <p className="text-sm font-semibold text-neutral-900">Rs. {bidder.price?.toLocaleString()}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default BidLeaderboard
