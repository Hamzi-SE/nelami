import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ProductFeaturesProps {
  product: any
}

const ProductFeatures = ({ product }: ProductFeaturesProps) => {
  const [open, setOpen] = useState(true)

  const features = []

  // Vehicle-specific features
  if (product.make) features.push({ label: 'Make', value: product.make })
  if (product.model) features.push({ label: 'Model', value: product.model })
  if (product.year) features.push({ label: 'Year', value: product.year })
  if (product.fuelType) features.push({ label: 'Fuel Type', value: product.fuelType })
  if (product.kmsDriven) features.push({ label: 'KMs Driven', value: product.kmsDriven })

  // Property-specific features
  if (product.bedrooms) features.push({ label: 'Bedrooms', value: product.bedrooms })
  if (product.bathrooms) features.push({ label: 'Bathrooms', value: product.bathrooms })
  if (product.area) features.push({ label: 'Area', value: `${product.area} ${product.areaUnit || ''}` })
  if (product.furnished) features.push({ label: 'Furnished', value: product.furnished })

  // Common features
  if (product.subCategory) features.push({ label: 'Sub-Category', value: product.subCategory })

  if (features.length === 0) return null

  return (
    <Card>
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-semibold text-neutral-900">Specifications</h3>
        <ChevronDown
          className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="bg-neutral-50 rounded-lg p-2.5">
                <p className="text-xs text-neutral-500">{feature.label}</p>
                <p className="text-sm font-medium text-neutral-900">{feature.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default ProductFeatures
