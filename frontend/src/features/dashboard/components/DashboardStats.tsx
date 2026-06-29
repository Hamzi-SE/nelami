import CountUp from '@/components/shared/CountUp'
import ErrorState from '@/components/shared/ErrorState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import customFetch from '@/lib/api'
import { useAppSelector } from '@/store/typedHooks'
import { Box, Car, CheckCircle, Clock, Gavel, Home, Package } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsData {
  totalBids: number
  totalProducts: number
  totalEndedBids: number
  totalOngoingBids: number
  totalVehicles: number
  totalProperties: number
  totalMiscProducts: number
}

const DashboardStats = () => {
  const { user } = useAppSelector((state) => state.user)
  const [stats, setStats] = useState<StatsData>({
    totalBids: 0,
    totalProducts: 0,
    totalEndedBids: 0,
    totalOngoingBids: 0,
    totalVehicles: 0,
    totalProperties: 0,
    totalMiscProducts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await customFetch('/api/v1/userStats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.status === 200) {
        setStats({
          totalBids: data.totalBids || 0,
          totalProducts: data.totalProducts || 0,
          totalEndedBids: data.totalEndedBids || 0,
          totalOngoingBids: data.totalOngoingBids || 0,
          totalVehicles: data.totalVehicles || 0,
          totalProperties: data.totalProperties || 0,
          totalMiscProducts: data.totalMiscProducts || 0,
        })
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const sellerCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
    {
      label: 'Auctions Ended',
      value: stats.totalEndedBids,
      icon: CheckCircle,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      label: 'Ongoing Auctions',
      value: stats.totalOngoingBids,
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    { label: 'Vehicles', value: stats.totalVehicles, icon: Car, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Properties', value: stats.totalProperties, icon: Home, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Miscellaneous', value: stats.totalMiscProducts, icon: Box, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-neutral-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Stats"
        message="Unable to load your dashboard statistics. Please try again."
        onRetry={fetchStats}
      />
    )
  }

  return (
    <div className="space-y-6">
      {user?.role === 'buyer' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Placed Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Gavel className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">
                <CountUp duration={0.6} end={stats.totalBids} />
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === 'seller' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellerCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-neutral-500">{card.label}</CardTitle>
                  <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900">
                    <CountUp duration={0.6} end={card.value} />
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

export default DashboardStats
