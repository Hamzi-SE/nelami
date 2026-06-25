import { Link } from 'react-router-dom'
import { Car, Building2, Package } from 'lucide-react'

const categories = [
  {
    title: 'Vehicles',
    description: 'Cars, bikes, buses and more',
    icon: Car,
    to: '/categories/Vehicles',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Properties',
    description: 'Houses, land, apartments and more',
    icon: Building2,
    to: '/categories/Property',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Miscellaneous',
    description: 'Other products and items',
    icon: Package,
    to: '/categories/MiscProducts',
    color: 'bg-amber-50 text-amber-600',
  },
]

const CategoryCards = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.to}
              className="group block p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cat.color} mb-4`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">{cat.title}</h3>
              <p className="text-sm text-neutral-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryCards
