import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSocket } from '@/hooks/useSocket'
import { Bell, Check, ExternalLink, Mail, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import customFetch from '@/utils/api'
import { useAppSelector } from '@/store/typedHooks'

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, loading, error } = useAppSelector((state) => state.notifications)
  const { isAuthenticated } = useAppSelector((state) => state.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const socket = useSocket()

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const fetchNotifications = async () => {
      dispatch({ type: 'GET_NOTIFICATIONS_REQUEST' })
      try {
        const response = await customFetch('/api/v1/notification/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        dispatch({ type: 'GET_NOTIFICATIONS_SUCCESS', payload: data.notifications })
      } catch (err: any) {
        dispatch({ type: 'GET_NOTIFICATIONS_FAIL', payload: err.message })
      }
    }

    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    const handleNotification = (notification: any) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
      try {
        const audio = new Audio('/notification-sound.mp3')
        audio.play().catch(() => {})
      } catch {
        // ignore audio errors
      }
    }

    if (socket) {
      socket.on('getNotification', handleNotification)
    }

    return () => {
      if (socket) {
        socket.off('getNotification', handleNotification)
      }
    }
  }, [dispatch, socket])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await customFetch('/api/v1/notification/mark-as-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })
      const data = await response.json()
      if (response.ok) {
        dispatch({ type: 'MARK_NOTIFICATION_AS_READ', payload: data.notification._id })
      } else {
        toast.error(data?.message || 'Failed to mark as read.')
        dispatch({ type: 'MARK_NOTIFICATION_AS_READ_FAIL', payload: data.message })
      }
    } catch (error: any) {
      dispatch({ type: 'MARK_NOTIFICATION_AS_READ_FAIL', payload: error.message })
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="relative gap-1 text-neutral-700 hover:text-neutral-900">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-72 overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-danger-500">Error: {error}</div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 text-sm text-neutral-500 text-center">No notifications</div>
        ) : (
          notifications?.map((notification: any, index: number) => (
            <DropdownMenuItem
              key={index}
              className={`flex items-start gap-2 px-3 py-2.5 cursor-default ${
                !notification.read ? 'bg-primary-50/50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                {notification.link ? (
                  <NavLink
                    to={notification.link}
                    className="flex items-center gap-1.5 text-sm text-neutral-700 hover:text-primary-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-words">{notification.message}</span>
                  </NavLink>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-neutral-700">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-words">{notification.message}</span>
                  </div>
                )}
              </div>
              {!notification.read && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleMarkAsRead(notification._id)}
                  title="Mark as read"
                >
                  <Check className="h-3.5 w-3.5 text-success-500" />
                </Button>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
