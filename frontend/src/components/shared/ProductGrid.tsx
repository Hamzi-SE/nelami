import EmptyState from '@/components/shared/EmptyState'
import { staggerContainer, staggerItem, useReducedMotion } from '@/lib/animations'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: any[]
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="No Products Found"
        description="No products match your search criteria. Try adjusting your filters."
      />
    )
  }

  if (useReducedMotion()) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product._id || index} product={product} index={index} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {products.map((product, index) => (
        <motion.div key={product._id || index} variants={staggerItem}>
          <ProductCard product={product} index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid
