import { useEffect, useState } from 'react'
import MetaData from '@/utils/MetaData'
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton'
import HeroSearch from '../components/HeroSearch'
import CategoryCards from '../components/CategoryCards'
import ProductCarousel from '../components/ProductCarousel'
import StatsSection from '../components/StatsSection'
import customFetch from '@/utils/api'
import { toast } from 'sonner'

const HomePage = () => {
  const [hotProducts, setHotProducts] = useState<any[]>([])
  const [productsEndingSoon, setProductsEndingSoon] = useState<any[]>([])
  const [latestProducts, setLatestProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [hotRes, endingSoonRes, latestRes] = await Promise.all([
          customFetch('/api/v1/products/hot'),
          customFetch('/api/v1/products/ending-soon'),
          customFetch('/api/v1/products/latest'),
        ])

        const [hotData, endingSoonData, latestData] = await Promise.all([
          hotRes.json(),
          endingSoonRes.json(),
          latestRes.json(),
        ])

        setHotProducts(hotData.products || [])
        setProductsEndingSoon(endingSoonData.products || [])
        setLatestProducts(latestData.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Error fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <MetaData title="Nelami - Auction & Bidding Platform" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner-1.webp')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80" />
        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Nelami Auction Website</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            We fetch the best value for your valuables. Bid, buy, and sell with confidence.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Hot Products */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">Hot Products</h2>
        {loading ? <ProductGridSkeleton count={4} /> : <ProductCarousel title="" products={hotProducts} />}
      </div>

      {/* Categories */}
      <CategoryCards />

      {/* Ending Soon */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">Bids About To End</h2>
        {loading ? <ProductGridSkeleton count={4} /> : <ProductCarousel title="" products={productsEndingSoon} />}
      </div>

      {/* Latest Auctions */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">Latest Auctions</h2>
        {loading ? <ProductGridSkeleton count={4} /> : <ProductCarousel title="" products={latestProducts} />}
      </div>
    </>
  )
}

export default HomePage
