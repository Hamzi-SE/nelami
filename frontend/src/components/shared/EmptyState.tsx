import { Button } from '@/components/ui/button'
import { slideUp, useReducedMotion } from '@/lib/animations'
import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  const reduced = useReducedMotion()

  const content = (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-neutral-100 p-4 mb-4">
        {icon || <Inbox className="h-8 w-8 text-neutral-400" />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
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

export default EmptyState
