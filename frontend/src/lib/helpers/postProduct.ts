import customFetch from '@/lib/api'
import type { AppDispatch } from '@/store/typedHooks'
import { toast } from 'sonner'

interface ProductData {
  title: string
  description: string
  furnished?: string
  bedrooms?: number
  bathrooms?: number
  noOfStoreys?: number
  constructionState?: string
  type?: string
  features?: string[]
  make?: string
  model?: string
  year?: string
  kmsDriven?: string
  fuelType?: string
  floorLevel?: string
  areaUnit?: string
  area?: number
  price: number
  province: string
  city: string
  category: string
  subCategory?: string
  bidTime: number
}

async function postProduct(
  dispatch: AppDispatch,
  navigate: (path: string, options?: any) => void,
  featuredImg: string,
  imageOne: string,
  imageTwo: string,
  imageThree: string,
  productData: ProductData
) {
  dispatch({ type: 'NEW_PRODUCT_REQUEST' })
  try {
    const res = await customFetch('/api/v1/product/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: productData.title,
        description: productData.description,
        furnished: productData.furnished,
        bedrooms: productData.bedrooms,
        bathrooms: productData.bathrooms,
        noOfStoreys: productData.noOfStoreys,
        constructionState: productData.constructionState,
        type: productData.type,
        features: productData.features,
        make: productData.make,
        model: productData.model,
        year: productData.year,
        kmsDriven: productData.kmsDriven,
        fuelType: productData.fuelType,
        floorLevel: productData.floorLevel,
        areaUnit: productData.areaUnit,
        area: productData.area,
        price: productData.price,
        province: productData.province,
        city: productData.city,
        category: productData.category,
        subCategory: productData.subCategory,
        bidTime: productData.bidTime,
        featuredImg,
        imageOne,
        imageTwo,
        imageThree,
      }),
    })

    const data = await res.json()

    if (res.status === 201) {
      dispatch({ type: 'NEW_PRODUCT_SUCCESS', payload: data.product })
      navigate('/', { replace: true })
      toast.success('Product Sent For Approval. You will be notified once it is approved.')
      return
    } else if (res.status === 400) {
      dispatch({ type: 'NEW_PRODUCT_FAIL', payload: data.message })
      toast.error(data.message)
      navigate('/packages', { replace: true })
      return
    } else {
      dispatch({ type: 'NEW_PRODUCT_FAIL', payload: data.message })
      toast.error(data.message)
      return
    }
  } catch (error: any) {
    dispatch({
      type: 'NEW_PRODUCT_FAIL',
      payload: error?.response?.data?.message || 'Something went wrong',
    })
    toast.error(error?.response?.data?.message || 'Something went wrong')
  }
}

export default postProduct
