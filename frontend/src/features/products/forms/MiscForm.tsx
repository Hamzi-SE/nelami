import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'
import BaseProductForm from './BaseProductForm'

const MiscForm = ({ subCategory }: { subCategory: string }) => {
  const additionalFields = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary-500" />
          Product Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500">Category</p>
          <p className="text-sm font-medium text-neutral-900">Miscellaneous Products</p>
        </div>
      </CardContent>
    </Card>
  )

  return <BaseProductForm category="MiscProducts" subCategory={subCategory} additionalFields={additionalFields} />
}

export default MiscForm
