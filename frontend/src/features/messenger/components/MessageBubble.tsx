import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  text: string
  createdAt: string | number
  isOwn: boolean
  senderAvatar?: string
  senderName?: string
}

const MessageBubble = ({ text, createdAt, isOwn, senderAvatar, senderName }: MessageBubbleProps) => {
  const timestamp =
    typeof createdAt === 'number'
      ? formatDistanceToNow(createdAt, { addSuffix: true })
      : formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  return (
    <div className={cn('flex gap-2 px-4 py-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && (
        <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-neutral-100 mt-auto">
          {senderAvatar ? (
            <img src={senderAvatar} alt={senderName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs font-medium text-neutral-500">
              {senderName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      <div className={cn('max-w-[70%] flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-3.5 py-2 rounded-2xl text-sm',
            isOwn
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-neutral-100 text-neutral-900 rounded-bl-md'
          )}
        >
          {text}
        </div>
        <span className="text-[10px] text-neutral-400 mt-0.5 px-1">{timestamp}</span>
      </div>
    </div>
  )
}

export default MessageBubble
