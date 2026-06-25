import CountUp from 'react-countup'
import { TrendingUp, Users, ShoppingBag, Gavel } from 'lucide-react'

const stats = [
  { icon: ShoppingBag, label: 'Total Products', value: 1500, suffix: '+' },
  { icon: Gavel, label: 'Active Auctions', value: 450, suffix: '+' },
  { icon: Users, label: 'Happy Users', value: 5000, suffix: '+' },
  { icon: TrendingUp, label: 'Successful Bids', value: 12000, suffix: '+' },
]

const StatsSection = () => {
  return (
    <section className="py-12 px-4 bg-neutral-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-neutral-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-neutral-900">
                <CountUp end={stat.value} duration={2.5} separator="," />
                {stat.suffix}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
