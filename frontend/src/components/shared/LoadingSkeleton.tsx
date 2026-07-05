import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="skeleton-shimmer">
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="skeleton-shimmer">
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="skeleton-shimmer">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="skeleton-shimmer">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="skeleton-shimmer">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-5 w-24" />
        </div>
      </CardFooter>
    </Card>
  )
}

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton-shimmer">
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton-shimmer">
              <Skeleton className="h-10 flex-1" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const ProfileSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="skeleton-shimmer">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="skeleton-shimmer">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}

export const DetailPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      <div className="skeleton-shimmer">
        <Skeleton className="h-96 w-full" />
      </div>
      <div className="space-y-4">
        <div className="skeleton-shimmer">
          <Skeleton className="h-8 w-3/4" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-12 w-full mt-6" />
        </div>
        <div className="skeleton-shimmer">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
