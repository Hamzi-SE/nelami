import { MessageCircle, User, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SellerInfoProps {
  seller: any
  onChatClick?: () => void
  onViewProfile?: () => void
}

const SellerInfo = ({ seller, onChatClick, onViewProfile }: SellerInfoProps) => {
  if (!seller) return null

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar?.url} alt={seller.name} />
            <AvatarFallback className="bg-primary-100 text-primary-700">
              {seller.name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2) || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 truncate">{seller.name}</p>
            <p className="text-sm text-neutral-500">{seller.userPackage}</p>
          </div>
        </div>

        {seller.phoneNo && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <Phone className="h-3.5 w-3.5" />
            <span>{seller.phoneNo}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {onChatClick && (
            <Button variant="outline" className="w-full" onClick={onChatClick}>
              Message
            </Button>
          )}
          {onViewProfile && (
            <Button variant="ghost" className="w-full gap-1.5" onClick={onViewProfile}>
              <User className="h-4 w-4" />
              View Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SellerInfo
