import { Button } from '@/components/ui/button'
import { slideUp, useReducedMotion } from '@/lib/animations'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  actionLabel?: string
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  actionLabel = 'Try Again',
}: ErrorStateProps) => {
  const reduced = useReducedMotion()

  const content = (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-danger-50 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-danger-500" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  )

  if (reduced) return content

  return (
    <motion.div initial="hidden" animate="visible" variants={slideUp}>
      {content}
    </motion.div>
  )
}

export default ErrorState
