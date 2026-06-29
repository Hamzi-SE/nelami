import CountUp from '@/components/shared/CountUp'
import EmptyState from '@/components/shared/EmptyState'
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton'
import ProductFilters from '@/components/shared/ProductFilters'
import ProductGrid from '@/components/shared/ProductGrid'
import { Button } from '@/components/ui/button'
import customFetch from '@/lib/api'
import MetaData from '@/lib/MetaData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const ProductsPage = () => {
  const dispatch = useAppDispatch()
  const { loading, products, error } = useAppSelector((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(12)
  const [localLoading, setLocalLoading] = useState(true)

  const fetchProducts = useCallback(
    async (filters: Record<string, string>) => {
      dispatch({ type: 'ALL_PRODUCTS_REQUEST' })
      setLocalLoading(true)

      try {
        const params = new URLSearchParams({ page: String(currentPage) })
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value)
        })

        const res = await customFetch(`/api/v1/products?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()

        dispatch({ type: 'ALL_PRODUCTS_SUCCESS', payload: data.products })
        setResultsPerPage(data.resultsPerPage || 12)
        setTotalProducts(data.productsCount || 0)

        // Update URL
        setSearchParams(params, { replace: true })
      } catch (error: any) {
        dispatch({ type: 'ALL_PRODUCTS_FAIL', payload: error.message })
      } finally {
        setLocalLoading(false)
      }
    },
    [currentPage, dispatch, setSearchParams]
  )

  useEffect(() => {
    const filters: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key !== 'page') filters[key] = value
    })
    fetchProducts(filters)
  }, [currentPage])

  const handleFiltersChange = (filters: Record<string, string>) => {
    setCurrentPage(1)
    // Fetch with new filters
    dispatch({ type: 'ALL_PRODUCTS_REQUEST' })
    setLocalLoading(true)

    const params = new URLSearchParams({ page: '1' })
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    customFetch(`/api/v1/products?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'ALL_PRODUCTS_SUCCESS', payload: data.products })
        setResultsPerPage(data.resultsPerPage || 12)
        setTotalProducts(data.productsCount || 0)
        setSearchParams(params, { replace: true })
      })
      .catch((error) => {
        dispatch({ type: 'ALL_PRODUCTS_FAIL', payload: error.message })
      })
      .finally(() => {
        setLocalLoading(false)
      })
  }

  const totalPages = Math.ceil(totalProducts / resultsPerPage)
  const startIndex = Math.min((currentPage - 1) * resultsPerPage + 1, totalProducts)
  const endIndex = Math.min(currentPage * resultsPerPage, totalProducts)

  const isLoading = loading || localLoading

  return (
    <>
      <MetaData title="Search Results - Nelami" />

      {/* Hero Banner */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/banner-1.webp')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            <span>{!isLoading && !error && <CountUp duration={0.5} end={totalProducts} />}</span> Auctions Running Right
            Now on Nelami
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <ProductFilters onFiltersChange={handleFiltersChange} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count & Sort */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-neutral-500">
                  Showing <span className="font-medium">{startIndex}</span> to{' '}
                  <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{totalProducts}</span> results
                </p>
              </div>

              {/* Grid */}
              {isLoading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={products} />}

              {/* Pagination */}
              {totalPages > 1 && !isLoading && (
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
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductsPage
