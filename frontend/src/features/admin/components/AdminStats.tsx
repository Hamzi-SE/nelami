import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import customFetch from '@/lib/api'
import { Chart, registerables } from 'chart.js'
import { Box, Car, Gavel, GavelIcon, Home, Package, UserCheck, Users, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import CountUp from 'react-countup'

Chart.register(...registerables)

interface AdminStatsData {
  totalUsers: number
  totalBuyers: number
  totalSellers: number
  activeBids: number
  endedBids: number
  totalProducts: number
  totalVehicles: number
  totalProperties: number
  totalMiscProducts: number
}

const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    activeBids: 0,
    endedBids: 0,
    totalProducts: 0,
    totalVehicles: 0,
    totalProperties: 0,
    totalMiscProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await customFetch('/api/v1/adminStats', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          setStats({
            totalUsers: data.totalUsers || 0,
            totalBuyers: data.totalBuyers || 0,
            totalSellers: data.totalSellers || 0,
            activeBids: data.activeBids || 0,
            endedBids: data.endedBids || 0,
            totalProducts: data.totalProducts || 0,
            totalVehicles: data.totalVehicles || 0,
            totalProperties: data.totalProperties || 0,
            totalMiscProducts: data.totalMiscProducts || 0,
          })
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [])

  const categoryPieData = {
    labels: ['Vehicles', 'Properties', 'Misc Products'],
    datasets: [
      {
        backgroundColor: ['#98b3ad', '#937DC2', '#f0bb77'],
        hoverBackgroundColor: ['#98b3ad', '#937DC2', '#f0bb77'],
        data: [stats.totalVehicles, stats.totalProperties, stats.totalMiscProducts],
      },
    ],
  }

  const userPieData = {
    labels: ['Buyers', 'Sellers'],
    datasets: [
      {
        backgroundColor: ['#FBB454', '#3AB4F2'],
        hoverBackgroundColor: ['#FBB454', '#3AB4F2'],
        data: [stats.totalBuyers, stats.totalSellers],
      },
    ],
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Buyers', value: stats.totalBuyers, icon: UserCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Sellers', value: stats.totalSellers, icon: UserX, color: 'text-sky-500', bg: 'bg-sky-50' },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    { label: 'Active Bids', value: stats.activeBids, icon: Gavel, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Ended Bids', value: stats.endedBids, icon: GavelIcon, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Vehicles', value: stats.totalVehicles, icon: Car, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Properties', value: stats.totalProperties, icon: Home, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Miscellaneous', value: stats.totalMiscProducts, icon: Box, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
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
                  <CountUp duration={0.8} end={card.value} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Products by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-[300px]">
              <Pie
                data={categoryPieData}
                options={{
                  plugins: {
                    legend: { display: true, position: 'bottom' },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-[300px]">
              <Pie
                data={userPieData}
                options={{
                  plugins: {
                    legend: { display: true, position: 'bottom' },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminStats
