import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
              <select
                {...field}
                id="furnished"
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
              >
                <option value="">Select Status</option>
                <option value="furnished">Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
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
                <select
                  {...field}
                  id="areaUnit"
                  className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                >
                  <option value="">Select Unit</option>
                  <option value="Marla">Marla</option>
                  <option value="Kanal">Kanal</option>
                  <option value="Sq. Ft.">Sq. Ft.</option>
                  <option value="Sq. Yard">Sq. Yard</option>
                </select>
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
              <select
                {...field}
                id="constructionState"
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
              >
                <option value="">Select State</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Grey Structure">Grey Structure</option>
              </select>
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
