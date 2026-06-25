import ProductCard from './ProductCard'

interface ProductGridProps {
  products: any[]
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 text-lg">No products found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id || index} product={product} index={index} />
      ))}
    </div>
  )
}

export default ProductGrid
