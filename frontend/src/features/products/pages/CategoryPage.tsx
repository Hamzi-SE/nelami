import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import MetaData from '@/utils/MetaData'
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton'
import ProductGrid from '@/components/shared/ProductGrid'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import customFetch from '@/utils/api'

const sortOptions = [
  { label: 'Latest', value: '1' },
  { label: 'Oldest', value: '2' },
  { label: 'Price: Low to High', value: '3' },
  { label: 'Price: High to Low', value: '4' },
]

const CategoryPage = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '1')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          category: category || '',
          page: String(currentPage),
          sortBy,
        })

        const res = await customFetch(`/api/v1/products?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()

        setProducts(data.products || [])
        setResultsPerPage(data.resultsPerPage || 12)
        setTotalProducts(data.productsCount || 0)
        setSearchParams(params, { replace: true })
      } catch (error) {
        console.error('Error fetching category products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, currentPage, sortBy])

  const totalPages = Math.ceil(totalProducts / resultsPerPage)

  const categoryTitle = category === 'Vehicles' ? 'Vehicles' : category === 'Property' ? 'Properties' : 'Miscellaneous Products'

  return (
    <>
      <MetaData title={`${categoryTitle} - Nelami`} />

      {/* Hero Banner */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/banner-1.webp')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white">{categoryTitle}</h1>
          <p className="text-primary-100 mt-2">
            <span>{totalProducts}</span> auctions available
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {/* Sort & Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-neutral-500">
              <span className="font-medium">{totalProducts}</span> results found
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-500">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-8 rounded-lg border border-neutral-200 bg-white px-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CategoryPage
