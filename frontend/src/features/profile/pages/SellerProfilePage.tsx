import EmptyState from '@/components/shared/EmptyState'
import ProductCard from '@/components/shared/ProductCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { staggerContainer, staggerItem } from '@/lib/animations'
import customFetch from '@/lib/api'
import MetaData from '@/lib/MetaData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { motion } from 'framer-motion'
import { Loader2, Store, User } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const SellerProfilePage = () => {
  const dispatch = useAppDispatch()
  const { seller, products, loading } = useAppSelector((state) => state.sellerProfile)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const callSellerProfile = async () => {
      dispatch({ type: 'LOAD_SELLER_REQUEST' })
      try {
        const res = await customFetch(`/api/v1/seller/${id}`, {
          method: 'GET',
        })
        const data = await res.json()

        if (res.status === 200) {
          if (data.user.role === 'seller') {
            dispatch({
              type: 'LOAD_SELLER_SUCCESS',
              payload: { seller: data.user, products: data.products },
            })
          } else {
            dispatch({
              type: 'LOAD_SELLER_FAIL',
              payload: `${data.user.role} does not have a shop page`,
            })
            toast.error(`${data.user.role} does not have a shop page`)
            navigate('/products')
          }
        } else {
          dispatch({ type: 'LOAD_SELLER_FAIL', payload: data.message })
          toast.error(data.message)
          navigate('/')
        }
      } catch (error) {
        dispatch({ type: 'LOAD_SELLER_FAIL', payload: error })
        toast.error('Failed to load seller profile')
      }
    }
    callSellerProfile()
  }, [id, dispatch, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <MetaData title={`${seller?.name || 'Seller'} - Nelami`} />

      {/* Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 mb-4">
              {seller?.avatar?.url ? (
                <img src={seller.avatar.url} alt={seller.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-white">
                  {seller?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold">{seller?.name}</h1>
            {seller?.aboutInfo && <p className="text-white/80 mt-2 max-w-md">{seller.aboutInfo}</p>}
            <div className="flex items-center gap-3 mt-4">
              {seller?.store && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Store className="h-3 w-3 mr-1" />
                  {seller.store}
                </Badge>
              )}
              {seller?.userPackage && (
                <Badge variant="secondary" className="bg-amber-500/80 text-white border-0">
                  {seller.userPackage} Plan
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-neutral-900">{seller?.name}&apos;s Products</h2>
            <Badge variant="secondary">{products?.length || 0}</Badge>
          </div>

          {products?.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={<Store className="h-12 w-12" />}
                  title="No Products Yet"
                  description="This seller hasn't listed any products yet."
                />
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {products?.map((product: any, index: number) => (
                <motion.div key={product?._id || index} variants={staggerItem}>
                  <ProductCard key={product?._id || index} product={product} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

export default SellerProfilePage
