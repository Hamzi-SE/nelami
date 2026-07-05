import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCarMake, getFuelDropList } from '@/lib/carData'
import { useAppSelector } from '@/store/typedHooks'
import { Car } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { z } from 'zod'
import BaseProductForm from './BaseProductForm'

const vehicleSchema = z.object({
  make: z.string().min(1, 'Please select a make'),
  model: z.string().min(1, 'Please enter a model'),
  year: z.string().min(1, 'Please select a year'),
  fuelType: z.string().min(1, 'Please select a fuel type'),
  kmsDriven: z.string().optional(),
})

const VehicleForm = ({ subCategory }: { subCategory: string }) => {
  const { data } = useAppSelector((state) => state.data)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 76 }, (_, i) => currentYear - i)

  const additionalFields = (control: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary-500" />
          Vehicle Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          name="make"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="make">Make</FieldLabel>
              <Select {...field}>
                <SelectTrigger id="make" className="h-9 w-full">
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select Make</SelectItem>
                  {getCarMake(data).map((el: any) => (
                    <SelectItem key={el.props.value} value={el.props.value}>
                      {el.props.children}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="model"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="model">Model</FieldLabel>
              <Input {...field} id="model" placeholder="e.g. Corolla, Civic, Mehran" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="year"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="year">Year</FieldLabel>
                <Select {...field}>
                  <SelectTrigger id="year" className="h-9 w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Year</SelectItem>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="fuelType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fuelType">Fuel Type</FieldLabel>
                <Select {...field}>
                  <SelectTrigger id="fuelType" className="h-9 w-full">
                    <SelectValue placeholder="Select Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Fuel Type</SelectItem>
                    {getFuelDropList(data).map((el: any) => (
                      <SelectItem key={el.props.value} value={el.props.value}>
                        {el.props.children}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="kmsDriven"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="kmsDriven">Kilometers Driven</FieldLabel>
              <Input {...field} id="kmsDriven" placeholder="e.g. 50000" />
              <FieldDescription>Optional - Enter total kilometers driven</FieldDescription>
            </Field>
          )}
        />
      </CardContent>
    </Card>
  )

  return (
    <BaseProductForm
      category="Vehicles"
      subCategory={subCategory}
      additionalFields={additionalFields}
      additionalSchema={vehicleSchema}
      additionalFieldNames={['make', 'model', 'year', 'fuelType']}
    />
  )
}

export default VehicleForm
