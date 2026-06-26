import { useState, useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store/typedHooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Package, PenSquare } from 'lucide-react'
import customFetch from '@/utils/api'
import { getData } from '@/helpers/GetData'
import {
  getAllCitiesDropList,
  getProvinceDropList,
  getIslamabadSectorsDropList,
  getNorthernAreasCitiesDropList,
  getAzadKashmirCitiesDropList,
  getPunjabCitiesDropList,
  getSindhCitiesDropList,
  getBalochistanCitiesDropList,
  getKPKCitiesDropList,
} from '@/utils/PakCitiesData'
import getBidTimeDropList from '@/utils/BidData'
import { getBikeMake } from '@/utils/BikeData'
import { getCarMake, getFuelDropList } from '@/utils/carData'

const featureOptions = [
  { value: 'bidTimeList', label: 'Bid Time' },
  { value: 'bikeMakeList', label: 'Bike Make' },
  { value: 'carMakeList', label: 'Car Make' },
  { value: 'carFuelTypeList', label: 'Fuel Type' },
  { value: 'allCitiesList', label: 'All Cities' },
  { value: 'provinceList', label: 'Province' },
  { value: 'punjabCitiesList', label: 'Punjab Cities' },
  { value: 'sindhCitiesList', label: 'Sindh Cities' },
  { value: 'kpkCitiesList', label: 'KPK Cities' },
  { value: 'balochistanCitiesList', label: 'Balochistan Cities' },
  { value: 'azadKashmirCitiesList', label: 'Azad Kashmir Cities' },
  { value: 'northernAreasList', label: 'Northern Areas' },
  { value: 'islamabadSectorsList', label: 'Islamabad Sectors' },
]

const addFeatureSchema = z.object({
  item: z.string().min(1, 'Please select a feature'),
  newEntry: z.string().min(1, 'Please enter a value'),
})

const removeFeatureSchema = z.object({
  item: z.string().min(1, 'Please select a feature'),
  entryToRemove: z.string().min(1, 'Please select an entry'),
})

const packageSchema = z.object({
  name: z.string().min(1, 'Please select a package'),
  price: z.string().min(1, 'Please enter a price'),
  productsAllowed: z.string().min(1, 'Please enter products allowed'),
  description: z.string().min(1, 'Please enter a description'),
})

type AddFeatureFormData = z.infer<typeof addFeatureSchema>
type RemoveFeatureFormData = z.infer<typeof removeFeatureSchema>
type PackageFormData = z.infer<typeof packageSchema>

const EditFeaturesPage = () => {
  const dispatch = useDispatch()
  const { data } = useAppSelector((state) => state.data)
  const [addLoading, setAddLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [packageLoading, setPackageLoading] = useState(false)

  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors, isSubmitting: isAddSubmitting },
  } = useForm<AddFeatureFormData>({
    resolver: zodResolver(addFeatureSchema),
    defaultValues: { item: '', newEntry: '' },
  })

  const {
    control: removeControl,
    handleSubmit: handleRemoveSubmit,
    reset: resetRemove,
    formState: { errors: removeErrors, isSubmitting: isRemoveSubmitting },
  } = useForm<RemoveFeatureFormData>({
    resolver: zodResolver(removeFeatureSchema),
    defaultValues: { item: '', entryToRemove: '' },
  })

  // Watch the selected feature to populate the values dropdown
  const selectedRemoveItem = useWatch({ control: removeControl, name: 'item' })

  // Reset entryToRemove when the selected feature changes
  useEffect(() => {
    resetRemove({ item: selectedRemoveItem || '', entryToRemove: '' })
  }, [selectedRemoveItem, resetRemove])

  const {
    control: packageControl,
    handleSubmit: handlePackageSubmit,
    reset: resetPackage,
    formState: { errors: packageErrors, isSubmitting: isPackageSubmitting },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: { name: '', price: '', productsAllowed: '', description: '' },
  })

  const getDropList = (item: string) => {
    const map: Record<string, (data: any) => React.ReactNode[]> = {
      bidTimeList: getBidTimeDropList,
      bikeMakeList: getBikeMake,
      carMakeList: getCarMake,
      carFuelTypeList: getFuelDropList,
      allCitiesList: getAllCitiesDropList,
      provinceList: getProvinceDropList,
      punjabCitiesList: getPunjabCitiesDropList,
      sindhCitiesList: getSindhCitiesDropList,
      kpkCitiesList: getKPKCitiesDropList,
      balochistanCitiesList: getBalochistanCitiesDropList,
      azadKashmirCitiesList: getAzadKashmirCitiesDropList,
      northernAreasList: getNorthernAreasCitiesDropList,
      islamabadSectorsList: getIslamabadSectorsDropList,
    }
    const getter = map[item]
    return getter ? getter(data) : []
  }

  const onAddFeature = async (formData: AddFeatureFormData) => {
    setAddLoading(true)
    dispatch({ type: 'ADD_FEATURE_REQUEST' })
    try {
      const res = await customFetch('/api/v1/data/newEntry', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: formData.item, newEntry: formData.newEntry }),
      })
      const responseData = await res.json()
      if (res.status === 201) {
        dispatch({ type: 'ADD_FEATURE_SUCCESS', payload: responseData.message })
        toast.success(responseData.message)
        resetAdd({ item: formData.item, newEntry: '' })
        getData(dispatch)
      } else {
        dispatch({ type: 'ADD_FEATURE_FAIL', payload: responseData.message })
        toast.error(responseData.message)
      }
    } catch (error) {
      dispatch({ type: 'ADD_FEATURE_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setAddLoading(false)
    }
  }

  const onRemoveFeature = async (formData: RemoveFeatureFormData) => {
    setRemoveLoading(true)
    dispatch({ type: 'REMOVE_FEATURE_REQUEST' })
    try {
      const res = await customFetch('/api/v1/data/removeEntry', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: formData.item, newEntry: formData.entryToRemove }),
      })
      const responseData = await res.json()
      if (res.status === 200) {
        dispatch({ type: 'REMOVE_FEATURE_SUCCESS', payload: responseData.message })
        toast.success(responseData.message)
        resetRemove()
        getData(dispatch)
      } else {
        dispatch({ type: 'REMOVE_FEATURE_FAIL', payload: responseData.message })
        toast.error(responseData.message)
      }
    } catch (error) {
      dispatch({ type: 'REMOVE_FEATURE_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    } finally {
      setRemoveLoading(false)
    }
  }

  const onUpdatePackage = async (formData: PackageFormData) => {
    setPackageLoading(true)
    try {
      const res = await customFetch('/api/v1/data/updatePackage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pkgName: formData.name,
          newPrice: formData.price,
          newProductsAllowed: formData.productsAllowed,
          newDesc: formData.description,
        }),
      })
      const responseData = await res.json()
      if (res.status === 200) {
        toast.success(responseData.message)
        resetPackage()
        getData(dispatch)
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setPackageLoading(false)
    }
  }

  const handlePackageNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkg = data?.packages?.find((o: any) => o.name === e.target.value)
    if (pkg) {
      resetPackage({
        name: pkg.name,
        price: String(pkg.price),
        productsAllowed: String(pkg.productsAllowed),
        description: pkg.description,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PenSquare className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">Edit Features</h1>
      </div>

      {/* Add Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubmit(onAddFeature)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="item"
                control={addControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="add-item">Feature</FieldLabel>
                    <select {...field} id="add-item" className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                      <option value="">Select Feature</option>
                      {featureOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="newEntry"
                control={addControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="add-value">New Value</FieldLabel>
                    <Input {...field} id="add-value" placeholder="Enter new value" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <div>
              <Button type="submit" disabled={isAddSubmitting || addLoading}>
                {(isAddSubmitting || addLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Feature
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Remove Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Remove Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRemoveSubmit(onRemoveFeature)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="item"
                control={removeControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="remove-item">Feature</FieldLabel>
                    <select {...field} id="remove-item" className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                      <option value="">Select Feature</option>
                      {featureOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {selectedRemoveItem && (
                <Controller
                  name="entryToRemove"
                  control={removeControl}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`remove-value-${selectedRemoveItem}`}>Value to Remove</FieldLabel>
                      <select
                        {...field}
                        id={`remove-value-${selectedRemoveItem}`}
                        key={`remove-select-${selectedRemoveItem}`}
                        className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                      >
                        <option value="">Select Value</option>
                        {getDropList(selectedRemoveItem).map((el: any) => (
                          <option key={el.props.value} value={el.props.value}>{el.props.children}</option>
                        ))}
                      </select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </div>
            <div>
              <Button type="submit" variant="destructive" disabled={isRemoveSubmitting || removeLoading}>
                {(isRemoveSubmitting || removeLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Remove Feature
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Edit Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Edit Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePackageSubmit(onUpdatePackage)} className="space-y-4">
            <Controller
              name="name"
              control={packageControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pkg-name">Package</FieldLabel>
                  <select
                    {...field}
                    id="pkg-name"
                    onChange={(e) => {
                      field.onChange(e)
                      handlePackageNameChange(e)
                    }}
                    className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                  >
                    <option value="">Select Package</option>
                    <option value="Free">Free</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="price"
                control={packageControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pkg-price">Price</FieldLabel>
                    <Input {...field} id="pkg-price" type="number" placeholder="Package price" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="productsAllowed"
                control={packageControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pkg-products">Products Allowed</FieldLabel>
                    <Input {...field} id="pkg-products" type="number" placeholder="Number of products" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={packageControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pkg-desc">Description (comma separated)</FieldLabel>
                  <Input {...field} id="pkg-desc" placeholder="Feature 1, Feature 2, Feature 3" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div>
              <Button type="submit" disabled={isPackageSubmitting || packageLoading}>
                {(isPackageSubmitting || packageLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Package
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditFeaturesPage
