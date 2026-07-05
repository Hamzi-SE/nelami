import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { z } from 'zod'
import BaseProductForm from './BaseProductForm'

const propertySchema = z.object({
  furnished: z.enum(['furnished', 'unfurnished']).optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  noOfStoreys: z.string().optional(),
  constructionState: z.string().optional(),
  type: z.string().optional(),
  floorLevel: z.string().optional(),
  area: z.coerce.number().optional(),
  areaUnit: z.string().optional(),
})

const PropertyForm = ({ subCategory }: { subCategory: string }) => {
  const additionalFields = (control: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary-500" />
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sub-type is already selected, show it as read-only */}
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-xs text-neutral-500">Sub-Category</p>
          <p className="text-sm font-medium text-neutral-900">{subCategory}</p>
        </div>

        <Controller
          name="furnished"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="furnished">Furnished Status</FieldLabel>
              <Select {...field}>
                <SelectTrigger id="furnished" className="h-9 w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select Status</SelectItem>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="bedrooms"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                <Input {...field} id="bedrooms" type="number" placeholder="e.g. 3" />
              </Field>
            )}
          />

          <Controller
            name="bathrooms"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                <Input {...field} id="bathrooms" type="number" placeholder="e.g. 2" />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="noOfStoreys"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="noOfStoreys">Storeys</FieldLabel>
                <Input {...field} id="noOfStoreys" placeholder="e.g. 2" />
              </Field>
            )}
          />

          <Controller
            name="floorLevel"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="floorLevel">Floor Level</FieldLabel>
                <Input {...field} id="floorLevel" placeholder="e.g. Ground, 1st" />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="area"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="area">Area</FieldLabel>
                <Input {...field} id="area" type="number" placeholder="e.g. 1000" />
              </Field>
            )}
          />

          <Controller
            name="areaUnit"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="areaUnit">Area Unit</FieldLabel>
                <Select {...field}>
                  <SelectTrigger id="areaUnit" className="h-9 w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Unit</SelectItem>
                    <SelectItem value="Marla">Marla</SelectItem>
                    <SelectItem value="Kanal">Kanal</SelectItem>
                    <SelectItem value="Sq. Ft.">Sq. Ft.</SelectItem>
                    <SelectItem value="Sq. Yard">Sq. Yard</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <Controller
          name="constructionState"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="constructionState">Construction State</FieldLabel>
              <Select {...field}>
                <SelectTrigger id="constructionState" className="h-9 w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select State</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Grey Structure">Grey Structure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="type">Property Type</FieldLabel>
              <Input {...field} id="type" placeholder="e.g. Residential, Commercial" />
              <FieldDescription>Optional - Specify property type</FieldDescription>
            </Field>
          )}
        />
      </CardContent>
    </Card>
  )

  return (
    <BaseProductForm
      category="Property"
      subCategory={subCategory}
      additionalFields={additionalFields}
      additionalSchema={propertySchema}
      additionalFieldNames={['furnished', 'bedrooms', 'bathrooms', 'area', 'areaUnit']}
    />
  )
}

export default PropertyForm
