import { Loader2 } from 'lucide-react'

interface TypingIndicatorProps {
  name: string
}

const TypingIndicator = ({ name }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-neutral-500">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>{name?.split(' ')[0]} is typing...</span>
    </div>
  )
}

export default TypingIndicator
