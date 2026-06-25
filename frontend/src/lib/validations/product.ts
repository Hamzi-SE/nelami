import { z } from 'zod'

const baseProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  province: z.string().min(1, 'Please select a province'),
  city: z.string().min(1, 'Please select a city'),
  bidTime: z.coerce.number().min(1, 'Bid time must be at least 1 day').max(30, 'Bid time must be at most 30 days'),
})

export const vehicleSchema = baseProductSchema.extend({
  category: z.literal('Vehicles'),
  subCategory: z.enum(['Cars', 'Bikes', 'Buses/Vans/Trucks', 'Rickshaw & Chingchi', 'Tractors & Trailers', 'Other Vehicles']),
  make: z.string().min(1, 'Please select a make'),
  model: z.string().min(1, 'Please enter a model'),
  year: z.string().min(1, 'Please select a year'),
  fuelType: z.string().min(1, 'Please select a fuel type'),
  kmsDriven: z.string().optional(),
})

export const propertySchema = baseProductSchema.extend({
  category: z.literal('Property'),
  subCategory: z.enum(['Land & Plots', 'Houses', 'Apartments & Flats', 'Shops-Offices-Commercial', 'Portions & Floors']),
  furnished: z.enum(['furnished', 'unfurnished']).optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
  areaUnit: z.string().optional(),
})

export const miscSchema = baseProductSchema.extend({
  category: z.literal('MiscProducts'),
  subCategory: z.literal('Other Products'),
})

export const productSchema = z.discriminatedUnion('category', [vehicleSchema, propertySchema, miscSchema])

export type VehicleFormData = z.infer<typeof vehicleSchema>
export type PropertyFormData = z.infer<typeof propertySchema>
export type MiscFormData = z.infer<typeof miscSchema>
export type ProductFormData = z.infer<typeof productSchema>
