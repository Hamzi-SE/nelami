import { Button } from '@/components/ui/button'
import MetaData from '@/lib/MetaData'
import { Building2, Car, ChevronRight, Package } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MiscForm from '../forms/MiscForm'
import PropertyForm from '../forms/PropertyForm'
import VehicleForm from '../forms/VehicleForm'

type Step = 'category' | 'subCategory' | 'form'

const categories = [
  {
    id: 'Vehicles',
    label: 'Vehicles',
    icon: Car,
    subCategories: [
      'Cars',
      'Bikes',
      'Buses/Vans/Trucks',
      'Rickshaw & Chingchi',
      'Tractors & Trailers',
      'Other Vehicles',
    ],
  },
  {
    id: 'Property',
    label: 'Property',
    icon: Building2,
    subCategories: ['Land & Plots', 'Houses', 'Apartments & Flats', 'Shops-Offices-Commercial', 'Portions & Floors'],
  },
  {
    id: 'MiscProducts',
    label: 'Miscellaneous',
    icon: Package,
    subCategories: ['Other Products'],
  },
]

const ProductCreatePage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('category')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('')

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep('subCategory')
  }

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory)
    setStep('form')
  }

  const handleBack = () => {
    if (step === 'form') setStep('subCategory')
    else if (step === 'subCategory') setStep('category')
    else navigate(-1)
  }

  const currentCategory = categories.find((c) => c.id === selectedCategory)

  return (
    <>
      <MetaData title="Add Product - Nelami" />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">POST YOUR AD</h1>
          {step !== 'category' && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="mt-2">
              ← Back
            </Button>
          )}
        </div>

        {/* Step 1: Category Selection */}
        {step === 'category' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 text-center">CHOOSE A CATEGORY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-center gap-4 p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{cat.label}</p>
                    <p className="text-sm text-neutral-500">{cat.subCategories.length} types</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sub-Category Selection */}
        {step === 'subCategory' && currentCategory && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 text-center">
              SELECT {currentCategory.label.toUpperCase()} TYPE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCategory.subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCategorySelect(sub)}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <span className="font-medium text-neutral-900">{sub}</span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Form */}
        {step === 'form' && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                {selectedCategory} → {selectedSubCategory}
              </h2>
            </div>
            {selectedCategory === 'Vehicles' && <VehicleForm subCategory={selectedSubCategory} />}
            {selectedCategory === 'Property' && <PropertyForm subCategory={selectedSubCategory} />}
            {selectedCategory === 'MiscProducts' && <MiscForm subCategory={selectedSubCategory} />}
          </div>
        )}
      </div>
    </>
  )
}

export default ProductCreatePage
